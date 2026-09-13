/**
 * Modo curado — tema Familias.
 * Historia: no son empresas sueltas. Son casas que capturan sectores.
 */

import { SRC_SHARED, pickNodes, SHARED_EDGES } from "./shared.js";

const SRC = { ...SRC_SHARED };

const LOCAL_NODES = [
  {
    id: "c-casas",
    name: "Las casas",
    kind: "familia",
    role: "El mapa real del poder económico",
    summary:
      "Vicini/INICIA, Rizek, Corripio, Popular, BHD, Martí, Bonetti/SID, Rainieri/Puntacana, Estrella. No compiten solo en el mercado: se reparten banca, AFP, medios, combustible, alimentos, turismo, construcción.",
    mechanism: "El Estado no flota solo. Trabaja sobre una geografía de familias.",
    weight: 100,
    source: SRC.inicia,
    themes: ["familias"],
  },
  {
    id: "e-rizek-cacao",
    name: "Rizek Cacao",
    kind: "empresa",
    role: "Exportación de cacao",
    summary:
      "Rizek Cacao / Nazario Rizek: uno de los exportadores históricos de cacao del país (Listín Diario / Bloomberg Línea).",
    weight: 72,
    source: SRC.rizekCacao,
    themes: ["familias", "aduana"],
  },
  {
    id: "e-patsa",
    name: "PATSA LTD",
    kind: "empresa",
    role: "Filial Rizek · Refidomsa 2021",
    summary:
      "Facilitó la recompra del 49% de Refidomsa para el Estado (Hacienda). Puente familia ↔ combustible.",
    weight: 78,
    source: SRC.haciendaPatsa,
    themes: ["familias", "gasolina"],
  },
  {
    id: "e-refidomsa",
    name: "Refidomsa",
    kind: "estado",
    role: "Refinería estatal · 100% Estado",
    summary: "Estado dueño desde 2021; la operación del 49% pasó por PATSA/Roryk.",
    weight: 75,
    source: SRC.haciendaPatsa,
    themes: ["familias", "gasolina"],
  },
];

const SHARED_IDS = [
  "e-grupo-vicini",
  "e-grupo-rizek",
  "e-grupo-corripio",
  "e-grupo-bonetti",
  "e-grupo-rainieri",
  "e-grupo-popular",
  "e-grupo-marti",
  "e-grupo-bhd",
  "e-grupo-estrella",
  "p-hector-rizek",
  "i-junta-monetaria",
  "e-afp-crecer",
  "e-afp-popular",
  "e-banco-popular",
  "e-banco-bhd",
  "e-banreservas",
  "m-listin",
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

export const FAMILIAS_NODES = dedupe([...LOCAL_NODES, ...pickNodes(SHARED_IDS)]);

export const FAMILIAS_EDGES = [
  ...SHARED_EDGES,
  {
    source: "c-casas",
    target: "e-grupo-vicini",
    type: "incluye",
    sourceRef: SRC.inicia,
  },
  {
    source: "c-casas",
    target: "e-grupo-rizek",
    type: "incluye",
    sourceRef: SRC.rizekBloomberg,
  },
  {
    source: "c-casas",
    target: "e-grupo-corripio",
    type: "incluye",
    sourceRef: SRC.corripioWiki,
  },
  {
    source: "c-casas",
    target: "e-grupo-popular",
    type: "incluye",
    sourceRef: SRC.popular,
  },
  {
    source: "c-casas",
    target: "e-grupo-bhd",
    type: "incluye",
    sourceRef: SRC.bhd,
  },
  {
    source: "c-casas",
    target: "e-grupo-marti",
    type: "incluye",
    sourceRef: SRC.marti,
  },
  {
    source: "c-casas",
    target: "e-grupo-bonetti",
    type: "incluye",
    sourceRef: SRC.sid,
  },
  {
    source: "c-casas",
    target: "e-grupo-rainieri",
    type: "incluye",
    sourceRef: SRC.puntacana,
  },
  {
    source: "c-casas",
    target: "e-grupo-estrella",
    type: "incluye",
    sourceRef: SRC.estrella,
  },
  {
    source: "e-grupo-rizek",
    target: "e-rizek-cacao",
    type: "controla",
    note: "Exportación de cacao",
    sourceRef: SRC.rizekCacao,
  },
  {
    source: "e-grupo-rizek",
    target: "e-patsa",
    type: "controla",
    sourceRef: SRC.haciendaPatsa,
  },
  {
    source: "e-patsa",
    target: "e-refidomsa",
    type: "facilitó_recompra",
    sourceRef: SRC.haciendaPatsa,
  },
];
