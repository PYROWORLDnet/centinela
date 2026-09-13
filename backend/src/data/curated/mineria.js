/**
 * Modo curado — tema Minería (Pueblo Viejo).
 * Solo hechos con fuente pública. Análisis de tasas (Aristy Escuder) se etiquetan como tales.
 * Denuncias comunitarias (Earthworks / Guardian) se etiquetan como reportes, no sentencias.
 *
 * Historia: contrato CEAM 2002 (RNF 3.2%) → Barrick 60% / Newmont 40% →
 * enmienda 2013 → precio récord del oro → Estado cobra menos de lo que el diseño
 * progresivo sugeriría → comunidades al lado de la mina siguen pobres.
 */

import { CUPULA_NODE } from "./cupula.js";
import { SRC_SHARED, pickNodes } from "./shared.js";

const SRC = {
  eitiCeam: {
    label: "EITI-RD / MEM — CEAM Pueblo Viejo: RNF 3.2% (Placer Dome, 25 mar 2002)",
    url: "https://eitird.mem.gob.do/informe-eiti-rd/contratos-mineros/reserva-fiscal-de-montenegro/contrato-ceam-barrick-pvdc/",
  },
  memResolucion: {
    label: "MEM — Resolución 125-02 / contrato de arrendamiento minero",
    url: "https://mem.gob.do/transparencia/wp-content/uploads/2018/10/Resoluci%C3%B3n-125-02-Contrato-Barrick-Estado-Dominicano-..pdf",
  },
  elDiaContrato: {
    label: "El Día — anatomía del contrato Barrick / RNF 3.2% y PUN",
    url: "https://eldia.com.do/el-nuevo-contrato-de-la-barrick-gold/",
  },
  barrickOps: {
    label: "Barrick — Pueblo Viejo (JV Barrick 60% / Newmont 40%)",
    url: "https://www.barrick.com/English/operations/pueblo-viejo/default.aspx",
  },
  diarioLibre2013: {
    label: "Diario Libre — gobierno Danilo y Barrick: enmienda 2013",
    url: "https://www.diariolibre.com/actualidad/gobierno-y-la-barrick-llegan-a-acuerdo-IDDL382785",
  },
  aristyTasas: {
    label: "Jaime Aristy Escuder — tasa efectiva 13.39% vs 38.55% a US$5,000/oz (análisis)",
    url: "https://cdn.com.do/nacionales/hay-que-aumentar-los-ingresos-publicos-jaime-aristy-escuder/",
  },
  barrick2025: {
    label: "Barrick Pueblo Viejo — RD$40,068.6 MM impuestos directos y regalías en 2025 (~US$649.5 MM)",
    url: "https://puebloviejolugardevalor.com/barrick-pueblo-viejo-pago-rd40068-6-millones-en-impuestos-directos-y-regalias-en-el-2025/",
  },
  barrick2020covid: {
    label: "Barrick — aportes >US$385 MM al Estado en 2020 (incluye adelantos COVID)",
    url: "https://www.barrick.com/English/news/news-details/2020/pueblo-viejo-tax-and-royal-payment-in-2020/default.aspx",
  },
  earthworks: {
    label: "Earthworks — comunidades aguas abajo de Pueblo Viejo (agua, polvo, 369 familias)",
    url: "https://earthworks.org/blog/surviving-next-to-one-of-the-worlds-largest-gold-mines/",
  },
  guardian: {
    label: "The Guardian — cientos de familias piden reubicación (may 2024)",
    url: "https://www.theguardian.com/global-development/article/2024/may/21/its-a-barbarity-why-are-hundreds-of-families-asking-to-be-moved-away-from-this-dominican-republic-goldmine",
  },
  presidenciaReasentamiento: {
    label: "Presidencia — acuerdo reasentamiento Barrick / comunitarios (jun 2025)",
    url: "https://www.presidencia.gob.do/noticias/gobierno-comunitarios-y-barrick-pueblo-viejo-llegan-acuerdo-para-reasentamiento-y",
  },
  mem: SRC_SHARED.mem,
  hacienda: SRC_SHARED.hacienda,
};

