/**
 * DGII — "Recaudación Efectiva" (datos.gob.do). CSV con una fila por
 * concepto × sub-concepto × año × mes. Solo cubre lo que cobra la DGII
 * (no Aduanas ni Tesorería): por eso el total de ingresos del Estado sale de DIGEPRES.
 */
import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { getJson, download } from "./http.js";

const CKAN = "https://datos.gob.do/api/3/action";
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export async function buscarRecaudacion() {
  const res = await getJson(`${CKAN}/package_search?q=${encodeURIComponent('"Recaudación Efectiva" DGII')}&rows=10`);
  const pkg = res.result.results.find((p) => /^recaudacion-efectiva/.test(p.name));
  if (!pkg) throw new Error("DGII: no se encontró el dataset 'Recaudación Efectiva' en datos.gob.do");
  const csv = pkg.resources.find((r) => String(r.format).toUpperCase() === "CSV");
  if (!csv) throw new Error("DGII: el dataset no tiene recurso CSV");
  return { dataset: pkg.title, url: csv.url, actualizado: pkg.metadata_modified };
}

function monto(s) {
  const n = Number(String(s ?? "").replace(/[,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Nombres más claros para la gente, sin cambiar a qué concepto oficial corresponden. */
const NOMBRES = [
  [/adicionales y selectivos/i, "Selectivos (combustibles, alcohol, cigarrillos, etc.)"],
  [/sobre los bienes y servicios$/i, "ITBIS y otros impuestos al consumo"],
  [/empresas/i, "Impuesto sobre la renta de las empresas"],
  [/personas f/i, "Impuesto sobre la renta de las personas (sueldos y otros)"],
  [/sin distinci/i, "Retenciones e impuestos a ingresos sin distinción de persona"],
  [/propiedad/i, "Impuestos a la propiedad (vehículos, inmuebles, etc.)"],
  [/uso de bienes y licencias/i, "Licencias, marbetes y uso de bienes"],
  [/comercio exterior/i, "Impuestos al comercio exterior"],
];
const nombreClaro = (c) => (NOMBRES.find(([re]) => re.test(c)) || [null, c])[1];

export async function leerRecaudacion({ refresh = false } = {}) {
  const info = await buscarRecaudacion();
  const archivo = await download(info.url, "dgii-recaudacion-efectiva.csv", { refresh });
  const rows = parse(await readFile(archivo.file), { bom: true, relax_column_count: true, skip_empty_lines: true });
  const [hdr, ...data] = rows;
  if (!/concepto/i.test(hdr[0]) || !/a.o/i.test(hdr[2]) || !/mes/i.test(hdr[3])) {
    throw new Error(`DGII: encabezados inesperados ${JSON.stringify(hdr.slice(0, 5))}`);
  }
  const porMes = new Map(); // "2026-09" -> total
  const porConcepto = new Map(); // `${anio}|${concepto}` -> [12 meses]
  let ultimo = "0000-00";
  for (const r of data) {
    const anio = Number(String(r[2]).trim());
    const mes = MESES.indexOf(String(r[3]).trim().toLowerCase()) + 1;
    const m = monto(r[4]);
    if (!anio || !mes || m == null) continue;
    const k = `${anio}-${String(mes).padStart(2, "0")}`;
    porMes.set(k, (porMes.get(k) || 0) + m);
    if (k > ultimo) ultimo = k;
    const concepto = String(r[0]).replace(/\s+/g, " ").trim();
    const ck = `${anio}|${concepto}`;
    if (!porConcepto.has(ck)) porConcepto.set(ck, Array(12).fill(0));
    porConcepto.get(ck)[mes - 1] += m;
  }
  const [anioUlt, mesUlt] = ultimo.split("-").map(Number);
  const serie = [...porMes.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([k]) => Number(k.slice(0, 4)) >= anioUlt - 2)
    .map(([periodo, total]) => ({ periodo, total }));
  const conceptos = [...porConcepto.entries()]
    .filter(([k]) => k.startsWith(`${anioUlt}|`))
    .map(([k, meses]) => {
      const concepto = k.split("|")[1];
      const anterior = (porConcepto.get(`${anioUlt - 1}|${concepto}`) || []).slice(0, mesUlt).reduce((a, b) => a + b, 0);
      return {
        concepto,
        nombre: nombreClaro(concepto),
        acumulado: meses.slice(0, mesUlt).reduce((a, b) => a + b, 0),
        anterior,
      };
    })
    .sort((a, b) => b.acumulado - a.acumulado);
  return {
    fuente: {
      institucion: "Dirección General de Impuestos Internos (DGII)",
      documento: info.dataset,
      ...archivo,
      actualizadoEnPortal: info.actualizado,
    },
    ultimoMes: { anio: anioUlt, mes: mesUlt, etiqueta: `${MESES[mesUlt - 1]} ${anioUlt}` },
    acumulado: conceptos.reduce((a, c) => a + c.acumulado, 0),
    acumuladoAnterior: [...porMes.entries()]
      .filter(([k]) => k.startsWith(`${anioUlt - 1}-`) && Number(k.slice(5)) <= mesUlt)
      .reduce((a, [, v]) => a + v, 0),
    conceptos,
    serie,
  };
}
