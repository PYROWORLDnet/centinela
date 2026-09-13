/**
 * Modo curado — tema ONU / ONG.
 * Solo hechos con fuente pública. El backlash soberanista se documenta como
 * reacción política publicada, no como veredicto sobre quién tiene razón.
 *
 * Historia: plata → socios → presión normativa → reacción soberanista.
 * La pelea es real; también puede tapar otras cuentas del mapa.
 */

import { CUPULA_NODE } from "./cupula.js";

const SRC = {
  mepydUsaid: {
    label: "MEPyD / Minpre — 24 iniciativas USAID en implementación · US$238.3 MM (feb 2025)",
    url: "https://minpre.gob.do/comunicacion/notas-de-prensa/ministerio-de-economia-registra-24-iniciativas-de-cooperacion-internacional-en-implementacion-con-apoyo-de-usaid/",
  },
  embassyCivil: {
    label: "Embajada EE.UU. — USAID alianza con FINJUS, IDDI y PUCMM (sociedad civil)",
    url: "https://do.usembassy.gov/es/proyecto-de-la-usaid-firma-alianzas-estrategicas-con-instituciones-de-la-sociedad-civil-para-fortalecer-la-seguridad-ciudadana/",
  },
  usafacts: {
    label: "USAFacts — ayuda EE.UU. a RD FY2024 (~US$107.8 MM obligados; USAID ~US$39.2 MM)",
    url: "https://usafacts.org/answers/how-much-foreign-aid-does-the-us-provide/countries/dominican-republic/",
  },
  amnistia2024: {
    label: "Amnistía Internacional — fin a deportaciones racistas (8 oct 2024)",
    url: "https://www.amnesty.org/es/documents/amr27/8597/2024/es/",
  },
  abinaderAmnistia: {
    label: "El Nacional / EFE — Abinader a Amnistía: «Trabajen en Haití» (24 abr 2025)",
    url: "https://elnacional.com.do/nacionales/abinader-a-amnistia-trabajen-en-haiti_527553.html",
  },
  diarioLibreOnu: {
    label: "Diario Libre — Abinader responde críticas ONU por protocolo hospitalario (abr 2025)",
    url: "https://www.diariolibre.com/politica/gobierno/2025/04/28/abinader-responde-a-criticas-de-la-onu-por-protocolo-migratorio/3091542",
  },
  oim2024: {
    label: "OIM DTM — haitianos deportados a Haití en 2024 (RD entre principales expulsores)",
    url: "https://dtm.iom.int/reports/haiti-haitians-deported-haiti-2024",
  },
  pnudOim: {
    label: "PNUD — estrategia fronteriza con OIM (Fondo de Consolidación de la Paz)",
    url: "https://www.undp.org/es/dominican-republic/noticias/pnud-y-oim-impulsan-estrategia-integral-para-empoderamiento-y-desarrollo-sostenible-en-la-zona-fronteriza",
  },
  earthworks: {
    label: "Earthworks — comunidades aguas abajo de Pueblo Viejo",
    url: "https://earthworks.org/blog/surviving-next-to-one-of-the-worlds-largest-gold-mines/",
  },
};

