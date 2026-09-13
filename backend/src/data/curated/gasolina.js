/**
 * Modo curado — tema Gasolina.
 * Solo hechos con fuente pública verificable. Montos solo cuando la fuente los publica.
 *
 * Historia: juego cerrado de tres patas —
 * Estado (Refidomsa / MICM) · Grupo Rizek (PATSA + AFP Crecer) · Grupo Martí (Tropigas / Sunix).
 * El contribuyente paga el subsidio que estabiliza el precio.
 */

import { CUPULA_NODE } from "./cupula.js";

const SRC = {
  haciendaRefidomsa: {
    label: "Hacienda — Estado adquiere 100% Refidomsa (PATSA / Grupo Rizek)",
    url: "https://www.hacienda.gob.do/gobierno-dominicano-adquiere-el-control-del-100-de-las-acciones-de-refidomsa/",
  },
  diarioLibreRefidomsa: {
    label: "Diario Libre — Patsa (Grupo Rizek) intermediaria Refidomsa 2021",
    url: "https://www.diariolibre.com/economia/gobierno-recupera-el-control-de-refidomsa-tras-operacion-con-pdvsa-AO28267272",
  },
  diarioLibreCrudo: {
    label: "Diario Libre — Refidomsa: ~30,000 bpd · crudo St. James / Shell",
    url: "https://www.diariolibre.com/economia/energia/2026/04/08/recibe-rd-petroleo-que-transita-por-el-estrecho-de-ormuz/3494741",
  },
  diarioLibreSubsidio: {
    label: "Diario Libre — subsidio semanal RD$1,631.5 MM (sep 2026)",
    url: "https://www.diariolibre.com/economia/energia/2026/09/11/republica-dominicana-mantiene-precios-gasolinas-y-subsidios/3656391",
  },
  martiNosotros: {
    label: "Grupo Martí — Nosotros (Tropigas / Sunix)",
    url: "https://marti.do/nosotros",
  },
  micm: {
    label: "MICM — Ministerio de Industria, Comercio y Mipymes",
    url: "https://www.micm.gob.do/",
  },
  afpCrecerNosotros: {
    label: "AFP Crecer — Nosotros (Grupo Rizek)",
    url: "https://afpcrecer.com.do/nosotros/",
  },
  refidomsa: {
    label: "Refidomsa",
    url: "https://www.refidomsa.com.do/",
  },
  shell: {
    label: "Shell",
    url: "https://www.shell.com/",
  },
};

