/**
 * Modo curado — tema Electricidad.
 * Historia: generas / transmites / distribuyes — y el contribuyente tapa el hueco.
 * Estado dueño de las EDE + generación mixta/privada + zona turística aparte (CEPM).
 */

import { SRC_SHARED, pickNodes, SHARED_EDGES } from "./shared.js";

const SRC = {
  ...SRC_SHARED,
  edeCierre2025: {
    label: "EH+ — EDE 2025: pérdidas 37.2% · subsidio RD$105,849.1 MM",
    url: "https://ehplus.do/ede-cerraron-2025-con-perdidas-de-37-2-y-subsidio-de-rd105849-millones/",
  },
  ppaCaros: {
    label: "El Dinero — SIBA y KarPowerShip: energía de contrato más cara (feb 2026)",
    url: "https://eldinero.com.do/355521/energia-de-contrato-en-la-actual-gestion-es-la-de-mayor-costo/",
  },
  karPower: {
    label: "Diario Libre — contratos KarPowerShip (barcazas Azua) vencen oct 2026",
    url: "https://www.diariolibre.com/economia/energia/2026/07/29/contratos-de-dos-barcazas-electricas-de-azua-estan-proximos-a-vencer/3613253",
  },
  memBoletin: {
    label: "MEM — Boletín generación ene 2026 (precios monómicos EDE)",
    url: "https://mem.gob.do/wp-content/uploads/2026/03/01.-Boletin-Informativo-Generacion-y-Gestion-Energia-Enero-2026.pdf",
  },
};

