/**
 * Nodos canónicos compartidos entre temas.
 * Mismos IDs en todo Centinela curado → una sola red.
 * Solo hechos con fuente. Sin fuente clara = sin cifra / sin edge.
 */

import { CUPULA_EDGES, cupulaNodes } from "./cupula.js";

export const SRC_SHARED = {
  inicia: {
    label: "Listín Diario — Vicini ahora se llamará INICIA (2016)",
    url: "https://listindiario.com/economia/2016/02/19/408391/vicini-ahora-se-llamara-inicia.html",
  },
  listin2010: {
    label: "El Nacional — accionistas Listín Diario 2010 (Vicini, Rizek, Bermúdez, Corripio)",
    url: "https://elnacional.com.do/nacionales/empresarios-compran-listin-diario_66870.html",
  },
  corripioWiki: {
    label: "Grupo Corripio — medios (Hoy, Telesistema, Teleantillas, Listín, El Día…)",
    url: "https://es.wikipedia.org/wiki/Grupo_Corripio",
  },
  corripioListin: {
    label: "Listín Diario — Corripio centraliza Teleantillas y Telesistema",
    url: "https://listindiario.com/la-republica/2019/04/23/562440/el-grupo-corripio-centralizara-canales-en-estacion-telesistema.html",
  },
  rizekBloomberg: {
    label: "Bloomberg Línea — Héctor José Rizek Llabaly (Junta Monetaria desde 1985)",
    url: "https://www.bloomberglinea.com/especiales/personajes-bloomberg-linea/hector-jose-rizek-llabaly/",
  },
  rizekFallece: {
    label: "Diario Libre — muere Héctor José Rizek Llabaly (28 mar 2026)",
    url: "https://www.diariolibre.com/actualidad/sucesos/2026/03/28/muere-el-empresario-hector-rizek-llabaly/3484859",
  },
  jmMiembros: {
    label: "Diario Libre — composición de la Junta Monetaria (jul 2026)",
    url: "https://www.diariolibre.com/politica/gobierno/2026/07/26/abinader-debera-revisar-funcionarios-clave-para-economia/3611373",
  },
  jmLey: {
    label: "Ley 183-02 — Monetaria y Financiera (art. 10–11, incompatibilidades)",
    url: "https://www.sb.gob.do/regulacion/compendio-de-leyes-y-reglamentos/ley-no-183-02-monetaria-y-financiera/",
  },
  sbCedeno: {
    label: "Presidencia — Enmanuel Cedeño Brea, superintendente de Bancos (sep 2026)",
    url: "https://www.presidencia.gob.do/noticias/ministro-magin-diaz-juramenta-enmanuel-cedeno-brea-como-nuevo-superintendente-de-bancos",
  },
  rizekCacao: {
    label: "Listín Diario — Héctor Rizek Llabaly / Rizek Cacao",
    url: "https://listindiario.com/la-republica/20260328/hector-rizek-llabaly-senor-cacao-deja-legado-trabajo-aportes-pais_899634.html",
  },
  afpCrecer: {
    label: "AFP Crecer — Nosotros (Grupo Rizek)",
    url: "https://afpcrecer.com.do/nosotros/",
  },
  haciendaPatsa: {
    label: "Hacienda — PATSA / Grupo Rizek facilitó Refidomsa 2021",
    url: "https://www.hacienda.gob.do/gobierno-dominicano-adquiere-el-control-del-100-de-las-acciones-de-refidomsa/",
  },
  marti: {
    label: "Grupo Martí — Nosotros",
    url: "https://marti.do/nosotros",
  },
  popular: {
    label: "Grupo Popular",
    url: "https://www.popularenlinea.com/",
  },
  afpPopular: {
    label: "AFP Popular",
    url: "https://www.afppopular.com.do/",
  },
  bhd: {
    label: "Centro Financiero BHD / AFP Siembra",
    url: "https://www.afpsiembra.com/conocenos/nuestro-accionista/",
  },
  banreservas: {
    label: "Banreservas",
    url: "https://www.banreservas.com/",
  },
  afpReservas: {
    label: "AFP Reservas",
    url: "https://www.afpreservas.com.do/",
  },
  puntacana: {
    label: "Grupo Puntacana",
    url: "https://www.puntacana.com/",
  },
  sid: {
    label: "Grupo SID / Bonetti",
    url: "https://www.gruposid.com.do/",
  },
  sidAbout: {
    label: "Grupo SID — About us (MercaSID, Induveca, Induspalma, Ligia Bonetti)",
    url: "https://gruposid.com.do/en/about-us/",
  },
  sidTrayectoria: {
    label: "Grupo SID — Nuestra trayectoria (Ligia Bonetti presidenta ejecutiva)",
    url: "https://gruposid.com.do/nuestra-trayectoria/",
  },
  mercasid: {
    label: "Grupo SID — MercaSID / La Manicera",
    url: "https://gruposid.com.do/empresas/mercasid/",
  },
  caei: {
    label: "CAEI — About us (Putney / INICIA · ingenio Cristóbal Colón)",
    url: "https://caei.com/en/about-us/",
  },
  caeiDiarioLibre: {
    label: "Diario Libre — Colón es propiedad de Vicini / CAEI",
    url: "https://www.diariolibre.com/actualidad/coln-es-propiedad-de-vicini-ECDL23372",
  },
  parval: {
    label: "PARVAL — Nosotros (Grupo Rizek)",
    url: "https://parval.com.do/nosotros/",
  },
  distribuidoraCorripio: {
    label: "Listín Diario — Distribuidora Corripio (Grupo Corripio, +50 años)",
    url: "https://listindiario.com/las-sociales/20260608/distribuidora-corripio-presenta-delovita-nueva-marca-categoria-snacks-dulces_909036.html",
  },
  pinturasTropical: {
    label: "Listín Diario — Pinturas Tropical (Corripio)",
    url: "https://listindiario.com/las-sociales/2022/10/19/744061/pinturas-tropical-estrena-campana-publicitaria.html",
  },
  islaPetroleo: {
    label: "Listín Diario — Grupo Corripio entra como accionista de Isla Dominicana de Petróleo (2017)",
    url: "https://listindiario.com/economia/2017/06/16/470332/isla-se-convierte-en-representante-de-shell.html",
  },
  popularAsamblea2026: {
    label: "Grupo Popular — Asamblea 2026 (Qik / Popular Bank Panamá)",
    url: "https://grupopopular.com/Noticias/Pages/Grupo-Popular-celebra-Asamblea-General-de-Accionistas-2026.aspx",
  },
  hacienda: {
    label: "Ministerio de Hacienda",
    url: "https://www.hacienda.gob.do/",
  },
  bc: {
    label: "Banco Central de la República Dominicana",
    url: "https://www.bancentral.gov.do/",
  },
  sb: {
    label: "Superintendencia de Bancos",
    url: "https://sb.gob.do/",
  },
  jm: {
    label: "Junta Monetaria",
    url: "https://www.bancentral.gov.do/",
  },
  dga: {
    label: "Dirección General de Aduanas",
    url: "https://www.aduanas.gob.do/",
  },
  micm: {
    label: "MICM",
    url: "https://www.micm.gob.do/",
  },
  acentoDeuda: {
    label: "Acento — El negocio de la deuda pública",
    url: "https://acento.com.do/opinion/el-negocio-de-la-deuda-publica-9573875.html",
  },
  creditoPublico: {
    label: "Crédito Público — deuda SPNF (jul 2026)",
    url: "https://www.creditopublico.gob.do/",
  },
  creesIntereses: {
    label: "7días / CREES — intereses 2026 RD$362,550 MM",
    url: "https://7dias.com.do/2026/08/20/republica-dominicana-destina-cada-ano-al-pago-de-intereses-por-la-deuda-la-mayor-partida-presupuestaria-en-2026-alcanzaria-rd362550-0-millones/",
  },
  digepres2026: {
    label: "DIGEPRES — Política presupuestaria 2026 (intereses)",
    url: "https://www.digepres.gob.do/wp-content/uploads/2025/08/Politica-Presupuestaria-Anual-2026.pdf",
  },
  sie: {
    label: "Superintendencia de Electricidad (SIE)",
    url: "https://sie.gob.do/",
  },
  mem: {
    label: "Ministerio de Energía y Minas",
    url: "https://mem.gob.do/",
  },
  edePerdidas: {
    label: "Diario Libre — pérdidas EDE 43.5% (ene–jun 2026) / subsidio",
    url: "https://www.diariolibre.com/economia/finanzas/2026/09/10/las-perdidas-totales-de-las-ede/3654347",
  },
  fonperEde: {
    label: "Hoy — traspaso acciones EDE a FONPER",
    url: "https://hoy.com.do/economia/gobierno-traspasa-acciones-de-las-ede-al-fonper-por-mas-de-cinco-mil-noventa-millones-de-pesos_873005.html",
  },
  elCaribeElectrico: {
    label: "El Caribe — sector público mayor dueño del mercado eléctrico",
    url: "https://www.elcaribe.com.do/panorama/dinero/el-sector-publico-mayor-dueno-del-mercado-electrico/",
  },
  elDineroEstado: {
    label: "El Dinero — Estado empresario (EGE Itabo / Haina / ETED)",
    url: "https://eldinero.com.do/308266/el-estado-dominicano-sigue-siendo-empresario-pese-a-privatizaciones/",
  },
  puntaCatalina: {
    label: "Presidencia — Decreto 142-23 · Empresa Generación Punta Catalina",
    url: "https://presidencia.gob.do/sites/default/files/decree/2023-04/Decreto%20142-23.pdf",
  },
  cepm: {
    label: "CEPM — Quiénes somos (InterEnergy)",
    url: "https://cepm.com.do/quienes-somos/",
  },
  adocem: {
    label: "ADOCEM — producción de cemento RD",
    url: "https://adocem.org/produccion-de-cemento-ha-crecido-55-en-la-ultima-decada/",
  },
  estrella: {
    label: "Grupo ESTRELLA",
    url: "https://estrella.com.do/",
  },
  cementoPanam: {
    label: "Grupo ESTRELLA — Cemento PANAM",
    url: "https://estrella.com.do/empresas/cemento-panam/",
  },
  cementoNacional: {
    label: "El Nacional — industria del cemento en RD",
    url: "https://elnacional.com.do/fama-y-vida/resaltan-calidad-de-la-industria-del-cemento-en-republica-dominicana_500105.html",
  },
  cemexRd: {
    label: "CEMEX — planta San Pedro de Macorís / capacidad",
    url: "https://www.cemex.com/w/cemex-expands-capacity-in-the-dominican-republic-with-reopening-of-production-line",
  },
};

