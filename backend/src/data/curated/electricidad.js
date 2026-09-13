/**
 * Modo curado — tema Electricidad.
 * Historia: generas / transmites / distribuyes — y el contribuyente tapa el hueco.
 * Estado dueño de las EDE + generación mixta/privada + zona turística aparte (CEPM).
 */

import { SRC_SHARED, pickNodes, SHARED_EDGES } from "./shared.js";

const SRC = { ...SRC_SHARED };

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
      "Diario Libre (informe MEM / ejecución): pérdidas totales de las EDE ~43.5% de la energía adquirida (ene–jun 2026). El déficit/subsidio se proyecta en el orden de RD$118,000 millones al cierre de ese año — plata pública que tapa lo que no se factura o no se cobra.",
    mechanism: "Misma lógica que gasolina: el ciudadano paga dos veces.",
    weight: 98,
    source: SRC.edePerdidas,
    themes: ["electricidad", "deuda"],
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
      "Apagones, tarifa y reclamo. Lo que no ves en el recibo es el subsidio: el Estado cubre el déficit de las EDE con presupuesto — o sea, con impuestos.",
    weight: 84,
    source: SRC.edePerdidas,
    themes: ["electricidad"],
  },
];

const SHARED_IDS = [
  "i-sie",
  "i-mem",
  "i-fonper",
  "i-hacienda",
  "e-grupo-rainieri",
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

export const ELECTRICIDAD_EDGES = [
  ...SHARED_EDGES.filter(
    (e) => SHARED_IDS.includes(e.source) || SHARED_IDS.includes(e.target),
  ),
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
];
