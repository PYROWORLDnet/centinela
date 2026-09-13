/**
 * Modo curado — tema Aduana / Importaciones.
 */

import { SRC_SHARED, pickNodes, SHARED_EDGES } from "./shared.js";

const SRC = { ...SRC_SHARED };

const LOCAL_NODES = [
  {
    id: "c-comercio-puerta",
    name: "La puerta del comercio",
    kind: "estado",
    role: "Todo lo que entra pasa por aquí",
    summary:
      "Aduana + MICM: aranceles, permisos, licencias, precios regulados. Quien navega esa puerta mejor —o con más peso— influye en qué llega y a qué precio.",
    mechanism: "No es solo logística. Es poder sobre el consumo.",
    weight: 96,
    source: SRC.dga,
    themes: ["aduana"],
  },
  {
    id: "e-tropigas",
    name: "Tropigas",
    kind: "empresa",
    role: "GLP · importación → entrega",
    summary: "Grupo Martí: cadena de GLP desde la importación hasta el usuario final.",
    weight: 84,
    source: SRC.marti,
    themes: ["aduana", "gasolina"],
  },
  {
    id: "e-sunix",
    name: "Sunix",
    kind: "empresa",
    role: "Combustibles líquidos importados",
    summary: "Grupo Martí: importación y distribución de gasolina y diésel.",
    weight: 82,
    source: SRC.marti,
    themes: ["aduana", "gasolina"],
  },
  {
    id: "e-rizek-cacao",
    name: "Rizek Cacao",
    kind: "empresa",
    role: "Exportación (salida por la misma puerta)",
    summary:
      "La aduana no es solo importar: también exportar. Rizek Cacao es un actor histórico de exportación.",
    weight: 70,
    source: SRC.rizekCacao,
    themes: ["aduana", "familias"],
  },
  {
    id: "c-importadores",
    name: "Grandes importadores",
    kind: "empresa",
    role: "Martí · Corripio · Rizek · otros",
    summary:
      "Combustibles (Martí), distribución comercial (Corripio), cacao/export (Rizek). Distintos rubros, misma lógica: la puerta del comercio la cruzan las casas con escala.",
    weight: 88,
    source: SRC.marti,
    themes: ["aduana"],
  },
];

const SHARED_IDS = [
  "i-dga",
  "i-micm",
  "e-grupo-marti",
  "e-grupo-corripio",
  "e-grupo-rizek",
  "e-grupo-bonetti",
  "e-grupo-vicini",
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

export const ADUANA_NODES = dedupe([...LOCAL_NODES, ...pickNodes(SHARED_IDS)]);

export const ADUANA_EDGES = [
  ...SHARED_EDGES.filter(
    (e) =>
      SHARED_IDS.includes(e.source) ||
      SHARED_IDS.includes(e.target) ||
      ["e-tropigas", "e-sunix", "e-rizek-cacao", "i-dga", "e-grupo-marti"].includes(e.source) ||
      ["e-tropigas", "e-sunix", "e-rizek-cacao", "i-dga", "e-grupo-marti"].includes(e.target),
  ),
  {
    source: "i-dga",
    target: "c-comercio-puerta",
    type: "opera",
    sourceRef: SRC.dga,
  },
  {
    source: "i-micm",
    target: "c-comercio-puerta",
    type: "regula",
    note: "Licencias, precios, comercio",
    sourceRef: SRC.micm,
  },
  {
    source: "c-comercio-puerta",
    target: "c-importadores",
    type: "atraviesan",
    sourceRef: SRC.dga,
  },
  {
    source: "c-importadores",
    target: "e-grupo-marti",
    type: "incluye",
    note: "Combustibles / GLP",
    sourceRef: SRC.marti,
  },
  {
    source: "c-importadores",
    target: "e-grupo-corripio",
    type: "incluye",
    note: "Distribución comercial",
    sourceRef: SRC.corripioWiki,
  },
  {
    source: "c-importadores",
    target: "e-grupo-rizek",
    type: "incluye",
    note: "Cacao / comercio exterior",
    sourceRef: SRC.rizekCacao,
  },
  {
    source: "c-importadores",
    target: "e-grupo-bonetti",
    type: "incluye",
    note: "Alimentos / industria SID",
    sourceRef: SRC.sid,
  },
  {
    source: "e-grupo-marti",
    target: "e-tropigas",
    type: "controla",
    sourceRef: SRC.marti,
  },
  {
    source: "e-grupo-marti",
    target: "e-sunix",
    type: "controla",
    sourceRef: SRC.marti,
  },
  {
    source: "e-grupo-rizek",
    target: "e-rizek-cacao",
    type: "controla",
    sourceRef: SRC.rizekCacao,
  },
  {
    source: "e-tropigas",
    target: "i-dga",
    type: "importa_via",
    sourceRef: SRC.marti,
  },
  {
    source: "e-sunix",
    target: "i-dga",
    type: "importa_via",
    sourceRef: SRC.marti,
  },
];
