/**
 * Informe de Ejecución Presupuestaria del Gobierno Central (Hacienda y Economía / DIGEPRES).
 *
 * DIGEPRES publica, junto al PDF del informe, un Excel "Cuadros y gráficos" con las
 * mismas tablas. Leemos ese Excel (no el PDF): los números salen tal cual de la fuente.
 *
 * Las tablas se buscan por su TÍTULO (p. ej. "Clasificación Funcional"), no por el
 * nombre de la hoja, porque la numeración cambia entre informes. Si una tabla no
 * aparece o sus encabezados no son los esperados, se lanza un error: preferimos no
 * publicar a publicar un número mal leído.
 */
import XLSX from "xlsx";
import { getJson, download } from "./http.js";

const WP = "https://www.digepres.gob.do/wp-json/wp/v2/media";
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/** Busca el Excel acumulado más reciente: "Cuadros-y-graficos-Enero-<Mes>-<Año>.xlsx". */
export async function buscarInformeAcumulado() {
  const items = await getJson(`${WP}?search=Cuadros-y-graficos-Enero&per_page=50&_fields=source_url,date`);
  const candidatos = items
    .map((it) => {
      const m = decodeURIComponent(it.source_url).match(/Cuadros-y-graficos-Enero-([A-Za-z]+)-(\d{4})/i);
      if (!m || !/\.xlsx?$/i.test(it.source_url)) return null;
      const mes = MESES.indexOf(m[1].toLowerCase());
      if (mes < 0) return null;
      return { url: it.source_url, anio: Number(m[2]), mesHasta: mes + 1, publicado: it.date };
    })
    .filter(Boolean)
    .sort((a, b) => b.anio - a.anio || b.mesHasta - a.mesHasta || b.publicado.localeCompare(a.publicado));
  if (!candidatos.length) throw new Error("DIGEPRES: no se encontró ningún Excel acumulado 'Cuadros-y-graficos-Enero-…'");
  return candidatos[0];
}

function rowsOf(ws) {
  return XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null });
}

/** Encuentra la hoja cuyo título (primeras filas) cumple el patrón. */
function hoja(wb, patron, { excluir } = {}) {
  for (const name of wb.SheetNames) {
    if (/^(indice|índice|index)$/i.test(name.trim())) continue;
    const rows = rowsOf(wb.Sheets[name]);
    const cab = rows.slice(0, 16).flat().filter((c) => typeof c === "string").map(norm).join(" | ");
    if (patron.test(cab) && !(excluir && excluir.test(cab))) return { name: name.trim(), rows };
  }
  throw new Error(`DIGEPRES: no se encontró la tabla ${patron}`);
}

/** Columna (índice) donde está la etiqueta de cada fila: la primera columna con texto en filas de datos. */
function filaPorEtiqueta(rows, patron) {
  for (const r of rows) {
    for (let c = 0; c < Math.min(r.length, 4); c++) {
      if (typeof r[c] === "string" && patron.test(norm(r[c]))) return { row: r, col: c };
    }
  }
  return null;
}

function num(v) {
  if (typeof v === "number") return v;
  if (v == null || v === "") return 0;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Valores numéricos que siguen a la etiqueta (n columnas). */
function valores(hit, n) {
  return Array.from({ length: n }, (_, i) => num(hit.row[hit.col + 1 + i]));
}

function exigir(hit, desc) {
  if (!hit) throw new Error(`DIGEPRES: falta la fila "${desc}"`);
  return hit;
}

function exigirEncabezados(rows, palabras, desc) {
  const cab = rows.slice(0, 22).flat().filter((c) => typeof c === "string").map(norm).join(" | ");
  for (const p of palabras) {
    if (!cab.includes(norm(p))) throw new Error(`DIGEPRES: la tabla "${desc}" no tiene el encabezado "${p}"; el formato cambió`);
  }
}

/* ------------------------------------------------------------------ */

function resumen(wb) {
  const t = hoja(wb, /resumen de las principales variables presupuestarias/);
  exigirEncabezados(t.rows, ["Presupuesto vigente", "Ejecución"], "Resumen");
  const fila = (re, d) => {
    const [ejec2025, ley, vigente, ejec] = valores(exigir(filaPorEtiqueta(t.rows, re), d), 4);
    return { anterior: ejec2025, presupuestoLey: ley, presupuestoVigente: vigente, ejecutado: ejec };
  };
  return {
    tabla: t.name,
    ingresos: fila(/^1\) ingresos/, "1) Ingresos"),
    gastos: fila(/^2\) gastos$/, "2) Gastos"),
    gastosCorrientes: fila(/^2\.1\) gastos corrientes/, "2.1) Gastos Corrientes"),
    intereses: fila(/intereses$/, "2.1.1) Intereses"),
    gastosCapital: fila(/^2\.2\) gastos de capital/, "2.2) Gastos de capital"),
    resultadoPrimario: fila(/^resultado primario/, "Resultado Primario"),
    resultadoFinanciero: fila(/^resultado financiero/, "Resultado Financiero"),
    fuentesFinancieras: fila(/^3\) fuente/, "3) Fuentes Financieras"),
    aplicacionesFinancieras: fila(/^4\) aplicaciones/, "4) Aplicaciones Financieras"),
  };
}

