/**
 * Tema curado — Azúcar / Batey.
 * No es solo commodity: es tierra arrendada, casas y mano de obra cautiva.
 * Solo hechos con fuente. Sin fuente = sin nodo.
 */

import { CUPULA_NODE } from "./cupula.js";
import { SRC_SHARED, pickNodes } from "./shared.js";

const SRC = {
  ...SRC_SHARED,
  cac: {
    label: "CAC — Nuestro Consorcio (arrendamiento Ingenio Barahona / CEA 1999)",
    url: "https://cac.com.do/nuestro-consorcio/",
  },
  cea: {
    label: "Consejo Estatal del Azúcar (CEA)",
    url: "https://cea.gob.do/",
  },
  centralRomana: {
    label: "Central Romana Corporation",
    url: "https://www.centralromana.com.do/",
  },
  cronkiteBatey: {
    label: "Cronkite News — condiciones en bateyes de Central Romana (2023)",
    url: "https://cronkitenews.azpbs.org/2023/08/10/haitian-workers-endure-harsh-living-working-conditions-in-company-settlement/",
  },
  motherJones: {
    label: "Mother Jones — costo humano del azúcar / Central Romana · Fanjul",
    url: "https://www.motherjones.com/politics/2021/09/sugar-central-romana-fanjul-dominican-republic/",
  },
  bhrc: {
    label: "Business & Human Rights Resource Centre — denuncias trabajadores Haití / Central Romana",
    url: "https://www.business-humanrights.org/en/latest-news/dominican-republic-haitian-workers-on-central-romana-sugar-plantations-report-harsh-working-living-conditions/",
  },
  ley14197: {
    label: "Ley 141-97 — Reforma de la Empresa Pública (capitalización / arrendamientos)",
    url: "https://www.dgcp.gob.do/wp-content/uploads/2016/09/Ley-No.-141-97.pdf",
  },
  elNuevoDiarioCac: {
    label: "El Nuevo Diario — arrendamiento CEA–CAC Ingenio Barahona (1999; prórrogas reportadas)",
    url: "https://elnuevodiario.com.do/de-que-lado-esta-dios-extienden-hasta-2070-arriendo-del-ingenio-barahona/",
  },
};

const LOCAL = [
  {
    id: "c-mecanismo-azucar",
    name: "Azúcar · tierra · batey",
    kind: "estado",
    role: "El sistema detrás del azúcar",
    summary:
      "El azúcar dominicano no es solo zafra. Es un circuito de 150 años: tierra, ingenio, batey y mano de obra —hoy mayoritariamente haitiana o de ascendencia haitiana— que sostiene la exportación. Las casas (Fanjul/Central Romana, Vicini/CAEI) y el Estado (CEA) siguen en el mapa.",
    mechanism: "Quien controla la caña controla el precio del trabajo en el campo.",
    weight: 100,
    source: SRC.motherJones,
    themes: ["azucar", "familias"],
  },
  {
    id: "i-cea",
    name: "CEA",
    kind: "estado",
    role: "Consejo Estatal del Azúcar · dueño residual",
    summary:
      "Tras Trujillo, el CEA administró ingenios estatales. Con la Ley 141-97 se capitalizaron/arrendaron activos. El Ingenio Barahona sigue siendo arrendado al CAC desde 1999 (sitio CAC / prensa).",
    mechanism: "El Estado no desapareció del azúcar: cambió de operador.",
    weight: 88,
    source: SRC.cea,
    themes: ["azucar"],
  },
  {
    id: "e-cac",
    name: "Consorcio Azucarero Central (CAC)",
    kind: "empresa",
    role: "Arrendatario · Ingenio Barahona",
    aliases: ["cac", "consorcio azucarero central", "ingenio barahona"],
    summary:
      "Opera el Ingenio Barahona bajo arrendamiento del CEA desde 1999 (Ley 141-97). El propio CAC describe capital dominico-franco-canadiense al inicio y luego transferencia a inversionistas dominico-guatemaltecos.",
    weight: 82,
    source: SRC.cac,
    themes: ["azucar", "familias"],
  },
  {
    id: "c-batey",
    name: "El batey",
    kind: "trabajador",
    role: "Asentamiento de cañeros · dependencia de la compañía",
    aliases: ["batey", "bateyes", "cañeros"],
    summary:
      "Asentamientos en tierras de ingenio donde viven cañeros —en gran parte migrantes haitianos o dominicanos de ascendencia haitiana sin documentación plena—. Reportajes (Cronkite News, Mother Jones, BHRRC) documentan jornadas extremas, vivienda precaria y dependencia de la empresa para techo y trabajo.",
    mechanism: "Sin papeles y sin otro techo, el cañero no puede negociar en igualdad.",
    weight: 94,
    source: SRC.cronkiteBatey,
    themes: ["azucar", "migracion"],
  },
  {
    id: "c-mano-obra-cana",
    name: "Mano de obra cañera",
    kind: "trabajador",
    role: "Fuerza de trabajo del azúcar",
    summary:
      "Sin cañeros no hay zafra. La industria exportadora depende de trabajo barato y vulnerable. Las denuncias internacionales sobre Central Romana pusieron el batey en la agenda global; el mecanismo local no empezó en 2020: es estructural.",
    weight: 86,
    source: SRC.bhrc,
    themes: ["azucar"],
  },
  {
    id: "c-ley-capitalizacion",
    name: "Ley 141-97",
    kind: "estado",
    role: "Capitalización / arrendamiento de empresas públicas",
    summary:
      "Marco legal de la reforma de empresas públicas que habilitó arrendamientos y capitalizaciones. Bajo ese régimen el CEA arrendó ingenios —incluido Barahona al CAC en 1999—.",
    weight: 70,
    source: SRC.ley14197,
    themes: ["azucar"],
  },
];

