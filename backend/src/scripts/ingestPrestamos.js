/**
 * Carga préstamos: Crédito Público, BID y Banco Mundial.
 * Acreedor → otorga → préstamo → ejecutado_por → institución.
 */
import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { dbClient, flushEdges, flushNodes, money, slug } from "../db/upsert.js";

const DATA = new URL("../../data/", import.meta.url);

const LENDERS = {
  BID: { id: "i-bid", name: "Banco Interamericano de Desarrollo", aliases: ["BID", "IDB"] },
  BIRF: { id: "i-bm", name: "Banco Mundial", aliases: ["BIRF", "BM", "World Bank", "Banco Mundial"] },
  CAF: { id: "i-caf", name: "CAF — Banco de Desarrollo de América Latina", aliases: ["CAF"] },
  BCIE: { id: "i-bcie", name: "Banco Centroamericano de Integración Económica", aliases: ["BCIE"] },
  KFW: { id: "i-kfw", name: "KfW", aliases: ["KFW"] },
  FIDA: { id: "i-fida", name: "Fondo Internacional de Desarrollo Agrícola", aliases: ["FIDA"] },
  JICA: { id: "i-jica", name: "JICA", aliases: ["JICA"] },
  BEI: { id: "i-bei", name: "Banco Europeo de Inversiones", aliases: ["BEI"] },
  FMI: { id: "i-fmi", name: "Fondo Monetario Internacional", aliases: ["FMI", "IMF"] },
};

const EXEC_HINTS = {
  MOPC: ["mopc", "obras públicas"],
  MHE: ["hacienda"],
  ME: ["educación"],
  MEPYD: ["economía", "planificación"],
  INDRHI: ["indrhi", "recursos hidráulicos"],
  INAPA: ["inapa"],
  MISPAS: ["salud pública"],
  MINPRE: ["presidencia"],
  MAP: ["administración pública"],
  INDOTEL: ["indotel"],
  DGCP: ["contrataciones públicas", "dgcp"],
  DGII: ["dgii", "impuestos internos"],
};

function lenderOf(name) {
  const key = String(name || "").toUpperCase().trim();
  if (LENDERS[key]) return LENDERS[key];
  if (/BANCO MUNDIAL|WORLD BANK|BIRF|IBRD/.test(key)) return LENDERS.BIRF;
  if (key.includes("BID") || key.includes("INTERAMERICANO")) return LENDERS.BID;
  const id = `lend-${slug(key).toLowerCase()}`;
  return { id, name: name || key, aliases: [key] };
}

function parseUsd(value) {
  if (value == null || value === "" || value === "ND") return null;
  return money(String(value).replace(/,/g, ""));
}

async function loadInstitutions(db) {
  const { rows } = await db.query(`SELECT id, name, aliases FROM nodes WHERE category = 'institucion'`);
  return rows;
}

function matchExecutor(code, institutions) {
  const raw = String(code || "").trim();
  if (!raw || raw === "ND") return null;
  const q = raw.toLowerCase();
  const hints = [
    ...(EXEC_HINTS[raw.toUpperCase()] || []),
    q,
    ...(q.includes("hacienda") || q.includes("finance") ? ["hacienda"] : []),
    ...(q.includes("obras") || q.includes("mopc") ? ["mopc", "obras públicas"] : []),
    ...(q.includes("indrhi") || q.includes("hidrául") ? ["indrhi"] : []),
  ];
  for (const inst of institutions) {
    const hay = `${inst.name} ${(inst.aliases || []).join(" ")}`.toLowerCase();
    if (hay.split(/\W+/).includes(q) || hints.some((h) => h.length >= 3 && hay.includes(h))) return inst.id;
  }
  return `inst-${slug(raw).toLowerCase()}`;
}

function executorNode(id, name) {
  return {
    id,
    name,
    aliases: [name],
    category: "institucion",
    extra: { source: { label: "Crédito Público / prestamistas", url: "https://www.creditopublico.gob.do/servicios/financiamientos" } },
  };
}

