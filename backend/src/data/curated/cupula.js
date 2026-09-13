/**
 * La Cúpula — nodo transversal (no es un tema).
 * Agrupa las casas que cruzan pensiones, banca, medios, combustible, etc.
 * Aparece al buscar cualquiera de esos nombres.
 */

export const SRC_CUPULA = {
  rizekFallece: {
    label: "Diario Libre — muere Héctor José Rizek Llabaly (28 mar 2026)",
    url: "https://www.diariolibre.com/actualidad/sucesos/2026/03/28/muere-el-empresario-hector-rizek-llabaly/3484859",
  },
  jmMiembros: {
    label: "Diario Libre — miembros designados de la Junta Monetaria (jul 2026)",
    url: "https://www.diariolibre.com/politica/gobierno/2026/07/26/abinader-debera-revisar-funcionarios-clave-para-economia/3611373",
  },
  jmLey: {
    label: "Ley 183-02 — Monetaria y Financiera (art. 10–11)",
    url: "https://www.sb.gob.do/regulacion/compendio-de-leyes-y-reglamentos/ley-no-183-02-monetaria-y-financiera/",
  },
  sbCedeno: {
    label: "Presidencia — Enmanuel Cedeño Brea, superintendente de Bancos (sep 2026)",
    url: "https://www.presidencia.gob.do/noticias/ministro-magin-diaz-juramenta-enmanuel-cedeno-brea-como-nuevo-superintendente-de-bancos",
  },
  fanjulListin: {
    label: "Listín Diario — Alfonso Fanjul / Central Romana (ago 2026)",
    url: "https://listindiario.com/la-republica/20260803/fallece-cleveland-empresario-alfy-fanjul-copropietario-central-romana_916633.html",
  },
  ccn: {
    label: "Centro Cuesta Nacional — About us",
    url: "https://centrocuestanacional.com/about-us/",
  },
  jumbo: {
    label: "Jumbo — Sobre nosotros (CCN)",
    url: "https://jumbo.com.do/sobre-nosotros",
  },
  ccnMercado: {
    label: "Revista Mercado — José Miguel González Cuadra / CCN",
    url: "https://revistamercado.do/empresas/jose-miguel-gonzalez-cuadra-el-empresario-que-hizo-de-jumbo-algo-mas-que-una-palabra/",
  },
  rica: {
    label: "Grupo Rica — equipo directivo (familia Brache)",
    url: "https://www.gruporica.com/en/management-team/",
  },
  brachePopular: {
    label: "AS/COA — Pedro Brache, consejo de Grupo Popular",
    url: "https://www.as-coa.org/speakers/pedro-brache",
  },
  ramos: {
    label: "Grupo Ramos — Nosotros (La Sirena)",
    url: "https://www.gruporamos.com/nosotros",
  },
  elDineroEmporios: {
    label: "El Dinero — emporios de Pepín Corripio y Félix García",
    url: "https://eldinero.com.do/9322/los-emporios-de-pepin-corripio-y-de-felix-garcia/",
  },
  lindaAes: {
    label: "El Caribe — Grupo Linda aumenta participación en AES",
    url: "https://www.elcaribe.com.do/panorama/dinero/grupo-linda-sube-participacion-accionaria-aes/",
  },
  elCaribeSolidarios: {
    label: "El Caribe — casas empresariales (Estrella, Linda, Corripio, Puntacana, SID, Vicini, Rica, CCN, Ramos)",
    url: "https://www.elcaribe.com.do/panorama/pais/reconocen-a-manuel-estrella-y-felix-m-garcia-entre-empresarios-solidarios-2020/",
  },
};

/** Nombres que deben devolver La Cúpula en el buscador. */
export const CUPULA_ALIASES = [
  "cúpula",
  "cupula",
  "la cúpula",
  "la cupula",
  "vicini",
  "inicia",
  "corripio",
  "rainieri",
  "puntacana",
  "fanjul",
  "central romana",
  "rizek",
  "gonzález cuadra",
  "gonzalez cuadra",
  "ccn",
  "jumbo",
  "brache",
  "rica",
  "estrella",
  "félix garcía",
  "felix garcia",
  "félix maría garcía",
  "grupo linda",
  "popular",
  "banco popular",
  "bhd",
  "banreservas",
  "la sirena",
  "sirena",
  "ramos",
  "el nacional",
];