/** Tablas de gasto con columnas: [devengado año anterior, inicial, vigente, comprometido, devengado, pagado]. */
function tablaGasto(t) {
  const out = [];
  for (const r of t.rows) {
    let col = -1;
    for (let c = 0; c < Math.min(r.length, 4); c++) if (typeof r[c] === "string" && r[c].trim()) { col = c; break; }
    if (col < 0) continue;
    const label = r[col].replace(/\s+/g, " ").trim();
    const nums = r.slice(col + 1, col + 7);
    if (nums.filter((x) => typeof x === "number").length < 4) continue;
    const [anterior, inicial, vigente, comprometido, devengado, pagado] = nums.map(num);
    out.push({ label, anterior, inicial, vigente, comprometido, devengado, pagado });
  }
  return out;
}

function funcional(wb) {
  const t = hoja(wb, /gastos del gobierno central por clasificacion funcional/, { excluir: /brecha de genero/ });
  exigirEncabezados(t.rows, ["Devengado", "Vigente", "Pagado"], "Funcional");
  const filas = tablaGasto(t);
  const grupos = [];
  for (const f of filas) {
    const m = f.label.match(/^(\d+(?:\.\d+)?)\s*-\s*(.+)$/);
    if (!m) continue;
    const [codigo, nombre] = [m[1], m[2].trim()];
    if (!codigo.includes(".")) grupos.push({ codigo, nombre, ...pick(f), subfunciones: [] });
    else grupos.at(-1)?.subfunciones.push({ codigo, nombre, ...pick(f) });
  }
  if (grupos.length < 5) throw new Error("DIGEPRES: la tabla funcional tiene menos de 5 grupos");
  return { tabla: t.name, grupos };
}

function economica(wb) {
  const t = hoja(wb, /gastos del gobierno central por clasificacion economica/);
  const filas = tablaGasto(t)
    .map((f) => {
      const m = f.label.match(/^([\d.]+)\s*-\s*(.+)$/);
      return m ? { codigo: m[1], nombre: m[2].trim(), ...pick(f) } : f.label === "TOTAL" ? { codigo: "TOTAL", nombre: "Total", ...pick(f) } : null;
    })
    .filter(Boolean);
  return { tabla: t.name, filas };
}

function institucional(wb) {
  const t = hoja(wb, /gastos del gobierno central por clasificacion institucional/);
  exigirEncabezados(t.rows, ["Devengado", "Presupuesto vigente"], "Institucional");
  const instituciones = [];
  let poder = null;
  let total = null;
  for (const f of tablaGasto(t)) {
    const m = f.label.match(/^(\d{4})\s*-\s*(.+)$/);
    if (m) instituciones.push({ codigo: m[1], nombre: titulo(m[2]), poder, ...pick(f) });
    else if (/^total$/i.test(f.label)) total = pick(f);
    else poder = titulo(f.label);
  }
  if (!total) throw new Error("DIGEPRES: la tabla institucional no tiene TOTAL");
  return { tabla: t.name, instituciones, total };
}

