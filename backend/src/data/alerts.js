import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { getNode as pgNode, hasDatabase } from "./pgGraph.js";
import { getPool } from "../db/pool.js";
import { slug } from "../db/upsert.js";

const DATA = new URL("../../data/", import.meta.url);
const FRESH_DAYS = 90;

function freshSince() {
  return new Date(Date.now() - FRESH_DAYS * 24 * 60 * 60 * 1000);
}

function isFresh(date, pipeline = false) {
  if (pipeline) return true;
  if (!date) return false;
  return date >= freshSince();
}

function parseDate(value) {
  if (!value || value === "NULL" || value === "N/A") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseAmount(value) {
  if (value == null || value === "" || value === "N/A" || value === "NULL") return null;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n) : null;
}

function formatWhen(date) {
  if (!date) return null;
  return date.toISOString().slice(0, 10);
}

function item({ id, nodeId, kind, title, body, amount, currency, date, source }) {
  return {
    id,
    nodeId,
    kind,
    title,
    body,
    amount,
    currency: currency || "USD",
    date: date ? formatWhen(date) : null,
    source,
  };
}

async function fromPostgres() {
  const pool = getPool();
  if (!pool) return null;
  const since = freshSince().toISOString();
  const loans = await pool.query(
    `SELECT id, name, role, amount, extra
     FROM nodes
     WHERE category = 'prestamo'
       AND (
         extra->>'pipeline' = 'true'
         OR extra->>'aprobado' >= $1
       )
     ORDER BY
       CASE WHEN extra->>'pipeline' = 'true' THEN 0 ELSE 1 END,
       extra->>'aprobado' DESC NULLS LAST
     LIMIT 20`,
    [since],
  );
  const banned = await pool.query(
    `SELECT id, name, extra
     FROM nodes
     WHERE extra->>'inhabilitado' = 'true'
       AND extra->>'fechaInhabilitacion' >= $1
     ORDER BY extra->>'fechaInhabilitacion' DESC NULLS LAST
     LIMIT 6`,
    [since.slice(0, 10)],
  );
  const alerts = [];
  for (const row of loans.rows) {
    const extra = row.extra || {};
    const pipeline = extra.pipeline === true || extra.pipeline === "true";
    alerts.push(
      item({
        id: `a-${row.id}`,
        nodeId: row.id,
        kind: pipeline ? "pipeline" : "prestamo",
        title: row.name,
        body: pipeline
          ? "En preparación en el banco. Todavía no tiene fecha de aprobación."
          : [row.role, extra.ejecutor || extra.sector].filter(Boolean).join(" · "),
        amount: row.amount,
        currency: extra.moneda || "USD",
        date: parseDate(extra.aprobado),
        source: extra.source || null,
      }),
    );
  }
  for (const row of banned.rows) {
    const extra = row.extra || {};
    alerts.push(
      item({
        id: `a-${row.id}`,
        nodeId: row.id,
        kind: "inhabilitado",
        title: row.name,
        body: String(extra.motivoInhabilitacion || "Proveedor inhabilitado en el RPE").slice(0, 180),
        date: parseDate(extra.fechaInhabilitacion),
        source: extra.source || { label: "DGCP — Inhabilitados", url: "https://datos.gob.do/dataset/proveedores-del-estado-inhabilitados" },
      }),
    );
  }
  return alerts;
}

