/**
 * Modo curado — tema Medios.
 * Ownership solo con fuente. Teleantillas/Hoy/Telesistema = Corripio.
 * Listín = Vicini + Rizek + Corripio + Bermúdez (2010).
 */

import { SRC_SHARED, pickNodes, SHARED_EDGES } from "./shared.js";

const SRC = {
  ...SRC_SHARED,
  decreto124: {
    label: "Presidencia — Decreto 1-24 regula la publicidad oficial",
    url: "https://presidencia.gob.do/noticias/presidente-abinader-promulga-decreto-1-24-que-regula-la-publicidad-oficial",
  },
  decreto124Pdf: {
    label: "Decreto 1-24 (PDF) — criterios de contratación de publicidad oficial",
    url: "https://presidencia.gob.do/sites/default/files/decree/2024-01/Decreto%201-24.pdf",
  },
  diecomDatos: {
    label: "Datos ABiertos — ejecución presupuestaria DIECOM 2022-2026",
    url: "https://www.datos.gob.do/dataset/diecom-ejecucion-presupuestaria",
  },
  diecom: {
    label: "DIECOM — Dirección de Estrategia y Comunicación Gubernamental",
    url: "https://diecom.gob.do/",
  },
  digepresPauta: {
    label: "EyR / Digepres — gasto publicidad 2025 ~RD$10,252 MM (partida modificada)",
    url: "https://eyr.com.do/gobierno-gasto-publicidad-2025-rd10200-millones/",
  },
};

const LOCAL_NODES = [
  {
    id: "c-filtros",
    name: "Filtros de información",
    kind: "medio",
    role: "Quién decide qué se discute",
    summary:
      "Los principales diarios y canales no flotan libres: pertenecen a casas que también tocan banca, industria o pensiones. No hace falta “mentir”: basta con no contar lo que no conviene.",
    mechanism: "La agenda informativa es parte del mismo mapa de poder.",
    weight: 96,
    source: SRC.corripioWiki,
    themes: ["medios"],
  },
  {
    id: "c-pauta-oficial",
    name: "Pauta oficial",
    kind: "medio",
    role: "Publicidad del Estado · control de agenda",
    aliases: ["pauta", "publicidad oficial", "pauta gubernamental"],
    summary:
      "El Estado compra espacios en medios, periodistas e influenciadores. Esa plata no es solo “comunicación”: es oxígeno financiero. El Decreto 1-24 intenta poner criterios objetivos; la partida de publicidad, impresión y encuadernación sigue siendo de miles de millones (Digepres vía prensa: ~RD$10,252 MM en 2025 tras modificación; ~RD$11,292 MM ejecutados en 2024).",
    mechanism: "Quien reparte la pauta condiciona qué medios respiran.",
    weight: 94,
    source: SRC.decreto124,
    themes: ["medios"],
  },
  {
    id: "i-diecom",
    name: "DIECOM",
    kind: "estado",
    role: "Estrategia y comunicación gubernamental",
    aliases: ["diecom", "dirección de estrategia y comunicación"],
    summary:
      "Dirección de Estrategia y Comunicación Gubernamental (Decreto 542-21). Coordina la comunicación del Ejecutivo. Con el Decreto 1-24, junto a la DGCP, verifica el cumplimiento de las reglas de publicidad oficial. Publica ejecución presupuestaria en datos abiertos.",
    weight: 88,
    source: SRC.diecom,
    themes: ["medios"],
  },
  {
    id: "c-decreto-1-24",
    name: "Decreto 1-24",
    kind: "estado",
    role: "Reglas de la publicidad oficial",
    summary:
      "Obliga a instituciones del Poder Ejecutivo a contratar publicidad con criterios documentados (público objetivo, alcance, costo por impacto). Prohíbe usar la pauta como propaganda electoral o subsidio encubierto. DGCP y DIECOM fiscalizan. No elimina la pauta: intenta transparentar el peaje.",
    mechanism: "Sin criterio publicado, la pauta es favor; con decreto, queda el rastro.",
    weight: 86,
    source: SRC.decreto124Pdf,
    themes: ["medios"],
  },
];