const SHARED = pickNodes(["i-mem", "i-hacienda"]).map((n) => ({
  ...n,
  themes: Array.from(new Set([...(n.themes || []), "mineria"])),
}));

/** @type {Array<object>} */
export const MINERIA_NODES = [
  CUPULA_NODE,
  ...SHARED,

  {
    id: "c-pueblo-viejo",
    name: "Pueblo Viejo",
    kind: "estado",
    role: "Mina de oro · Cotuí / Sánchez Ramírez",
    summary:
      "Una de las minas de oro más grandes del hemisferio. Reserva fiscal Montenegro. Operada por Pueblo Viejo Dominicana (JV). No es solo un yacimiento: es el contrato que define cuánto se queda el país y cuánto se va.",
    mechanism: "Quien fija el régimen fiscal de la mina fija la soberanía sobre el metal.",
    weight: 100,
    source: SRC.barrickOps,
    themes: ["mineria"],
  },
  {
    id: "c-ceam-2002",
    name: "CEAM 2002",
    kind: "estado",
    role: "Contrato · Placer Dome · RNF 3.2%",
    summary:
      "Contrato Especial de Arrendamiento de Derechos Mineros, 25 mar 2002 (gobierno Hipólito Mejía), aprobado por el Congreso (Res. 125-02). Régimen fiscal especial: Retorno Neto de Fundición (RNF) de 3.2% sobre precio de venta menos costos de producción (excluye cobre/zinc), más Participación de Utilidades Netas (PUN) variable e impuestos generales (EITI-RD / MEM).",
    mechanism: "Con RNF 3.2%, el Estado cobraba una regalía mínima; el grueso del valor se quedaba en la concesionaria.",
    weight: 96,
    source: SRC.eitiCeam,
    themes: ["mineria"],
  },
  {
    id: "e-placer-dome",
    name: "Placer Dome",
    kind: "empresa",
    role: "Concesionaria original (2002)",
    summary:
      "Minera canadiense. Firmó el CEAM en 2002 como Placer Dome Dominicana. Nunca reinició la explotación a gran escala antes de ser absorbida. El contrato original es el punto de partida del régimen fiscal que todavía debate el país.",
    mechanism: "Trajo el molde contractual. Barrick heredó el molde al comprar la empresa.",
    weight: 78,
    source: SRC.eitiCeam,
    themes: ["mineria"],
  },
  {
    id: "e-barrick",
    name: "Barrick Gold",
    kind: "empresa",
    role: "Operador · 60% del JV",
    summary:
      "Compró Placer Dome en 2006 y heredó Pueblo Viejo. Opera el JV (60%). Sitio Barrick: primera producción 2012; fuerza laboral ~98% dominicana. En 2025 reportó ~US$649.5 MM en impuestos directos y regalías al Estado (RD$40,068.6 MM).",
    mechanism: "Opera, exporta y negocia con el Estado. El operador define el ritmo; el contrato define el reparto.",
    weight: 98,
    amount: 649_500_000,
    source: SRC.barrickOps,
    themes: ["mineria"],
  },
  {
    id: "e-newmont",
    name: "Newmont",
    kind: "empresa",
    role: "Socio · 40% del JV",
    summary:
      "Dueña del 40% de Pueblo Viejo Dominicana. Ese 40% pasó por Goldcorp (tras la compra de Placer Dome) y luego a Newmont al absorber Goldcorp (2019). No opera el día a día; captura parte del cash flow.",
    mechanism: "Socio silencioso del metal: no habla en Cotuí, sí en el balance.",
    weight: 86,
    source: SRC.barrickOps,
    themes: ["mineria"],
  },
  {
    id: "e-pvdc",
    name: "Pueblo Viejo Dominicana",
    kind: "empresa",
    role: "JV local · vehículo del contrato",
    summary:
      "Vehículo del CEAM. Consorcio Barrick 60% / Newmont 40%. EITI-RD: a partir de oct 2021 también referida como Pueblo Viejo Dominicana Jersey 2 Limited. Es la cara jurídica frente al Estado.",
    mechanism: "El Estado no negocia con “el oro”: negocia con este vehículo.",
    weight: 90,
    source: SRC.eitiCeam,
    themes: ["mineria"],
  },
  {
    id: "c-enmienda-2013",
    name: "Enmienda 2013",
    kind: "estado",
    role: "Danilo Medina · “parche” fiscal",
    summary:
      "Segunda enmienda al CEAM (2013). El gobierno anunció que los ingresos 2013–2016 pasarían de ~US$377 MM a ~US$2,200 MM (a US$1,600/oz) y la participación sobre EBITDA de 37.1% a 51.3% (Diario Libre). Incluyó Impuesto Mínimo Anual (IMA) y cambios a depreciación/intereses. Mejoró el trato de 2009; no cerró el debate sobre windfall a precios récord.",
    mechanism: "Renegociación política bajo presión. Adelanta caja al Estado; deja mecanismos progresivos que hay que actualizar.",
    weight: 92,
    source: SRC.diarioLibre2013,
    themes: ["mineria"],
  },
  {
    id: "c-tasa-efectiva",
    name: "Tasa efectiva vs windfall",
    kind: "estado",
    role: "13.39% vs 38.55% (análisis Aristy)",
    summary:
      "Jaime Aristy Escuder sostiene que, con oro cerca de US$5,000/oz, el diseño del IMA/acuerdo 2013 implicaría una tasa efectiva ~38.55%, pero el Estado estaría cobrando ~13.39% si no se actualizan parámetros. Es análisis del economista — no un comunicado oficial de Hacienda. La disputa es: ¿el windfall del oro se reparte como se diseñó?",
    mechanism: "Si el precio dispara y la fórmula no se ajusta, el Estado se queda con la foto de 2013 y la empresa con el alza.",
    weight: 88,
    source: SRC.aristyTasas,
    themes: ["mineria"],
  },
  {
    id: "c-aportes-estado",
    name: "Aportes al fisco",
    kind: "financiador",
    role: "Caja real · 2020 y 2025",
    summary:
      "Barrick: en 2020 aportó >US$385 MM (incluye adelantos de regalías por COVID). En 2025: RD$40,068.6 MM (~US$649.5 MM) en impuestos directos y regalías; ~US$684.6 MM sumando indirectos. Cifras de la empresa. No niegan el debate de tasa efectiva: muestran lo pagado bajo el régimen vigente.",
    mechanism: "La mina es un gran contribuyente. La pregunta Centinela: ¿grande respecto a qué debería ser a precio récord?",
    weight: 84,
    amount: 649_500_000,
    source: SRC.barrick2025,
    themes: ["mineria", "deuda"],
  },
  {
    id: "c-comunidades-cotui",
    name: "Comunidades Cotuí",
    kind: "trabajador",
    role: "Aguas abajo · reubicación pendiente",
    summary:
      "Earthworks / Guardian: comunidades aguas abajo del embalse de colas reportan polvo negro diario, agua embotellada (≈15 galones, 2×/semana) desde ~2011, daños a cultivos y ganado, y demanda de reubicación. Censo gubernamental: 369–450 familias en zona de impacto; por años solo un grupo menor completó mudanza. Barrick y el MEM disputan causalidad (contaminación histórica vs operación actual). Jun 2025: Presidencia anunció acuerdo de reasentamiento (>RD$20,000 MM).",
    mechanism: "El metal sale. El riesgo socioambiental se queda en la provincia.",
    weight: 90,
    source: SRC.earthworks,
    themes: ["mineria"],
  },
  {
    id: "c-soberania-mineral",
    name: "Soberanía mineral",
    kind: "estado",
    role: "Contrato · renegociación · omisión",
    summary:
      "La soberanía no se pierde solo el día que se firma el CEAM. Se erosiona cada periodo en que el Estado no usa las herramientas de ajuste que el propio marco permite, mientras el precio del oro corre. 2002 abrió la puerta; 2013 la estrecharon; el presente decide si se actualiza o se deja correr el windfall.",
    mechanism: "Firma + omisión = transferencia silenciosa de renta.",
    weight: 94,
    source: SRC.aristyTasas,
    themes: ["mineria"],
  },
];

