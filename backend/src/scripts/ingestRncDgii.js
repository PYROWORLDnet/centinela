/**
 * Ingiere RNC DGII: solo contribuyentes ESTADO=ACTIVO.
 * Fuente típica: RNC_Contribuyentes_Actualizado_*.csv (latin-1).
 *
 * RNC_PATH=/ruta/al.csv  (default: data/rnc-dgii.csv o Downloads más reciente)
 * RNC_LIMIT=N            (pruebas)
 */
import { createReadStream, existsSync, readdirSync, statSync, copyFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { parse } from "csv-parse";
import { loadEnv } from "../db/loadEnv.js";
import { dbClient, flushNodes } from "../db/upsert.js";

loadEnv();

const DATA_DIR = new URL("../../data/", import.meta.url);
const SOURCE = {
  label: "DGII — RNC contribuyentes (activos)",
  url: "https://dgii.gov.do/",
};

const LIMIT = process.env.RNC_LIMIT ? Number(process.env.RNC_LIMIT) : null;

function findCsv() {
  if (process.env.RNC_PATH && existsSync(process.env.RNC_PATH)) {
    return process.env.RNC_PATH;
  }
  const local = path.join(DATA_DIR.pathname, "rnc-dgii.csv");
  if (existsSync(local)) return local;

  const downloads = path.join(homedir(), "Downloads");
  if (!existsSync(downloads)) return null;
  const candidates = readdirSync(downloads)
    .filter((f) => /^RNC_Contribuyentes.*\.csv$/i.test(f))
    .map((f) => ({
      path: path.join(downloads, f),
      mtime: statSync(path.join(downloads, f)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime);
  return candidates[0]?.path || null;
}

function pickField(row, ...needles) {
  for (const [k, v] of Object.entries(row)) {
    const ku = k.normalize("NFD").replace(/\p{M}/gu, "").toUpperCase();
    if (needles.some((n) => ku.includes(n))) return String(v || "").trim();
  }
  return "";
}

function parseFecha(raw) {
  const s = String(raw || "").trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const [, d, mo, y] = m;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

async function main() {
  const csvPath = findCsv();
  if (!csvPath) {
    throw new Error(
      "No encontré el CSV del RNC. Ponlo en backend/data/rnc-dgii.csv o RNC_PATH=...",
    );
  }
  console.log("leyendo", csvPath);

  // Copia local para el cron / re-runs (data/ está gitignored).
  const localCopy = path.join(DATA_DIR.pathname, "rnc-dgii.csv");
  if (csvPath !== localCopy) {
    try {
      copyFileSync(csvPath, localCopy);
      console.log("copiado →", localCopy);
    } catch (err) {
      console.warn("no pude copiar a data/:", err.message);
    }
  }

  const client = dbClient();
  await client.connect();

  const parser = createReadStream(csvPath, { encoding: "latin1" }).pipe(
    parse({
      columns: true,
      bom: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
    }),
  );

  let batch = [];
  let seen = 0;
  let activos = 0;
  let upserted = 0;
  let empresas = 0;
  let personas = 0;

  async function flush() {
    if (!batch.length) return;
    const n = await flushNodes(client, batch);
    upserted += n;
    console.log("flush", { batch: n, activos, empresas, personas, upserted });
    batch = [];
  }

  for await (const row of parser) {
    seen += 1;
    const estado = pickField(row, "ESTADO").toUpperCase();
    if (estado !== "ACTIVO") continue;

    const rnc = pickField(row, "RNC").replace(/\D/g, "");
    const name = pickField(row, "RAZON SOCIAL", "RAZÓN SOCIAL", "NOMBRE");
    if (!rnc || !name) continue;

    activos += 1;
    if (LIMIT != null && activos > LIMIT) break;

    const actividad = pickField(row, "ACTIVIDAD ECONOMICA", "ACTIVIDAD ECONÓMICA");
    const fechaInicio = parseFecha(pickField(row, "FECHA DE INICIO", "FECHA"));
    const regimen = pickField(row, "REGIMEN", "RÉGIMEN");

    // 9 dígitos ≈ persona jurídica; 11 ≈ persona física (cédula como RNC).
    const category = rnc.length >= 11 ? "persona" : "empresa";
    if (category === "empresa") empresas += 1;
    else personas += 1;

    batch.push({
      id: `rpe-${rnc}`,
      name: name.slice(0, 280),
      aliases: [rnc],
      category,
      role: actividad ? actividad.slice(0, 180) : null,
      rnc,
      summary: ["ACTIVO", actividad, fechaInicio ? `desde ${fechaInicio}` : null]
        .filter(Boolean)
        .join(" · ")
        .slice(0, 500),
      extra: {
        estado: "ACTIVO",
        actividadEconomica: actividad || null,
        fechaInicioOperaciones: fechaInicio,
        regimenPago: regimen || null,
        fuente: "dgii-rnc",
        source: SOURCE,
      },
    });

    if (batch.length >= 500) await flush();
    if (activos % 50000 === 0) {
      console.log("activos", activos, { empresas, personas, upserted });
    }
  }

  await flush();
  console.log({
    filasLeidas: seen,
    activosIngestados: activos,
    empresas,
    personas,
    upserted,
  });
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
