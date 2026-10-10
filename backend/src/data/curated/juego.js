/**
 * Tema curado — Juego / bancas.
 * Lotería Nacional, Fenabanca y el plan de regularización.
 * Solo hechos con fuente. Sin fuente = sin nodo.
 * Nota: el tema "banca" es banca financiera; este es juego de azar.
 */

const SRC = {
  loteria: {
    label: "Lotería Nacional Dominicana",
    url: "https://loterianacional.gob.do/",
  },
  loteriaTransparencia: {
    label: "Lotería Nacional — Portal de Transparencia",
    url: "https://p.loterianacional.gob.do/transparencia/",
  },
  presidencia19726: {
    label: "Presidencia — Decreto 197-26 reactiva regularización de bancas",
    url: "https://presidencia.gob.do/noticias/gobierno-reactiva-plan-de-regularizacion-de-bancas-y-juegos-de-azar",
  },
  cdnFenabanca: {
    label: "CDN — Fenabanca valora Decreto 197-26 y pide ajustes",
    url: "https://cdn.com.do/nacionales/fenabanca-valora-decreto-sobre-regulacion-de-bancas-de-loteria-pero-pide-ajustes/",
  },
  rccFenabanca: {
    label: "RCC — Fenabanca: ~30,974 bancas legales vs ~71,192 identificadas",
    url: "https://rccnoticias.com.do/fenabanca-critica-decreto-197-26-por-excluir-al-ministerio-545742/",
  },
  decreto19726Pdf: {
    label: "Decreto 197-26 (PDF) — plan de regularización",
    url: "https://7dias.com.do/wp-content/uploads/2026/04/Decreto-197-26.pdf",
  },
  hacienda: {
    label: "Ministerio de Hacienda y Economía",
    url: "https://www.hacienda.gob.do/",
  },
  dgii: {
    label: "DGII — Dirección General de Impuestos Internos",
    url: "https://dgii.gov.do/",
  },
  diarioLibreDiputados: {
    label: "Diario Libre — nueve diputados dueños de bancas (declaraciones juradas)",
    url: "https://www.diariolibre.com/actualidad/politica/hay-nueve-diputados-duenos-de-bancas-de-apuestas-y-muy-millonarios-HE24463455",
  },
  nDiputados: {
    label: "N Digital / Nuria — 8 diputados propietarios de consorcios de bancas (2022)",
    url: "https://n.com.do/2022/03/20/estos-son-los-8-diputados-que-tambien-son-propietarios-de-consorcios-de-bancas-de-loterias/",
  },
  nLoteka: {
    label: "N Digital / Nuria — Loteka, contratos de Hacienda y Sajama (2022)",
    url: "https://n.com.do/2022/03/27/loteka-por-anos-pago-impuestos-por-debajo-de-lo-que-establece-ley-donald-guerrero-fue-su-dueno/",
  },
  panoramaAmos: {
    label: "Panorama — Los amos del azar (abr 2025)",
    url: "https://panorama.com.do/los-amos-del-azar-el-imperio-silencioso-detras-de-un-negocio-lucrativo/",
  },
  panoramaLey: {
    label: "Panorama — Proyecto de ley de juegos de azar: lo que no toca (jun 2025)",
    url: "https://panorama.com.do/proponen-ley-sobre-juegos-de-azar-tras-reportajes-del-periodico-panorama-pero-la-banca-sigue-ganando/",
  },
  cdnEntramado: {
    label: "CDN Reporte Especial — Bancas ilegales y poder político",
    url: "https://cdn.com.do/investigacion/reporte-especial/bancas-ilegales-y-el-poder-politico-mantienen-entramado-que-afecta-al-fisco/",
  },
  casinosConcesionarios: {
    label: "Dirección de Casinos y Juegos de Azar — concesionarios de loterías electrónicas",
    url: "https://www.casinos.gob.do/juegos-autorizados/concesionarios-de-loterias-electronicas/",
  },
};