const SHARED_IDS = [
  "c-la-cupula",
  "e-grupo-corripio",
  "e-grupo-vicini",
  "e-grupo-rizek",
  "e-grupo-popular",
  "e-grupo-linda",
  "e-grupo-estrella",
  "p-felix-garcia",
  "m-listin",
  "m-hoy",
  "m-telesistema",
  "m-teleantillas",
  "m-el-dia",
  "m-el-nacional",
  "m-el-caribe",
  "m-cdn",
  "e-distribuidora-corripio",
  "e-pinturas-tropical",
  "e-isla-petroleo",
];

function dedupe(nodes) {
  const seen = new Set();
  const out = [];
  for (const n of nodes) {
    if (!n?.id || seen.has(n.id)) continue;
    seen.add(n.id);
    out.push(n);
  }
  return out;
}

export const MEDIOS_NODES = dedupe([...LOCAL_NODES, ...pickNodes(SHARED_IDS)]);

export const MEDIOS_EDGES = [
  ...SHARED_EDGES.filter(
    (e) =>
      SHARED_IDS.includes(e.source) ||
      SHARED_IDS.includes(e.target) ||
      e.source.startsWith("m-") ||
      e.target.startsWith("m-"),
  ),
  {
    source: "c-filtros",
    target: "e-grupo-corripio",
    type: "concentra",
    note: "Mayor bloque mediático documentado",
    sourceRef: SRC.corripioWiki,
  },
  {
    source: "c-filtros",
    target: "m-listin",
    type: "incluye",
    note: "Diario histórico · varias casas",
    sourceRef: SRC.listin2010,
  },
  {
    source: "c-filtros",
    target: "e-grupo-vicini",
    type: "incluye",
    sourceRef: SRC.listin2010,
  },
  {
    source: "c-filtros",
    target: "e-grupo-rizek",
    type: "incluye",
    sourceRef: SRC.listin2010,
  },
  {
    source: "c-filtros",
    target: "m-el-nacional",
    type: "incluye",
    note: "Periódico · Corripio",
    sourceRef: SRC.corripioWiki,
  },
  {
    source: "c-filtros",
    target: "e-grupo-linda",
    type: "incluye",
    note: "El Caribe + CDN",
    sourceRef: SRC.corripioWiki,
  },
  {
    source: "c-filtros",
    target: "c-la-cupula",
    type: "atraviesa",
    sourceRef: SRC.corripioWiki,
  },
  {
    source: "c-filtros",
    target: "c-pauta-oficial",
    type: "incluye",
    note: "Ownership + pauta = doble filtro",
    sourceRef: SRC.decreto124,
  },
  {
    source: "c-pauta-oficial",
    target: "i-diecom",
    type: "coordina",
    sourceRef: SRC.diecom,
  },
  {
    source: "c-decreto-1-24",
    target: "i-diecom",
    type: "regula",
    note: "DIECOM + DGCP verifican cumplimiento",
    sourceRef: SRC.decreto124,
  },
  {
    source: "c-decreto-1-24",
    target: "c-pauta-oficial",
    type: "enmarca",
    sourceRef: SRC.decreto124Pdf,
  },
  {
    source: "i-diecom",
    target: "c-pauta-oficial",
    type: "ejecuta",
    note: "Ejecución presupuestaria publicada (datos abiertos)",
    sourceRef: SRC.diecomDatos,
  },
  {
    source: "c-pauta-oficial",
    target: "e-grupo-corripio",
    type: "oxigena",
    note: "Bloques mediáticos compiten por la pauta estatal",
    sourceRef: SRC.digepresPauta,
  },
  {
    source: "c-pauta-oficial",
    target: "m-listin",
    type: "oxigena",
    sourceRef: SRC.digepresPauta,
  },
];