export const CUPULA_ID = "c-la-cupula";

export const CUPULA_NODE = {
  id: CUPULA_ID,
  name: "La Cúpula",
  kind: "familia",
  role: "Nodo transversal · casas que cruzan el mapa",
  aliases: CUPULA_ALIASES,
  summary:
    "No es un tema: es el agrupamiento de las casas que aparecen en Pensiones, Banca, Medios, Gasolina, Deuda, Familias y el resto. Vicini, Corripio, Rainieri, Fanjul, Rizek, González Cuadra, Brache, Estrella, Félix García, Banco Popular, BHD, Banreservas, La Sirena, El Nacional. Si buscas cualquiera de esos nombres, este nodo tiene que salir.",
  mechanism:
    "El poder económico dominicano no se lee por empresa suelta. Se lee por casas que tocan varios sectores a la vez.",
  weight: 100,
  source: SRC_CUPULA.elCaribeSolidarios,
  themes: [
    "todo",
    "familias",
    "banca",
    "medios",
    "pensiones",
    "gasolina",
    "deuda",
    "electricidad",
    "aduana",
    "construccion",
    "partidos",
  ],
};

export const CUPULA_FAMILY_NODES = [
  {
    id: "e-grupo-fanjul",
    name: "Familia Fanjul / Central Romana",
    kind: "familia",
    role: "Azúcar · Este · Casa de Campo",
    aliases: ["fanjul", "central romana", "alfy fanjul"],
    summary:
      "Los hermanos Fanjul (Fanjul Corp.) son copropietarios de Central Romana Corporation: azúcar, tierras y turismo alrededor de La Romana (Casa de Campo, aeropuerto La Romana). Imperio azucarero reconstruido tras salir de Cuba (Listín Diario, ago 2026).",
    mechanism: "Azúcar + enclave turístico en el Este: otra casa con territorio propio.",
    weight: 93,
    source: SRC_CUPULA.fanjulListin,
    themes: ["familias", "aduana", "electricidad"],
  },
  {
    id: "e-grupo-ccn",
    name: "González Cuadra / CCN",
    kind: "familia",
    role: "Retail · Jumbo · Nacional",
    aliases: ["gonzález cuadra", "gonzalez cuadra", "ccn", "centro cuesta nacional"],
    summary:
      "Centro Cuesta Nacional (CCN), familia González Cuadra: nació en 1935 como Colmado Mercedes / Nacional. Hoy opera Jumbo, Supermercados Nacional y otros formatos de retail (sitio CCN / Jumbo).",
    mechanism: "Quien pone el anaquel pone el precio de lo que comes.",
    weight: 91,
    source: SRC_CUPULA.ccn,
    themes: ["familias", "aduana"],
  },
  {
    id: "e-grupo-brache",
    name: "Familia Brache / Grupo Rica",
    kind: "familia",
    role: "Lácteos · agroindustria · consejo Popular",
    aliases: ["brache", "rica", "grupo rica", "pedro brache"],
    summary:
      "Grupo Rica (familia Brache Álvarez): lácteos y cítricos. Pedro Brache es presidente ejecutivo de Rica y figura en el consejo de Grupo Popular (AS/COA / sitio Rica).",
    mechanism: "Alimentos en la mesa y asiento en el banco más grande.",
    weight: 90,
    source: SRC_CUPULA.rica,
    themes: ["familias", "banca", "pensiones", "aduana"],
  },
  {
    id: "e-grupo-linda",
    name: "Félix García / Grupo Linda",
    kind: "familia",
    role: "Agroindustria · medios · energía",
    aliases: ["félix garcía", "felix garcia", "grupo linda", "linda"],
    summary:
      "Grupo Linda (Félix M. García, Santiago): Envases Antillanos, Transagrícola, Troquedom, Tapas Antillanas, La Fabril, Pinturas Tucán. Accionista de El Caribe y CDN; participación minoritaria en AES Dominicana (El Dinero / El Caribe).",
    mechanism: "Industria del Cibao + micrófono + ficha en generación eléctrica.",
    weight: 91,
    source: SRC_CUPULA.elDineroEmporios,
    themes: ["familias", "medios", "electricidad", "construccion"],
  },
  {
    id: "e-grupo-ramos",
    name: "Grupo Ramos / La Sirena",
    kind: "familia",
    role: "Retail · Sirena · Aprezio",
    aliases: ["ramos", "la sirena", "sirena", "grupo ramos"],
    summary:
      "Román Ramos Uría adquirió La Sirena en 1965. Grupo Ramos opera Sirena, Sirena Market y Aprezio (sitio corporativo). Retail de masas: otra puerta al consumo diario, distinta de CCN y de Corripio.",
    mechanism: "La compra del mes también tiene casa.",
    weight: 88,
    source: SRC_CUPULA.ramos,
    themes: ["familias", "aduana"],
  },
];