/** @type {Array<object>} */
export const ONG_NODES = [
  CUPULA_NODE,

  {
    id: "c-mecanismo-ong",
    name: "Mecanismo ONU/ONG",
    kind: "estado",
    role: "Plata · socios · presión · backlash",
    summary:
      "No es «buenos vs malos». Es un circuito: donantes ponen plata no reembolsable, implementadores (agencias ONU, ONG locales e internacionales) ejecutan y publican, eso genera presión normativa sobre el Estado, y el Estado responde con relato soberanista. La pelea pública es real; también puede desplazar otras preguntas del mapa.",
    mechanism: "Seguir el dinero y la reacción. Ahí está el mecanismo.",
    weight: 100,
    source: SRC.mepydUsaid,
    themes: ["ong"],
  },
  {
    id: "i-usaid",
    name: "USAID",
    kind: "financiador",
    role: "Donante bilateral · pipeline grande",
    summary:
      "MEPyD (feb 2025): 81 iniciativas históricas con apoyo USAID; 24 en implementación valorizadas en US$238.3 MM no reembolsables (ciclo completo). USAFacts: en FY2024 EE.UU. obligó ~US$107.8 MM de ayuda a RD; USAID ~US$39.2 MM ese año fiscal. No es «la ONU»: es la agencia de desarrollo de EE.UU.",
    mechanism: "Quien financia el proyecto influye en la agenda que se ejecuta y se mide.",
    weight: 96,
    amount: 238_321_910,
    source: SRC.mepydUsaid,
    themes: ["ong"],
  },
  {
    id: "i-mepyd",
    name: "MEPyD",
    kind: "estado",
    role: "Registra · cuenta la cooperación",
    summary:
      "Ministerio de Economía, Planificación y Desarrollo. Publica el inventario SINACID de cooperación. Es la puerta estatal que cuantifica cuánta plata externa entra y con qué socios se ejecuta.",
    mechanism: "Sin registro, la cooperación es niebla. Con registro, se puede mapear.",
    weight: 80,
    source: SRC.mepydUsaid,
    themes: ["ong"],
  },
  {
    id: "i-pnud",
    name: "PNUD",
    kind: "estado",
    role: "Agencia ONU · desarrollo y frontera",
    summary:
      "Programa de las Naciones Unidas para el Desarrollo. Aparece entre los ejecutores de iniciativas apoyadas por USAID (informe MEPyD). Con OIM impulsó proyectos fronterizos con fondos del Peacebuilding Fund. Traduce prioridades globales a programas locales.",
    mechanism: "Canal ONU: convierte marcos internacionales en proyectos sobre el terreno.",
    weight: 86,
    source: SRC.pnudOim,
    themes: ["ong"],
  },
  {
    id: "i-oim",
    name: "OIM",
    kind: "estado",
    role: "Datos migratorios · crítica humanitaria",
    summary:
      "Organización Internacional para las Migraciones. Monitorea retornos a Haití (DTM 2024): RD figura entre los principales expulsores. Documenta perfiles vulnerables. También ejecuta proyectos de cohesión fronteriza con PNUD. Mide el flujo y habla el idioma humanitario.",
    mechanism: "Datos + mandato migratorio = presión blanda sobre la política de deportaciones.",
    weight: 88,
    source: SRC.oim2024,
    themes: ["ong", "migracion"],
  },
  {
    id: "o-amnistia",
    name: "Amnistía Internacional",
    kind: "medio",
    role: "Presión de derechos humanos",
    summary:
      "8 oct 2024: pidió poner fin a las «deportaciones racistas» y a expulsiones colectivas tras el anuncio de hasta 10,000 deportaciones semanales. En 2025 volvió a exigir derogar el protocolo hospitalario ligado a repatriación. No ejecuta el presupuesto USAID local: opera como voz normativa global.",
    mechanism: "Sin chequera bilateral grande: con informe y titular que cuestan políticamente.",
    weight: 90,
    source: SRC.amnistia2024,
    themes: ["ong", "migracion"],
  },
  {
    id: "o-finjus",
    name: "FINJUS",
    kind: "medio",
    role: "ONG local · socia USAID",
    summary:
      "Fundación Institucionalidad y Justicia. Embajada EE.UU.: alianza con USAID (junto a IDDI y PUCMM) para fortalecer sociedad civil y seguridad ciudadana — leyes, políticas y capacidades profesionales. Ejemplo de ONG dominicana en la tubería del donante.",
    mechanism: "Socio local: traduce plata externa en incidencia e institucionalidad.",
    weight: 78,
    source: SRC.embassyCivil,
    themes: ["ong"],
  },
  {
    id: "o-iddi",
    name: "IDDI",
    kind: "medio",
    role: "ONG local · participación comunitaria",
    summary:
      "Instituto Dominicano de Desarrollo Integral. Misma alianza USAID (Embajada EE.UU.): enfoque en participación comunitaria para influir políticas de seguridad ciudadana y prevención de violencia. Otra vena local del mismo pipeline.",
    mechanism: "Base comunitaria + grant = voz con micrófono financiado.",
    weight: 74,
    source: SRC.embassyCivil,
    themes: ["ong"],
  },
  {
    id: "c-flujo-plata",
    name: "Flujo de plata",
    kind: "financiador",
    role: "Donante → implementador → proyecto",
    summary:
      "MEPyD: de las 24 iniciativas USAID en curso, 20 son financieras (~US$237.4 MM) y 4 técnicas. Ejecutores nombrados incluyen Chemonics, ENTRENA, PACT, Counterpart, Winrock, MINERD, PMA, MICM, PNUD y SNS. La plata no llega «a la ONU» en abstracto: llega a contratos y socios concretos.",
    mechanism: "El mapa de implementación es más útil que el eslogan «se meten las ONG».",
    weight: 92,
    amount: 237_396_030,
    source: SRC.mepydUsaid,
    themes: ["ong"],
  },
  {
    id: "c-presion-normativa",
    name: "Presión normativa",
    kind: "estado",
    role: "Informes · titulares · costo político",
    summary:
      "Amnistía, portavoces de la ONU y datos OIM no legislan en el Congreso, pero mueven titulares, diplomacia y reputación. El protocolo hospitalario (abr 2025) y el plan de deportaciones masivas (oct 2024) concentraron esa presión. El Estado lo siente aunque no acate.",
    mechanism: "Presión sin bayoneta: agenda setting + vergüenza pública.",
    weight: 88,
    source: SRC.amnistia2024,
    themes: ["ong"],
  },
  {
    id: "c-backlash-soberania",
    name: "Backlash soberanista",
    kind: "estado",
    role: "Respuesta del Estado · relato nacional",
    summary:
      "Abinader (abr 2025): a Amnistía, «que vayan a trabajar en Haití»; defiende deportaciones «conforme a la ley» frente a críticas de la ONU por el protocolo en hospitales (Diario Libre). Jul 2025: refuerza el choque tras reuniones políticas. Es reacción publicada — no prueba de conspiración, sí de choque político.",
    mechanism: "Cuando la presión sube, el Estado vende soberanía. El electorado escucha.",
    weight: 94,
    source: SRC.abinaderAmnistia,
    themes: ["ong", "migracion"],
  },
  {
    id: "c-cortina-soberania",
    name: "Cortina de soberanía",
    kind: "estado",
    role: "La pelea tapa otras cuentas",
    summary:
      "Mientras el debate público pelea derechos humanos vs «invasión»/soberanía, otras capas del mapa (peaje fronterizo, mano de obra barata, contratos mineros, deuda) siguen. La bronca ONU/ONG es real y documentada; también puede desplazar la pregunta de quién cobra y quién se beneficia.",
    mechanism: "Atención finita. El relato más ruidoso gana el feed.",
    weight: 91,
    source: SRC.abinaderAmnistia,
    themes: ["ong", "migracion"],
  },
  {
    id: "o-earthworks",
    name: "Earthworks",
    kind: "medio",
    role: "ONG · presión socioambiental minera",
    summary:
      "Documenta impactos en comunidades aguas abajo de Pueblo Viejo (polvo, agua, reubicación). Mismo patrón de presión normativa, otro sector: minería. Aquí no hay USAID en el titular — hay advocacy internacional sobre un contrato extractivo.",
    mechanism: "ONG también miran oro y agua, no solo migración.",
    weight: 70,
    source: SRC.earthworks,
    themes: ["ong", "mineria"],
  },
];