function servicioDeuda(wb) {
  const t = hoja(wb, /servicio de la deuda del gobierno central/);
  const filas = tablaGasto(t);
  const out = {};
  let bloque = null;
  for (const f of filas) {
    const k = norm(f.label);
    if (k === "servicio") out.total = pick(f);
    else if (k === "externo" || k === "interno") { bloque = k; out[k] = { total: pick(f) }; }
    else if (bloque && ["amortizacion", "intereses", "comisiones"].includes(k)) out[bloque][k] = pick(f);
  }
  if (!out.total) throw new Error("DIGEPRES: falta 'Servicio' en la tabla de deuda");
  return { tabla: t.name, ...out };
}

function ingresosPorEntidad(wb) {
  const t = hoja(wb, /ingresos del gobierno central por entidad recaudadora/);
  const out = [];
  for (const sigla of ["DGII", "DGA", "TN"]) {
    const hit = exigir(filaPorEtiqueta(t.rows, new RegExp(`^${sigla.toLowerCase()}$`)), sigla);
    const [anterior, estimado, recaudado] = valores(hit, 3);
    out.push({ sigla, anterior, estimado, recaudado });
  }
  return { tabla: t.name, entidades: out };
}

function ingresosEconomica(wb) {
  const t = hoja(wb, /recaudacion de ingresos por clasificacion economica/);
  const filas = [];
  for (const r of t.rows) {
    const col = r.findIndex((c, i) => i < 4 && typeof c === "string" && /^\d/.test(c.trim()));
    if (col < 0) continue;
    const m = r[col].trim().match(/^([\d.]+)\s*-?\s*(.+)$/);
    if (!m) continue;
    const [anterior, inicial, vigente, estimado, recaudado] = r.slice(col + 1, col + 6).map(num);
    filas.push({ codigo: m[1], nombre: m[2].replace(/\s+/g, " ").trim(), anterior, inicial, vigente, estimado, recaudado });
  }
  return { tabla: t.name, filas };
}

function provincias(wb) {
  const t = hoja(wb, /distribucion geografica de proyectos de inversion/);
  exigirEncabezados(t.rows, ["PRESUPUESTO VIGENTE", "DEVENGADO"], "Distribución geográfica");
  const regiones = [];
  let region = null;
  let prov = null;
  let total = null;
  for (const r of t.rows) {
    const col = r.findIndex((c, i) => i < 4 && typeof c === "string" && c.trim());
    if (col < 0) continue;
    const label = r[col].replace(/\s+/g, " ").trim();
    const [inicial, vigente, anterior, devengado] = r.slice(col + 1, col + 5).map(num);
    const v = { inicial, vigente, anterior, devengado };
    if (/^total general$/i.test(label)) {
      total = v;
    } else if (/^\d+-region/i.test(label) || /^98-nacional/i.test(label)) {
      // "98-NACIONAL" no es una región geográfica: son proyectos de alcance nacional.
      const nacional = /^98-/.test(label);
      region = {
        codigo: label.split("-")[0],
        nombre: nacional ? "Alcance nacional" : titulo(label.replace(/^\d+-region\s*/i, "")),
        ...v,
        provincias: [],
      };
      regiones.push(region);
      prov = null;
    } else if (/^\d+\.\d+\s*-/.test(label)) {
      const m = label.match(/^(\d+\.\d+)\s*-\s*(.+)$/);
      prov?.funciones.push({ codigo: m[1], nombre: m[2].trim(), ...v });
    } else if (/^\d{2}-/.test(label) && region) {
      const codigo = label.slice(0, 2);
      prov = {
        codigo,
        nombre: PROVINCIAS[codigo] || titulo(label.replace(/^\d{2}-/, "")),
        esProvincia: Boolean(PROVINCIAS[codigo]),
        region: region.nombre,
        ...v,
        funciones: [],
      };
      region.provincias.push(prov);
    }
  }
  if (regiones.length < 5) throw new Error("DIGEPRES: la distribución geográfica tiene menos de 5 regiones");
  if (!total) throw new Error("DIGEPRES: la distribución geográfica no tiene 'Total general'");
  return { tabla: t.name, regiones, total };
}