export const CUPULA_COMPANY_NODES = [
  {
    id: "e-central-romana",
    name: "Central Romana",
    kind: "empresa",
    role: "Azúcar · Fanjul",
    aliases: ["central romana", "romana"],
    summary:
      "Central Romana Corporation: ingenio y tierras en el Este. Copropiedad de la familia Fanjul (Listín Diario).",
    weight: 84,
    source: SRC_CUPULA.fanjulListin,
    themes: ["familias", "aduana"],
  },
  {
    id: "e-jumbo",
    name: "Jumbo",
    kind: "empresa",
    role: "Hipermercado · CCN",
    aliases: ["jumbo", "merca jumbo"],
    summary: "Hipermercado de Centro Cuesta Nacional. Primera sucursal en 2002 (sitio Jumbo).",
    weight: 78,
    source: SRC_CUPULA.jumbo,
    themes: ["familias", "aduana"],
  },
  {
    id: "e-nacional-super",
    name: "Supermercados Nacional",
    kind: "empresa",
    role: "Supermercado · CCN",
    aliases: ["nacional", "supermercados nacional"],
    summary:
      "Cadena de supermercados de CCN. No confundir con el periódico El Nacional (Corripio).",
    weight: 76,
    source: SRC_CUPULA.ccn,
    themes: ["familias", "aduana"],
  },
  {
    id: "e-la-sirena",
    name: "La Sirena",
    kind: "empresa",
    role: "Tienda por departamentos · Grupo Ramos",
    aliases: ["la sirena", "sirena"],
    summary:
      "Marca insignia de Grupo Ramos desde 1965. Formato de hipermercado / departamentos (sitio Grupo Ramos).",
    weight: 80,
    source: SRC_CUPULA.ramos,
    themes: ["familias", "aduana"],
  },
  {
    id: "e-rica",
    name: "Grupo Rica",
    kind: "empresa",
    role: "Lácteos · familia Brache",
    aliases: ["rica", "pasteurizadora rica"],
    summary: "Pasteurizadora Rica y empresas hermanas del grupo Brache (sitio corporativo).",
    weight: 78,
    source: SRC_CUPULA.rica,
    themes: ["familias", "aduana"],
  },
];

export const CUPULA_MEDIA_NODES = [
  {
    id: "m-el-caribe",
    name: "El Caribe",
    kind: "medio",
    role: "Diario · Félix García",
    aliases: ["el caribe"],
    summary:
      "Diario nacional. El Dinero lo identifica como propiedad de Félix García, en el mismo emporio que CDN.",
    weight: 72,
    source: SRC_CUPULA.elDineroEmporios,
    themes: ["medios", "familias"],
  },
  {
    id: "m-cdn",
    name: "CDN",
    kind: "medio",
    role: "Canal 37 · García + Estrella",
    aliases: ["cdn", "cdn 37"],
    summary:
      "Canal de noticias y deportes. El Dinero: Félix García es accionista junto a Manuel Estrella (CDN 37 / CDN Spot / CDN La Radio).",
    weight: 74,
    source: SRC_CUPULA.elDineroEmporios,
    themes: ["medios", "familias", "construccion"],
  },
];

