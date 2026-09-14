/**
 * Modo curado — tema Partidos.
 * Solo hechos con fuente pública verificable. Montos solo cuando la fuente los publica.
 *
 * Cifras 2026 (Resolución JCE 01-2026 / prensa):
 * - Total contribución: RD$1,620 MM (no “recortado” a 810: eso es el primer semestre desembolsado)
 * - +5%: 80% → RD$432 MM c/u (PRM, FP, PLD)
 * - 1–5%: 12% → RD$38.88 MM c/u (5 partidos)
 * - <1%: 8% → ~RD$3,927,272.73 c/u
 * Ratio grande/nuevo ≈ 110× (432 / 3.927)
 */

import { CUPULA_NODE } from "./cupula.js";

const SRC = {
  ley3318: {
    label: "Ley 33-18 — Partidos, Agrupaciones y Movimientos Políticos (PDF CEPAL)",
    url: "https://oig.cepal.org/sites/default/files/2018_ley33_18_rdo.pdf",
  },
  ley1519: {
    label: "Ley 15-19 — Régimen Electoral (antecedente)",
    url: "https://www.consultoria.gov.do/",
  },
  ley2023: {
    label: "Ley 20-23 — Régimen Electoral vigente",
    url: "https://jce.gob.do/",
  },
  ley1326: {
    label: "Ley 13-26 — elimina candidaturas independientes (Listín Diario)",
    url: "https://listindiario.com/la-republica/politica/20260623/marzo-2026-candidaturas-independientes-desaparecieron-legislacion-dominicana_910968.html",
  },
  elDia1326: {
    label: "El Día — promulgación Ley 13-26",
    url: "https://eldia.com.do/presidente-abinader-promulga-ley-13-26-que-suprime-candidaturas-independientes-del-sistema-electoral/",
  },
  jce: {
    label: "Junta Central Electoral",
    url: "https://jce.gob.do/",
  },
  jceRes012026: {
    label: "JCE — Resolución 01-2026 / distribución RD$1,620 MM (vía Diario Libre)",
    url: "https://www.diariolibre.com/politica/partidos/2026/01/23/la-jce-distribuye-rd1620-millones-entre-partidos-politicos/3414204",
  },
  jceMontos2026: {
    label: "JCE 2026 — montos por tramo (vía Proceso)",
    url: "https://proceso.com.do/2026/01/23/junta-central-electoral-distribuira-rd1620-millones-del-estado-entre-partidos-politicos-este-2026/",
  },
  diarioLibreDetalle: {
    label: "Diario Libre — reforma distribución 2026 (RD$3.9 MM minoritarios)",
    url: "https://www.diariolibre.com/politica/jce/2026/01/25/conoce-reforma-de-financiamiento-publico-a-partidos-en-2026/3415128",
  },
  elDia17617: {
    label: "El Día — RD$17,617.9 MM a partidos (2016–2026)",
    url: "https://eldia.com.do/democracia-muy-cara-partidos-recibieron-rd17-mil-millones-en-los-ultimos-diez-anos/",
  },
  diarioLibre2024: {
    label: "Diario Libre — financiamiento 2024 RD$5,041.6 MM",
    url: "https://www.diariolibre.com/politica/partidos/2024/12/13/el-financiamiento-publico-a-los-partidos-subio-en-2024-y-subira-en-202/2938620",
  },
  senado3318: {
    label: "Senado RD — modificación Ley 33-18 (debida diligencia / compliance)",
    url: "https://www.senadord.gob.do/modificacion-a-ley-de-partidos-agrupaciones-y-movimientos-politicos-ayudara-a-prevenir-infiltracion-de-recursos-ilicitos-en-la-politica/",
  },
  listinFirmas: {
    label: "Listín Diario — ~2% de votos válidos en firmas (Art. 15 Ley 33-18)",
    url: "https://listindiario.com/la-republica/politica/20260831/90-mil-firmas-inscribir-partido-jce_920275.html",
  },
  tse0010: {
    label: "TSE/0010/2025 — criterio de última elección (vía Diario Libre)",
    url: "https://www.diariolibre.com/politica/partidos/2026/01/23/la-jce-distribuye-rd1620-millones-entre-partidos-politicos/3414204",
  },
  nDigitalPequenos: {
    label: "N Digital — partidos pequeños decisivos en 6 de 7 gobiernos",
    url: "https://n.com.do/2023/06/02/partidos-pequenos-la-clave-para-construir-mayoria-y-determinantes-para-6-de-7-gobiernos/",
  },
  elNacional50: {
    label: "El Nacional — 50%+1 y segunda vuelta (reforma 1994)",
    url: "https://elnacional.com.do/politica/tres-decadas-50-reforma-transformo-sistema-electoral-dominicano_574671.html",
  },
  acentoAlianzas: {
    label: "Acento — alianzas y doble vuelta (Ley 20-23)",
    url: "https://acento.com.do/opinion/alianzas-y-doble-vuelta-9256107.html",
  },
  constitucion212: {
    label: "Constitución RD — Art. 212 (composición y elección de la JCE · Justia)",
    url: "https://republica-dominicana.justia.com/nacionales/constitucion-de-la-republica-dominicana/titulo-x/capitulo-ii/seccion-i/articulo-212/",
  },
  constitucion80: {
    label: "Constitución RD — Art. 80.4 (Senado elige a la JCE · PDF SGN)",
    url: "https://sgn.gob.do/transparencia/images/docs/base_legal/constitucion_politica.pdf",
  },
  elDiaJceRequisitos: {
    label: "El Día — requisitos constitucionales y legales para miembros de la JCE",
    url: "https://eldia.com.do/cuales-requisitos-establecen-la-constitucion-y-las-leyes-para-ser-miembro-de-la-jce/",
  },
  jceSuspende2020: {
    label: "JCE — suspensión de las elecciones municipales (16 feb 2020)",
    url: "https://jce.gob.do/Noticias/pleno-jce-suspende-proceso-de-elecciones-municipales-en-todo-el-pais",
  },
  diarioLibreReacciones2020: {
    label: "Diario Libre — reacciones a la suspensión de 2020 (Abinader / PLD)",
    url: "https://www.diariolibre.com/actualidad/politica/las-reacciones-a-decision-de-jce-de-suspender-elecciones-IG17115159",
  },
  elNacionalAbinader2020: {
    label: "El Nacional — Abinader: JCE fracasó; rechazo a suspensión parcial",
    url: "https://elnacional.com.do/abinader-afirma-jce-fracaso-y-lleva-pais-a-crisis-institucional/",
  },
  jceEdet2024: {
    label: "JCE — clonado de equipos EDET (escaneo, digitalización, impresión y transmisión)",
    url: "https://jce.gob.do/Noticias/jce-inicia-proceso-de-clonado-de-los-equipos-edet-que-se-usaran-en-las-elecciones-municipales",
  },
  cdnEdetRed: {
    label: "Noticentro — JCE dispone laptops/multifuncionales EDET (digitalización, escaneo y transmisión)",
    url: "https://noticentro.com.do/jce-dispone-uso-laptops-y-multifuncionales-para-digitalizacion-escaneo-y-transmision-de-resultados-elecciones-2024/",
  },
  diarioLibreEdet: {
    label: "Diario Libre — clonación de equipos EDET para municipales 2024",
    url: "https://www.diariolibre.com/actualidad/politica/2024/01/29/arranca-clonacion-de-equipos-que-se-usaran-en-elecciones-municipales/2591074",
  },
  jceEscrutinio2020: {
    label: "JCE — Resoluciones sobre observación y grabación del escrutinio (julio 2020)",
    url: "https://jce.gob.do/Noticias/pleno-jce-aprueba-resoluciones-sobre-observacion-y-grabacion-de-fase-de-escrutinio-en-elecciones-de-julio",
  },
  jceComputo2020: {
    label: "JCE — procedimiento de cómputo julio 2020 (copias a delegados / escaneo)",
    url: "https://jce.gob.do/Noticias/pleno-jce-aprueba-procedimiento-de-computo-electoral-de-elecciones-del-5-de-julio",
  },
  nDigitalAbstencion: {
    label: "El Nuevo Diario — JCE: abstención municipal 2024 = 53.33% (datos preliminares)",
    url: "https://elnuevodiario.com.do/abstencion-en-elecciones-fue-del-53-33-de-acuerdo-a-datos-preliminares-de-la-jce/",
  },
  noticiasSinAbstencion: {
    label: "Noticias SIN — abstención récord 53.33% (datos preliminares JCE)",
    url: "https://noticiassin.com/elecciones-municipales-registran-abstencion-record-de-53-33-a-nivel-general/",
  },
  alMomentoTsa: {
    label: "AlMomento — TSA fija audiencia de amparo El Faro Latino vs JCE (gastos exterior 2024)",
    url: "https://almomento.net/el-faro-latino-lleva-a-jce-ante-el-tsa-rd-por-falta-transparencia/",
  },
  elFaroOpacidad: {
    label: "El Faro Latino — entrega parcial sobre fondos del voto exterior 2024",
    url: "https://elfarolatino.com/jce-interfiere-y-distrae-investigacion-sobre-fondos-elecciones-en-el-exterior-2024/",
  },
  jceInformeExterior: {
    label: "JCE — informe investigación voto exterior 2020; desvinculaciones",
    url: "https://jce.gob.do/Noticias/pleno-de-la-jce-aprueba-informe-presentado-sobre-investigacion-del-voto-dominicano-en-el-exterior-dispone-desvinculacion-de-varios-funcionarios",
  },
  precisionExterior: {
    label: "Precision — JCE: manejo inadecuado de US$4,083,762.64 en OPREE/OCLEE (2020)",
    url: "https://precision.com.do/jce-aprueba-informe-de-investigacion-del-voto-en-el-exterior-y-bota-a-varios-funcionarios/",
  },
};