/** Familias / grupos — IDs estables */
export const FAMILY_NODES = [
  {
    id: "e-grupo-vicini",
    name: "Grupo Vicini / INICIA",
    kind: "familia",
    role: "Capital histórico · azúcar · medios y activos",
    aliases: ["vicini", "inicia", "grupo vicini"],
    summary:
      "Familia Vicini: más de un siglo en RD. En 2016 VICINI pasó a llamarse INICIA. Opera azúcar vía CAEI (ingenio Cristóbal Colón / Putney afiliado a INICIA). Juan Bautista Vicini Lluberes fue accionista de Listín Diario en 2010.",
    mechanism: "Capital viejo + agroindustria + medios. No es una empresa suelta: es una casa.",
    weight: 96,
    source: SRC_SHARED.inicia,
    themes: ["familias", "medios", "deuda", "banca"],
  },
  {
    id: "e-grupo-rizek",
    name: "Grupo Rizek",
    kind: "familia",
    role: "Pensiones · combustible · cacao · valores · Junta histórica",
    aliases: ["rizek", "grupo rizek", "roryk"],
    summary:
      "Controla AFP Crecer; facilitó Refidomsa vía PATSA (2021); exporta cacao (Roryk Cacao); opera PARVAL (puesto de bolsa). Héctor José Rizek Llabaly integró la Junta Monetaria (1985–2026): histórico, no actual. Accionista histórico de Listín Diario (2010).",
    mechanism: "Misma familia, varias venas: pensión, combustible, cacao, mercado de valores y —durante cuatro décadas— la mesa monetaria.",
    weight: 98,
    source: SRC_SHARED.rizekFallece,
    themes: ["familias", "pensiones", "gasolina", "deuda", "medios", "banca", "aduana"],
  },
  {
    id: "e-grupo-corripio",
    name: "Grupo Corripio",
    kind: "familia",
    role: "Medios · distribución · industria · energía",
    aliases: ["corripio", "pepín corripio", "pepin corripio", "grupo corripio"],
    summary:
      "Brazo mediático: Hoy, Telesistema, Teleantillas, El Día, El Nacional y participación en Listín Diario. También Distribuidora Corripio, Pinturas Tropical y participación accionaria en Isla Dominicana de Petróleo (Shell, 2017).",
    mechanism: "Pantallas, anaquel y combustible: la misma casa toca lo que ves, lo que compras y lo que echas al tanque.",
    weight: 94,
    source: SRC_SHARED.corripioWiki,
    themes: ["familias", "medios", "aduana", "gasolina"],
  },
  {
    id: "e-grupo-bonetti",
    name: "Grupo Bonetti / SID",
    kind: "familia",
    role: "Alimentos · industria (SID)",
    aliases: ["bonetti", "grupo sid", "sid", "grupo bonetti", "la manicera"],
    summary:
      "Grupo SID (familia Bonetti): MercaSID (heredera de “La Manicera”), Induveca, Induspalma y otras filiales de consumo masivo. Ligia Bonetti es presidenta ejecutiva (sitio corporativo). Casa industrial histórica del país.",
    mechanism: "Del aceite Manicero al anaquel: una casa, varias marcas de lo que comes.",
    weight: 90,
    source: SRC_SHARED.sid,
    themes: ["familias", "aduana"],
  },
  {
    id: "e-grupo-rainieri",
    name: "Grupo Rainieri / Puntacana",
    kind: "familia",
    role: "Turismo · aeropuerto Punta Cana",
    aliases: ["rainieri", "puntacana", "punta cana"],
    summary:
      "Grupo Puntacana: resort, destino y Aeropuerto Internacional de Punta Cana. Turismo de enclave con infraestructura propia. El Este turístico depende de energía confiable (CEPM/InterEnergy opera en esa zona).",
    weight: 82,
    source: SRC_SHARED.puntacana,
    themes: ["familias", "electricidad"],
  },
  {
    id: "e-grupo-popular",
    name: "Grupo Popular",
    kind: "familia",
    role: "Banco Popular · AFP Popular · banca digital · Panamá",
    aliases: ["popular", "grullón", "grullon", "grupo popular", "familia grullón"],
    summary:
      "Casa Grullón / Grupo Popular: Banco Popular Dominicano, AFP Popular, Qik Banco Digital y Popular Bank (Panamá). Conglomerado financiero documentado en sitios e informes corporativos.",
    mechanism: "Tu depósito, tu pensión y el neobanco: mismo ecosistema.",
    weight: 95,
    source: SRC_SHARED.popular,
    themes: ["familias", "pensiones", "deuda", "banca", "medios"],
  },
  {
    id: "e-grupo-marti",
    name: "Grupo Martí",
    kind: "familia",
    role: "GLP · combustibles · Volvo",
    summary:
      "Tropigas (GLP) y Sunix (líquidos): importación y distribución. También Volvo y otros negocios (sitio Martí).",
    weight: 92,
    source: SRC_SHARED.marti,
    themes: ["familias", "gasolina", "aduana"],
  },
  {
    id: "e-grupo-bhd",
    name: "Centro Financiero BHD",
    kind: "familia",
    role: "BHD · AFP Siembra",
    summary:
      "Accionista de AFP Siembra (sitio AFP Siembra). Brazo bancario y de pensiones del ecosistema BHD.",
    weight: 90,
    source: SRC_SHARED.bhd,
    themes: ["familias", "pensiones", "deuda", "banca"],
  },
  {
    id: "e-grupo-estrella",
    name: "Grupo Estrella",
    kind: "familia",
    role: "Construcción · cemento · acero",
    aliases: ["estrella", "manuel estrella"],
    summary:
      "Conglomerado dominicano: Ingeniería Estrella (obras), Acero Estrella, y PANAM (cemento, concreto, agregados). Integración vertical de la cadena de la construcción (sitio corporativo).",
    mechanism: "No solo construye: también fabrica la materia prima de la obra.",
    weight: 90,
    source: SRC_SHARED.estrella,
    themes: ["familias", "construccion"],
  },
];

