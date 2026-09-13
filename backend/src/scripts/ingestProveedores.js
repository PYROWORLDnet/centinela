/**
 * Carga el CSV de proveedores DGCP en Postgres (upsert por RNC / RPE).
 * Fuente: https://datos.gob.do/dataset/proveedores-del-estado
 */
import { createReadStream } from "node:fs";
import { parse } from "csv-parse";
import { loadEnv } from "../db/loadEnv.js";
import { dbClient, flushNodes } from "../db/upsert.js";

loadEnv();

const CSV = new URL("../../data/proveedores-dgcp.csv", import.meta.url);
const SOURCE = {
  label: "DGCP — Proveedores del Estado 2005–2026",
  url: "https://datos.gob.do/dataset/proveedores-del-estado",
};

function categoryFor(row) {
  const tipo = (row.TIPO_PERSONA || "").toLowerCase();
  if (tipo.includes("natural") || tipo.includes("física") || tipo.includes("fisica")) {
    return "persona";
  }
  return "empresa";
}

function nodeId(row) {
  const doc = String(row.NUMERO_DOCUMENTO || "").replace(/\D/g, "");
  const rpe = String(row.RPE || row["\ufeffRPE"] || "").trim();
  if (doc) return `rpe-${doc}`;
  return `rpe-${rpe}`;
}

function parseRm(raw) {
  const s = String(raw || "").trim().toUpperCase();
  if (!s || s === "N/A" || s === "NA") return null;
  const m = s.match(/^(\d+)([A-Z]+)$/);
  if (!m) return { registro: s, numero: null, camaraCodigo: null };
  return { registro: s, numero: m[1], camaraCodigo: m[2] };
}

async function main() {
  const client = dbClient();
  await client.connect();

  const parser = createReadStream(CSV).pipe(
    parse({ columns: true, bom: true, skip_empty_lines: true, relax_quotes: true, relax_column_count: true }),
  );

  let batch = [];
  let upserted = 0;

  async function flush() {
    if (!batch.length) return;
    const n = await flushNodes(client, batch);
    batch = [];
    upserted += n;
  }

  for await (const row of parser) {
    const name = String(row.RAZON_SOCIAL || "").trim();
    if (!name) continue;
    const rnc = String(row.NUMERO_DOCUMENTO || "").replace(/\D/g, "") || null;
    const rm = parseRm(row.NUMERO_REGISTRO_MERCANTIL);
    batch.push({
      id: nodeId(row),
      name,
      aliases: [row.RPE || row["\ufeffRPE"], rm?.registro, rnc].filter(Boolean),
      category: categoryFor(row),
      role: row.FORMA_JURIDICA || row.OCUPACION || null,
      rnc,
      summary: [row.ESTADO_RPE, row.CLASIFICACION, rm?.registro ? `RM ${rm.registro}` : null]
        .filter(Boolean)
        .join(" · "),
      extra: {
        rpe: row.RPE || row["\ufeffRPE"] || null,
        registroMercantil: rm?.registro || null,
        mercantil: rm
          ? {
              registro: rm.registro,
              numero: rm.numero,
              camaraCodigo: rm.camaraCodigo,
              fechaVigencia: row.FECHA_REGISTRO_MERCANTIL || null,
              fuente: "dgcp-rpe",
            }
          : undefined,
        source: SOURCE,
      },
    });
    if (batch.length >= 500) await flush();
  }
  await flush();
  console.log(`proveedores upserted: ${upserted}`);
  await client.end();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