async function main() {
  const db = dbClient();
  await db.connect();
  const institutions = await loadInstitutions(db);
  const nodes = [];
  const edges = [];

  nodes.push({
    id: "i-creditopublico",
    name: "Dirección General de Crédito Público",
    aliases: ["Crédito Público", "DGCPUB"],
    category: "institucion",
    extra: { source: { label: "Crédito Público", url: "https://www.creditopublico.gob.do/servicios/financiamientos" } },
  });
  for (const lender of Object.values(LENDERS)) {
    nodes.push({
      id: lender.id,
      name: lender.name,
      aliases: lender.aliases,
      category: "institucion",
      role: "Acreedor internacional",
      extra: { tipo: "acreedor" },
    });
  }

  const cp = JSON.parse(await readFile(new URL("prestamos-creditopublico.json", DATA), "utf8"));
  for (const row of cp) {
    const loanId = `loan-cp-${slug(row.numero)}`;
    const lender = lenderOf(row.acreedor);
    const execId = matchExecutor(row.ejecutor, institutions);
    nodes.push({
      id: lender.id,
      name: lender.name,
      aliases: lender.aliases || [row.acreedor],
      category: "institucion",
      role: "Acreedor",
    });
    nodes.push({
      id: loanId,
      name: `Préstamo ${row.numero} · ${row.acreedor} → ${row.ejecutor}`,
      aliases: [row.numero, row.gaceta].filter((x) => x && x !== "ND"),
      category: "prestamo",
      role: row.fuente,
      amount: parseUsd(row.montoOriginal),
      summary: [row.acreedor, row.ejecutor, row.gaceta, row.moneda].filter(Boolean).join(" · "),
      extra: {
        numero: row.numero,
        acreedor: row.acreedor,
        ejecutor: row.ejecutor,
        moneda: row.moneda,
        gaceta: row.gaceta,
        saldoUsd: row.saldoUsd,
        fuente: row.fuente,
        source: {
          label: "Crédito Público — Consulta de financiamientos",
          url: "https://www.creditopublico.gob.do/servicios/financiamientos",
        },
      },
    });
    edges.push({ source: lender.id, target: loanId, type: "otorga" });
    if (execId) {
      if (execId.startsWith("inst-")) nodes.push(executorNode(execId, row.ejecutor));
      edges.push({ source: loanId, target: execId, type: "ejecutado_por" });
    }
  }

  const bidCsv = await readFile(new URL("prestamos-bid.csv", DATA), "utf8");
  const bidRows = parse(bidCsv, { columns: true, bom: true, skip_empty_lines: true }).filter(
    (r) => r.cntry_cd === "DR",
  );
  for (const row of bidRows) {
    const loanId = `loan-bid-${slug(row.oper_num)}`;
    const pipeline = !row.apprvl_dt || row.apprvl_dt === "NULL";
    nodes.push({
      id: loanId,
      name: row.oper_nm || row.oper_num,
      aliases: [row.oper_num],
      category: "prestamo",
      role: pipeline ? `BID pipeline · ${row.opertyp_nm}` : `BID · ${row.opertyp_nm}`,
      amount: parseUsd(row.orig_apprvd_useq_amnt),
      summary: [row.publc_sts_nm, row.sector_nm, row.apprvl_dt].filter((x) => x && x !== "NULL").join(" · "),
      extra: {
        operacion: row.oper_num,
        estado: row.publc_sts_nm,
        sector: row.sector_nm,
        aprobado: row.apprvl_dt,
        pipeline,
        objetivo: row.objtv && row.objtv !== "NULL" ? String(row.objtv).slice(0, 500) : null,
        source: {
          label: "BID — Listado de proyectos",
          url: `https://www.iadb.org/es/proyecto/${row.oper_num}`,
        },
      },
    });
    edges.push({ source: "i-bid", target: loanId, type: "otorga" });
  }

  const wb = JSON.parse(await readFile(new URL("prestamos-bm.json", DATA), "utf8"));
  for (const row of wb) {
    const loanId = `loan-bm-${slug(row.id)}`;
    const abstract = row.project_abstract?.["cdata!"] || "";
    nodes.push({
      id: loanId,
      name: row.project_name,
      aliases: [row.id],
      category: "prestamo",
      role: `Banco Mundial · ${row.lendinginstr || ""}`.trim(),
      amount: parseUsd(row.totalamt),
      summary: [row.status, row.boardapprovaldate, row.impagency].filter(Boolean).join(" · "),
      extra: {
        proyecto: row.id,
        estado: row.status,
        aprobado: row.boardapprovaldate,
        abstract: String(abstract).slice(0, 500),
        source: {
          label: "Banco Mundial — Projects API",
          url: row.url || `https://projects.worldbank.org/en/projects-operations/project-detail/${row.id}`,
        },
      },
    });
    edges.push({ source: "i-bm", target: loanId, type: "otorga" });
    const agencies = String(row.impagency || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const agency of agencies) {
      let execId = matchExecutor(agency, institutions);
      if (!execId || execId.startsWith("inst-")) {
        execId = `inst-${slug(agency).toLowerCase()}`;
        nodes.push(executorNode(execId, agency));
      }
      edges.push({ source: loanId, target: execId, type: "ejecutado_por" });
    }
  }

  const n = await flushNodes(db, nodes);
  const e = await flushEdges(db, edges);
  const { rows: cats } = await db.query(
    `SELECT category, COUNT(*) FROM nodes WHERE category = 'prestamo' GROUP BY category`,
  );
  const { rows: types } = await db.query(
    `SELECT type, COUNT(*) FROM edges WHERE type IN ('otorga', 'ejecutado_por') GROUP BY type`,
  );
  console.log({ nodes: n, edges: e, prestamos: cats, vinculos: types });
  await db.end();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