export const PERSON_NODES = [
  {
    id: "p-hector-rizek",
    name: "Héctor José Rizek Llabaly",
    kind: "persona",
    role: "Fallecido · miembro histórico de la Junta Monetaria (1985–2026)",
    aliases: ["rizek", "héctor rizek", "hector rizek", "señor cacao"],
    summary:
      "Falleció el 28 de marzo de 2026 (Diario Libre). Presidente histórico de Rizek Cacao. Integró la Junta Monetaria desde 1985 hasta su muerte: miembro histórico, no forma parte de la composición actual. El puente familia ↔ regulación monetaria quedó en el archivo, no en la mesa de hoy.",
    weight: 70,
    source: SRC_SHARED.rizekFallece,
    themes: ["familias", "banca"],
  },
  {
    id: "p-ligia-bonetti",
    name: "Ligia Bonetti",
    kind: "persona",
    role: "Presidenta ejecutiva · Grupo SID",
    aliases: ["ligia bonetti", "ligia bonetti du-breil"],
    summary:
      "Presidenta ejecutiva de Grupo SID y sus empresas (sitio corporativo / trayectoria). Liderazgo visible de la casa Bonetti en alimentos e industria.",
    weight: 72,
    source: SRC_SHARED.sidTrayectoria,
    themes: ["familias"],
  },
];

