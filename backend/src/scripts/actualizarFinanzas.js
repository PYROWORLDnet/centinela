/**
 * Actualiza los datos públicos de Centinela a partir de las fuentes oficiales.
 *
 *   node src/scripts/actualizarFinanzas.js            # usa caché si existe
 *   node src/scripts/actualizarFinanzas.js --refresh  # vuelve a descargar todo
 *
 * Escribe backend/src/data/finanzas/datos.json SOLO si todas las verificaciones pasan.
 * Si algo no cuadra, sale con error y deja publicado el archivo anterior.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { leerInformeAcumulado } from "../finanzas/digepres.js";
import { leerRecaudacion } from "../finanzas/dgii.js";
import { leerContratos } from "../finanzas/contratos.js";
import { REGLAS } from "../finanzas/reglas.js";

const OUT_DIR = new URL("../data/finanzas/", import.meta.url);
const OUT = new URL("datos.json", OUT_DIR);
const refresh = process.argv.includes("--refresh");

const errores = [];
const verificaciones = [];
function verificar(nombre, a, b, tolerancia = 0.001) {
  const dif = Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1);
  const ok = dif <= tolerancia;
  verificaciones.push({ nombre, a: Math.round(a), b: Math.round(b), diferencia: Number(dif.toFixed(6)), ok });
  if (!ok) errores.push(`${nombre}: ${Math.round(a).toLocaleString("en")} vs ${Math.round(b).toLocaleString("en")} (${(dif * 100).toFixed(3)}%)`);
}

/* Agrupación ciudadana del clasificador funcional oficial. Cada categoría lista sus códigos oficiales. */
const CATEGORIAS = [
  { id: "deuda", nombre: "Pago de deuda pública", detalle: "Intereses, comisiones y otros cargos de la deuda", codigos: ["5.1"] },
  { id: "educacion", nombre: "Educación", codigos: ["4.4"] },
  { id: "proteccion", nombre: "Ayudas sociales y pensiones", codigos: ["4.5", "4.6"] },
  { id: "salud", nombre: "Salud", codigos: ["4.2"] },
  { id: "seguridad", nombre: "Seguridad, justicia y defensa", codigos: ["1.3", "1.4"] },
  { id: "energia", nombre: "Luz y combustibles", codigos: ["2.4"] },
  { id: "administracion", nombre: "Administración del gobierno", codigos: ["1.1", "1.2"] },
  { id: "transporte", nombre: "Carreteras y transporte", codigos: ["2.6", "2.7"] },
  { id: "economia", nombre: "Agricultura, comercio y economía", codigos: ["2.1", "2.2", "2.3", "2.5", "2.8", "2.9"] },
  { id: "vivienda", nombre: "Vivienda, deporte, cultura y ambiente", codigos: ["4.1", "4.3", "3.1", "3.2", "3.3"] },
];

const TIPOS = [
  { id: "sueldos", nombre: "Sueldos de empleados públicos", codigos: ["2.1.2.1"] },
  { id: "intereses", nombre: "Intereses de la deuda", codigos: ["2.1.4"] },
  { id: "transfPublicas", nombre: "Transferencias a otras entidades del Estado", detalle: "Ayuntamientos, hospitales, universidades, empresas eléctricas, etc.", codigos: ["2.1.6.2", "2.1.6.4"] },
  { id: "compras", nombre: "Compras de bienes y servicios", codigos: ["2.1.2.2", "2.1.2.4", "2.1.2.7", "2.1.2.8"] },
  { id: "obras", nombre: "Obras, equipos y terrenos", codigos: ["2.2.1", "2.2.2", "2.2.4", "2.2.5", "2.2.8"] },
  { id: "transfCapital", nombre: "Transferencias para obras de otras entidades", codigos: ["2.2.6"] },
  { id: "pensiones", nombre: "Pensiones y seguridad social", codigos: ["2.1.3"] },
  { id: "transfPrivadas", nombre: "Ayudas y transferencias al sector privado", codigos: ["2.1.6.1", "2.1.6.3"] },
  { id: "subsidios", nombre: "Subsidios a empresas", codigos: ["2.1.5"] },
  { id: "otros", nombre: "Otros gastos", codigos: ["2.1.9"] },
];

function main() {
  return Promise.all([leerInformeAcumulado({ refresh }), leerRecaudacion({ refresh }), leerContratos({ refresh })]);
}

const [ej, dgii, contratos] = await main();
const r = ej.resumen;
const gastoTotal = r.gastos.ejecutado;

