/**
 * Modo curado — tema Construcción / cemento.
 * Historia: materia prima → obra. Pocas casas controlan cemento, concreto, acero y contratos.
 */

import { SRC_SHARED, pickNodes, SHARED_EDGES } from "./shared.js";
import { SRC_CUPULA } from "./cupula.js";

const SRC = { ...SRC_SHARED, ...SRC_CUPULA };

const LOCAL_NODES = [
  {
    id: "c-cadena-construccion",
    name: "Cadena de la construcción",
    kind: "empresa",
    role: "Cemento · concreto · acero · obra",
    summary:
      "Sin cemento no hay edificio ni carretera. ADOCEM agrupa a los productores. El poder no está solo en “quién construye”: está en quién fabrica la materia prima y quién integra toda la cadena.",
    mechanism: "Verticalizar cemento + concreto + acero + ingeniería = control del costo de construir el país.",
    weight: 100,
    source: SRC.adocem,
    themes: ["construccion"],
  },
  {
    id: "e-adocem",
    name: "ADOCEM",
    kind: "empresa",
    role: "Gremio del cemento",
    summary:
      "Asociación Dominicana de Productores de Cemento Portland: Argos, Cemex, Cementos Cibao, Domicem, Cemento Panam y Cemento Santo Domingo. Producción de 4.2 Mt (2012) a 6.5 Mt (2023).",
    weight: 78,
    source: SRC.adocem,
    themes: ["construccion"],
  },
  {
    id: "e-cemento-panam",
    name: "Cemento PANAM",
    kind: "empresa",
    role: "Cemento · Grupo Estrella",
    summary:
      "Marca de cemento del Grupo Estrella / Consorcio Minero Dominicano. Planta moderna; tipologías CPM 27.5 y CPM 35 (sitio Estrella).",
    weight: 88,
    source: SRC.cementoPanam,
    themes: ["construccion", "familias"],
  },
  {
    id: "e-concreto-panam",
    name: "Concreto PANAM",
    kind: "empresa",
    role: "Hormigón · Grupo Estrella",
    summary:
      "Hormigón premezclado del ecosistema Estrella; sinergia con Cemento PANAM y agregados (sitio corporativo).",
    weight: 80,
    source: SRC.estrella,
    themes: ["construccion", "familias"],
  },
  {
    id: "e-acero-estrella",
    name: "Acero ESTRELLA",
    kind: "empresa",
    role: "Estructuras metálicas",
    summary: "Brazo de construcción metálica del Grupo Estrella (sitio corporativo).",
    weight: 76,
    source: SRC.estrella,
    themes: ["construccion", "familias"],
  },
  {
    id: "e-ingenieria-estrella",
    name: "Ingeniería ESTRELLA",
    kind: "empresa",
    role: "Obras · infraestructura",
    summary: "Contratista de obras civiles y viales del Grupo Estrella — el extremo de la cadena que ejecuta.",
    weight: 84,
    source: SRC.estrella,
    themes: ["construccion", "familias"],
  },
  {
    id: "e-cemex-rd",
    name: "CEMEX Dominicana",
    kind: "empresa",
    role: "Cemento · multinacional",
    summary:
      "Planta principal en San Pedro de Macorís; capacidad reportada ~2.5 Mt cemento/clinker tras reapertura de línea (CEMEX).",
    weight: 82,
    source: SRC.cemexRd,
    themes: ["construccion"],
  },
  {
    id: "e-domicem",
    name: "Domicem",
    kind: "empresa",
    role: "Cemento · gran capacidad",
    summary:
      "Productora afiliada a ADOCEM. Prensa sectorial: expansión de horno en Sabana Grande de Palenque / San Cristóbal; una de las mayores capacidades del mercado.",
    weight: 82,
    source: SRC.adocem,
    themes: ["construccion"],
  },
  {
    id: "e-cementos-cibao",
    name: "Cementos Cibao",
    kind: "empresa",
    role: "Cemento · productor local",
    summary: "Productora local afiliada a ADOCEM; capacidad citada ~1.3 Mt en reportes de prensa sectorial.",
    weight: 74,
    source: SRC.cementoNacional,
    themes: ["construccion"],
  },
  {
    id: "e-argos-rd",
    name: "Argos Dominicana",
    kind: "empresa",
    role: "Cemento · Argos",
    summary: "Miembro ADOCEM (antes asociada a Colón en reportes de prensa). Capital extranjero en la mesa del cemento.",
    weight: 72,
    source: SRC.adocem,
    themes: ["construccion"],
  },
  {
    id: "e-cemento-sd",
    name: "Cemento Santo Domingo",
    kind: "empresa",
    role: "Cemento · productor",
    summary: "Miembro ADOCEM; productor de menor escala relativa en el mapa gremial.",
    weight: 64,
    source: SRC.adocem,
    themes: ["construccion"],
  },
  {
    id: "c-materia-prima",
    name: "Materia prima de la obra",
    kind: "empresa",
    role: "Cemento + agregados + acero",
    summary:
      "El edificio no nace en la grúa: nace en la planta. Quien controla cemento, hormigón, agregados y acero fija el piso del costo de construir — viviendas, hoteles, carreteras.",
    weight: 92,
    source: SRC.estrella,
    themes: ["construccion"],
  },
  {
    id: "i-mivhed",
    name: "MIVHED",
    kind: "estado",
    role: "Licencias de construcción · Ventanilla Única",
    aliases: ["mivhed", "mived", "ministerio de vivienda"],
    summary:
      "Ministerio de la Vivienda, Hábitat y Edificaciones (Ley 160-21). Emite la Licencia de Construcción y concentra trámites vía Ventanilla Única (Decreto 806-21). Sin esa licencia, la obra es irregular — sujeta a paralización. El boom inmobiliario pasa por este sello.",
    mechanism: "Quien firma la licencia decide qué se levanta en legalidad.",
    weight: 94,
    source: {
      label: "MIVHED — Licencia de Construcción y permisos asociados",
      url: "https://mivhed.gob.do/permisos-y-licencias-de-construccion/licencia-de-construccion-y-permisos-asociados/",
    },
    themes: ["construccion"],
  },
  {
    id: "c-uso-suelo",
    name: "Uso de suelo",
    kind: "estado",
    role: "Certificación municipal · primer candado",
    summary:
      "La Certificación de Uso de Suelo y Retiro de Edificaciones la emite el ayuntamiento. Es requisito previo a la licencia MIVHED (Ley 176-07 / Ley 368-22). Cambiar el uso de un solar —de residencial a torre— es poder urbano antes de poner un ladrillo.",
    mechanism: "Sin uso de suelo favorable, no hay licencia que valga.",
    weight: 88,
    source: {
      label: "MIVHED — requisitos: certificación de uso de suelo municipal",
      url: "https://mivhed.gob.do/permisos-y-licencias-de-construccion/licencia-de-construccion-y-permisos-asociados/",
    },
    themes: ["construccion"],
  },
  {
    id: "c-ley-160-21",
    name: "Ley 160-21",
    kind: "estado",
    role: "Crea el MIVHED · concentra permisos",
    summary:
      "Crea el Ministerio de la Vivienda, Hábitat y Edificaciones y concentra funciones de tramitación de planos y licencias que antes estaban dispersas (incl. MOPC). El Decreto 806-21 crea la Ventanilla Única de Permisos de Construcción.",
    weight: 76,
    source: {
      label: "MIVHED Transparencia — Ley 160-21 y Decreto 806-21",
      url: "https://transparencia.mived.gob.do/",
    },
    themes: ["construccion"],
  },
  {
    id: "c-permiso-obra",
    name: "El permiso",
    kind: "estado",
    role: "Llave del boom inmobiliario",
    summary:
      "Licencia + uso de suelo + no objeciones (ayuntamiento, ambiente, bomberos, eléctricas…). El Inmobiliario resume el cuello de botella: sin licencia MIVHED, la torre —por bien financiada que esté— es irregular. El permiso no es trámite burocrático inocente: es el peaje entre capital y cielo.",
    mechanism: "La materia prima construye; el permiso legaliza.",
    weight: 90,
    source: {
      label: "El Inmobiliario — paso a paso licencia de construcción / MIVHED",
      url: "https://inmobiliario.do/paso-a-paso-como-obtener-una-licencia-de-construccion-para-tu-proyecto-inmobiliario/",
    },
    themes: ["construccion"],
  },
];