/** @type {Array<object>} */
export const GASOLINA_NODES = [
  CUPULA_NODE,
  // —— Hub ——
  {
    id: "i-micm",
    name: "MICM",
    kind: "estado",
    role: "Fija precios semanales · absorbe volatilidad",
    summary:
      "Ministerio de Industria, Comercio y Mipymes. Publica precios de combustibles y destina subsidios para congelarlos. En la semana del 12–18 sep 2026: RD$1,631.5 millones en subsidios.",
    mechanism:
      "El Estado fija el precio al público y paga la diferencia cuando el mercado internacional sube.",
    weight: 100,
    amount: 1_631_500_000,
    source: SRC.diarioLibreSubsidio,
    themes: ["gasolina"],
  },

  // —— Tres patas ——
  {
    id: "e-refidomsa",
    name: "Refidomsa",
    kind: "estado",
    role: "Refinería estatal · 100% Estado desde 2021",
    summary:
      "Refinería Dominicana de Petróleo. Desde ago 2021 el Estado posee el 100% (antes 51% Estado / 49% PDV Caribe). Procesa ~30,000 barriles diarios; el crudo actual viene de EE.UU. con contrato Shell (Refidomsa vía Diario Libre). Dueño de la planta ≠ dueño de toda la cadena.",
    mechanism: "El Estado da la legalidad y la refinería. El crudo y la distribución viven afuera.",
    weight: 94,
    source: SRC.haciendaRefidomsa,
    themes: ["gasolina"],
  },
  {
    id: "e-grupo-rizek",
    name: "Grupo Rizek",
    kind: "familia",
    role: "Dos venas: combustible + pensiones",
    summary:
      "Facilitó la recompra del 49% de Refidomsa vía PATSA LTD (Hacienda, ago 2021). El mismo grupo controla AFP Crecer. Misma familia, dos venas: combustible y pensiones.",
    mechanism: "Aparece donde el Estado necesita intermediario — y donde se administran tus ahorros.",
    weight: 96,
    source: SRC.haciendaRefidomsa,
    themes: ["gasolina", "pensiones"],
  },
  {
    id: "e-grupo-marti",
    name: "Grupo Martí",
    kind: "familia",
    role: "Distribución GLP y líquidos",
    summary:
      "Grupo empresarial (sitio Martí): líder en GLP vía Tropigas; fuerte en combustibles líquidos vía Sunix. Cadena desde importación hasta entrega. También Volvo y otros negocios.",
    mechanism: "Quien controla la manguera controla el día a día del combustible.",
    weight: 95,
    source: SRC.martiNosotros,
    themes: ["gasolina"],
  },

  // —— Rizek / PATSA / Crecer ——
  {
    id: "e-patsa",
    name: "PATSA LTD",
    kind: "empresa",
    role: "Filial Grupo Rizek · facilitador Refidomsa 2021",
    summary:
      "Hacienda: en ago 2021 PATSA LTD (Grupo Rizek) permutó con PDV Caribe el 49% de Refidomsa a cambio de bonos venezolanos, y de inmediato vendió esas acciones al Estado por €74 MM (~US$88.1 MM). Facilitador, no dueño final de la refinería.",
    weight: 82,
    amount: 88_134_000,
    source: SRC.haciendaRefidomsa,
    themes: ["gasolina"],
  },
  {
    id: "e-afp-crecer",
    name: "AFP Crecer",
    kind: "afp",
    role: "Administradora · Grupo Rizek",
    summary:
      "AFP del Grupo Rizek (sitio AFP Crecer). Misma familia que facilitó la operación Refidomsa vía PATSA. Puente explícito entre pensiones y combustible.",
    weight: 78,
    source: SRC.afpCrecerNosotros,
    themes: ["gasolina", "pensiones"],
  },

  // —— Martí ops ——
  {
    id: "e-tropigas",
    name: "Tropigas",
    kind: "empresa",
    role: "GLP · importación → usuario final",
    summary:
      "Negocio de GLP del Grupo Martí. Sitio corporativo: participan en toda la cadena del mercado de gas licuado, desde la importación hasta la entrega al consumidor final. Desde 1997 incorporó operaciones de Shell Gas en RD.",
    weight: 90,
    source: SRC.martiNosotros,
    themes: ["gasolina"],
  },
  {
    id: "e-sunix",
    name: "Sunix",
    kind: "empresa",
    role: "Combustibles líquidos · gasolina y diésel",
    summary:
      "Sunix Petroleum (Grupo Martí, formalizada 2006): importación, distribución y estaciones de combustibles líquidos — gasolina, diésel y otros.",
    weight: 86,
    source: SRC.martiNosotros,
    themes: ["gasolina"],
  },
  {
    id: "p-carlos-marti",
    name: "Carlos José Martí",
    kind: "persona",
    role: "Presidente · Grupo Martí",
    summary:
      "Figura pública al frente del Grupo Martí, el conglomerado detrás de Tropigas y Sunix.",
    weight: 55,
    source: SRC.martiNosotros,
    themes: ["gasolina"],
  },

  // —— Crudo / import ——
  {
    id: "e-shell",
    name: "Shell",
    kind: "empresa",
    role: "Contrato de crudo (según Refidomsa)",
    summary:
      "Refidomsa (vía Diario Libre, abr 2026): el crudo que procesa (~30,000 bpd) proviene de St. James, EE.UU., con contrato Shell que asegura suministro. No es crudo venezolano.",
    weight: 70,
    source: SRC.diarioLibreCrudo,
    themes: ["gasolina"],
  },
  {
    id: "c-crudo-importado",
    name: "Crudo importado",
    kind: "empresa",
    role: "~30,000 barriles/día",
    summary:
      "La refinería estatal procesa crudo comprado en el mercado internacional. Dueño de la planta no implica soberanía energética: el feedstock viene de afuera.",
    weight: 72,
    source: SRC.diarioLibreCrudo,
    themes: ["gasolina"],
  },

  // —— Subsidio / pagador ——
  {
    id: "c-subsidio",
    name: "Subsidio a combustibles",
    kind: "financiador",
    role: "Estado absorbe el alza internacional",
    summary:
      "Semana 12–18 sep 2026 (MICM / Diario Libre): RD$1,631.5 millones. Por galón: gasolina regular RD$55.21; gasoil regular RD$108.93; gasoil óptimo RD$117.28; GLP RD$26.90. Acumulado 2026: más de RD$32,000 millones.",
    amount: 1_631_500_000,
    weight: 92,
    source: SRC.diarioLibreSubsidio,
    themes: ["gasolina"],
  },
  {
    id: "c-acumulado-2026",
    name: "Subsidios 2026 · +RD$32,000 MM",
    kind: "financiador",
    role: "Acumulado año (MICM / prensa)",
    summary:
      "Con la asignación de sep 2026, el MICM reporta que el monto destinado a subsidios de combustibles en 2026 supera los RD$32,000 millones.",
    amount: 32_000_000_000,
    weight: 88,
    source: SRC.diarioLibreSubsidio,
    themes: ["gasolina"],
  },
  {
    id: "c-contribuyente",
    name: "Contribuyente",
    kind: "persona",
    role: "Paga el estabilizador",
    summary:
      "El precio al surtidor se congela con impuestos. El riesgo del mercado internacional no desaparece: se traslada del importador/distribuidor al presupuesto público — o sea, a ti.",
    mechanism: "Apariencia de precio estable. Factura real: subsidio.",
    weight: 80,
    source: SRC.diarioLibreSubsidio,
    themes: ["gasolina"],
  },
  {
    id: "c-juego-cerrado",
    name: "Juego cerrado · 3 patas",
    kind: "estado",
    role: "Estado + Rizek + Martí",
    summary:
      "No es monopolio estatal puro ni mercado libre. El Estado da legalidad y refinería; Rizek facilita/conecta; Martí domina distribución; el contribuyente financia el subsidio que mantiene el precio.",
    mechanism: "Dos familias, a través de distintos nodos, tocan combustible, pensiones y caja del Estado.",
    weight: 98,
    source: SRC.haciendaRefidomsa,
    themes: ["gasolina"],
  },
];