/* ---------- Verificaciones: si alguna falla, no se publica ---------- */
verificar("Ingresos − gastos = resultado financiero", r.ingresos.ejecutado - r.gastos.ejecutado, r.resultadoFinanciero.ejecutado);
verificar("Gasto total (resumen) = total institucional", gastoTotal, ej.institucional.total.devengado);
verificar("Gasto total = suma de funciones", gastoTotal, ej.funcional.grupos.reduce((a, g) => a + g.devengado, 0));
verificar("Gasto total = total clasificación económica", gastoTotal, ej.economica.filas.find((f) => f.codigo === "TOTAL")?.devengado ?? 0);
verificar("Gasto total = suma de instituciones", gastoTotal, ej.institucional.instituciones.reduce((a, i) => a + i.devengado, 0));
verificar("Intereses (resumen) = intereses (económica)", r.intereses.ejecutado, ej.economica.filas.find((f) => f.codigo === "2.1.4")?.devengado ?? 0);
for (const g of ej.funcional.grupos) {
  verificar(`Función ${g.codigo}: grupo = suma de subfunciones`, g.devengado, g.subfunciones.reduce((a, s) => a + s.devengado, 0));
}
verificar("Inversión: total general = suma de regiones", ej.provincias.total.devengado, ej.provincias.regiones.reduce((a, x) => a + x.devengado, 0));
for (const reg of ej.provincias.regiones) {
  verificar(`Región ${reg.nombre}: total = suma de provincias`, reg.devengado, reg.provincias.reduce((a, p) => a + p.devengado, 0));
}
const recaudadoEntidades = ej.ingresosEntidad.entidades.reduce((a, e) => a + e.recaudado, 0);
if (recaudadoEntidades > r.ingresos.ejecutado * 1.001) errores.push("DGII+DGA+TN supera los ingresos totales");
const dgiiInforme = ej.ingresosEntidad.entidades.find((e) => e.sigla === "DGII").recaudado;
if (dgii.ultimoMes.anio === ej.periodo.anio && dgii.ultimoMes.mes === ej.periodo.mesHasta) {
  verificar("DGII: dataset de recaudación = informe de Hacienda", dgii.acumulado, dgiiInforme, 0.005);
}

/* ---------- Derivados para la app ---------- */
const subf = new Map(ej.funcional.grupos.flatMap((g) => g.subfunciones.map((s) => [s.codigo, s])));
const categorias = CATEGORIAS.map((c) => {
  const partes = c.codigos.map((k) => subf.get(k)).filter(Boolean);
  const suma = (k) => partes.reduce((a, p) => a + p[k], 0);
  return {
    ...c,
    devengado: suma("devengado"),
    anterior: suma("anterior"),
    vigente: suma("vigente"),
    oficiales: partes.map((p) => ({ codigo: p.codigo, nombre: p.nombre, devengado: p.devengado })),
  };
}).sort((a, b) => b.devengado - a.devengado);
verificar("Categorías ciudadanas = gasto total", categorias.reduce((a, c) => a + c.devengado, 0), gastoTotal);

const eco = new Map(ej.economica.filas.map((f) => [f.codigo, f]));
const tipos = TIPOS.map((t) => {
  const partes = t.codigos.map((k) => eco.get(k)).filter(Boolean);
  return { ...t, devengado: partes.reduce((a, p) => a + p.devengado, 0), anterior: partes.reduce((a, p) => a + p.anterior, 0) };
}).sort((a, b) => b.devengado - a.devengado);
verificar("Tipos de gasto = gasto total", tipos.reduce((a, t) => a + t.devengado, 0), gastoTotal);

