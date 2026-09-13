/**
 * Capa Registro Mercantil desde datos oficiales DGCP (RPE).
 *
 * Realidad 2026: app.registromercantil.do solo valida con Nº RM + código de
 * validación (no hay dump público de accionistas). Lo que SÍ es abierto:
 * ~67k proveedores con NUMERO_REGISTRO_MERCANTIL (número + cámara).
 *
 * Este script estructura ese dato: empresa → registrada_en → cámara de comercio,
 * y deja mercantil parseado en extra para cruzar dueños cuando haya fuente.
 */
import { createReadStream } from "node:fs";
import { parse } from "csv-parse";
import { loadEnv } from "../db/loadEnv.js";
import { dbClient, flushEdges, flushNodes, slug } from "../db/upsert.js";

loadEnv();

const CSV = new URL("../../data/proveedores-dgcp.csv", import.meta.url);
const SOURCE = {
  label: "DGCP — Proveedores del Estado (Registro Mercantil)",
  url: "https://datos.gob.do/dataset/proveedores-del-estado",
};

/** Códigos vistos en NUMERO_REGISTRO_MERCANTIL + cámaras del portal RM. */
const CAMARAS = {
  SD: "Cámara de Comercio y Producción de Santo Domingo",
  PSD: "Cámara de Comercio y Producción de Santo Domingo",
  STI: "Cámara de Comercio y Producción de Santiago",
  SC: "Cámara de Comercio y Producción de San Cristóbal",
  LV: "Cámara de Comercio y Producción de La Vega",
  LA: "Cámara de Comercio y Producción de La Altagracia",
  SPM: "Cámara de Comercio y Producción de San Pedro de Macorís",
  LR: "Cámara de Comercio y Producción de La Romana",
  PE: "Cámara de Comercio y Producción de Pedernales",
  SFM: "Cámara de Comercio y Producción de San Francisco de Macorís",
  CSR: "Cámara de Comercio y Producción de Sánchez Ramírez",
  MN: "Cámara de Comercio y Producción de Monseñor Nouel",
  PP: "Cámara de Comercio y Producción de Puerto Plata",
  BH: "Cámara de Comercio y Producción de Barahona",
  BHO: "Cámara de Comercio y Producción de Bahoruco",
  AZU: "Cámara de Comercio y Producción de Azua",
  CP: "Cámara de Comercio y Producción de Cotuí",
  SJ: "Cámara de Comercio y Producción de San Juan",
  MPT: "Cámara de Comercio y Producción de Monte Plata",
  VVD: "Cámara de Comercio y Producción de Valverde",
  NAG: "Cámara de Comercio y Producción de Nagua",
  DAJ: "Cámara de Comercio y Producción de Dajabón",
  EP: "Cámara de Comercio y Producción de Elías Piña",
  HMI: "Cámara de Comercio y Producción de Hermanas Mirabal",
  MC: "Cámara de Comercio y Producción de Montecristi",
  SAM: "Cámara de Comercio y Producción de Samaná",
  SEI: "Cámara de Comercio y Producción de El Seibo",
  IND: "Cámara de Comercio y Producción de Independencia",
  OCO: "Cámara de Comercio y Producción de San José de Ocoa",
  PER: "Cámara de Comercio y Producción de Peravia",
  HAT: "Cámara de Comercio y Producción de Hato Mayor",
  ESP: "Cámara de Comercio y Producción de Espaillat",
  DU: "Cámara de Comercio y Producción de Duarte",
};

function parseRm(raw) {
  const s = String(raw || "").trim().toUpperCase();
  if (!s || s === "N/A" || s === "NA") return null;
  const m = s.match(/^(\d+)([A-Z]+)$/);
  if (!m) return { raw: s, numero: null, camaraCodigo: null };
  return { raw: s, numero: m[1], camaraCodigo: m[2] };
}

function camaraId(codigo) {
  return `rm-camara-${slug(codigo).toLowerCase()}`;
}

function empresaId(row) {
  const doc = String(row.NUMERO_DOCUMENTO || row["\ufeffNUMERO_DOCUMENTO"] || "").replace(/\D/g, "");
  const rpe = String(row.RPE || row["\ufeffRPE"] || "").trim();
  if (doc) return `rpe-${doc}`;
  return rpe ? `rpe-${rpe}` : null;
}

async function main() {
  const db = dbClient();
  await db.connect();

  const nodes = [];
  const edges = [];
  const camaras = new Map();
  let rows = 0;
  let withRm = 0;

  const parser = createReadStream(CSV).pipe(
    parse({ columns: true, bom: true, skip_empty_lines: true, relax_quotes: true, relax_column_count: true }),
  );

  for await (const row of parser) {
    rows += 1;
    const id = empresaId(row);
    const name = String(row.RAZON_SOCIAL || "").trim();
    if (!id || !name) continue;

    const rm = parseRm(row.NUMERO_REGISTRO_MERCANTIL);
    if (!rm || !rm.raw) continue;
    withRm += 1;

    const rnc = String(row.NUMERO_DOCUMENTO || "").replace(/\D/g, "") || null;
    const mercantil = {
      registro: rm.raw,
      numero: rm.numero,
      camaraCodigo: rm.camaraCodigo,
      fechaVigencia: row.FECHA_REGISTRO_MERCANTIL || null,
      fuente: "dgcp-rpe",
    };

    nodes.push({
      id,
      name,
      aliases: [row.RPE, rm.raw, rnc].filter(Boolean),
      category: "empresa",
      role: row.FORMA_JURIDICA || null,
      rnc,
      summary: [row.ESTADO_RPE, row.CLASIFICACION, rm.raw ? `RM ${rm.raw}` : null]
        .filter(Boolean)
        .join(" · "),
      extra: {
        source: SOURCE,
        rpe: row.RPE || row["\ufeffRPE"] || null,
        mercantil,
        registroMercantil: rm.raw,
      },
    });

    if (rm.camaraCodigo) {
      const cid = camaraId(rm.camaraCodigo);
      if (!camaras.has(cid)) {
        camaras.set(cid, {
          id: cid,
          name: CAMARAS[rm.camaraCodigo] || `Cámara de Comercio (${rm.camaraCodigo})`,
          aliases: [rm.camaraCodigo, `RM-${rm.camaraCodigo}`],
          category: "institucion",
          role: "Cámara de Comercio y Producción",
          summary: "Cámara de Comercio del sistema de Registro Mercantil RD.",
          extra: { source: SOURCE, mercantilCamara: rm.camaraCodigo },
        });
      }
      edges.push({
        source: id,
        target: cid,
        type: "registrada_en",
        note: `RM ${rm.raw}`,
      });
    }
  }

  // Cámaras primero (FK), luego empresas, luego edges.
  let n = await flushNodes(db, [...camaras.values()]);
  for (let i = 0; i < nodes.length; i += 400) {
    n += await flushNodes(db, nodes.slice(i, i + 400));
  }
  let e = 0;
  for (let i = 0; i < edges.length; i += 800) {
    e += await flushEdges(db, edges.slice(i, i + 800));
  }

  const { rows: stats } = await db.query(
    `SELECT
       COUNT(*) FILTER (WHERE extra ? 'mercantil') AS empresas_con_rm,
       COUNT(DISTINCT extra->'mercantil'->>'camaraCodigo') AS camaras
     FROM nodes
     WHERE category = 'empresa'`,
  );

  console.log({
    csvRows: rows,
    conRm: withRm,
    nodes: n,
    edges: e,
    camaras: camaras.size,
    db: stats[0],
    nota: "Sin dump público de accionistas; consulta RM requiere código de validación.",
  });

  await db.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