const SHARED_IDS = [
  "c-la-cupula",
  "e-grupo-estrella",
  "e-grupo-rainieri",
  "e-grupo-bonetti",
  "e-grupo-linda",
  "e-grupo-corripio",
  "p-felix-garcia",
  "m-cdn",
  "i-dga",
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

export const CONSTRUCCION_NODES = dedupe([...LOCAL_NODES, ...pickNodes(SHARED_IDS)]);

export const CONSTRUCCION_EDGES = [
  ...SHARED_EDGES.filter(
    (e) => SHARED_IDS.includes(e.source) || SHARED_IDS.includes(e.target),
  ),
  {
    source: "c-cadena-construccion",
    target: "c-materia-prima",
    type: "depende_de",
    sourceRef: SRC.adocem,
  },
  {
    source: "c-cadena-construccion",
    target: "e-adocem",
    type: "organiza",
    sourceRef: SRC.adocem,
  },
  {
    source: "e-adocem",
    target: "e-cemex-rd",
    type: "incluye",
    sourceRef: SRC.adocem,
  },
  {
    source: "e-adocem",
    target: "e-domicem",
    type: "incluye",
    sourceRef: SRC.adocem,
  },
  {
    source: "e-adocem",
    target: "e-cementos-cibao",
    type: "incluye",
    sourceRef: SRC.adocem,
  },
  {
    source: "e-adocem",
    target: "e-argos-rd",
    type: "incluye",
    sourceRef: SRC.adocem,
  },
  {
    source: "e-adocem",
    target: "e-cemento-panam",
    type: "incluye",
    sourceRef: SRC.adocem,
  },
  {
    source: "e-adocem",
    target: "e-cemento-sd",
    type: "incluye",
    sourceRef: SRC.adocem,
  },
  {
    source: "e-grupo-estrella",
    target: "e-cemento-panam",
    type: "controla",
    sourceRef: SRC.cementoPanam,
  },
  {
    source: "e-grupo-estrella",
    target: "e-concreto-panam",
    type: "controla",
    sourceRef: SRC.estrella,
  },
  {
    source: "e-grupo-estrella",
    target: "e-acero-estrella",
    type: "controla",
    sourceRef: SRC.estrella,
  },
  {
    source: "e-grupo-estrella",
    target: "e-ingenieria-estrella",
    type: "controla",
    sourceRef: SRC.estrella,
  },
  {
    source: "e-cemento-panam",
    target: "c-materia-prima",
    type: "abastece",
    sourceRef: SRC.cementoPanam,
  },
  {
    source: "e-concreto-panam",
    target: "c-materia-prima",
    type: "abastece",
    sourceRef: SRC.estrella,
  },
  {
    source: "e-acero-estrella",
    target: "c-materia-prima",
    type: "abastece",
    sourceRef: SRC.estrella,
  },
  {
    source: "c-materia-prima",
    target: "e-ingenieria-estrella",
    type: "alimenta_obra",
    sourceRef: SRC.estrella,
  },
  {
    source: "e-grupo-estrella",
    target: "c-cadena-construccion",
    type: "integra",
    note: "Vertical: material + obra",
    sourceRef: SRC.estrella,
  },
  {
    source: "e-cemex-rd",
    target: "c-materia-prima",
    type: "abastece",
    sourceRef: SRC.cemexRd,
  },
  {
    source: "e-domicem",
    target: "c-materia-prima",
    type: "abastece",
    sourceRef: SRC.adocem,
  },
  {
    source: "e-grupo-rainieri",
    target: "c-cadena-construccion",
    type: "demanda",
    note: "Turismo / destino exige obra e infraestructura",
    sourceRef: SRC.puntacana,
  },
  {
    source: "e-grupo-bonetti",
    target: "c-cadena-construccion",
    type: "demanda",
    note: "Industria / planta también construye",
    sourceRef: SRC.sid,
  },
  {
    source: "c-cadena-construccion",
    target: "c-la-cupula",
    type: "atraviesa",
    sourceRef: SRC.estrella,
  },
  {
    source: "e-grupo-linda",
    target: "c-cadena-construccion",
    type: "toca",
    note: "El Dinero: García y Corripio coinciden en ferretería y cemento",
    sourceRef: SRC.elDineroEmporios,
  },
  {
    source: "c-cadena-construccion",
    target: "c-permiso-obra",
    type: "requiere",
    note: "Sin permiso no hay obra legal",
    sourceRef: {
      label: "El Inmobiliario — licencia MIVHED",
      url: "https://inmobiliario.do/paso-a-paso-como-obtener-una-licencia-de-construccion-para-tu-proyecto-inmobiliario/",
    },
  },
  {
    source: "i-mivhed",
    target: "c-permiso-obra",
    type: "emite",
    sourceRef: {
      label: "MIVHED — Licencia de Construcción",
      url: "https://mivhed.gob.do/permisos-y-licencias-de-construccion/licencia-de-construccion-y-permisos-asociados/",
    },
  },
  {
    source: "c-uso-suelo",
    target: "c-permiso-obra",
    type: "condiciona",
    note: "Certificación municipal previa",
    sourceRef: {
      label: "MIVHED — uso de suelo como requisito",
      url: "https://mivhed.gob.do/permisos-y-licencias-de-construccion/licencia-de-construccion-y-permisos-asociados/",
    },
  },
  {
    source: "c-ley-160-21",
    target: "i-mivhed",
    type: "crea",
    sourceRef: {
      label: "Ley 160-21 / transparencia MIVHED",
      url: "https://transparencia.mived.gob.do/",
    },
  },
  {
    source: "e-grupo-estrella",
    target: "c-permiso-obra",
    type: "necesita",
    note: "Integrar material + obra aún pasa por el sello estatal",
    sourceRef: SRC.estrella,
  },
];