/** Códigos de provincia de la ONE / DIGEPRES. 98 y 99 no son provincias. */
const PROVINCIAS = {
  "01": "Distrito Nacional", "02": "Azua", "03": "Bahoruco", "04": "Barahona", "05": "Dajabón",
  "06": "Duarte", "07": "Elías Piña", "08": "El Seibo", "09": "Espaillat", "10": "Independencia",
  "11": "La Altagracia", "12": "La Romana", "13": "La Vega", "14": "María Trinidad Sánchez",
  "15": "Monte Cristi", "16": "Pedernales", "17": "Peravia", "18": "Puerto Plata",
  "19": "Hermanas Mirabal", "20": "Samaná", "21": "San Cristóbal", "22": "San Juan",
  "23": "San Pedro de Macorís", "24": "Sánchez Ramírez", "25": "Santiago", "26": "Santiago Rodríguez",
  "27": "Valverde", "28": "Monseñor Nouel", "29": "Monte Plata", "30": "Hato Mayor",
  "31": "San José de Ocoa", "32": "Santo Domingo",
};

function metas(wb) {
  const out = [];
  for (const name of wb.SheetNames) {
    const rows = rowsOf(wb.Sheets[name]);
    const tituloHoja = rows.slice(0, 12).flat().find((c) => typeof c === "string" && /metas fisicas\s*-/.test(norm(c)));
    if (!tituloHoja) continue;
    const institucion = titulo(tituloHoja.split(/-\s*/).slice(1).join("- ").trim());
    const hdr = rows.findIndex((r) => r.some((c) => typeof c === "string" && norm(c) === "productos"));
    if (hdr < 0) continue;
    const c0 = rows[hdr].findIndex((c) => typeof c === "string" && norm(c) === "programa");
    let programa = null;
    let unidad = null;
    const productos = [];
    for (const r of rows.slice(hdr + 1)) {
      if (typeof r[c0] === "string" && r[c0].trim()) programa = r[c0].trim();
      if (typeof r[c0 + 2] === "string" && r[c0 + 2].trim()) unidad = r[c0 + 2].trim();
      const producto = r[c0 + 1];
      const meta = r[c0 + 3];
      const logrado = r[c0 + 4];
      if (typeof producto !== "string" || typeof meta !== "number" || typeof logrado !== "number" || meta <= 0) continue;
      productos.push({
        programa,
        producto: producto.replace(/^\d+-/, "").trim(),
        unidad,
        meta,
        logrado,
        cumplimiento: logrado / meta,
        devengado: num(r[c0 + 6]),
      });
    }
    if (productos.length) out.push({ tabla: name.trim(), institucion, productos });
  }
  return out;
}

/* ------------------------------------------------------------------ */

function pick(f) {
  const { anterior, inicial, vigente, comprometido, devengado, pagado } = f;
  return { anterior, inicial, vigente, comprometido, devengado, pagado };
}

const MINUSCULAS = new Set(["de", "del", "la", "las", "los", "y", "e", "el", "a", "en", "para", "por"]);
function titulo(s) {
  return String(s)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w, i) => (i > 0 && MINUSCULAS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function periodo(wb, anio, mesHasta) {
  return {
    anio,
    mesDesde: 1,
    mesHasta,
    etiqueta: `enero–${MESES[mesHasta - 1]} ${anio}`,
    dias: Math.round((Date.UTC(anio, mesHasta, 1) - Date.UTC(anio, 0, 1)) / 86_400_000),
  };
}

export async function leerInformeAcumulado({ refresh = false } = {}) {
  const info = await buscarInformeAcumulado();
  const nombre = decodeURIComponent(info.url.split("/").pop());
  const archivo = await download(info.url, `digepres-${nombre}`, { refresh });
  const wb = XLSX.readFile(archivo.file);
  return {
    fuente: {
      institucion: "Ministerio de Hacienda y Economía — Dirección General de Presupuesto (DIGEPRES)",
      documento: `Informe de Ejecución Presupuestaria, cuadros y gráficos (${nombre})`,
      ...archivo,
      publicado: info.publicado,
    },
    periodo: periodo(wb, info.anio, info.mesHasta),
    resumen: resumen(wb),
    funcional: funcional(wb),
    economica: economica(wb),
    institucional: institucional(wb),
    deuda: servicioDeuda(wb),
    ingresosEntidad: ingresosPorEntidad(wb),
    ingresosEconomica: ingresosEconomica(wb),
    provincias: provincias(wb),
    metas: metas(wb),
  };
}
