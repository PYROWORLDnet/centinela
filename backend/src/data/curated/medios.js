/**
 * Modo curado — tema Medios.
 * Ownership solo con fuente. Teleantillas/Hoy/Telesistema = Corripio.
 * Listín = Vicini + Rizek + Corripio + Bermúdez (2010).
 */

import { SRC_SHARED, pickNodes, SHARED_EDGES } from "./shared.js";

const SRC = { ...SRC_SHARED };

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
];

const SHARED_IDS = [
  "e-grupo-corripio",
  "e-grupo-vicini",
  "e-grupo-rizek",
  "e-grupo-popular",
  "m-listin",
  "m-hoy",
  "m-telesistema",
  "m-teleantillas",
  "m-el-dia",
  "m-el-nacional",
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
];