/** @type {Array<object>} */
export const PARTIDOS_NODES = [
  CUPULA_NODE,
  // —— Hub ——
  {
    id: "i-jce",
    name: "JCE",
    kind: "estado",
    role: "Junta Central Electoral · árbitro",
    summary:
      "Órgano constitucional que organiza y certifica elecciones, reconoce partidos y reparte la contribución estatal. Sus miembros los elige el Senado. También distribuye RD$1,620 MM (Resolución 01-2026).",
    mechanism:
      "El Senado elige al árbitro. El árbitro organiza y certifica las elecciones — y reparte el dinero de los partidos. No es un detalle administrativo: es la cadena de poder electoral.",
    weight: 100,
    amount: 1_620_000_000,
    source: SRC.constitucion212,
    themes: ["partidos"],
  },


  // —— Cadena del árbitro: Senado → JCE → elecciones ——
  {
    id: "i-senado",
    name: "Senado",
    kind: "estado",
    role: "Cámara Alta · elige a la JCE",
    summary:
      "Art. 80.4 de la Constitución: el Senado elige a los miembros de la Junta Central Electoral y a sus suplentes, con el voto de las dos terceras partes de los presentes.",
    mechanism:
      "Quien manda en el Senado manda en quién arbitra las elecciones. No es un rumor: está en el texto constitucional.",
    weight: 92,
    source: SRC.constitucion80,
    themes: ["partidos"],
  },
  {
    id: "c-eleccion-jce",
    name: "Elección de la JCE",
    kind: "estado",
    role: "Presidente + 4 titulares + suplentes · 2/3 del Senado",
    summary:
      "Art. 212: la JCE se integra por un presidente y cuatro miembros, con sus suplentes, elegidos por cuatro años por el Senado con dos terceras partes de los senadores presentes. El Día resume los mismos requisitos constitucionales.",
    mechanism:
      "Cinco titulares (incluido el presidente) y sus suplentes. No son nueve puestos sueltos: son un pleno de cinco con banco de suplentes, todos salidos del Senado.",
    weight: 88,
    source: SRC.constitucion212,
    themes: ["partidos"],
  },
  {
    id: "c-elecciones",
    name: "Elecciones",
    kind: "estado",
    role: "Lo que la JCE organiza y certifica",
    summary:
      "Art. 212: la finalidad principal de la JCE es organizar y dirigir las asambleas electorales. También certifica resultados y reconoce a los partidos que compiten.",
    mechanism:
      "Senado → elige → JCE → organiza y certifica → elecciones. Esa es la cadena.",
    weight: 90,
    source: SRC.constitucion212,
    themes: ["partidos"],
  },

  // —— Crisis 2020 y lo que vino después ——
  {
    id: "c-colapso-2020",
    name: "Colapso municipal 2020",
    kind: "estado",
    role: "Suspensión total · 16 feb 2020",
    summary:
      "El 16 de febrero de 2020 la JCE suspendió las elecciones municipales en todo el país tras fallas en boletas del voto automatizado (boletas incompletas en más de la mitad de los colegios automatizados).",
    mechanism:
      "El árbitro detuvo el partido a mitad de juego. La causa oficial: error técnico en el sistema automatizado.",
    weight: 86,
    source: SRC.jceSuspende2020,
    themes: ["partidos"],
  },
  {
    id: "c-posiciones-2020",
    name: "Abinader / PLD · 2020",
    kind: "partido",
    role: "Posiciones documentadas en la crisis",
    summary:
      "Abinader (entonces candidato) rechazó suspender solo los centros automatizados y exigió respuesta total; calificó el episodio de fracaso institucional. El PLD, en el gobierno, planteó que no debió suspenderse todo el territorio y habló de sabotaje (Diario Libre / El Nacional).",
    mechanism:
      "Misma crisis, dos lecturas de poder. Lo verificable es qué pidió cada bando — no una teoría de conspiración.",
    weight: 70,
    source: SRC.diarioLibreReacciones2020,
    themes: ["partidos"],
  },
  {
    id: "c-transparencia-post-2020",
    name: "Controles post-2020",
    kind: "estado",
    role: "Escrutinio visible · copias de actas · menos automatización del voto",
    summary:
      "Tras la crisis, la JCE aprobó resoluciones que reforzaron observación y grabación del escrutinio, entrega de copias de relaciones de votación a delegados, y escaneo/transmisión de actas. El voto volvió a ser manual; la tecnología quedó para transmitir resultados (EDET).",
    mechanism:
      "La respuesta institucional no fue “confía en la máquina”. Fue: que se vea el conteo y que cada partido se lleve su copia.",
    weight: 74,
    source: SRC.jceEscrutinio2020,
    themes: ["partidos"],
  },

  // —— Opacidad financiera (exterior) ——
  {
    id: "c-opacidad-exterior",
    name: "Opacidad · voto exterior",
    kind: "estado",
    role: "Gastos 2024 · amparo en el TSA",
    summary:
      "El Faro Latino documentó prórrogas y entregas parciales de la JCE ante pedidos de información (Portal SAIP) sobre el presupuesto y gastos del voto en el exterior 2024. El caso llegó al Tribunal Superior Administrativo en recurso de amparo (AlMomento).",
    mechanism:
      "El árbitro organiza el voto afuera. Cuando piden la factura completa, entrega a medias — y el conflicto termina en el TSA.",
    weight: 82,
    source: SRC.alMomentoTsa,
    themes: ["partidos"],
  },
  {
    id: "c-irregularidades-exterior-2020",
    name: "Exterior 2020 · US$4.08 MM",
    kind: "financiador",
    role: "Manejo inadecuado (informe JCE)",
    summary:
      "El propio informe de investigación de la JCE sobre el voto exterior 2020 determinó manejo inadecuado de fondos por US$4,083,762.64 en OPREE/OCLEE de la Circunscripción 1 y dispuso desvinculaciones (Precision / comunicado JCE). No es una condena penal: es el hallazgo administrativo del órgano.",
    mechanism:
      "Antes de la pelea de 2024 por documentos, ya había un expediente interno de plata mal llevada en el exterior.",
    weight: 80,
    source: SRC.precisionExterior,
    themes: ["partidos"],
  },

  // —— Abstención ——
  {
    id: "c-abstencion-2024",
    name: "Abstención municipal 2024",
    kind: "estado",
    role: "53.33% · dato preliminar JCE",
    summary:
      "En las municipales del 18 de febrero de 2024 la JCE reportó participación del 46.67% del padrón: abstención del 53.33% (N Digital / Noticias SIN sobre datos preliminares de la JCE). Varios medios la describieron como la más alta del ciclo municipal reciente.",
    mechanism:
      "Más de la mitad no fue a votar. El árbitro certifica el resultado; la urna vacía también habla.",
    weight: 78,
    source: SRC.nDigitalAbstencion,
    themes: ["partidos"],
  },

  // —— Lo que sí existe: verificación ——
  {
    id: "c-sistema-edet",
    name: "Sistema EDET",
    kind: "estado",
    role: "Escaneo · digitación · impresión · transmisión",
    summary:
      "Equipos EDET de la JCE: escanean, digitalizan, imprimen y transmiten actas desde los colegios electorales. El escrutinio es manual (Resolución 28-2023); después se digita/imprime el acta, se firma y se transmite. La JCE dispuso laptops y multifuncionales para ese flujo en 2024 (Noticentro / Diario Libre).",
    mechanism:
      "No es voto electrónico. Es conteo a mano + digitalización y transmisión del acta.",
    weight: 76,
    source: SRC.jceEdet2024,
    themes: ["partidos"],
  },

  // —— Tres grandes ——
  {
    id: "p-prm",
    name: "PRM",
    kind: "partido",
    role: "Partido Revolucionario Moderno · +5%",
    summary:
      "Uno de los tres partidos con más del 5% de los votos válidos. En 2026 recibe RD$432 millones de contribución estatal (Resolución 01-2026).",
    amount: 432_000_000,
    weight: 96,
    source: SRC.jceMontos2026,
    themes: ["partidos"],
  },
  {
    id: "p-fp",
    name: "FP",
    kind: "partido",
    role: "Fuerza del Pueblo · +5%",
    summary:
      "Uno de los tres partidos con más del 5% de los votos válidos. En 2026 recibe RD$432 millones de contribución estatal (Resolución 01-2026).",
    amount: 432_000_000,
    weight: 94,
    source: SRC.jceMontos2026,
    themes: ["partidos"],
  },
  {
    id: "p-pld",
    name: "PLD",
    kind: "partido",
    role: "Partido de la Liberación Dominicana · +5%",
    summary:
      "Uno de los tres partidos con más del 5% de los votos válidos. En 2026 recibe RD$432 millones de contribución estatal (Resolución 01-2026).",
    amount: 432_000_000,
    weight: 94,
    source: SRC.jceMontos2026,
    themes: ["partidos"],
  },

  // —— Tramos ——
  {
    id: "p-medianos",
    name: "Partidos 1–5%",
    kind: "partido",
    role: "Tramo intermedio · 12% del fondo",
    summary:
      "Cinco partidos con entre 1% y menos del 5% de los votos. Se reparte el 12% del fondo (RD$194.4 MM): ~RD$38.88 MM cada uno en 2026 (PRD, PRSC, DxC, País Posible, BIS, según prensa sobre la Resolución 01-2026).",
    amount: 38_880_000,
    weight: 72,
    source: SRC.jceMontos2026,
    themes: ["partidos"],
  },
  {
    id: "p-nuevos",
    name: "Partidos nuevos / <1%",
    kind: "partido",
    role: "Tramo minoritario · 8% del fondo",
    summary:
      "Organizaciones con menos del 1% de votos, recién reconocidas o que conservan personería. En 2026 la mayoría recibe ~RD$3,927,272.73 del 8% del fondo (Resolución 01-2026 / prensa).",
    amount: 3_927_273,
    weight: 58,
    source: SRC.diarioLibreDetalle,
    themes: ["partidos"],
  },

  // —— Mecanismo / dinero ——
  {
    id: "c-financiamiento",
    name: "Financiamiento público",
    kind: "financiador",
    role: "Contribución económica del Estado",
    summary:
      "Presupuesto 2026: RD$1,620 millones para 41 organizaciones con personería. Se reparte bajo el Art. 61 de la Ley 33-18 (80 / 12 / 8).",
    amount: 1_620_000_000,
    weight: 90,
    source: SRC.jceRes012026,
    themes: ["partidos"],
  },
  {
    id: "c-requisitos",
    name: "Requisitos de registro",
    kind: "estado",
    role: "Art. 15 Ley 33-18",
    summary:
      "Para ser partido: estatutos, órganos, sede, presupuesto — y firmas equivalentes al 2% de los votos válidos de las últimas elecciones presidenciales. La solicitud debe depositarse al menos 12 meses antes de la próxima elección ordinaria.",
    mechanism: "Puedes entrar al padrón. Eso no te da paridad de armas.",
    weight: 68,
    source: SRC.listinFirmas,
    themes: ["partidos"],
  },
  {
    id: "c-regla-80",
    name: "Regla 80%",
    kind: "financiador",
    role: "+5% de votos → 80% del dinero",
    summary:
      "Ley 33-18 Art. 61.1: el 80% del fondo se reparte en partes iguales entre los partidos con más del 5% de los votos válidos. En 2026: RD$1,296 MM → RD$432 MM para PRM, FP y PLD cada uno.",
    amount: 1_296_000_000,
    weight: 88,
    source: SRC.ley3318,
    themes: ["partidos"],
  },
  {
    id: "c-regla-12",
    name: "Regla 12%",
    kind: "financiador",
    role: "1–5% de votos → 12% del dinero",
    summary:
      "Ley 33-18 Art. 61.2: el 12% del fondo para partidos con más del 1% y menos del 5%. En 2026: RD$194.4 MM entre cinco partidos (~RD$38.88 MM c/u).",
    amount: 194_400_000,
    weight: 70,
    source: SRC.ley3318,
    themes: ["partidos"],
  },
  {
    id: "c-regla-8",
    name: "Regla 8%",
    kind: "financiador",
    role: "<1% de votos → 8% del dinero",
    summary:
      "Ley 33-18 Art. 61.3: el 8% restante entre quienes obtuvieron entre 0.01% y 1% (y, en la práctica post-TSE/0010/2025, organizaciones con personería en ese tramo). En 2026: ~RD$129.6 MM → ~RD$3.9 MM por organización en el grueso del tramo.",
    amount: 129_600_000,
    weight: 66,
    source: SRC.ley3318,
    themes: ["partidos"],
  },
  {
    id: "c-comparacion",
    name: "Grande vs nuevo · ~110×",
    kind: "financiador",
    role: "RD$432 MM vs ~RD$3.9 MM (2026)",
    summary:
      "Un partido del tramo +5% recibe RD$432,000,000. Una organización del tramo minoritario recibe ~RD$3,927,273. Diferencia ≈ RD$428 MM; ratio ≈ 110 veces. Fuentes: Resolución 01-2026 / prensa.",
    amount: 428_000_000,
    weight: 86,
    source: SRC.jceMontos2026,
    themes: ["partidos"],
  },
  {
    id: "c-historico",
    name: "2016–2026 · RD$17,617.9 MM",
    kind: "financiador",
    role: "Década de contribución estatal",
    summary:
      "El Día reporta RD$17,617.9 millones transferidos a partidos reconocidos por la JCE entre 2016 y 2026 (incluye años electorales y no electorales).",
    amount: 17_617_900_000,
    weight: 84,
    source: SRC.elDia17617,
    themes: ["partidos"],
  },
  {
    id: "c-2024",
    name: "Año electoral 2024 · RD$5,041.6 MM",
    kind: "financiador",
    role: "Salto en año de elecciones",
    summary:
      "Diario Libre: el financiamiento público subió a RD$5,041.6 millones en 2024. PRM, PLD y FP recibieron ~RD$1,008 MM cada uno (80% del pastel).",
    amount: 5_041_600_000,
    weight: 80,
    source: SRC.diarioLibre2024,
    themes: ["partidos"],
  },
  {
    id: "c-compliance",
    name: "Debida diligencia / compliance",
    kind: "estado",
    role: "Reforma Ley 33-18 (Senado 2026)",
    summary:
      "En 2026 el Senado aprobó modificar la Ley 33-18 para exigir debida diligencia y programas de cumplimiento frente a lavado, terrorismo, corrupción y crimen organizado. Cumplir cuesta abogados y sistemas; los grandes los tienen.",
    mechanism: "Más reglas no igualan el campo si solo tres partidos tienen el 80% del dinero.",
    weight: 64,
    source: SRC.senado3318,
    themes: ["partidos"],
  },

  // —— Sin independientes ——
  {
    id: "l-13-26",
    name: "Ley 13-26",
    kind: "estado",
    role: "Elimina candidaturas independientes",
    summary:
      "Promulgada el 26 de marzo de 2026. Derogó los arts. 156–158 de la Ley 20-23. Desde entonces, para aspirar a cualquier cargo electivo hay que pasar por un partido, agrupación o movimiento político.",
    mechanism: "Sin partido no hay boleta. El ciudadano no elige personas sueltas: elige dentro del club.",
    weight: 90,
    source: SRC.ley1326,
    themes: ["partidos"],
  },
  {
    id: "c-sin-independientes",
    name: "Sin independientes",
    kind: "estado",
    role: "La puerta cerrada al ciudadano suelto",
    summary:
      "Desde marzo 2026 las candidaturas independientes desaparecieron del marco legal (Ley 13-26 / Listín Diario). Presidencia, Senado, Diputados, alcaldías: solo a través de organizaciones políticas reconocidas.",
    mechanism: "Te venden democracia de personas. La ley te obliga a pasar por un partido.",
    weight: 88,
    source: SRC.ley1326,
    themes: ["partidos"],
  },

  // —— El juego: negociar, no ganar ——
  {
    id: "c-50-mas-uno",
    name: "50% + 1 · segunda vuelta",
    kind: "estado",
    role: "Regla que hace necesarias las alianzas",
    summary:
      "Desde la reforma de 1994, ganar la presidencia en primera vuelta exige más del 50% de los votos válidos. Si nadie lo alcanza, hay segunda vuelta entre los dos más votados. Eso convierte a los bloques pequeños en piezas útiles.",
    mechanism: "Sin mayoría absoluta, el grande necesita votos ajenos.",
    weight: 78,
    source: SRC.elNacional50,
    themes: ["partidos"],
  },
  {
    id: "c-negociacion",
    name: "Negociación / alianza",
    kind: "partido",
    role: "El valor real del partido chico",
    summary:
      "La Ley 20-23 reconoce alianzas y coaliciones entre partidos. En la práctica dominicana, los partidos pequeños han sido decisivos para armar mayoría: N Digital documenta que fueron determinantes en 6 de 7 gobiernos desde el 50%+1.",
    mechanism:
      "El chico no juega para ser presidente. Juega para vender su bloque de votos al grande que necesita ganar.",
    weight: 88,
    source: SRC.nDigitalPequenos,
    themes: ["partidos"],
  },
  {
    id: "c-precio",
    name: "El precio de la alianza",
    kind: "partido",
    role: "Qué cobra el que no puede ganar",
    summary:
      "Cuando un grande necesita el bloque, el chico cobra: candidaturas cedidas, cargos en el gobierno, control de un presupuesto o acceso al poder. La ley permite alianzas y reserva de candidaturas; el resto se negocia fuera del discurso de “cambio”.",
    mechanism:
      "Cuando el grande gana, el chico cobra. Negociar es entrar al mismo sistema.",
    weight: 84,
    source: SRC.acentoAlianzas,
    themes: ["partidos"],
  },

  // —— Marco legal ——
  {
    id: "l-33-18",
    name: "Ley 33-18",
    kind: "estado",
    role: "Ley de partidos",
    summary:
      "Regula reconocimiento, organización y financiamiento público de partidos, agrupaciones y movimientos. Art. 61 fija la distribución 80 / 12 / 8.",
    mechanism: "La inequidad no es un accidente: está escrita en la ley.",
    weight: 82,
    source: SRC.ley3318,
    themes: ["partidos"],
  },
  {
    id: "l-15-19",
    name: "Ley 15-19",
    kind: "estado",
    role: "Régimen electoral (antecedente)",
    summary:
      "Ley de Régimen Electoral de 2019. Fue el marco electoral previo; el régimen vigente es la Ley 20-23. Sigue siendo referencia del diseño institucional que rodea a la JCE y a los partidos.",
    weight: 55,
    source: SRC.ley1519,
    themes: ["partidos"],
  },
  {
    id: "l-20-23",
    name: "Ley 20-23",
    kind: "estado",
    role: "Régimen electoral vigente",
    summary:
      "Ley del Régimen Electoral vigente. Complementa la Ley 33-18 en el ciclo electoral; la JCE aplica ambas en reconocimiento, campañas y control.",
    weight: 60,
    source: SRC.ley2023,
    themes: ["partidos"],
  },
  {
    id: "i-tse",
    name: "TSE",
    kind: "estado",
    role: "Tribunal Superior Electoral",
    summary:
      "Sentencia TSE/0010/2025 ordenó reinterpretar “última elección” como ciclo electoral completo. Eso movió partidos entre tramos del 12% y del 8% en 2025–2026.",
    weight: 62,
    source: SRC.tse0010,
    themes: ["partidos"],
  },
];