export const MEDIA_NODES = [
  {
    id: "m-listin",
    name: "Listín Diario",
    kind: "medio",
    role: "Diario · accionistas 2010",
    summary:
      "En 2010 asumieron el control accionario: Juan Bautista Vicini Lluberes, Héctor José Rizek, Samir Rizek, Mícalo Bermúdez y José Luis Corripio (comunicado / prensa).",
    weight: 85,
    source: SRC_SHARED.listin2010,
    themes: ["medios", "familias"],
  },
  {
    id: "m-hoy",
    name: "Periódico Hoy",
    kind: "medio",
    role: "Grupo Corripio",
    summary: "Diario del Grupo de Comunicaciones Corripio.",
    weight: 72,
    source: SRC_SHARED.corripioWiki,
    themes: ["medios"],
  },
  {
    id: "m-telesistema",
    name: "Telesistema 11",
    kind: "medio",
    role: "Grupo Corripio",
    summary: "Canal de televisión del Grupo Corripio.",
    weight: 74,
    source: SRC_SHARED.corripioListin,
    themes: ["medios"],
  },
  {
    id: "m-teleantillas",
    name: "Teleantillas",
    kind: "medio",
    role: "Grupo Corripio",
    summary:
      "Canal 2. Operaciones consolidadas con Telesistema bajo Medios Electrónicos Corripio (Listín Diario, 2019).",
    weight: 74,
    source: SRC_SHARED.corripioListin,
    themes: ["medios"],
  },
  {
    id: "m-el-dia",
    name: "El Día",
    kind: "medio",
    role: "Grupo Corripio",
    summary: "Diario gratuito del Grupo Corripio.",
    weight: 60,
    source: SRC_SHARED.corripioWiki,
    themes: ["medios"],
  },
  {
    id: "m-el-nacional",
    name: "El Nacional",
    kind: "medio",
    role: "Grupo Corripio",
    aliases: ["el nacional", "nacional"],
    summary: "Periódico del ecosistema Corripio.",
    weight: 62,
    source: SRC_SHARED.corripioWiki,
    themes: ["medios"],
  },
];

