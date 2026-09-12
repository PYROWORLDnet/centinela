/**
 * Carga el CSV de proveedores DGCP en Postgres (upsert por RNC / RPE).
 * Fuente: https://datos.gob.do/dataset/proveedores-del-estado
 */
import { createReadStream } from "node:fs";
import { parse } from "csv-parse";
import pg from "pg";

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
  const rpe = String(row.RPE || "").trim();
  if (doc) return `rpe-${doc}`;
  return `rpe-${rpe}`;
}

async function main() {
  const client = new pg.Client({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || process.env.POSTGRES_DB,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const parser = createReadStream(CSV).pipe(
    parse({ columns: true, bom: true, skip_empty_lines: true, relax_quotes: true }),
  );

  let batch = [];
  let upserted = 0;

  async function flush() {
    if (!batch.length) return;
    const unique = [...new Map(batch.map((n) => [n.id, n])).values()];
    batch = [];
    const values = [];
    const params = [];
    let i = 1;
    for (const n of unique) {
      values.push(
        `($${i++}, $${i++}, $${i++}::text[], $${i++}, $${i++}, $${i++}, $${i++}, $${i++}::jsonb)`,
      );
      params.push(
        n.id,
        n.name,
        n.aliases,
        n.category,
        n.role,
        n.rnc,
        n.summary,
        JSON.stringify(n.extra),
      );
    }
    await client.query(
      `INSERT INTO nodes (id, name, aliases, category, role, rnc, summary, extra)
       VALUES ${values.join(",")}
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         aliases = EXCLUDED.aliases,
         extra = nodes.extra || EXCLUDED.extra,
         rnc = COALESCE(EXCLUDED.rnc, nodes.rnc)`,
      params,
    );
    upserted += unique.length;
  }

  for await (const row of parser) {
    const name = String(row.RAZON_SOCIAL || "").trim();
    if (!name) continue;
    const rnc = String(row.NUMERO_DOCUMENTO || "").trim() || null;
    batch.push({
      id: nodeId(row),
      name,
      aliases: [row.RPE, row.NUMERO_REGISTRO_MERCANTIL].filter((x) => x && x !== "N/A"),
      category: categoryFor(row),
      role: row.FORMA_JURIDICA || row.OCUPACION || null,
      rnc,
      summary: [row.ESTADO_RPE, row.CLASIFICACION].filter(Boolean).join(" · "),
      extra: {
        rpe: row.RPE,
        registroMercantil: row.NUMERO_REGISTRO_MERCANTIL,
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
