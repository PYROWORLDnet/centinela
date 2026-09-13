/**
 * Modo curado — tema Banca y Seguros.
 */

import { SRC_SHARED, pickNodes, SHARED_EDGES } from "./shared.js";

const SRC = { ...SRC_SHARED };

const LOCAL_NODES = [
  {
    id: "c-corazon-bancario",
    name: "Corazón del sistema",
    kind: "banco",
    role: "Bancos + AFP + mesa monetaria",
    summary:
      "Los bancos no son solo bancos: son el núcleo que compra deuda pública, alimenta AFP del mismo grupo y se sienta bajo reglas de la Junta Monetaria. La ley prohíbe a un miembro designado mandar un banco. Héctor José Rizek Llabaly fue miembro histórico (1985–2026), no actual.",
    mechanism: "Cada casa grande quiere su banco, su AFP, su flujo.",
    weight: 100,
    source: SRC.sb,
    themes: ["banca"],
  },
];

const SHARED_IDS = [
  "c-la-cupula",
  "i-junta-monetaria",
  "i-superintendencia-bancos",
  "i-banco-central",
  "e-grupo-popular",
  "e-grupo-bhd",
  "e-grupo-rizek",
  "e-grupo-brache",
  "e-banco-popular",
  "e-banco-bhd",
  "e-banreservas",
  "e-afp-popular",
  "e-afp-crecer",
  "e-afp-siembra",
  "e-afp-reservas",
  "p-hector-rizek",
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

export const BANCA_NODES = dedupe([...LOCAL_NODES, ...pickNodes(SHARED_IDS)]);

export const BANCA_EDGES = [
  ...SHARED_EDGES,
  {
    source: "c-corazon-bancario",
    target: "e-banco-popular",
    type: "incluye",
    sourceRef: SRC.popular,
  },
  {
    source: "c-corazon-bancario",
    target: "e-banco-bhd",
    type: "incluye",
    sourceRef: SRC.bhd,
  },
  {
    source: "c-corazon-bancario",
    target: "e-banreservas",
    type: "incluye",
    sourceRef: SRC.banreservas,
  },
  {
    source: "c-corazon-bancario",
    target: "i-junta-monetaria",
    type: "regido_por",
    sourceRef: SRC.jm,
  },
  {
    source: "c-corazon-bancario",
    target: "i-superintendencia-bancos",
    type: "supervisado_por",
    sourceRef: SRC.sb,
  },
  {
    source: "c-corazon-bancario",
    target: "c-la-cupula",
    type: "atraviesa",
    note: "Las mismas casas del mapa",
    sourceRef: SRC.popular,
  },
];