export const BANK_AFP_NODES = [
  {
    id: "e-banco-popular",
    name: "Banco Popular",
    kind: "banco",
    role: "Grupo Popular",
    summary: "Principal banco privado del Grupo Popular.",
    weight: 90,
    source: SRC_SHARED.popular,
    themes: ["banca", "deuda", "pensiones", "familias"],
  },
  {
    id: "e-banco-bhd",
    name: "Banco BHD",
    kind: "banco",
    role: "Centro Financiero BHD",
    summary: "Banco del ecosistema BHD, vinculado a AFP Siembra.",
    weight: 86,
    source: SRC_SHARED.bhd,
    themes: ["banca", "deuda", "pensiones", "familias"],
  },
  {
    id: "e-banreservas",
    name: "Banreservas",
    kind: "banco",
    role: "Banco estatal",
    summary: "Banco de Reservas. Ecosistema de AFP Reservas.",
    weight: 88,
    source: SRC_SHARED.banreservas,
    themes: ["banca", "deuda", "pensiones", "familias"],
  },
  {
    id: "e-afp-popular",
    name: "AFP Popular",
    kind: "afp",
    role: "Grupo Popular",
    summary: "Administradora de pensiones del Grupo Popular.",
    weight: 88,
    source: SRC_SHARED.afpPopular,
    themes: ["pensiones", "deuda", "banca", "familias"],
  },
  {
    id: "e-afp-crecer",
    name: "AFP Crecer",
    kind: "afp",
    role: "Grupo Rizek",
    summary: "AFP del Grupo Rizek. Puente pensiones ↔ familia Rizek.",
    weight: 88,
    source: SRC_SHARED.afpCrecer,
    themes: ["pensiones", "deuda", "banca", "familias", "gasolina"],
  },
  {
    id: "e-afp-siembra",
    name: "AFP Siembra",
    kind: "afp",
    role: "Centro Financiero BHD",
    summary: "AFP cuyo accionista es el Centro Financiero BHD.",
    weight: 84,
    source: SRC_SHARED.bhd,
    themes: ["pensiones", "deuda", "banca", "familias"],
  },
  {
    id: "e-afp-reservas",
    name: "AFP Reservas",
    kind: "afp",
    role: "Ecosistema Banreservas",
    summary: "AFP del ecosistema Reservas.",
    weight: 84,
    source: SRC_SHARED.afpReservas,
    themes: ["pensiones", "deuda", "banca", "familias"],
  },
];

