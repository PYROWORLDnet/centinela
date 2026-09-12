/**
 * Descarga declaraciones DJP desde consultadjp.camaradecuentas.gob.do
 * 1) Catálogo completo (DataTables)
 * 2) PDFs de resumen patrimonial (verPatrimonio) → montos parseados
 *
 * SKIP_PDF=1  → solo catálogo
 * PDF_LIMIT=N → solo N patrimonios (pruebas)
 * PDF_CONCURRENCY=8
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { PDFParse } from "pdf-parse";

const DIR = new URL("../../data/", import.meta.url);
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const BASE = "https://consultadjp.camaradecuentas.gob.do";
const PAGE = 200;
const CONCURRENCY = Number(process.env.PDF_CONCURRENCY || 8);
const SKIP_PDF = process.env.SKIP_PDF === "1";
const PDF_LIMIT = process.env.PDF_LIMIT ? Number(process.env.PDF_LIMIT) : null;

const jar = new Map();

function storeCookies(res) {
  for (const c of res.headers.getSetCookie?.() || []) {
    const [nv] = c.split(";");
    const i = nv.indexOf("=");
    if (i > 0) jar.set(nv.slice(0, i), nv.slice(i + 1));
  }
}

function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function get(pathname) {
  const res = await fetch(BASE + pathname, {
    headers: { "User-Agent": UA, Cookie: cookieHeader(), Referer: BASE + "/" },
    redirect: "follow",
  });
  storeCookies(res);
  return res;
}

async function postForm(pathname, data) {
  const res = await fetch(BASE + pathname, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      Cookie: cookieHeader(),
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      Referer: BASE + "/",
    },
    body: new URLSearchParams(data),
    redirect: "follow",
  });
  storeCookies(res);
  return res;
}

function parseAspDate(value) {
  if (value == null) return null;
  const m = String(value).match(/\/Date\((-?\d+)/);
  if (!m) return null;
  return new Date(Number(m[1])).toISOString().slice(0, 10);
}

function parseMoneyText(text, label) {
  const re = new RegExp(`${label}\\s*([\\d,]+\\.?\\d*)`, "i");
  const m = text.match(re);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n) : null;
}

async function parsePatrimonioPdf(buf) {
  const parser = new PDFParse({ data: buf });
  try {
    const result = await parser.getText();
    const text = result.text || "";
    return {
      patrimonioNeto: parseMoneyText(text, "Patrimonio neto \\(activo - pasivo\\)"),
      totalActivos: parseMoneyText(text, "Total Activos"),
      totalPasivos: parseMoneyText(text, "Total Pasivos"),
      rawPreview: text.slice(0, 400),
    };
  } finally {
    await parser.destroy?.();
  }
}

async function mapPool(items, concurrency, fn) {
  let i = 0;
  const results = new Array(items.length);
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function downloadCatalog() {
  await get("/");
  const first = await (
    await postForm("/Home/dtSourceDetalle", {
      draw: "1",
      start: "0",
      length: String(PAGE),
      Declaracion: "",
      Cedula: "",
      Entidad: "",
      Cargo: "",
      Nombre: "",
      init: "false",
    })
  ).json();

  const total = Number(first.recordsTotal || 0);
  const rows = [...(first.data || [])];
  console.log("catálogo total", total);

  for (let start = PAGE; start < total; start += PAGE) {
    const page = await (
      await postForm("/Home/dtSourceDetalle", {
        draw: String(start),
        start: String(start),
        length: String(PAGE),
        Declaracion: "",
        Cedula: "",
        Entidad: "",
        Cargo: "",
        Nombre: "",
        init: "false",
      })
    ).json();
    rows.push(...(page.data || []));
    if (start % 1000 === 0 || start + PAGE >= total) {
      console.log("catálogo", Math.min(start + PAGE, total), "/", total);
    }
  }

  return rows.map((r) => ({
    declaracion: r.Declaracion,
    identificador: r.Identificador,
    nombre: String(r.NombreCompleto || "").replace(/\s+/g, " ").trim(),
    entidad: String(r.Entidad || "").replace(/\s+/g, " ").trim(),
    funcion: String(r.Funcion || "").replace(/\s+/g, " ").trim(),
    fechaDesignacion: parseAspDate(r.FechaDesignacion),
    fechaRecibido: parseAspDate(r.FechaRecibido),
    verDJP: Boolean(r.verDJP),
    verPatrimonio: Boolean(r.verPatrimonio),
  }));
}

async function enrichPatrimonio(rows) {
  let targets = rows.filter((r) => r.verPatrimonio && r.identificador);
  if (PDF_LIMIT != null) targets = targets.slice(0, PDF_LIMIT);
  console.log("patrimonios a parsear", targets.length);

  let done = 0;
  let ok = 0;
  let fail = 0;
  const byDecl = new Map();

  await mapPool(targets, CONCURRENCY, async (row) => {
    try {
      const res = await get(`/Reportes/resumenPatrimonialDJP?param=${encodeURIComponent(row.identificador)}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.slice(0, 4).toString() !== "%PDF") {
        fail += 1;
        return;
      }
      const parsed = await parsePatrimonioPdf(buf);
      byDecl.set(row.declaracion, {
        declaracion: row.declaracion,
        patrimonioNeto: parsed.patrimonioNeto,
        totalActivos: parsed.totalActivos,
        totalPasivos: parsed.totalPasivos,
      });
      ok += 1;
    } catch {
      fail += 1;
    } finally {
      done += 1;
      if (done % 100 === 0 || done === targets.length) {
        console.log("pdf", done, "/", targets.length, { ok, fail });
      }
    }
  });

  return byDecl;
}

async function main() {
  await mkdir(DIR, { recursive: true });
  const catalogPath = path.join(DIR.pathname, "djp-declaraciones.json");
  const patrimonioPath = path.join(DIR.pathname, "djp-patrimonios.json");

  let rows;
  if (process.env.REUSE_CATALOG === "1" && existsSync(catalogPath)) {
    rows = JSON.parse(await readFile(catalogPath, "utf8"));
    console.log("reusando catálogo", rows.length);
  } else {
    rows = await downloadCatalog();
    await writeFile(catalogPath, JSON.stringify(rows));
    console.log("guardado", catalogPath, rows.length);
  }

  let patrimonioMap = new Map();
  if (!SKIP_PDF) {
    patrimonioMap = await enrichPatrimonio(rows);
    const list = [...patrimonioMap.values()];
    await writeFile(patrimonioPath, JSON.stringify(list));
    console.log("guardado", patrimonioPath, list.length);
  } else if (existsSync(patrimonioPath)) {
    const list = JSON.parse(await readFile(patrimonioPath, "utf8"));
    patrimonioMap = new Map(list.map((p) => [p.declaracion, p]));
    console.log("reusando patrimonios", patrimonioMap.size);
  }

  const withMoney = rows.filter((r) => patrimonioMap.has(r.declaracion)).length;
  console.log({
    declaraciones: rows.length,
    conPatrimonioFlag: rows.filter((r) => r.verPatrimonio).length,
    conMonto: withMoney,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