/** @type {Array<object>} */
export const MINERIA_EDGES = [
  {
    source: "i-mem",
    target: "c-pueblo-viejo",
    type: "regula",
    note: "Política minera · MEM",
    sourceRef: SRC.mem,
  },
  {
    source: "c-ceam-2002",
    target: "c-pueblo-viejo",
    type: "arrenda",
    note: "CEAM · reserva Montenegro",
    sourceRef: SRC.eitiCeam,
  },
  {
    source: "e-placer-dome",
    target: "c-ceam-2002",
    type: "firmo",
    note: "25 mar 2002",
    sourceRef: SRC.eitiCeam,
  },
  {
    source: "e-barrick",
    target: "e-placer-dome",
    type: "adquirio",
    note: "2006 · compra global Placer Dome",
    sourceRef: SRC.eitiCeam,
  },
  {
    source: "e-barrick",
    target: "e-pvdc",
    type: "controla",
    note: "60% · operador",
    sourceRef: SRC.barrickOps,
  },
  {
    source: "e-newmont",
    target: "e-pvdc",
    type: "participa",
    note: "40% · vía Goldcorp → Newmont",
    sourceRef: SRC.barrickOps,
  },
  {
    source: "e-pvdc",
    target: "c-pueblo-viejo",
    type: "opera",
    note: "Producción desde 2012",
    sourceRef: SRC.barrickOps,
  },
  {
    source: "c-ceam-2002",
    target: "c-enmienda-2013",
    type: "enmendado_por",
    note: "Segunda enmienda · Danilo 2013",
    sourceRef: SRC.diarioLibre2013,
  },
  {
    source: "c-enmienda-2013",
    target: "c-tasa-efectiva",
    type: "disena",
    note: "IMA / mecanismos progresivos",
    sourceRef: SRC.aristyTasas,
  },
  {
    source: "c-tasa-efectiva",
    target: "c-soberania-mineral",
    type: "tensa",
    note: "Windfall sin ajuste = renta que se va",
    sourceRef: SRC.aristyTasas,
  },
  {
    source: "e-pvdc",
    target: "c-aportes-estado",
    type: "paga",
    note: "~US$649.5 MM directos 2025 (Barrick)",
    amount: 649_500_000,
    sourceRef: SRC.barrick2025,
  },
  {
    source: "c-aportes-estado",
    target: "i-hacienda",
    type: "ingresa_a",
    note: "ISR · PUN · regalías → fisco",
    sourceRef: SRC.barrick2025,
  },
  {
    source: "c-pueblo-viejo",
    target: "c-comunidades-cotui",
    type: "impacta",
    note: "Aguas abajo · polvo · agua · reubicación",
    sourceRef: SRC.earthworks,
  },
  {
    source: "c-comunidades-cotui",
    target: "c-soberania-mineral",
    type: "evidencia",
    note: "Provincia pobre junto a mina rica",
    sourceRef: SRC.earthworks,
  },
  {
    source: "c-soberania-mineral",
    target: "c-pueblo-viejo",
    type: "define",
    note: "El contrato es la soberanía en la práctica",
    sourceRef: SRC.eitiCeam,
  },
  {
    source: "c-ceam-2002",
    target: "c-soberania-mineral",
    type: "abre",
    note: "RNF 3.2% · punto de partida",
    sourceRef: SRC.eitiCeam,
  },
  {
    source: "i-hacienda",
    target: "c-aportes-estado",
    type: "recauda",
    note: "DGII / régimen minero",
    sourceRef: SRC.barrick2025,
  },
];