export const STATE_NODES = [
  {
    id: "i-hacienda",
    name: "Ministerio de Hacienda",
    kind: "estado",
    role: "Emisor de deuda · presupuestos",
    summary: "Emite bonos del Gobierno Central y gestiona el presupuesto, incluidos intereses de la deuda.",
    weight: 96,
    source: SRC_SHARED.hacienda,
    themes: ["deuda", "pensiones", "gasolina", "electricidad"],
  },
  {
    id: "i-banco-central",
    name: "Banco Central",
    kind: "estado",
    role: "Política monetaria · títulos",
    summary: "Emite títulos y opera con la Junta Monetaria. Los bancos y AFP concentran gran parte de esos papeles.",
    weight: 92,
    source: SRC_SHARED.bc,
    themes: ["deuda", "banca", "pensiones"],
  },
  {
    id: "i-junta-monetaria",
    name: "Junta Monetaria",
    kind: "estado",
    role: "Órgano superior · 3 ex officio + 6 designados",
    aliases: ["junta monetaria", "jm"],
    summary:
      "Ley 183-02: tres miembros ex officio —gobernador del Banco Central (la preside), ministro de Hacienda y Economía y superintendente de Bancos— y seis designados por el Presidente por dos años, renovables. Composición reciente (prensa 2026): Héctor Valdez Albizu (presidente), Magín Díaz (Hacienda), Enmanuel Cedeño Brea (Superintendencia de Bancos, desde sep 2026); designados Julio César Llibre Salcedo, Arturo Martínez Moya, Eduardo de Jesús Tejera Curbelo, Sergia Elena Mejía de Peña, Ricardo Rojas León y José Manuel Mallén. Héctor José Rizek Llabaly fue miembro histórico (1985–2026), no actual: falleció el 28 de marzo de 2026.",
    mechanism:
      "Art. 11 de la Ley 183-02: el cargo de miembro designado es incompatible con dirigir o controlar una entidad de intermediación financiera y con tener participación directa o indirecta en el capital de las entidades sometidas a esa ley. Quien sienta en esa mesa no puede, a la vez, mandar un banco.",
    weight: 90,
    source: SRC_SHARED.jmLey,
    themes: ["banca", "familias", "deuda"],
  },
  {
    id: "i-superintendencia-bancos",
    name: "Superintendencia de Bancos",
    kind: "estado",
    role: "Supervisión bancaria",
    summary: "Regula y supervisa las entidades de intermediación financiera.",
    weight: 70,
    source: SRC_SHARED.sb,
    themes: ["banca"],
  },
  {
    id: "i-dga",
    name: "DGA",
    kind: "estado",
    role: "Dirección General de Aduanas",
    summary:
      "Controla el ingreso de mercancías al país: aranceles, permisos, fiscalización. Quien navega la aduana navega el precio de lo que consumes.",
    mechanism: "La aduana no es solo un filtro. Es un mecanismo de poder sobre el comercio.",
    weight: 100,
    source: SRC_SHARED.dga,
    themes: ["aduana"],
  },
  {
    id: "i-micm",
    name: "MICM",
    kind: "estado",
    role: "Comercio · precios · licencias",
    summary: "Ministerio de Industria, Comercio y Mipymes. Precios de combustibles, licencias y marco comercial.",
    weight: 85,
    source: SRC_SHARED.micm,
    themes: ["aduana", "gasolina"],
  },
  {
    id: "i-sie",
    name: "SIE",
    kind: "estado",
    role: "Regulador eléctrico",
    summary:
      "Superintendencia de Electricidad: fiscaliza el subsector eléctrico y el marco tarifario (sitio SIE).",
    mechanism: "Quien fija y vigila las reglas de la luz pesa sobre lo que pagas en la factura.",
    weight: 96,
    source: SRC_SHARED.sie,
    themes: ["electricidad"],
  },
  {
    id: "i-mem",
    name: "Energía y Minas",
    kind: "estado",
    role: "Política energética",
    summary:
      "Ministerio de Energía y Minas: política del sector. Publica desempeño de las EDE y el marco institucional post-CDEEE.",
    weight: 88,
    source: SRC_SHARED.mem,
    themes: ["electricidad"],
  },
  {
    id: "i-fonper",
    name: "FONPER",
    kind: "estado",
    role: "Dueño patrimonial de las EDE",
    summary:
      "Fondo Patrimonial de las Empresas Reformadas: recibió las acciones de Edesur, Edenorte y Edeeste (prensa / acto notarial reportado).",
    weight: 80,
    source: SRC_SHARED.fonperEde,
    themes: ["electricidad"],
  },
];

/** Edges estructurales entre familias y sus venas (reutilizables). */

