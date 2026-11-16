/**
 * Contrataciones públicas (DGCP) en formato OCDS.
 *
 * La API y los archivos de la DGCP están detrás de Cloudflare, que bloquea a los
 * servidores en la nube. Por eso hay dos vías:
 *   1) Open Contracting Data Registry (data.open-contracting.org), que copia los
 *      datos de la API de la DGCP una vez al mes. Funciona desde cualquier servidor.
 *   2) Colector local (scripts/colectarDgcp.js) que corre en una conexión normal
 *      y deja el mismo formato en backend/data/fuentes/dgcp-<año>.jsonl.gz.
 * Se usa el archivo más reciente de los dos.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createGunzip } from "node:zlib";
import readline from "node:readline";
import path from "node:path";
import { download, CACHE_DIR } from "./http.js";

const OCDR = "https://data.open-contracting.org/en/publication/22";

/** Métodos donde se espera competencia: aquí "un solo oferente" sí es una señal. */
const COMPETITIVOS = new Set([
  "Comparación de Precios",
  "Licitación Pública Nacional",
  "Licitación Pública Abreviada",
  "Licitación Pública Internacional",
  "Subasta Inversa",
]);

async function fuenteMasReciente(anio, { refresh }) {
  const local = path.join(CACHE_DIR, `dgcp-${anio}.jsonl.gz`);
  const st = await stat(local).catch(() => null);
  const ocdr = await download(`${OCDR}/download?name=${anio}.jsonl.gz`, `ocdr-dgcp-${anio}.jsonl.gz`, { refresh });
  if (st && st.mtime.toISOString() > ocdr.descargado) {
    return { file: local, url: "https://datosabiertos.dgcp.gob.do/api-dgcp/v1", via: "colector local (API DGCP)", descargado: st.mtime.toISOString() };
  }
  return { ...ocdr, via: "Open Contracting Data Registry (copia mensual de la API DGCP)" };
}

export async function leerContratos({ anio = new Date().getFullYear(), refresh = false } = {}) {
  const fuente = await fuenteMasReciente(anio, { refresh });
  const rl = readline.createInterface({ input: createReadStream(fuente.file).pipe(createGunzip()), crlfDelay: Infinity });

  let procesos = 0;
  let contratos = [];
  const metodos = new Map();
  let otrasMonedas = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    const r = JSON.parse(line);
    procesos++;
    const t = r.tender || {};
    const metodo = t.procurementMethodDetails || "Sin especificar";
    const awards = new Map((r.awards || []).map((a) => [a.id, a]));
    const partes = new Map((r.parties || []).map((p) => [p.id, p]));
    const comprador = r.buyer?.name || t.procuringEntity?.name || partes.get(t.procuringEntity?.id)?.name || "Sin institución";
    const m = metodos.get(metodo) || { metodo, procesos: 0, contratos: 0, monto: 0, unSoloOferente: 0 };
    m.procesos++;
    if (t.numberOfTenderers === 1) m.unSoloOferente++;
    metodos.set(metodo, m);

    for (const c of r.contracts || []) {
      if (c.status !== "active") continue;
      if (c.value?.currency !== "DOP") { otrasMonedas++; continue; }
      const award = awards.get(c.awardID) || {};
      const sup = (award.suppliers || [])[0] || {};
      const supParty = partes.get(sup.id) || {};
      const monto = Number(c.value.amount) || 0;
      const estimado = t.value?.currency === "DOP" ? Number(t.value.amount) || 0 : 0;
      // Regla de calidad: un contrato que supera 10× el estimado de su propio proceso
      // casi siempre es un error de digitación en el portal (p. ej. tres ceros de más).
      // No se suma a totales ni rankings; se muestra aparte para que se pueda revisar.
      const inconsistente = estimado > 0 && monto > 10 * estimado;
      if (!inconsistente) {
        m.contratos++;
        m.monto += monto;
      }
      const enlace = (t.documents || []).map((d) => d.url).find((u) => /OpportunityDetail/i.test(u || "")) || null;
      contratos.push({
        enlace: enlace ? enlace.replace(/(\.gob\.do)\/\//, "$1/") : null,
        inconsistente,
        estimado,
        id: c.id,
        ocid: r.ocid,
        titulo: (c.title || t.title || "").replace(/\s+/g, " ").trim(),
        institucion: comprador.replace(/\s+/g, " ").trim(),
        proveedor: (sup.name || supParty.name || "Sin proveedor").replace(/\s+/g, " ").trim(),
        proveedorId: sup.id || null,
        monto,
        fecha: (award.date || r.date || "").slice(0, 10),
        metodo,
        oferentes: t.numberOfTenderers ?? null,
        categoria: t.mainProcurementCategory || null,
        alertas: [
          ...(metodo === "Procesos de Excepción" ? ["excepcion"] : []),
          ...(COMPETITIVOS.has(metodo) && t.numberOfTenderers === 1 ? ["un_solo_oferente"] : []),
        ],
      });
    }
  }

  const inconsistentes = contratos.filter((c) => c.inconsistente).sort((a, b) => b.monto - a.monto);
  const todos = contratos;
  contratos = contratos.filter((c) => !c.inconsistente);
  contratos.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.monto - a.monto);
  const total = contratos.reduce((a, c) => a + c.monto, 0);
  const sumaPor = (key) => {
    const acc = new Map();
    for (const c of contratos) {
      const k = c[key];
      const v = acc.get(k) || { nombre: k, contratos: 0, monto: 0 };
      v.contratos++;
      v.monto += c.monto;
      acc.set(k, v);
    }
    return [...acc.values()].sort((a, b) => b.monto - a.monto);
  };
  const competitivos = [...metodos.values()].filter((x) => COMPETITIVOS.has(x.metodo));
  const conAlerta = contratos.filter((c) => c.alertas.length);

  return {
    fuente: {
      institucion: "Dirección General de Contrataciones Públicas (DGCP)",
      documento: `Procesos y contratos ${anio} en formato OCDS — vía ${fuente.via}`,
      url: fuente.url,
      sha256: fuente.sha256 || null,
      descargado: fuente.descargado,
    },
    anio,
    fechaMasReciente: contratos.find((c) => c.fecha <= new Date().toISOString().slice(0, 10))?.fecha || null,
    procesos,
    contratosActivos: contratos.length,
    montoActivo: total,
    contratosOtrasMonedas: otrasMonedas,
    metodos: [...metodos.values()].sort((a, b) => b.monto - a.monto),
    competencia: {
      procesosCompetitivos: competitivos.reduce((a, x) => a + x.procesos, 0),
      conUnSoloOferente: competitivos.reduce((a, x) => a + x.unSoloOferente, 0),
    },
    excepcion: {
      contratos: contratos.filter((c) => c.metodo === "Procesos de Excepción").length,
      monto: contratos.filter((c) => c.metodo === "Procesos de Excepción").reduce((a, c) => a + c.monto, 0),
    },
    topProveedores: sumaPor("proveedor").slice(0, 25),
    topInstituciones: sumaPor("institucion").slice(0, 25),
    recientes: contratos.filter((c) => c.monto > 0 && c.fecha <= new Date().toISOString().slice(0, 10)).slice(0, 60),
    inconsistentes: { contratos: inconsistentes.length, lista: inconsistentes.slice(0, 30), totalRegistros: todos.length },
    mayoresConAlerta: [...conAlerta].sort((a, b) => b.monto - a.monto).slice(0, 30),
    mayores: [...contratos].sort((a, b) => b.monto - a.monto).slice(0, 30),
  };
}