async function fromFiles() {
  const alerts = [];
  try {
    const bid = parse(await readFile(new URL("prestamos-bid.csv", DATA), "utf8"), {
      columns: true,
      bom: true,
      skip_empty_lines: true,
    }).filter((r) => r.cntry_cd === "DR");
    for (const row of bid) {
      const pipeline = !row.apprvl_dt || row.apprvl_dt === "NULL";
      const isLoan = row.opertyp_nm === "Operación de Préstamo";
      if (!isLoan) continue;
      const date = parseDate(row.apprvl_dt);
      if (!isFresh(date, pipeline)) continue;
      const id = `loan-bid-${slug(row.oper_num)}`;
      alerts.push(
        item({
          id: `a-${id}`,
          nodeId: id,
          kind: pipeline ? "pipeline" : "prestamo",
          title: row.oper_nm,
          body: pipeline
            ? `BID ${row.oper_num} · en preparación`
            : `BID ${row.oper_num} · ${row.publc_sts_nm}`,
          amount: parseAmount(row.orig_apprvd_useq_amnt),
          date,
          source: { label: "BID", url: `https://www.iadb.org/es/proyecto/${row.oper_num}` },
        }),
      );
    }
  } catch {
    /* archivo ausente */
  }

  try {
    const wb = JSON.parse(await readFile(new URL("prestamos-bm.json", DATA), "utf8"));
    for (const row of wb) {
      const date = parseDate(row.boardapprovaldate);
      if (!isFresh(date, false)) continue;
      const id = `loan-bm-${slug(row.id)}`;
      alerts.push(
        item({
          id: `a-${id}`,
          nodeId: id,
          kind: "prestamo",
          title: row.project_name,
          body: `Banco Mundial ${row.id} · ${row.status}`,
          amount: parseAmount(row.totalamt),
          date,
          source: { label: "Banco Mundial", url: row.url },
        }),
      );
    }
  } catch {
    /* archivo ausente */
  }

  try {
    const rows = parse(await readFile(new URL("inhabilitados-dgcp.csv", DATA), "utf8"), {
      columns: true,
      bom: true,
      skip_empty_lines: true,
    });
    for (const row of rows) {
      const date = parseDate(row.FECHA_INHABILITACION);
      if (!isFresh(date, false)) continue;
      const rpe = String(row.RPE || "").trim();
      if (!rpe) continue;
      alerts.push(
        item({
          id: `a-inh-${rpe}`,
          nodeId: rpe,
          kind: "inhabilitado",
          title: `RPE ${rpe} inhabilitado`,
          body: String(row.MOTIVO_INHABILITACION || "").slice(0, 180),
          date,
          source: { label: "DGCP — Inhabilitados", url: row.URL_CERTIFICACION_RPE },
        }),
      );
    }
  } catch {
    /* archivo ausente */
  }

  return alerts;
}

function rank(a, b) {
  const order = { pipeline: 0, prestamo: 1, inhabilitado: 2 };
  const ka = order[a.kind] ?? 9;
  const kb = order[b.kind] ?? 9;
  if (ka !== kb) return ka - kb;
  return String(b.date || "").localeCompare(String(a.date || ""));
}

let cache = null;
let cacheAt = 0;

export async function getAlerts() {
  if (cache && Date.now() - cacheAt < 15_000) return cache;
  const rows = ((await fromPostgres()) || (await fromFiles())).filter((row) =>
    isFresh(row.date ? new Date(row.date) : null, row.kind === "pipeline"),
  );
  const seen = new Set();
  const unique = [];
  let banned = 0;
  for (const row of rows.sort(rank)) {
    if (seen.has(row.nodeId)) continue;
    if (row.kind === "inhabilitado" && ++banned > 6) continue;
    seen.add(row.nodeId);
    unique.push(row);
    if (unique.length >= 16) break;
  }
  cache = {
    generatedAt: new Date().toISOString(),
    label: "Lo que se movió",
    sources: ["BID", "Banco Mundial", "Crédito Público", "DGCP"],
    alerts: unique,
  };
  cacheAt = Date.now();
  return cache;
}

export async function resolveAlertNode(id) {
  if (hasDatabase()) {
    const node = await pgNode(id);
    if (node) return node;
  }
  const pack = await getAlerts();
  const alert = pack.alerts.find((a) => a.nodeId === id || a.id === id);
  if (!alert) return null;
  return {
    id: alert.nodeId,
    name: alert.title,
    category: alert.kind === "inhabilitado" ? "empresa" : "prestamo",
    summary: alert.body,
    amount: alert.amount,
    extra: { source: alert.source, moneda: alert.currency },
    connections: [],
  };
}