export const JUEGO_NODES = [
  {
    id: "c-mecanismo-juego",
    name: "Quién controla el juego",
    kind: "estado",
    role: "Lotería · bancas · regularización",
    summary:
      "El juego de azar en RD no es solo “entretenimiento”. Es un mapa de concesiones, puntos de venta, federaciones de bancas y un Estado que intenta regularizar lo que ya opera. La Lotería Nacional concentra sorteos oficiales; loterías electrónicas privadas (Leidsa, Loteka, Lotedom…) dan sombrilla a consorcios de bancas; varios de esos consorcios son de diputados y senadores que votan las leyes del sector. Los decretos de regularización revelan la brecha entre lo legal y lo que realmente existe en la esquina.",
    mechanism: "Quien licencia la banca decide quién cobra la esperanza del barrio.",
    weight: 100,
    source: SRC.presidencia19726,
    themes: ["juego"],
  },
  {
    id: "i-loteria-nacional",
    name: "Lotería Nacional",
    kind: "estado",
    role: "Sorteos oficiales · administrador",
    aliases: ["lotería nacional", "loteria nacional"],
    summary:
      "Institución estatal de sorteos (billetes, quinielas y productos). Tiene portal de transparencia (presupuesto, ejecución, auditorías). En el Decreto 197-26, su administrador funge temporalmente como coordinador operativo del plan de regularización.",
    weight: 94,
    source: SRC.loteria,
    themes: ["juego"],
  },
  {
    id: "c-decreto-197-26",
    name: "Decreto 197-26",
    kind: "estado",
    role: "Reactiva regularización de bancas",
    summary:
      "Decreto del Poder Ejecutivo (26 mar 2026) que reactiva el Plan Nacional de Regularización de bancas de lotería, puntos de venta, agencias y bancas de apuestas. Incorpora a la DGII, crea/actualiza consejo consultivo y deroga el esquema del Decreto 295-22.",
    mechanism: "Regularizar es decidir quién queda dentro del peaje legal.",
    weight: 92,
    source: SRC.presidencia19726,
    themes: ["juego"],
  },
  {
    id: "o-fenabanca",
    name: "Fenabanca",
    kind: "sindicato",
    role: "Federación de bancas de lotería",
    aliases: ["fenabanca", "federación nacional de bancas"],
    summary:
      "Federación Nacional de Bancas de Lotería: gremio de dueños/asociaciones de bancas. Integra el consejo consultivo del plan de regularización. Su secretario general (prensa) ha pedido ajustes al 197-26, incluido rol del Ministerio Público frente a bancas ilegales.",
    weight: 90,
    source: SRC.cdnFenabanca,
    themes: ["juego"],
  },
  {
    id: "c-brecha-bancas",
    name: "La brecha legal / real",
    kind: "empresa",
    role: "~31 mil legales · ~71 mil identificadas",
    summary:
      "Dirigentes de Fenabanca (RCC): ~30,974 bancas registradas legalmente frente a ~71,192 establecimientos identificados en el proceso de regularización de 2022 — una brecha de ~40,218 puntos fuera de norma. El mapa del juego es más grande que el padrón.",
    mechanism: "Lo ilegal no es margen: es competencia que redefine quién paga impuestos.",
    weight: 88,
    source: SRC.rccFenabanca,
    themes: ["juego"],
  },
  {
    id: "i-hacienda-juego",
    name: "Hacienda (juego)",
    kind: "estado",
    role: "Licencias · normativa del sector",
    summary:
      "Ministerio de Hacienda y Economía: instruido por el 197-26 a elaborar y adecuar normas del proceso de regularización, en coordinación con el consejo consultivo. Históricamente fue el eje del plan 2022 (decretos 63-22 / 295-22).",
    weight: 86,
    source: SRC.presidencia19726,
    themes: ["juego"],
  },
  {
    id: "i-dgii-juego",
    name: "DGII (fiscalización bancas)",
    kind: "estado",
    role: "Verificación fiscal de operadores",
    summary:
      "El Decreto 197-26 incorpora a la DGII para verificar cumplimiento fiscal de operadores, incorporación provisional al régimen tributario y respaldo a fiscalización. Sin RNC y sin control, la banca es efectivo opaco.",
    weight: 82,
    source: SRC.presidencia19726,
    themes: ["juego"],
  },
  {
    id: "c-jugador",
    name: "El jugador",
    kind: "trabajador",
    role: "Quién pone el efectivo",
    summary:
      "Compra el chance en la esquina. No diseña el decreto ni sienta a Fenabanca en el consejo. Financia el sistema con esperanza. La opacidad del padrón es opacidad sobre su dinero.",
    weight: 70,
    source: SRC.loteria,
    themes: ["juego"],
  },
  {
    id: "c-curules-banca",
    name: "Curules con banca",
    kind: "partido",
    role: "Legisladores dueños de consorcios · PRM, PLD, FP",
    aliases: ["diputados banqueros", "legisladores bancas", "bancas joselito", "consorcio eduard"],
    summary:
      "Según sus propias declaraciones juradas (Diario Libre; N Digital / Nuria, 2022), al menos ocho o nueve diputados eran a la vez dueños de consorcios de bancas, de los tres partidos grandes: Orlando Martínez (PRM, Bancas OM), Alexander Javier Cuevas (PRM, Alex Sport), Manuel Florián (PRM, Los Mellizos), Juan Carlos Echavarría (PLD, Bancas Joselito / Negosur), Carlos Gil (PLD, La Dinámica), Eduard Espiritusanto (FP, Consorcio Eduard; hoy senador). Panorama (2025) suma exlegisladores como Pedro Alegría (Leidsa) y Antonio Cruz Torres. Fenabanca ha denunciado bancas sin regularizar en algunos de esos consorcios: son denuncias, no sentencias.",
    mechanism: "El que vende el chance también vota la ley del chance.",
    weight: 96,
    source: SRC.diarioLibreDiputados,
    themes: ["juego"],
  },
  {
    id: "e-loteka-fixtil",
    name: "Loteka · Fixtil",
    kind: "empresa",
    role: "Lotería electrónica · matriz con acciones al portador",
    aliases: ["loteka", "fixtil", "fixtil corporation"],
    summary:
      "Loteka es concesionaria de lotería electrónica (Dirección de Casinos). Su matriz, Fixtil Corporation LTD, está constituida en el extranjero con acciones al portador: no se puede saber con certeza quiénes son sus dueños (Panorama, 2025). Aun así, legisladores declaran acciones en Fixtil: Echavarría reportó US$14 mil (Diario Libre) y Espiritusanto también se declara accionista (Panorama). Nuria (2022) mostró un contrato en el que Sajama, presidida por Donald Guerrero —luego ministro de Hacienda—, figuraba como propietaria de la marca Loteka.",
    mechanism: "Si el dueño es al portador, el dueño es nadie… y es alguien.",
    weight: 92,
    source: SRC.panoramaAmos,
    themes: ["juego"],
  },
  {
    id: "e-lotedom",
    name: "Lotedom · Bancas OM",
    kind: "empresa",
    role: "Lotería electrónica · ~6,700 bancas concesionadas",
    aliases: ["lotedom", "bancas om", "orlando martínez"],
    summary:
      "Lotedom es concesionaria de lotería electrónica (Dirección de Casinos). Panorama (2025): su accionista mayoritario es el diputado Orlando Martínez (PRM), dueño también de Bancas OM; Lotedom figura con más de 6,700 bancas y, según esos registros, al menos 1,381 sin los permisos requeridos (señalamiento periodístico, no sentencia).",
    mechanism: "Concesión, consorcio y curul en la misma persona.",
    weight: 90,
    source: SRC.panoramaAmos,
    themes: ["juego"],
  },
  {
    id: "c-ley-juego",
    name: "La ley que no toca",
    kind: "estado",
    role: "Proyecto de ley de juegos de azar (Hacienda, 2025)",
    summary:
      "Hacienda sometió al Congreso un proyecto para crear una Dirección General de Juegos de Azar, licencias y sanciones. Panorama (jun 2025) señala lo que no hace: no pone tope de bancas por consorcio, no prohíbe que diputados o senadores sean dueños de bancas, no prohíbe sociedades con acciones al portador. La votan, entre otros, legisladores que son dueños del negocio.",
    mechanism: "El regulado y el regulador se sientan en la misma curul.",
    weight: 89,
    source: SRC.panoramaLey,
    themes: ["juego"],
  },
];