/** @type {Array<object>} */
export const PARTIDOS_EDGES = [
  {
    source: "i-jce",
    target: "c-requisitos",
    type: "exige",
    note: "Art. 15 Ley 33-18 · firmas, estatutos, plazos",
    sourceRef: SRC.listinFirmas,
  },
  {
    source: "c-requisitos",
    target: "p-nuevos",
    type: "habilita",
    note: "Registro ≠ paridad de recursos",
    sourceRef: SRC.ley3318,
  },
  {
    source: "i-jce",
    target: "l-33-18",
    type: "aplica",
    note: "Marco de partidos y financiamiento",
    sourceRef: SRC.ley3318,
  },
  {
    source: "i-jce",
    target: "l-15-19",
    type: "marco_historico",
    note: "Régimen electoral 2019 (antecedente)",
    sourceRef: SRC.ley1519,
  },
  {
    source: "i-jce",
    target: "l-20-23",
    type: "aplica",
    note: "Régimen electoral vigente",
    sourceRef: SRC.ley2023,
  },
  {
    source: "l-13-26",
    target: "l-20-23",
    type: "modifica",
    note: "Deroga arts. 156–158 · sin independientes",
    sourceRef: SRC.ley1326,
  },
  {
    source: "l-13-26",
    target: "c-sin-independientes",
    type: "ordena",
    note: "Solo partidos, agrupaciones y movimientos",
    sourceRef: SRC.elDia1326,
  },
  {
    source: "c-sin-independientes",
    target: "p-prm",
    type: "obliga_pasar_por",
    note: "Sin partido no hay candidatura",
    sourceRef: SRC.ley1326,
  },
  {
    source: "c-sin-independientes",
    target: "p-nuevos",
    type: "obliga_pasar_por",
    note: "La única vía sigue siendo una organización política",
    sourceRef: SRC.ley1326,
  },
  {
    source: "i-jce",
    target: "c-sin-independientes",
    type: "aplica",
    note: "Reconoce organizaciones · no personas sueltas",
    sourceRef: SRC.ley1326,
  },
  {
    source: "l-33-18",
    target: "c-financiamiento",
    type: "ordena",
    note: "Art. 61 · distribución del fondo público",
    sourceRef: SRC.ley3318,
  },
  {
    source: "i-jce",
    target: "c-financiamiento",
    type: "distribuye",
    note: "Resolución 01-2026 · RD$1,620 MM",
    amount: 1_620_000_000,
    sourceRef: SRC.jceRes012026,
  },
  {
    source: "c-financiamiento",
    target: "c-regla-80",
    type: "tramo",
    note: "80% del fondo",
    amount: 1_296_000_000,
    sourceRef: SRC.ley3318,
  },
  {
    source: "c-financiamiento",
    target: "c-regla-12",
    type: "tramo",
    note: "12% del fondo",
    amount: 194_400_000,
    sourceRef: SRC.ley3318,
  },
  {
    source: "c-financiamiento",
    target: "c-regla-8",
    type: "tramo",
    note: "8% del fondo",
    amount: 129_600_000,
    sourceRef: SRC.ley3318,
  },
  {
    source: "c-regla-80",
    target: "p-prm",
    type: "asigna",
    note: "RD$432 MM (2026)",
    amount: 432_000_000,
    sourceRef: SRC.jceMontos2026,
  },
  {
    source: "c-regla-80",
    target: "p-fp",
    type: "asigna",
    note: "RD$432 MM (2026)",
    amount: 432_000_000,
    sourceRef: SRC.jceMontos2026,
  },
  {
    source: "c-regla-80",
    target: "p-pld",
    type: "asigna",
    note: "RD$432 MM (2026)",
    amount: 432_000_000,
    sourceRef: SRC.jceMontos2026,
  },
  {
    source: "c-regla-12",
    target: "p-medianos",
    type: "asigna",
    note: "~RD$38.88 MM c/u (2026)",
    amount: 38_880_000,
    sourceRef: SRC.jceMontos2026,
  },
  {
    source: "c-regla-8",
    target: "p-nuevos",
    type: "asigna",
    note: "~RD$3,927,273 (2026)",
    amount: 3_927_273,
    sourceRef: SRC.diarioLibreDetalle,
  },
  {
    source: "p-prm",
    target: "c-comparacion",
    type: "contrasta",
    note: "RD$432 MM vs ~RD$3.9 MM ≈ 110×",
    sourceRef: SRC.jceMontos2026,
  },
  {
    source: "p-nuevos",
    target: "c-comparacion",
    type: "contrasta",
    note: "Misma boleta, otro presupuesto",
    sourceRef: SRC.diarioLibreDetalle,
  },
  {
    source: "i-jce",
    target: "c-historico",
    type: "acumula",
    note: "RD$17,617.9 MM (2016–2026)",
    amount: 17_617_900_000,
    sourceRef: SRC.elDia17617,
  },
  {
    source: "c-historico",
    target: "p-prm",
    type: "incluye",
    sourceRef: SRC.elDia17617,
  },
  {
    source: "c-historico",
    target: "p-fp",
    type: "incluye",
    sourceRef: SRC.elDia17617,
  },
  {
    source: "c-historico",
    target: "p-pld",
    type: "incluye",
    sourceRef: SRC.elDia17617,
  },
  {
    source: "i-jce",
    target: "c-2024",
    type: "distribuye",
    note: "Año electoral · RD$5,041.6 MM",
    amount: 5_041_600_000,
    sourceRef: SRC.diarioLibre2024,
  },
  {
    source: "l-33-18",
    target: "c-compliance",
    type: "reforma",
    note: "Debida diligencia aprobada en Senado (2026)",
    sourceRef: SRC.senado3318,
  },
  {
    source: "c-compliance",
    target: "p-prm",
    type: "carga_regulatoria",
    note: "Capacidad legal asimétrica",
    sourceRef: SRC.senado3318,
  },
  {
    source: "c-compliance",
    target: "p-nuevos",
    type: "carga_regulatoria",
    note: "Misma norma, menos recursos",
    sourceRef: SRC.senado3318,
  },
  {
    source: "i-tse",
    target: "c-financiamiento",
    type: "reinterpreta",
    note: "TSE/0010/2025 · ciclo electoral completo",
    sourceRef: SRC.tse0010,
  },
  {
    source: "i-jce",
    target: "p-prm",
    type: "reconoce",
    sourceRef: SRC.jce,
  },
  {
    source: "i-jce",
    target: "p-fp",
    type: "reconoce",
    sourceRef: SRC.jce,
  },
  {
    source: "i-jce",
    target: "p-pld",
    type: "reconoce",
    sourceRef: SRC.jce,
  },
  {
    source: "i-jce",
    target: "p-nuevos",
    type: "reconoce",
    sourceRef: SRC.jce,
  },
  {
    source: "i-jce",
    target: "p-medianos",
    type: "reconoce",
    sourceRef: SRC.jce,
  },

  // —— El juego: negociar ——
  {
    source: "l-20-23",
    target: "c-50-mas-uno",
    type: "marco_legal",
    note: "50%+1 · segunda vuelta si nadie alcanza mayoría",
    sourceRef: SRC.elNacional50,
  },
  {
    source: "c-50-mas-uno",
    target: "c-negociacion",
    type: "hace_necesaria",
    note: "Sin mayoría absoluta, el grande busca aliados",
    sourceRef: SRC.nDigitalPequenos,
  },
  {
    source: "p-nuevos",
    target: "c-negociacion",
    type: "ofrece",
    note: "Bloque de votos · no candidatura real a ganar",
    sourceRef: SRC.nDigitalPequenos,
  },
  {
    source: "c-negociacion",
    target: "p-prm",
    type: "aliado_potencial",
    note: "Votos a cambio de espacio en el poder",
    sourceRef: SRC.nDigitalPequenos,
  },
  {
    source: "c-negociacion",
    target: "p-fp",
    type: "aliado_potencial",
    note: "Votos a cambio de espacio en el poder",
    sourceRef: SRC.nDigitalPequenos,
  },
  {
    source: "c-negociacion",
    target: "p-pld",
    type: "aliado_potencial",
    note: "Votos a cambio de espacio en el poder",
    sourceRef: SRC.nDigitalPequenos,
  },
  {
    source: "c-negociacion",
    target: "c-precio",
    type: "cobra",
    note: "Cargos, candidaturas, presupuesto, acceso",
    sourceRef: SRC.acentoAlianzas,
  },
  {
    source: "c-precio",
    target: "p-nuevos",
    type: "integra",
    note: "Cuando cobra, entra al mismo sistema",
    sourceRef: SRC.nDigitalPequenos,
  },
  {
    source: "c-precio",
    target: "c-la-cupula",
    type: "atraviesa",
    note: "Las casas del mapa también operan sobre el tablero político",
    sourceRef: SRC.acentoAlianzas,
  },

  // —— Cadena del árbitro ——
  {
    source: "i-senado",
    target: "c-eleccion-jce",
    type: "elige",
    note: "Art. 80.4 / 212 · dos terceras partes de los presentes",
    sourceRef: SRC.constitucion80,
  },
  {
    source: "c-eleccion-jce",
    target: "i-jce",
    type: "integra",
    note: "Presidente + 4 miembros + suplentes · 4 años",
    sourceRef: SRC.constitucion212,
  },
  {
    source: "i-senado",
    target: "i-jce",
    type: "elige",
    note: "El Senado nombra al árbitro electoral",
    sourceRef: SRC.constitucion212,
  },
  {
    source: "i-jce",
    target: "c-elecciones",
    type: "organiza",
    note: "Art. 212 · organiza y dirige las asambleas electorales",
    sourceRef: SRC.constitucion212,
  },
  {
    source: "i-jce",
    target: "c-elecciones",
    type: "certifica",
    note: "Certifica resultados y reconoce competidores",
    sourceRef: SRC.constitucion212,
  },
  {
    source: "l-15-19",
    target: "c-eleccion-jce",
    type: "marco_historico",
    note: "Ley 15-19 · régimen electoral que rodea a la JCE",
    sourceRef: SRC.ley1519,
  },

  // —— 2020 ——
  {
    source: "i-jce",
    target: "c-colapso-2020",
    type: "suspendio",
    note: "16 feb 2020 · fallo de boletas automatizadas",
    sourceRef: SRC.jceSuspende2020,
  },
  {
    source: "c-colapso-2020",
    target: "c-elecciones",
    type: "interrompio",
    note: "Suspensión total del proceso municipal",
    sourceRef: SRC.jceSuspende2020,
  },
  {
    source: "c-colapso-2020",
    target: "c-posiciones-2020",
    type: "provoco",
    note: "Abinader: suspensión total · PLD: no generalizar",
    sourceRef: SRC.diarioLibreReacciones2020,
  },
  {
    source: "c-posiciones-2020",
    target: "p-prm",
    type: "posicion_de",
    note: "Abinader / PRM en la crisis",
    sourceRef: SRC.elNacionalAbinader2020,
  },
  {
    source: "c-posiciones-2020",
    target: "p-pld",
    type: "posicion_de",
    note: "PLD en el gobierno · continuidad parcial",
    sourceRef: SRC.diarioLibreReacciones2020,
  },
  {
    source: "c-colapso-2020",
    target: "c-transparencia-post-2020",
    type: "derivo_en",
    note: "Más control visual del escrutinio y copias de actas",
    sourceRef: SRC.jceEscrutinio2020,
  },
  {
    source: "c-transparencia-post-2020",
    target: "c-sistema-edet",
    type: "refuerza",
    note: "Voto manual + transmisión verificable de actas",
    sourceRef: SRC.jceComputo2020,
  },

  // —— Opacidad / exterior ——
  {
    source: "i-jce",
    target: "c-opacidad-exterior",
    type: "retiene",
    note: "Prórrogas y documentos parciales · amparo TSA",
    sourceRef: SRC.alMomentoTsa,
  },
  {
    source: "c-opacidad-exterior",
    target: "c-irregularidades-exterior-2020",
    type: "recuerda",
    note: "Antecedente 2020 · US$4.08 MM mal manejados (informe JCE)",
    sourceRef: SRC.precisionExterior,
  },
  {
    source: "i-jce",
    target: "c-irregularidades-exterior-2020",
    type: "investigo",
    note: "Informe propio · desvinculaciones",
    sourceRef: SRC.jceInformeExterior,
  },

  // —— Abstención y verificación ——
  {
    source: "c-elecciones",
    target: "c-abstencion-2024",
    type: "registro",
    note: "Municipales 2024 · 53.33% de abstención",
    sourceRef: SRC.nDigitalAbstencion,
  },
  {
    source: "i-jce",
    target: "c-abstencion-2024",
    type: "reporta",
    note: "Dato preliminar del órgano electoral",
    sourceRef: SRC.noticiasSinAbstencion,
  },
  {
    source: "i-jce",
    target: "c-sistema-edet",
    type: "opera",
    note: "Escaneo, digitación, impresión y transmisión de actas",
    sourceRef: SRC.jceEdet2024,
  },
  {
    source: "c-sistema-edet",
    target: "c-elecciones",
    type: "verifica",
    note: "Digitalización, escaneo y transmisión de actas firmadas",
    sourceRef: SRC.cdnEdetRed,
  },
];