const LOCAL_NODES = [
  {
    id: "c-sistema-electrico",
    name: "El sistema eléctrico",
    kind: "estado",
    role: "Generación · transmisión · distribución · factura",
    summary:
      "No es “la luz del gobierno” contra “la luz privada”. Es una cadena: se genera, se transmite, se reparte — y cuando las EDE pierden energía y plata, el presupuesto público tapa el hueco.",
    mechanism: "Tú pagas la factura. Y con impuestos pagas el subsidio que cubre lo que las EDE no cobran.",
    weight: 100,
    source: SRC.sie,
    themes: ["electricidad"],
  },
  {
    id: "e-edesur",
    name: "Edesur",
    kind: "empresa",
    role: "Distribución · Sur",
    summary: "Empresa Distribuidora de Electricidad del Sur. Continuadora jurídica estatal (Ley 365-22 / marco institucional).",
    weight: 86,
    source: SRC.fonperEde,
    themes: ["electricidad"],
  },
  {
    id: "e-edenorte",
    name: "Edenorte",
    kind: "empresa",
    role: "Distribución · Norte",
    summary: "Empresa Distribuidora de Electricidad del Norte. Parte del trío estatal de distribución.",
    weight: 86,
    source: SRC.fonperEde,
    themes: ["electricidad"],
  },
  {
    id: "e-edeeste",
    name: "Edeeste",
    kind: "empresa",
    role: "Distribución · Este",
    summary: "Empresa Distribuidora de Electricidad del Este. Acciones traspasadas a FONPER junto a las otras EDE.",
    weight: 86,
    source: SRC.fonperEde,
    themes: ["electricidad"],
  },
  {
    id: "c-subsidio-electrico",
    name: "Subsidio eléctrico",
    kind: "fondo",
    role: "El hueco que tapa el presupuesto",
    summary:
      "2025: el Estado destinó RD$105,849.1 MM al subsidio de las EDE con pérdidas acumuladas 37.2% (EH+ / Digepres). Ene–jun 2026: pérdidas totales ~43.5% de la energía adquirida (MEM vía Diario Libre); el ritmo de transferencias apunta a ~RD$118,000 MM o más al cierre. Plata pública que tapa lo no facturado o no cobrado.",
    mechanism: "Misma lógica que gasolina: el ciudadano paga dos veces.",
    weight: 98,
    amount: 105_849_100_000,
    source: SRC.edeCierre2025,
    themes: ["electricidad", "deuda"],
  },
  {
    id: "c-pagas-dos-veces",
    name: "Pagas dos veces",
    kind: "trabajador",
    role: "Factura + impuestos",
    summary:
      "En el recibo pagas lo que la EDE te factura. En el presupuesto —vía impuestos— pagas el subsidio que cubre el déficit de esas mismas EDE. Si las pérdidas bajan, baja la doble carga. Si no, el apagón y el hueco fiscal conviven.",
    mechanism: "La punta visible es la factura. El mecanismo es el subsidio.",
    weight: 95,
    source: SRC.edeCierre2025,
    themes: ["electricidad"],
  },
  {
    id: "c-apagones",
    name: "Apagones",
    kind: "trabajador",
    role: "El síntoma que sientes",
    summary:
      "Pese a subsidios récord, el sistema sigue con déficit de generación y contingencias. MEM y prensa registran salidas generales (p. ej. nov 2025) donde entran plantas de respaldo caras. El apagón no niega el gasto: muestra que gastar mucho no equivale a servicio estable.",
    mechanism: "Más plata pública ≠ luz confiable si la red pierde y el respaldo cuesta oro.",
    weight: 88,
    source: SRC.edeCierre2025,
    themes: ["electricidad"],
  },
  {
    id: "c-contratos-caros",
    name: "Contratos caros",
    kind: "financiador",
    role: "PPA de respaldo · precio disparado",
    summary:
      "El Dinero (con boletines MEM): sin SIBA Energy ni KarPowerShip, el promedio de generación contratada rondó ~12.44 ¢US$/kWh en 2025; al incluirlas, ~27.50. SIBA ~67.66 ¢US$/kWh; KarPowerShip ~168.06 — hasta ~12× el promedio del resto. Operan como respaldo, pero cuando despachan, el costo pega al déficit de las EDE.",
    mechanism: "Respaldo necesario ≠ precio irrelevante. El kWh caro alimenta el hueco que tapa el subsidio.",
    weight: 93,
    source: SRC.ppaCaros,
    themes: ["electricidad"],
  },
  {
    id: "e-siba",
    name: "SIBA Energy",
    kind: "empresa",
    role: "Generación contratada · precio alto",
    summary:
      "Generadora bajo contrato con las EDE. El Dinero / MEM 2025: vendió en promedio ~67.66 ¢US$/kWh — varias veces el promedio del resto del parque contratado. Planificada como respaldo ante contingencias.",
    mechanism: "Poco volumen, mucho precio unitario cuando entra.",
    weight: 80,
    source: SRC.ppaCaros,
    themes: ["electricidad"],
  },
  {
    id: "e-karpowership",
    name: "KarPowerShip",
    kind: "empresa",
    role: "Barcazas Azua · PPA de respaldo",
    summary:
      "Barcazas en Los Negros, Azua (~408 MW con tres unidades). Contrato inicial 2023 vence oct 2026; tercera unidad bajo otro contrato. El Dinero / MEM 2025: ~168.06 ¢US$/kWh promedio — el tramo más caro del mapa de contratos. Diario Libre: la empresa dice estar abierta a renovar.",
    mechanism: "Capacidad flotante de respaldo con tarifa de contingencia.",
    weight: 84,
    source: SRC.karPower,
    themes: ["electricidad"],
  },
  {
    id: "e-punta-catalina",
    name: "Punta Catalina",
    kind: "estado",
    role: "Generación termoeléctrica estatal",
    summary:
      "Central termoeléctrica de propiedad estatal. Ley 365-22 / Decreto 142-23: se crea la Empresa de Generación Eléctrica Punta Catalina (EGEPC) para titularidad y administración.",
    weight: 90,
    source: SRC.puntaCatalina,
    themes: ["electricidad"],
  },
  {
    id: "e-eted",
    name: "ETED",
    kind: "estado",
    role: "Transmisión · 100% Estado",
    summary:
      "Empresa de Transmisión Eléctrica Dominicana: conduce la energía de los generadores a las subestaciones. Propiedad estatal (El Caribe / El Dinero).",
    weight: 78,
    source: SRC.elCaribeElectrico,
    themes: ["electricidad"],
  },
  {
    id: "e-egehid",
    name: "EGEHID",
    kind: "estado",
    role: "Generación hidroeléctrica estatal",
    summary:
      "Empresa de Generación Hidroeléctrica Dominicana: centrales hidro, 100% estatal (El Caribe).",
    weight: 74,
    source: SRC.elCaribeElectrico,
    themes: ["electricidad"],
  },
  {
    id: "e-ege-haina",
    name: "EGE Haina",
    kind: "empresa",
    role: "Generación mixta",
    summary:
      "Empresa de generación con capital mixto: el Estado mantiene participación mayoritaria reportada (~61% según El Dinero) bajo administración con componente privado.",
    weight: 82,
    source: SRC.elDineroEstado,
    themes: ["electricidad"],
  },
  {
    id: "e-ege-itabo",
    name: "EGE Itabo",
    kind: "empresa",
    role: "Generación · AES + Estado",
    summary:
      "Filial/operación con AES como socio privado (~50%) y el Estado (~50% vía FONPER, cifras de prensa). Administración bajo control privado reportado.",
    weight: 82,
    source: SRC.elCaribeElectrico,
    themes: ["electricidad"],
  },
  {
    id: "e-aes",
    name: "AES",
    kind: "empresa",
    role: "Socio privado · Itabo",
    summary: "Corporación AES: participación privada en EGE Itabo (El Caribe / El Dinero).",
    weight: 70,
    source: SRC.elCaribeElectrico,
    themes: ["electricidad"],
  },
  {
    id: "e-cepm",
    name: "CEPM",
    kind: "empresa",
    role: "Luz del Este turístico",
    summary:
      "Consorcio Energético Punta Cana–Macao: genera, transmite, distribuye y comercializa en el Este turístico (Punta Cana, Bávaro, Macao, etc.). Parte de InterEnergy (sitio CEPM).",
    mechanism: "Otra lógica: concesión privada en la zona hotelera — no es la misma factura que Edesur/Edenorte/Edeeste.",
    weight: 88,
    source: SRC.cepm,
    themes: ["electricidad"],
  },
  {
    id: "e-interenergy",
    name: "InterEnergy",
    kind: "empresa",
    role: "Grupo dueño de CEPM",
    summary: "Grupo energético regional; CEPM forma parte de InterEnergy (sitio CEPM).",
    weight: 76,
    source: SRC.cepm,
    themes: ["electricidad"],
  },
  {
    id: "c-factura-luz",
    name: "Tu factura de luz",
    kind: "trabajador",
    role: "El extremo ciudadano",
    summary:
      "Apagones, tarifa y reclamo. Lo que no ves en el recibo es el subsidio: el Estado cubre el déficit de las EDE con presupuesto — o sea, con impuestos. Por eso el mapa une factura, pérdidas y contratos caros.",
    weight: 84,
    source: SRC.edePerdidas,
    themes: ["electricidad"],
  },
];