// Provincias: una provincia puede aparecer en dos regiones (p. ej. Azua); se suman por código.
const provMap = new Map();
for (const reg of ej.provincias.regiones) {
  for (const p of reg.provincias) {
    if (!p.esProvincia) continue;
    const prev = provMap.get(p.codigo);
    if (!prev) provMap.set(p.codigo, { ...p, regiones: [reg.nombre], funciones: p.funciones.map((f) => ({ ...f })) });
    else {
      for (const k of ["inicial", "vigente", "anterior", "devengado"]) prev[k] += p[k];
      prev.regiones.push(reg.nombre);
      for (const f of p.funciones) {
        const pf = prev.funciones.find((x) => x.codigo === f.codigo);
        if (pf) for (const k of ["inicial", "vigente", "anterior", "devengado"]) pf[k] += f[k];
        else prev.funciones.push({ ...f });
      }
    }
  }
}
const provincias = [...provMap.values()]
  .map(({ esProvincia, region, ...p }) => ({ ...p, funciones: p.funciones.filter((f) => f.devengado || f.vigente || f.anterior).sort((a, b) => b.devengado - a.devengado) }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
const sinProvincia = ej.provincias.total.devengado - provincias.reduce((a, p) => a + p.devengado, 0);

if (errores.length) {
  console.error("✗ No se publica: hay verificaciones que no cuadran:\n  - " + errores.join("\n  - "));
  process.exit(1);
}

const prev = await readFile(OUT, "utf8").then(JSON.parse).catch(() => null);
if (prev) {
  const a = prev.periodo.anio * 12 + prev.periodo.mesHasta;
  const b = ej.periodo.anio * 12 + ej.periodo.mesHasta;
  if (b < a) {
    console.error(`✗ No se publica: el informe nuevo (${ej.periodo.etiqueta}) es más viejo que el publicado (${prev.periodo.etiqueta}).`);
    process.exit(1);
  }
}

// Contratos: nunca reemplazar datos más nuevos (p. ej. del colector local) por una copia más vieja.
let bloqueContratos = (({ fuente, ...c }) => c)(contratos);
let fuenteContratos = contratos.fuente;
if (prev?.contratos?.fechaMasReciente && prev.contratos.anio === contratos.anio && prev.contratos.fechaMasReciente > (contratos.fechaMasReciente || "")) {
  console.log(`· Contratos: se mantienen los publicados (hasta ${prev.contratos.fechaMasReciente}); la fuente nueva llega solo hasta ${contratos.fechaMasReciente}.`);
  bloqueContratos = prev.contratos;
  fuenteContratos = prev.fuentes.contratos;
}

const dias = ej.periodo.dias;
const datos = {
  generado: new Date().toISOString(),
  periodo: ej.periodo,
  fuentes: { ejecucion: ej.fuente, recaudacion: dgii.fuente, contratos: fuenteContratos, reglas: REGLAS },
  verificaciones,
  balance: {
    ingresos: r.ingresos,
    gastos: r.gastos,
    intereses: r.intereses,
    resultadoFinanciero: r.resultadoFinanciero,
    resultadoPrimario: r.resultadoPrimario,
    prestamos: r.fuentesFinancieras,
    amortizaciones: r.aplicacionesFinancieras,
    porDia: { gasto: gastoTotal / dias, intereses: r.intereses.ejecutado / dias, ingresos: r.ingresos.ejecutado / dias },
    tablas: { resumen: r.tabla },
  },
  ingresos: {
    entidades: ej.ingresosEntidad.entidades,
    economica: ej.ingresosEconomica.filas,
    dgii: { ultimoMes: dgii.ultimoMes, acumulado: dgii.acumulado, acumuladoAnterior: dgii.acumuladoAnterior, conceptos: dgii.conceptos, serie: dgii.serie },
    tablas: { entidades: ej.ingresosEntidad.tabla, economica: ej.ingresosEconomica.tabla },
  },
  gastos: {
    total: gastoTotal,
    categorias,
    tipos,
    instituciones: ej.institucional.instituciones.filter((i) => i.vigente > 0 || i.devengado > 0),
    deuda: ej.deuda,
    tablas: { funcional: ej.funcional.tabla, economica: ej.economica.tabla, institucional: ej.institucional.tabla, deuda: ej.deuda.tabla },
  },
  cumplimiento: {
    presupuestoVigente: r.gastos.presupuestoVigente,
    ejecutado: gastoTotal,
    avanceDelAnio: ej.periodo.mesHasta / 12,
    metas: ej.metas,
  },
  provincias: { lista: provincias, total: ej.provincias.total, sinProvincia, tabla: ej.provincias.tabla },
  contratos: bloqueContratos,
};

// Si lo único distinto son las fechas de descarga/generación, no se reescribe el archivo.
const sinFechas = (o) => JSON.stringify(o, (k, v) => (k === "generado" || k === "descargado" ? undefined : v));
if (prev && sinFechas(prev) === sinFechas(datos)) {
  console.log(`= Sin cambios: ${ej.periodo.etiqueta} ya está publicado con los mismos datos.`);
  process.exit(0);
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT, JSON.stringify(datos));
const kb = Math.round(JSON.stringify(datos).length / 1024);
console.log(`✓ Publicado ${ej.periodo.etiqueta} — ${verificaciones.length} verificaciones OK — ${kb} KB`);