export const JUEGO_EDGES = [
  { source: "c-mecanismo-juego", target: "i-loteria-nacional", type: "incluye", sourceRef: SRC.loteria },
  { source: "c-mecanismo-juego", target: "o-fenabanca", type: "incluye", sourceRef: SRC.cdnFenabanca },
  { source: "c-decreto-197-26", target: "i-loteria-nacional", type: "coordina_via", note: "Administrador como coordinador operativo temporal", sourceRef: SRC.presidencia19726 },
  { source: "c-decreto-197-26", target: "i-hacienda-juego", type: "instruye", sourceRef: SRC.presidencia19726 },
  { source: "c-decreto-197-26", target: "i-dgii-juego", type: "incorpora", note: "Fiscalización de operadores", sourceRef: SRC.presidencia19726 },
  { source: "c-decreto-197-26", target: "o-fenabanca", type: "sienta_en_consejo", note: "Fenabanca en consejo consultivo", sourceRef: SRC.presidencia19726 },
  { source: "o-fenabanca", target: "c-brecha-bancas", type: "denuncia", note: "Cifras de padrón vs identificados (prensa)", sourceRef: SRC.rccFenabanca },
  { source: "i-loteria-nacional", target: "c-jugador", type: "sortea_para", sourceRef: SRC.loteria },
  { source: "c-brecha-bancas", target: "c-jugador", type: "captura", sourceRef: SRC.rccFenabanca },
  { source: "i-dgii-juego", target: "c-brecha-bancas", type: "fiscaliza", sourceRef: SRC.presidencia19726 },
  { source: "c-mecanismo-juego", target: "c-curules-banca", type: "incluye", note: "Dueños de bancas con curul", sourceRef: SRC.diarioLibreDiputados },
  { source: "c-curules-banca", target: "e-loteka-fixtil", type: "accionistas_declarados", note: "Acciones en Fixtil en declaraciones juradas", sourceRef: SRC.diarioLibreDiputados },
  { source: "c-curules-banca", target: "e-lotedom", type: "controla", note: "Accionista mayoritario: diputado Orlando Martínez", sourceRef: SRC.panoramaAmos },
  { source: "c-curules-banca", target: "c-ley-juego", type: "vota", note: "Los dueños votan la ley de su negocio", sourceRef: SRC.panoramaLey },
  { source: "o-fenabanca", target: "c-curules-banca", type: "denuncia", note: "Bancas sin regularizar en consorcios de legisladores (denuncia)", sourceRef: SRC.panoramaAmos },
  { source: "e-loteka-fixtil", target: "c-brecha-bancas", type: "sombrilla", note: "Consorcios bajo su concesión, muchos sin regularizar (prensa)", sourceRef: SRC.panoramaAmos },
  { source: "e-lotedom", target: "c-brecha-bancas", type: "sombrilla", note: "≥1,381 bancas sin permisos (prensa)", sourceRef: SRC.panoramaAmos },
  { source: "c-ley-juego", target: "c-jugador", type: "deja_igual", note: "Sin tope, sin incompatibilidad, sin transparencia de dueños", sourceRef: SRC.panoramaLey },
  { source: "i-hacienda-juego", target: "c-ley-juego", type: "somete", sourceRef: SRC.panoramaLey },
];