const SHARED_IDS = [
  "c-la-cupula",
  "i-sie",
  "i-mem",
  "i-fonper",
  "i-hacienda",
  "e-grupo-rainieri",
  "e-grupo-linda",
  "p-felix-garcia",
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

export const ELECTRICIDAD_NODES = dedupe([...LOCAL_NODES, ...pickNodes(SHARED_IDS)]);

const THEME_IDS = new Set(ELECTRICIDAD_NODES.map((n) => n.id));

export const ELECTRICIDAD_EDGES = [
  ...SHARED_EDGES.filter((e) => THEME_IDS.has(e.source) && THEME_IDS.has(e.target)),
  {
    source: "i-sie",
    target: "c-sistema-electrico",
    type: "regula",
    sourceRef: SRC.sie,
  },
  {
    source: "i-mem",
    target: "c-sistema-electrico",
    type: "politica",
    sourceRef: SRC.mem,
  },
  {
    source: "c-sistema-electrico",
    target: "e-edesur",
    type: "distribuye_via",
    sourceRef: SRC.fonperEde,
  },
  {
    source: "c-sistema-electrico",
    target: "e-edenorte",
    type: "distribuye_via",
    sourceRef: SRC.fonperEde,
  },
  {
    source: "c-sistema-electrico",
    target: "e-edeeste",
    type: "distribuye_via",
    sourceRef: SRC.fonperEde,
  },
  {
    source: "i-fonper",
    target: "e-edesur",
    type: "posee",
    note: "Acciones EDE",
    sourceRef: SRC.fonperEde,
  },
  {
    source: "i-fonper",
    target: "e-edenorte",
    type: "posee",
    sourceRef: SRC.fonperEde,
  },
  {
    source: "i-fonper",
    target: "e-edeeste",
    type: "posee",
    sourceRef: SRC.fonperEde,
  },
  {
    source: "e-edesur",
    target: "c-subsidio-electrico",
    type: "genera_deficit",
    sourceRef: SRC.edePerdidas,
  },
  {
    source: "e-edenorte",
    target: "c-subsidio-electrico",
    type: "genera_deficit",
    sourceRef: SRC.edePerdidas,
  },
  {
    source: "e-edeeste",
    target: "c-subsidio-electrico",
    type: "genera_deficit",
    sourceRef: SRC.edePerdidas,
  },
  {
    source: "c-subsidio-electrico",
    target: "i-hacienda",
    type: "carga_presupuesto",
    note: "Transferencias / subsidio",
    sourceRef: SRC.edePerdidas,
  },
  {
    source: "c-subsidio-electrico",
    target: "c-factura-luz",
    type: "doble_carga",
    note: "Factura + impuestos",
    sourceRef: SRC.edePerdidas,
  },
  {
    source: "e-punta-catalina",
    target: "c-sistema-electrico",
    type: "genera",
    sourceRef: SRC.puntaCatalina,
  },
  {
    source: "e-egehid",
    target: "c-sistema-electrico",
    type: "genera",
    sourceRef: SRC.elCaribeElectrico,
  },
  {
    source: "e-ege-haina",
    target: "c-sistema-electrico",
    type: "genera",
    sourceRef: SRC.elDineroEstado,
  },
  {
    source: "e-ege-itabo",
    target: "c-sistema-electrico",
    type: "genera",
    sourceRef: SRC.elCaribeElectrico,
  },
  {
    source: "e-aes",
    target: "e-ege-itabo",
    type: "participa",
    note: "~50% privado",
    sourceRef: SRC.elCaribeElectrico,
  },
  {
    source: "i-fonper",
    target: "e-ege-itabo",
    type: "participa",
    note: "Participación estatal",
    sourceRef: SRC.elCaribeElectrico,
  },
  {
    source: "e-eted",
    target: "c-sistema-electrico",
    type: "transmite",
    sourceRef: SRC.elCaribeElectrico,
  },
  {
    source: "e-interenergy",
    target: "e-cepm",
    type: "controla",
    sourceRef: SRC.cepm,
  },
  {
    source: "e-cepm",
    target: "c-sistema-electrico",
    type: "otro_circuito",
    note: "Concesión Este turístico",
    sourceRef: SRC.cepm,
  },
  {
    source: "e-cepm",
    target: "e-grupo-rainieri",
    type: "alimenta_destino",
    note: "Energía del Este turístico (Punta Cana / Bávaro). CEPM ≠ propiedad Rainieri; InterEnergy es el dueño reportado.",
    sourceRef: SRC.cepm,
  },
  {
    source: "e-edesur",
    target: "c-factura-luz",
    type: "factura_a",
    sourceRef: SRC.sie,
  },
  {
    source: "e-edenorte",
    target: "c-factura-luz",
    type: "factura_a",
    sourceRef: SRC.sie,
  },
  {
    source: "e-edeeste",
    target: "c-factura-luz",
    type: "factura_a",
    sourceRef: SRC.sie,
  },
  {
    source: "c-subsidio-electrico",
    target: "c-pagas-dos-veces",
    type: "explica",
    note: "Factura + impuestos",
    sourceRef: SRC.edeCierre2025,
  },
  {
    source: "c-factura-luz",
    target: "c-pagas-dos-veces",
    type: "pata",
    sourceRef: SRC.edeCierre2025,
  },
  {
    source: "c-apagones",
    target: "c-factura-luz",
    type: "rompe",
    note: "Servicio inestable pese al gasto",
    sourceRef: SRC.edeCierre2025,
  },
  {
    source: "c-contratos-caros",
    target: "c-subsidio-electrico",
    type: "encarece",
    note: "kWh de respaldo caro → mayor déficit",
    sourceRef: SRC.ppaCaros,
  },
  {
    source: "e-siba",
    target: "c-contratos-caros",
    type: "ejemplo",
    note: "~67.66 ¢US$/kWh (2025)",
    sourceRef: SRC.ppaCaros,
  },
  {
    source: "e-karpowership",
    target: "c-contratos-caros",
    type: "ejemplo",
    note: "~168.06 ¢US$/kWh (2025)",
    sourceRef: SRC.ppaCaros,
  },
  {
    source: "e-siba",
    target: "c-sistema-electrico",
    type: "genera_respaldo",
    sourceRef: SRC.ppaCaros,
  },
  {
    source: "e-karpowership",
    target: "c-sistema-electrico",
    type: "genera_respaldo",
    sourceRef: SRC.karPower,
  },
  {
    source: "c-contratos-caros",
    target: "c-apagones",
    type: "responde_a",
    note: "Respaldo entra cuando hay contingencia",
    sourceRef: SRC.ppaCaros,
  },
  {
    source: "c-sistema-electrico",
    target: "c-la-cupula",
    type: "atraviesa",
    sourceRef: SRC.sie,
  },
];