/** @type {Array<object>} */
export const GASOLINA_EDGES = [
  {
    source: "i-micm",
    target: "c-subsidio",
    type: "destina",
    note: "Precios semanales + subsidio (sep 2026: RD$1,631.5 MM)",
    amount: 1_631_500_000,
    sourceRef: SRC.diarioLibreSubsidio,
  },
  {
    source: "i-micm",
    target: "e-refidomsa",
    type: "regula_sector",
    note: "Marco de hidrocarburos / precios",
    sourceRef: SRC.micm,
  },
  {
    source: "i-micm",
    target: "e-tropigas",
    type: "licencia",
    note: "Distribuidores mayoristas de GLP",
    sourceRef: SRC.micm,
  },
  {
    source: "i-micm",
    target: "e-sunix",
    type: "licencia",
    note: "Distribución de líquidos",
    sourceRef: SRC.micm,
  },

  {
    source: "e-refidomsa",
    target: "c-crudo-importado",
    type: "procesa",
    note: "~30,000 barriles/día",
    sourceRef: SRC.diarioLibreCrudo,
  },
  {
    source: "e-shell",
    target: "c-crudo-importado",
    type: "suministra",
    note: "Contrato de crudo (según Refidomsa)",
    sourceRef: SRC.diarioLibreCrudo,
  },
  {
    source: "c-crudo-importado",
    target: "e-shell",
    type: "origen_contrato",
    note: "St. James, EE.UU. · no Venezuela",
    sourceRef: SRC.diarioLibreCrudo,
  },

  // Roryk: dos venas
  {
    source: "e-grupo-rizek",
    target: "e-patsa",
    type: "controla",
    note: "PATSA LTD · facilitador",
    sourceRef: SRC.haciendaRefidomsa,
  },
  {
    source: "e-patsa",
    target: "e-refidomsa",
    type: "facilitó_recompra",
    note: "Ago 2021 · 49% PDV Caribe → Estado (€74 MM)",
    amount: 88_134_000,
    sourceRef: SRC.haciendaRefidomsa,
  },
  {
    source: "e-grupo-rizek",
    target: "e-afp-crecer",
    type: "controla",
    note: "Misma familia · vena de pensiones",
    sourceRef: SRC.afpCrecerNosotros,
  },
  {
    source: "e-grupo-rizek",
    target: "e-refidomsa",
    type: "conecta",
    note: "Vía PATSA · vena de combustible",
    sourceRef: SRC.diarioLibreRefidomsa,
  },

  // Martí
  {
    source: "e-grupo-marti",
    target: "e-tropigas",
    type: "controla",
    note: "GLP · importación → entrega final",
    sourceRef: SRC.martiNosotros,
  },
  {
    source: "e-grupo-marti",
    target: "e-sunix",
    type: "controla",
    note: "Gasolina, diésel y líquidos",
    sourceRef: SRC.martiNosotros,
  },
  {
    source: "e-grupo-marti",
    target: "p-carlos-marti",
    type: "liderado_por",
    sourceRef: SRC.martiNosotros,
  },

  // Subsidio flow
  {
    source: "c-subsidio",
    target: "c-acumulado-2026",
    type: "acumula",
    note: "+RD$32,000 MM en 2026",
    amount: 32_000_000_000,
    sourceRef: SRC.diarioLibreSubsidio,
  },
  {
    source: "c-contribuyente",
    target: "c-subsidio",
    type: "financia",
    note: "Impuestos → diferencia de precio",
    sourceRef: SRC.diarioLibreSubsidio,
  },
  {
    source: "c-subsidio",
    target: "e-tropigas",
    type: "estabiliza_precio",
    note: "Riesgo del importador → presupuesto",
    sourceRef: SRC.diarioLibreSubsidio,
  },
  {
    source: "c-subsidio",
    target: "e-sunix",
    type: "estabiliza_precio",
    note: "Precio estable al surtidor",
    sourceRef: SRC.diarioLibreSubsidio,
  },

  // Juego cerrado
  {
    source: "c-juego-cerrado",
    target: "e-refidomsa",
    type: "pata",
    note: "Estado · refinería / legalidad",
    sourceRef: SRC.haciendaRefidomsa,
  },
  {
    source: "c-juego-cerrado",
    target: "e-grupo-rizek",
    type: "pata",
    note: "Rizek · facilitador + pensiones",
    sourceRef: SRC.haciendaRefidomsa,
  },
  {
    source: "c-juego-cerrado",
    target: "e-grupo-marti",
    type: "pata",
    note: "Martí · distribución",
    sourceRef: SRC.martiNosotros,
  },
  {
    source: "c-juego-cerrado",
    target: "c-contribuyente",
    type: "paga",
    note: "El que financia el estabilizador",
    sourceRef: SRC.diarioLibreSubsidio,
  },
  {
    source: "i-micm",
    target: "c-juego-cerrado",
    type: "opera_sobre",
    note: "Fija precio · no abre el mercado",
    sourceRef: SRC.diarioLibreSubsidio,
  },
  {
    source: "c-juego-cerrado",
    target: "c-la-cupula",
    type: "atraviesa",
    note: "Rizek es una de las casas de La Cúpula",
    sourceRef: SRC.haciendaRefidomsa,
  },
];
