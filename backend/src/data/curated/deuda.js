/**
 * Modo curado — tema Deuda.
 * Historia: el Estado emite → AFP/bancos compran → impuestos pagan intereses → ciclos.
 */

import {
  SRC_SHARED,
  pickNodes,
  SHARED_EDGES,
} from "./shared.js";

const SRC = {
  ...SRC_SHARED,
};

const LOCAL_NODES = [
  {
    id: "c-deuda-total",
    name: "Deuda pública total",
    kind: "financiador",
    role: "US$74,895 MM · 57.5% PIB (Acento)",
    summary:
      "Acento, citando el debate presupuestario: la deuda pública total alcanza US$74,895 millones (57.5% del PIB). Distinta de la serie SPNF de Crédito Público (~US$67,828 MM a jul 2026).",
    amount: 74_895_000_000,
    weight: 98,
    source: SRC.acentoDeuda,
    themes: ["deuda"],
  },
  {
    id: "c-deuda-spnf",
    name: "Deuda SPNF",
    kind: "financiador",
    role: "US$67,827.8 MM (jul 2026)",
    summary:
      "Dirección General de Crédito Público: deuda del sector público no financiero US$67,827.8 millones al 31 de julio de 2026 (preliminar).",
    amount: 67_827_800_000,
    weight: 90,
    source: SRC.creditoPublico,
    themes: ["deuda"],
  },
  {
    id: "c-afp-bonos",
    name: "AFP en deuda del Estado",
    kind: "afp",
    role: "+RD$803,000 MM (Acento)",
    summary:
      "Acento: las AFP tienen más de RD$803 mil millones colocados en deuda del Gobierno y del Banco Central. Tu cotización financia al deudor Estado.",
    amount: 803_000_000_000,
    weight: 94,
    source: SRC.acentoDeuda,
    themes: ["deuda", "pensiones"],
  },
  {
    id: "c-bancos-deuda",
    name: "Bancos en deuda del Estado",
    kind: "banco",
    role: "+RD$900,000 MM entidades financieras (Acento)",
    summary:
      "Acento: entidades de intermediación financiera internas tienen más de RD$900 mil millones invertidos en deuda del Gobierno y del Banco Central.",
    amount: 900_000_000_000,
    weight: 92,
    source: SRC.acentoDeuda,
    themes: ["deuda", "banca"],
  },
  {
    id: "c-intereses-2026",
    name: "Intereses 2026",
    kind: "financiador",
    role: "RD$362,550 MM · 22.3% del gasto (CREES)",
    summary:
      "CREES vía 7días: en el presupuesto 2026 el pago de intereses alcanzaría RD$362,550 millones (22.3% del gasto total), por encima de Educación (20.2%). DIGEPRES publica otra línea de intereses (~RD$322,361 MM) en su política presupuestaria.",
    amount: 362_550_000_000,
    weight: 96,
    source: SRC.creesIntereses,
    themes: ["deuda"],
  },
  {
    id: "c-acreedores-privados",
    name: "Acreedores privados",
    kind: "financiador",
    role: "~76% de la deuda externa del gobierno (Acento)",
    summary:
      "Acento: de deberle a gobiernos y organismos, se pasó a que acreedores privados controlen ~76% de la deuda pública externa del gobierno — y casi el 100% de la interna.",
    weight: 86,
    source: SRC.acentoDeuda,
    themes: ["deuda"],
  },
  {
    id: "c-impuestos-deuda",
    name: "Impuestos que pagan intereses",
    kind: "financiador",
    role: "El ciclo se cierra en tu bolsillo",
    summary:
      "Los intereses de la deuda salen del presupuesto: ITBIS, ISR y demás. Cotizas a la AFP que compra el bono; luego pagas impuestos para que el Estado le pague a esa misma AFP.",
    mechanism: "Doble carga: cotización + impuesto sobre el mismo circuito.",
    weight: 88,
    source: SRC.acentoDeuda,
    themes: ["deuda", "pensiones"],
  },
  {
    id: "e-patsa",
    name: "PATSA LTD",
    kind: "empresa",
    role: "Filial Rizek · puente a combustible",
    summary:
      "Facilitó la recompra del 49% de Refidomsa (Hacienda, 2021). Misma familia que AFP Crecer — deuda, pensiones y combustible se tocan.",
    weight: 70,
    source: SRC.haciendaPatsa,
    themes: ["deuda", "gasolina", "familias"],
  },
];

