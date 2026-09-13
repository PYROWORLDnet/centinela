/**
 * Modo curado — tema Familias.
 * Historia: no son empresas sueltas. Son casas que capturan sectores.
 */

import { SRC_SHARED, pickNodes, SHARED_EDGES } from "./shared.js";
import { SRC_CUPULA } from "./cupula.js";

const SRC = { ...SRC_SHARED, ...SRC_CUPULA };

const LOCAL_NODES = [
  {
    id: "c-casas",
    name: "Las casas",
    kind: "familia",
    role: "El mapa real del poder económico",
    summary:
      "La Cúpula: Vicini, Corripio, Rainieri, Fanjul, Rizek, González Cuadra, Brache, Estrella, Félix García, Popular, BHD, Banreservas, La Sirena, El Nacional. No compiten solo en el mercado: se reparten banca, AFP, medios, combustible, alimentos, turismo, retail y construcción.",
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
  "c-la-cupula",
  "e-grupo-vicini",
  "e-grupo-rizek",
  "e-grupo-corripio",
  "e-grupo-bonetti",
  "e-grupo-rainieri",
  "e-grupo-fanjul",
  "e-grupo-ccn",
  "e-grupo-brache",
  "e-grupo-linda",
  "e-grupo-ramos",
  "e-grupo-popular",
  "e-grupo-marti",
  "e-grupo-bhd",
  "e-grupo-estrella",
  "p-hector-rizek",
  "p-felix-garcia",
  "i-junta-monetaria",
  "e-afp-crecer",
  "e-afp-popular",
  "e-banco-popular",
  "e-banco-bhd",
  "e-banreservas",
  "e-central-romana",
  "e-jumbo",
  "e-nacional-super",
  "e-la-sirena",
  "e-rica",
  "m-listin",
  "m-el-nacional",
  "m-el-caribe",
  "m-cdn",
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
    source: "c-casas",
    target: "c-la-cupula",
    type: "nombra",
    note: "El mismo mapa, un solo nodo transversal",
    sourceRef: SRC.elCaribeSolidarios,
  },
  {
    source: "c-casas",
    target: "e-grupo-fanjul",
    type: "incluye",
    sourceRef: SRC.fanjulListin,
  },
  {
    source: "c-casas",
    target: "e-grupo-ccn",
    type: "incluye",
    sourceRef: SRC.ccn,
  },
  {
    source: "c-casas",
    target: "e-grupo-brache",
    type: "incluye",
    sourceRef: SRC.rica,
  },
  {
    source: "c-casas",
    target: "e-grupo-linda",
    type: "incluye",
    sourceRef: SRC.elDineroEmporios,
  },
  {
    source: "c-casas",
    target: "e-grupo-ramos",
    type: "incluye",
    sourceRef: SRC.ramos,
  },
  {
    source: "c-casas",
    target: "e-banreservas",
    type: "incluye",
    sourceRef: SRC.banreservas,
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
