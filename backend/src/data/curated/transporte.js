/**
 * Tema curado — Transporte.
 * Quién mueve la ciudad: Estado (OMSA/Metro) vs federaciones que controlan rutas.
 */

import { CUPULA_NODE } from "./cupula.js";

const SRC = {
  acento: {
    label: "Acento — transporte público: lucha por un sector de RD$18,250 MM/año",
    url: "https://acento.com.do/economia/transporte-publico-la-lucha-por-el-control-de-un-sector-que-mueve-mas-de-rd18250-millones-al-ano-9071481.html",
  },
  diarioLibreOmsa: {
    label: "Diario Libre — OMSA al límite: presupuesto ~RD$2,200 MM (2025)",
    url: "https://www.diariolibre.com/actualidad/ciudad/2025/06/15/omsa-al-limite-transporte-masivo-con-el-presupuesto-deficiente/3149368",
  },
  diarioLibre2026: {
    label: "Diario Libre — OMSA en retroceso; Fenatrano opera Corredor Independencia",
    url: "https://www.diariolibre.com/actualidad/ciudad/2026/03/05/la-omsa-en-retroceso-ahora-es-un-sistema-de-respaldo/3458046",
  },
  omsa: {
    label: "OMSA — Operadora Metropolitana de Servicios de Autobuses",
    url: "https://omsa.gob.do/",
  },
  opret: {
    label: "OPRET — Oficina para el Reordenamiento del Transporte (Metro / Teleférico)",
    url: "https://www.opret.gob.do/",
  },
  intrant: {
    label: "INTRANT — Instituto Nacional de Tránsito y Transporte Terrestre",
    url: "https://intrant.gob.do/",
  },
  ley6317: {
    label: "Ley 63-17 — Movilidad, Transporte Terrestre, Tránsito y Seguridad Vial",
    url: "https://intrant.gob.do/transparencia/index.php/base-legal/leyes",
  },
};

export const TRANSPORTE_NODES = [
  CUPULA_NODE,
  {
    id: "c-mecanismo-transporte",
    name: "Quién mueve la ciudad",
    kind: "estado",
    role: "Rutas · federaciones · Estado",
    summary:
      "El transporte urbano no es solo “buses”. Es un mercado de miles de millones donde federaciones (Fenatrano, Conatra, Mochotran) concentran unidades con licencia INTRANT, la OMSA opera con presupuesto público insuficiente, y Metro/Teleférico (OPRET) corren en paralelo. Quien controla la ruta controla el peaje diario del pueblo.",
    mechanism: "Sin permiso de ruta no hay negocio; quien reparte permisos reparte poder.",
    weight: 100,
    source: SRC.acento,
    themes: ["transporte"],
  },
  {
    id: "i-intrant",
    name: "INTRANT",
    kind: "estado",
    role: "Licencias y ordenamiento",
    summary:
      "Instituto Nacional de Tránsito y Transporte Terrestre (Ley 63-17). Autoriza operación. Sin licencia INTRANT, la federación no cobra en legalidad.",
    weight: 90,
    source: SRC.intrant,
    themes: ["transporte"],
  },
  {
    id: "e-omsa",
    name: "OMSA",
    kind: "estado",
    role: "Buses estatales · presupuesto público",
    aliases: ["omsa", "oficina metropolitana de servicios de autobuses"],
    summary:
      "Operadora estatal de buses. Diario Libre (2025): presupuesto ~RD$2,200 millones para >70,000 usuarios/día y miles de empleados; en 2026 reportan ~RD$3,000 MM. Convertida en empresa pública (decreto) para abrir capital privado. Compite —y cede terreno— frente a corredores de federaciones.",
    mechanism: "El Estado paga la flota; las federaciones cobran la calle.",
    weight: 92,
    source: SRC.diarioLibreOmsa,
    themes: ["transporte"],
  },
  {
    id: "i-opret",
    name: "OPRET",
    kind: "estado",
    role: "Metro y Teleférico SD",
    summary:
      "Oficina para el Reordenamiento del Transporte: Metro de Santo Domingo y Teleférico. Inversión masiva en rieles mientras el bus sigue repartido entre Estado y gremios. Santiago sigue sin metro: el mapa de hierro es capital-céntrico.",
    weight: 88,
    source: SRC.opret,
    themes: ["transporte"],
  },
  {
    id: "o-fenatrano",
    name: "Fenatrano",
    kind: "sindicato",
    role: "Federación · ~49% unidades licenciadas",
    aliases: ["fenatrano", "federación nacional de transporte"],
    summary:
      "Federación Nacional de Transporte Nueva Opción. Acento: ~49% de las unidades con licencia de operación en INTRANT — la mayor cobertura. Opera corredores (p. ej. Independencia, 68 buses) reportados por Diario Libre (2026).",
    mechanism: "Quien concentra unidades concentra la renta del pasaje.",
    weight: 94,
    source: SRC.acento,
    themes: ["transporte"],
  },
  {
    id: "o-conatra",
    name: "Conatra",
    kind: "sindicato",
    role: "Confederación · ~11% unidades",
    aliases: ["conatra", "conatra transporte"],
    summary:
      "Central Nacional de Organizaciones del Transporte. Acento: ~11% de unidades licenciadas; junto a Mochotran controló corredores (Charles de Gaulle, Churchill, Núñez de Cáceres).",
    weight: 84,
    source: SRC.acento,
    themes: ["transporte"],
  },
  {
    id: "o-mochotran",
    name: "Mochotran",
    kind: "sindicato",
    role: "Consorcio · ~20% unidades",
    aliases: ["mochotran"],
    summary:
      "Consorcio de Empresas del Transporte (Mochotran). Acento: ~20% de cobertura de unidades licenciadas; socio de corredores urbanos junto a Conatra.",
    weight: 80,
    source: SRC.acento,
    themes: ["transporte"],
  },
  {
    id: "c-corredores",
    name: "Corredores privados",
    kind: "empresa",
    role: "Rutas reformadas · renta del pasaje",
    summary:
      "Modelo de corredores donde federaciones operan buses de alta capacidad en avenidas clave. Diario Libre documenta Corredor Independencia (Fenatrano) y la pérdida de centralidad de la OMSA. El pasajero paga; el permiso vale oro.",
    weight: 78,
    source: SRC.diarioLibre2026,
    themes: ["transporte"],
  },
  {
    id: "c-pasajero",
    name: "El pasajero",
    kind: "trabajador",
    role: "Quien paga el sistema dos veces",
    summary:
      "Paga pasaje a federaciones y, vía presupuesto, sostiene OMSA/Metro. No elige el mapa de rutas: lo hereda. El teleférico y el metro existen en Santo Domingo; Santiago espera. La geografía del transporte es geografía de poder.",
    weight: 70,
    source: SRC.acento,
    themes: ["transporte"],
  },
];