const SHARED_IDS = [
  "c-la-cupula",
  "i-hacienda",
  "i-banco-central",
  "e-grupo-popular",
  "e-grupo-rizek",
  "e-grupo-bhd",
  "e-grupo-vicini",
  "e-afp-popular",
  "e-afp-crecer",
  "e-afp-siembra",
  "e-afp-reservas",
  "e-banco-popular",
  "e-banco-bhd",
  "e-banreservas",
];

export const DEUDA_NODES = [...pickNodes(SHARED_IDS), ...LOCAL_NODES];

export const DEUDA_EDGES = [
  ...SHARED_EDGES.filter(
    (e) =>
      SHARED_IDS.includes(e.source) ||
      SHARED_IDS.includes(e.target) ||
      e.source === "e-grupo-rizek" ||
      e.target === "e-afp-crecer",
  ),
  {
    source: "i-hacienda",
    target: "c-deuda-total",
    type: "emite",
    note: "Bonos y obligaciones del Estado",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "i-hacienda",
    target: "c-deuda-spnf",
    type: "reporta",
    note: "Serie SPNF · Crédito Público",
    sourceRef: SRC.creditoPublico,
  },
  {
    source: "c-deuda-total",
    target: "c-afp-bonos",
    type: "comprada_por",
    note: "AFP como acreedoras internas",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "c-deuda-total",
    target: "c-bancos-deuda",
    type: "comprada_por",
    note: "Bancos como acreedores internos",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "e-afp-popular",
    target: "c-afp-bonos",
    type: "integra",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "e-afp-crecer",
    target: "c-afp-bonos",
    type: "integra",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "e-afp-siembra",
    target: "c-afp-bonos",
    type: "integra",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "e-afp-reservas",
    target: "c-afp-bonos",
    type: "integra",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "e-banco-popular",
    target: "c-bancos-deuda",
    type: "integra",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "e-banco-bhd",
    target: "c-bancos-deuda",
    type: "integra",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "e-banreservas",
    target: "c-bancos-deuda",
    type: "integra",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "i-hacienda",
    target: "c-intereses-2026",
    type: "paga",
    note: "Partida de intereses del presupuesto",
    amount: 362_550_000_000,
    sourceRef: SRC.creesIntereses,
  },
  {
    source: "c-impuestos-deuda",
    target: "c-intereses-2026",
    type: "financia",
    note: "Impuestos → servicio de deuda",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "c-intereses-2026",
    target: "c-afp-bonos",
    type: "remunera",
    note: "Intereses vuelven a tenedores de bonos",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "c-intereses-2026",
    target: "c-bancos-deuda",
    type: "remunera",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "c-deuda-total",
    target: "c-acreedores-privados",
    type: "composición",
    note: "~76% externa en manos privadas",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "e-grupo-rizek",
    target: "e-patsa",
    type: "controla",
    sourceRef: SRC.haciendaPatsa,
  },
  {
    source: "i-banco-central",
    target: "c-bancos-deuda",
    type: "emite_titulos",
    note: "Títulos BC en carteras financieras",
    sourceRef: SRC.acentoDeuda,
  },
  {
    source: "c-acreedores-privados",
    target: "c-la-cupula",
    type: "atraviesa",
    note: "Popular, BHD, Rizek, Banreservas son casas, no “el mercado”",
    sourceRef: SRC.acentoDeuda,
  },
];