/** @type {Array<object>} */
export const ONG_EDGES = [
  {
    source: "i-usaid",
    target: "c-flujo-plata",
    type: "financia",
    note: "US$238.3 MM pipeline · 24 iniciativas",
    amount: 238_321_910,
    sourceRef: SRC.mepydUsaid,
  },
  {
    source: "i-mepyd",
    target: "c-flujo-plata",
    type: "registra",
    note: "SINACID · inventario público",
    sourceRef: SRC.mepydUsaid,
  },
  {
    source: "i-mepyd",
    target: "i-usaid",
    type: "cuenta",
    note: "81 iniciativas históricas · 24 activas",
    sourceRef: SRC.mepydUsaid,
  },
  {
    source: "c-flujo-plata",
    target: "i-pnud",
    type: "ejecuta_via",
    note: "PNUD entre implementadores MEPyD",
    sourceRef: SRC.mepydUsaid,
  },
  {
    source: "c-flujo-plata",
    target: "o-finjus",
    type: "ejecuta_via",
    note: "Alianza sociedad civil USAID",
    sourceRef: SRC.embassyCivil,
  },
  {
    source: "c-flujo-plata",
    target: "o-iddi",
    type: "ejecuta_via",
    note: "Participación comunitaria · grant",
    sourceRef: SRC.embassyCivil,
  },
  {
    source: "i-usaid",
    target: "o-finjus",
    type: "alia",
    note: "Embajada EE.UU. · seguridad ciudadana",
    sourceRef: SRC.embassyCivil,
  },
  {
    source: "i-usaid",
    target: "o-iddi",
    type: "alia",
    note: "Misma alianza civil",
    sourceRef: SRC.embassyCivil,
  },
  {
    source: "i-pnud",
    target: "i-oim",
    type: "coordina",
    note: "Proyectos frontera · PBF",
    sourceRef: SRC.pnudOim,
  },
  {
    source: "i-oim",
    target: "c-presion-normativa",
    type: "presiona",
    note: "DTM · datos de deportaciones",
    sourceRef: SRC.oim2024,
  },
  {
    source: "o-amnistia",
    target: "c-presion-normativa",
    type: "presiona",
    note: "Informes · titulares · UA oct 2024",
    sourceRef: SRC.amnistia2024,
  },
  {
    source: "c-presion-normativa",
    target: "c-backlash-soberania",
    type: "provoca",
    note: "Estado responde en público",
    sourceRef: SRC.abinaderAmnistia,
  },
  {
    source: "c-backlash-soberania",
    target: "c-cortina-soberania",
    type: "alimenta",
    note: "Soberanía como relato dominante",
    sourceRef: SRC.diarioLibreOnu,
  },
  {
    source: "o-amnistia",
    target: "c-backlash-soberania",
    type: "choca_con",
    note: "«Trabajen en Haití»",
    sourceRef: SRC.abinaderAmnistia,
  },
  {
    source: "c-mecanismo-ong",
    target: "c-flujo-plata",
    type: "empieza_en",
    note: "Primero la plata",
    sourceRef: SRC.mepydUsaid,
  },
  {
    source: "c-mecanismo-ong",
    target: "c-presion-normativa",
    type: "incluye",
    note: "Luego la presión",
    sourceRef: SRC.amnistia2024,
  },
  {
    source: "c-mecanismo-ong",
    target: "c-backlash-soberania",
    type: "incluye",
    note: "Luego la reacción",
    sourceRef: SRC.abinaderAmnistia,
  },
  {
    source: "c-cortina-soberania",
    target: "c-mecanismo-ong",
    type: "revela_limite",
    note: "La pelea no es todo el mapa",
    sourceRef: SRC.abinaderAmnistia,
  },
  {
    source: "o-earthworks",
    target: "c-presion-normativa",
    type: "presiona",
    note: "Misma lógica · sector minero",
    sourceRef: SRC.earthworks,
  },
  {
    source: "i-usaid",
    target: "c-mecanismo-ong",
    type: "pata",
    note: "Donante bilateral",
    sourceRef: SRC.mepydUsaid,
  },
  {
    source: "o-amnistia",
    target: "c-mecanismo-ong",
    type: "pata",
    note: "Presión sin grant local USAID",
    sourceRef: SRC.amnistia2024,
  },
  {
    source: "i-usaid",
    target: "c-flujo-plata",
    type: "evidencia",
    note: "FY2024 obligaciones (USAFacts)",
    sourceRef: SRC.usafacts,
  },
];