export const CUPULA_PERSON_NODES = [
  {
    id: "p-felix-garcia",
    name: "Félix M. García",
    kind: "persona",
    role: "Presidente · Grupo Linda",
    aliases: ["félix garcía", "felix garcia", "félix maría garcía"],
    summary:
      "Empresario de Santiago. Preside Grupo Linda; El Dinero lo sitúa como dueño de El Caribe y accionista de CDN, y como competidor/socio de Corripio en ferretería y cemento.",
    weight: 68,
    source: SRC_CUPULA.elDineroEmporios,
    themes: ["familias", "medios", "electricidad"],
  },
];

export const CUPULA_MEMBER_IDS = [
  CUPULA_ID,
  "e-grupo-vicini",
  "e-grupo-corripio",
  "e-grupo-rainieri",
  "e-grupo-fanjul",
  "e-grupo-rizek",
  "e-grupo-ccn",
  "e-grupo-brache",
  "e-grupo-estrella",
  "e-grupo-linda",
  "e-grupo-popular",
  "e-grupo-bhd",
  "e-banreservas",
  "e-grupo-ramos",
  "e-la-sirena",
  "m-el-nacional",
  "e-banco-popular",
  "e-banco-bhd",
];

export const CUPULA_EDGES = [
  {
    source: CUPULA_ID,
    target: "e-grupo-vicini",
    type: "agrupa",
    note: "Capital histórico / INICIA",
    sourceRef: SRC_CUPULA.elCaribeSolidarios,
  },
  {
    source: CUPULA_ID,
    target: "e-grupo-corripio",
    type: "agrupa",
    note: "Medios + distribución",
    sourceRef: SRC_CUPULA.elCaribeSolidarios,
  },
  {
    source: CUPULA_ID,
    target: "e-grupo-rainieri",
    type: "agrupa",
    note: "Puntacana / turismo",
    sourceRef: SRC_CUPULA.elCaribeSolidarios,
  },
  {
    source: CUPULA_ID,
    target: "e-grupo-fanjul",
    type: "agrupa",
    note: "Central Romana / azúcar",
    sourceRef: SRC_CUPULA.fanjulListin,
  },
  {
    source: CUPULA_ID,
    target: "e-grupo-rizek",
    type: "agrupa",
    note: "Cacao · AFP Crecer · Junta histórica",
    sourceRef: SRC_CUPULA.rizekFallece,
  },
  {
    source: CUPULA_ID,
    target: "e-grupo-ccn",
    type: "agrupa",
    note: "Jumbo / Nacional",
    sourceRef: SRC_CUPULA.elCaribeSolidarios,
  },
  {
    source: CUPULA_ID,
    target: "e-grupo-brache",
    type: "agrupa",
    note: "Rica + consejo Popular",
    sourceRef: SRC_CUPULA.elCaribeSolidarios,
  },
  {
    source: CUPULA_ID,
    target: "e-grupo-estrella",
    type: "agrupa",
    note: "Cemento / obra",
    sourceRef: SRC_CUPULA.elCaribeSolidarios,
  },
  {
    source: CUPULA_ID,
    target: "e-grupo-linda",
    type: "agrupa",
    note: "Félix García",
    sourceRef: SRC_CUPULA.elCaribeSolidarios,
  },
  {
    source: CUPULA_ID,
    target: "e-grupo-popular",
    type: "agrupa",
    note: "Banco Popular + AFP Popular",
    sourceRef: {
      label: "Grupo Popular",
      url: "https://www.popularenlinea.com/",
    },
  },
  {
    source: CUPULA_ID,
    target: "e-grupo-bhd",
    type: "agrupa",
    note: "BHD + AFP Siembra",
    sourceRef: {
      label: "Centro Financiero BHD",
      url: "https://www.afpsiembra.com/conocenos/nuestro-accionista/",
    },
  },
  {
    source: CUPULA_ID,
    target: "e-banreservas",
    type: "agrupa",
    note: "Banco estatal del mismo tablero",
    sourceRef: {
      label: "Banreservas",
      url: "https://www.banreservas.com/",
    },
  },
  {
    source: CUPULA_ID,
    target: "e-grupo-ramos",
    type: "agrupa",
    note: "La Sirena",
    sourceRef: SRC_CUPULA.elCaribeSolidarios,
  },
  {
    source: CUPULA_ID,
    target: "m-el-nacional",
    type: "agrupa",
    note: "Periódico · Corripio",
    sourceRef: {
      label: "Grupo Corripio — medios",
      url: "https://es.wikipedia.org/wiki/Grupo_Corripio",
    },
  },
  {
    source: CUPULA_ID,
    target: "e-banco-popular",
    type: "incluye",
    sourceRef: {
      label: "Grupo Popular",
      url: "https://www.popularenlinea.com/",
    },
  },
  {
    source: CUPULA_ID,
    target: "e-banco-bhd",
    type: "incluye",
    sourceRef: {
      label: "Centro Financiero BHD",
      url: "https://www.afpsiembra.com/conocenos/nuestro-accionista/",
    },
  },
  {
    source: CUPULA_ID,
    target: "e-la-sirena",
    type: "incluye",
    sourceRef: SRC_CUPULA.ramos,
  },
  {
    source: "e-grupo-fanjul",
    target: "e-central-romana",
    type: "controla",
    note: "Copropiedad reportada",
    sourceRef: SRC_CUPULA.fanjulListin,
  },
  {
    source: "e-grupo-ccn",
    target: "e-jumbo",
    type: "controla",
    sourceRef: SRC_CUPULA.jumbo,
  },
  {
    source: "e-grupo-ccn",
    target: "e-nacional-super",
    type: "controla",
    sourceRef: SRC_CUPULA.ccn,
  },
  {
    source: "e-grupo-ramos",
    target: "e-la-sirena",
    type: "controla",
    sourceRef: SRC_CUPULA.ramos,
  },
  {
    source: "e-grupo-brache",
    target: "e-rica",
    type: "controla",
    sourceRef: SRC_CUPULA.rica,
  },
  {
    source: "e-grupo-brache",
    target: "e-grupo-popular",
    type: "sienta_en",
    note: "Pedro Brache · consejo de Grupo Popular",
    sourceRef: SRC_CUPULA.brachePopular,
  },
  {
    source: "e-grupo-linda",
    target: "p-felix-garcia",
    type: "liderado_por",
    sourceRef: SRC_CUPULA.elDineroEmporios,
  },
  {
    source: "e-grupo-linda",
    target: "m-el-caribe",
    type: "controla",
    sourceRef: SRC_CUPULA.elDineroEmporios,
  },
  {
    source: "p-felix-garcia",
    target: "m-cdn",
    type: "accionista",
    note: "Junto a Manuel Estrella",
    sourceRef: SRC_CUPULA.elDineroEmporios,
  },
  {
    source: "e-grupo-estrella",
    target: "m-cdn",
    type: "accionista",
    note: "Manuel Estrella · socio de García",
    sourceRef: SRC_CUPULA.elDineroEmporios,
  },
  {
    source: "e-grupo-linda",
    target: "e-aes",
    type: "participa",
    note: "Participación minoritaria en AES Dominicana (2014–)",
    sourceRef: SRC_CUPULA.lindaAes,
  },
];

export function cupulaNodes() {
  return [
    CUPULA_NODE,
    ...CUPULA_FAMILY_NODES,
    ...CUPULA_COMPANY_NODES,
    ...CUPULA_MEDIA_NODES,
    ...CUPULA_PERSON_NODES,
  ];
}

export function queryHitsCupula(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return false;
  return CUPULA_ALIASES.some((alias) => alias.includes(q) || q.includes(alias));
}