const SHARED_IDS = [
  "e-grupo-vicini",
  "e-caei",
  "e-grupo-fanjul",
  "e-central-romana",
  "c-la-cupula",
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

export const AZUCAR_NODES = dedupe([...LOCAL, ...pickNodes(SHARED_IDS), CUPULA_NODE]);

export const AZUCAR_EDGES = [
  { source: "c-mecanismo-azucar", target: "c-batey", type: "revela", note: "El azúcar se sostiene en el batey", sourceRef: SRC.cronkiteBatey },
  { source: "c-mecanismo-azucar", target: "e-central-romana", type: "incluye", note: "Mayor productor privado", sourceRef: SRC.centralRomana },
  { source: "c-mecanismo-azucar", target: "e-caei", type: "incluye", note: "Ingenio Cristóbal Colón · Vicini/INICIA", sourceRef: SRC.caei },
  { source: "c-mecanismo-azucar", target: "e-cac", type: "incluye", note: "Ingenio Barahona arrendado", sourceRef: SRC.cac },
  { source: "i-cea", target: "e-cac", type: "arrendo", note: "Ingenio Barahona · 1999 (Ley 141-97)", sourceRef: SRC.cac },
  { source: "c-ley-capitalizacion", target: "i-cea", type: "habilita", note: "Marco de capitalización/arrendamiento", sourceRef: SRC.ley14197 },
  { source: "e-grupo-fanjul", target: "e-central-romana", type: "controla", sourceRef: SRC.motherJones },
  { source: "e-grupo-vicini", target: "e-caei", type: "controla", sourceRef: SRC.caei },
  { source: "e-central-romana", target: "c-batey", type: "opera_en", note: "Bateyes documentados en reportajes", sourceRef: SRC.cronkiteBatey },
  { source: "e-central-romana", target: "c-mano-obra-cana", type: "emplea", sourceRef: SRC.bhrc },
  { source: "c-batey", target: "c-mano-obra-cana", type: "concentra", sourceRef: SRC.cronkiteBatey },
  { source: "c-mecanismo-azucar", target: "c-la-cupula", type: "atraviesa", sourceRef: SRC.motherJones },
  { source: "e-grupo-fanjul", target: "c-la-cupula", type: "pertenece", sourceRef: SRC.motherJones },
  { source: "e-grupo-vicini", target: "c-la-cupula", type: "pertenece", sourceRef: SRC.caei },
  { source: "i-cea", target: "c-mecanismo-azucar", type: "es_pieza", sourceRef: SRC.cea },
];
