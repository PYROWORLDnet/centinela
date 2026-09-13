/**
 * Rellena extra.fecha (y URL profunda en adjudicaciones) sin re-ingerir todo.
 * 1) ctr-*: fecha desde summary o CSV
 * 2) proc-*: fecha desde procesos-dgcp.csv
 * 3) ctr-*: copia URL del proceso vinculado
 */
import { createReadStream } from "node:fs";
import { parse } from "csv-parse";
import { loadEnv } from "../db/loadEnv.js";
import { getPool } from "../db/pool.js";

loadEnv();

const DATA = new URL("../../data/", import.meta.url);

function slug(value) {
  return String(value || "")
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

async function main() {
  const pool = getPool();
  if (!pool) throw new Error("DATABASE_URL required");

  console.log("1) fechas en adjudicaciones (ctr) desde summary…");
  const a = await pool.query(`
    UPDATE nodes
    SET extra = extra || jsonb_build_object(
      'fecha', (regexp_match(summary, '(\\d{4}-\\d{2}-\\d{2})'))[1]
    )
    WHERE category = 'contrato'
      AND id LIKE 'ctr-%'
      AND summary ~ '\\d{4}-\\d{2}-\\d{2}'
      AND (extra->>'fecha' IS NULL OR extra->>'fecha' = '')
  `);
  console.log("   updated", a.rowCount);

  console.log("2) fechas + URL en procesos desde CSV…");
  const parser = createReadStream(new URL("procesos-dgcp.csv", DATA)).pipe(
    parse({ columns: true, bom: true, skip_empty_lines: true, relax_quotes: true, relax_column_count: true }),
  );

  let batch = [];
  let updated = 0;
  const flush = async () => {
    if (!batch.length) return;
    const ids = batch.map((b) => b.id);
    const fechas = batch.map((b) => b.fecha);
    const urls = batch.map((b) => b.url);
    const { rowCount } = await pool.query(
      `UPDATE nodes AS n
       SET extra = n.extra
         || jsonb_build_object('fecha', v.fecha)
         || CASE
              WHEN v.url <> '' THEN jsonb_build_object(
                'url', v.url,
                'source', jsonb_build_object(
                  'label', 'Compras Dominicana — ficha del proceso',
                  'url', v.url
                )
              )
              ELSE '{}'::jsonb
            END
       FROM unnest($1::text[], $2::text[], $3::text[]) AS v(id, fecha, url)
       WHERE n.id = v.id`,
      [ids, fechas, urls],
    );
    updated += rowCount || 0;
    batch = [];
  };

  for await (const row of parser) {
    const code = slug(row.CODIGO_PROCESO);
    if (!code) continue;
    const fecha = String(row.FECHA_PUBLICACION || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) continue;
    batch.push({
      id: `proc-${code}`,
      fecha,
      url: String(row.URL || "").trim(),
    });
    if (batch.length >= 800) await flush();
  }
  await flush();
  console.log("   updated", updated);

  console.log("3) omitido: URL de adjudicaciones se resuelve al abrir ficha vía proceso vinculado");

  const stats = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE extra->>'fecha' IS NOT NULL AND extra->>'fecha' <> '') AS con_fecha,
      COUNT(*) FILTER (WHERE extra->>'url' ~ 'comprasdominicana') AS con_portal,
      COUNT(*) AS total
    FROM nodes WHERE category = 'contrato'
  `);
  console.log("stats", stats.rows[0]);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