/** Empresas / filiales documentadas de las casas (IDs estables). */
export const COMPANY_NODES = [
  {
    id: "e-mercasid",
    name: "MercaSID",
    kind: "empresa",
    role: "Alimentos · distribución · Grupo SID",
    aliases: ["mercasid", "la manicera", "manicera"],
    summary:
      "Filial de Grupo SID. Continuidad de la Sociedad Industrial Dominicana (“La Manicera”): aceites, grasas, cereales y distribución de marcas de consumo masivo.",
    weight: 80,
    source: SRC_SHARED.mercasid,
    themes: ["familias", "aduana"],
  },
  {
    id: "e-induveca",
    name: "Induveca",
    kind: "empresa",
    role: "Cárnicos · lácteos · jugos · Grupo SID",
    aliases: ["induveca"],
    summary:
      "Empresa del Grupo SID: productos cárnicos procesados, lácteos y jugos (sitio corporativo SID).",
    weight: 76,
    source: SRC_SHARED.sidAbout,
    themes: ["familias", "aduana"],
  },
  {
    id: "e-induspalma",
    name: "Induspalma",
    kind: "empresa",
    role: "Palma aceitera · Grupo SID",
    aliases: ["induspalma"],
    summary:
      "Proyecto agroindustrial de aceite de palma del Grupo SID en el Caribe (sitio corporativo).",
    weight: 70,
    source: SRC_SHARED.sidAbout,
    themes: ["familias"],
  },
  {
    id: "e-caei",
    name: "CAEI / Ingenio Cristóbal Colón",
    kind: "empresa",
    role: "Azúcar · Vicini / INICIA",
    aliases: ["caei", "cristóbal colón", "cristobal colon", "ingenio colón"],
    summary:
      "Consorcio Azucarero de Empresas Industriales: opera el ingenio Cristóbal Colón. Activo administrado por Putney Capital Management, gestor afiliado a INICIA (familia Vicini). Diario Libre documentó la propiedad Vicini/CAEI.",
    weight: 84,
    source: SRC_SHARED.caei,
    themes: ["familias"],
  },
  {
    id: "e-parval",
    name: "PARVAL",
    kind: "empresa",
    role: "Puesto de bolsa · Grupo Rizek",
    aliases: ["parval", "parallax valores"],
    summary:
      "Parallax Valores (PARVAL): puesto de bolsa del Grupo Rizek (sitio corporativo). Brazo de mercado de valores de la casa.",
    weight: 78,
    source: SRC_SHARED.parval,
    themes: ["familias", "banca", "deuda"],
  },
  {
    id: "e-distribuidora-corripio",
    name: "Distribuidora Corripio",
    kind: "empresa",
    role: "Distribución · importación · Grupo Corripio",
    aliases: ["distribuidora corripio"],
    summary:
      "Empresa del Grupo Corripio dedicada a comercialización, fabricación, importación y exportación de marcas (sitio corporativo).",
    weight: 80,
    source: SRC_SHARED.distribuidoraCorripio,
    themes: ["familias", "aduana"],
  },
  {
    id: "e-pinturas-tropical",
    name: "Pinturas Tropical",
    kind: "empresa",
    role: "Pinturas · Grupo Corripio",
    aliases: ["pinturas tropical", "tropical"],
    summary:
      "Marca industrial de pinturas del ecosistema Corripio. Listín Diario documenta a José Alfredo Corripio como vicepresidente de Pinturas Tropical.",
    weight: 68,
    source: SRC_SHARED.pinturasTropical,
    themes: ["familias"],
  },
  {
    id: "e-isla-petroleo",
    name: "Isla Dominicana de Petróleo",
    kind: "empresa",
    role: "Combustibles · Shell · Corripio accionista",
    aliases: ["isla", "isla dominicana de petróleo", "isla petroleo"],
    summary:
      "Distribuidora de combustibles (marca Shell). En 2017 Listín Diario reportó la entrada del Grupo Corripio como accionista junto a la familia Moller.",
    weight: 82,
    source: SRC_SHARED.islaPetroleo,
    themes: ["familias", "gasolina"],
  },
  {
    id: "e-qik",
    name: "Qik Banco Digital",
    kind: "banco",
    role: "Neobanco · Grupo Popular",
    aliases: ["qik", "qik banco", "qik banco digital"],
    summary:
      "Filial de banca digital del Grupo Popular. La asamblea corporativa de 2026 reporta a Qik como neobanco del ecosistema Popular.",
    weight: 78,
    source: SRC_SHARED.popularAsamblea2026,
    themes: ["familias", "banca"],
  },
  {
    id: "e-popular-bank-panama",
    name: "Popular Bank (Panamá)",
    kind: "banco",
    role: "Filial internacional · Grupo Popular",
    aliases: ["popular bank", "popular bank panamá", "popular bank panama"],
    summary:
      "Filial bancaria internacional del Grupo Popular en Panamá. Reportada en la asamblea corporativa de 2026 (activos y utilidades).",
    weight: 74,
    source: SRC_SHARED.popularAsamblea2026,
    themes: ["familias", "banca"],
  },
];