export const TRANSPORTE_EDGES = [
  { source: "c-mecanismo-transporte", target: "i-intrant", type: "regula_via", sourceRef: SRC.intrant },
  { source: "c-mecanismo-transporte", target: "e-omsa", type: "incluye", sourceRef: SRC.omsa },
  { source: "c-mecanismo-transporte", target: "i-opret", type: "incluye", sourceRef: SRC.opret },
  { source: "c-mecanismo-transporte", target: "o-fenatrano", type: "incluye", sourceRef: SRC.acento },
  { source: "i-intrant", target: "o-fenatrano", type: "licencia", note: "~49% unidades (Acento)", sourceRef: SRC.acento },
  { source: "i-intrant", target: "o-conatra", type: "licencia", note: "~11% unidades (Acento)", sourceRef: SRC.acento },
  { source: "i-intrant", target: "o-mochotran", type: "licencia", note: "~20% unidades (Acento)", sourceRef: SRC.acento },
  { source: "o-fenatrano", target: "c-corredores", type: "opera", note: "Corredor Independencia (prensa 2026)", sourceRef: SRC.diarioLibre2026 },
  { source: "o-conatra", target: "c-corredores", type: "opera", sourceRef: SRC.acento },
  { source: "o-mochotran", target: "c-corredores", type: "opera", sourceRef: SRC.acento },
  { source: "e-omsa", target: "c-pasajero", type: "transporta", sourceRef: SRC.diarioLibreOmsa },
  { source: "c-corredores", target: "c-pasajero", type: "cobra", sourceRef: SRC.diarioLibre2026 },
  { source: "i-opret", target: "c-pasajero", type: "transporta", note: "Metro / Teleférico SD", sourceRef: SRC.opret },
  { source: "c-mecanismo-transporte", target: "c-la-cupula", type: "atraviesa", note: "Rutas y permisos tocan el mismo centro de poder", sourceRef: SRC.acento },
];