export const SHARED_EDGES = [
  {
    source: "e-grupo-rizek",
    target: "e-afp-crecer",
    type: "controla",
    note: "AFP Crecer · vena de pensiones",
    sourceRef: SRC_SHARED.afpCrecer,
  },
  {
    source: "e-grupo-rizek",
    target: "p-hector-rizek",
    type: "liderado_por",
    note: "Presidente histórico · fallecido 28 mar 2026",
    sourceRef: SRC_SHARED.rizekFallece,
  },
  {
    source: "p-hector-rizek",
    target: "i-junta-monetaria",
    type: "integró",
    note: "Miembro histórico 1985–2026 · no actual",
    sourceRef: SRC_SHARED.rizekFallece,
  },
  {
    source: "e-grupo-rizek",
    target: "m-listin",
    type: "accionista_historico",
    note: "Control accionario 2010 (con Vicini, Corripio, Bermúdez)",
    sourceRef: SRC_SHARED.listin2010,
  },
  {
    source: "e-grupo-vicini",
    target: "m-listin",
    type: "accionista_historico",
    note: "Juan Bautista Vicini Lluberes · 2010",
    sourceRef: SRC_SHARED.listin2010,
  },
  {
    source: "e-grupo-corripio",
    target: "m-listin",
    type: "accionista_historico",
    note: "José Luis Corripio · 2010",
    sourceRef: SRC_SHARED.listin2010,
  },
  {
    source: "e-grupo-corripio",
    target: "m-hoy",
    type: "controla",
    sourceRef: SRC_SHARED.corripioWiki,
  },
  {
    source: "e-grupo-corripio",
    target: "m-telesistema",
    type: "controla",
    sourceRef: SRC_SHARED.corripioListin,
  },
  {
    source: "e-grupo-corripio",
    target: "m-teleantillas",
    type: "controla",
    sourceRef: SRC_SHARED.corripioListin,
  },
  {
    source: "e-grupo-corripio",
    target: "m-el-dia",
    type: "controla",
    sourceRef: SRC_SHARED.corripioWiki,
  },
  {
    source: "e-grupo-corripio",
    target: "m-el-nacional",
    type: "controla",
    sourceRef: SRC_SHARED.corripioWiki,
  },
  {
    source: "e-grupo-popular",
    target: "e-banco-popular",
    type: "controla",
    sourceRef: SRC_SHARED.popular,
  },
  {
    source: "e-grupo-popular",
    target: "e-afp-popular",
    type: "controla",
    sourceRef: SRC_SHARED.afpPopular,
  },
  {
    source: "e-grupo-bhd",
    target: "e-banco-bhd",
    type: "controla",
    sourceRef: SRC_SHARED.bhd,
  },
  {
    source: "e-grupo-bhd",
    target: "e-afp-siembra",
    type: "controla",
    sourceRef: SRC_SHARED.bhd,
  },
  {
    source: "e-banreservas",
    target: "e-afp-reservas",
    type: "ecosistema",
    sourceRef: SRC_SHARED.afpReservas,
  },
  {
    source: "e-grupo-marti",
    target: "i-dga",
    type: "opera_en",
    note: "Importación de combustibles / GLP",
    sourceRef: SRC_SHARED.marti,
  },
  {
    source: "i-junta-monetaria",
    target: "i-banco-central",
    type: "dirige",
    sourceRef: SRC_SHARED.jm,
  },
  {
    source: "i-superintendencia-bancos",
    target: "e-banco-popular",
    type: "supervisa",
    sourceRef: SRC_SHARED.sb,
  },
  {
    source: "i-superintendencia-bancos",
    target: "e-banco-bhd",
    type: "supervisa",
    sourceRef: SRC_SHARED.sb,
  },
  {
    source: "i-superintendencia-bancos",
    target: "e-banreservas",
    type: "supervisa",
    sourceRef: SRC_SHARED.sb,
  },

  // --- Expansión casas: SID / Bonetti ---
  {
    source: "e-grupo-bonetti",
    target: "e-mercasid",
    type: "controla",
    note: "Alimentos y distribución · “La Manicera”",
    sourceRef: SRC_SHARED.mercasid,
  },
  {
    source: "e-grupo-bonetti",
    target: "e-induveca",
    type: "controla",
    note: "Cárnicos, lácteos y jugos",
    sourceRef: SRC_SHARED.sidAbout,
  },
  {
    source: "e-grupo-bonetti",
    target: "e-induspalma",
    type: "controla",
    note: "Palma aceitera",
    sourceRef: SRC_SHARED.sidAbout,
  },
  {
    source: "e-grupo-bonetti",
    target: "p-ligia-bonetti",
    type: "liderado_por",
    note: "Presidenta ejecutiva",
    sourceRef: SRC_SHARED.sidTrayectoria,
  },
  // --- Vicini / CAEI ---
  {
    source: "e-grupo-vicini",
    target: "e-caei",
    type: "controla",
    note: "Azúcar · ingenio Cristóbal Colón",
    sourceRef: SRC_SHARED.caei,
  },
  // --- Rizek / PARVAL ---
  {
    source: "e-grupo-rizek",
    target: "e-parval",
    type: "controla",
    note: "Puesto de bolsa",
    sourceRef: SRC_SHARED.parval,
  },
  // --- Corripio industria / energía ---
  {
    source: "e-grupo-corripio",
    target: "e-distribuidora-corripio",
    type: "controla",
    note: "Distribución e importación",
    sourceRef: SRC_SHARED.distribuidoraCorripio,
  },
  {
    source: "e-grupo-corripio",
    target: "e-pinturas-tropical",
    type: "controla",
    note: "Pinturas",
    sourceRef: SRC_SHARED.pinturasTropical,
  },
  {
    source: "e-grupo-corripio",
    target: "e-isla-petroleo",
    type: "participa_en",
    note: "Accionista · Shell (2017)",
    sourceRef: SRC_SHARED.islaPetroleo,
  },
  // --- Popular / Grullón ---
  {
    source: "e-grupo-popular",
    target: "e-qik",
    type: "controla",
    note: "Neobanco",
    sourceRef: SRC_SHARED.popularAsamblea2026,
  },
  {
    source: "e-grupo-popular",
    target: "e-popular-bank-panama",
    type: "controla",
    note: "Filial Panamá",
    sourceRef: SRC_SHARED.popularAsamblea2026,
  },
  ...CUPULA_EDGES,
];

export function pickNodes(ids) {
  const all = [
    ...FAMILY_NODES,
    ...PERSON_NODES,
    ...MEDIA_NODES,
    ...BANK_AFP_NODES,
    ...STATE_NODES,
    ...COMPANY_NODES,
    ...cupulaNodes(),
  ];
  const set = new Set(ids);
  return all.filter((n) => set.has(n.id));
}
