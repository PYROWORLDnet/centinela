/**
 * Modo curado — tema Migración.
 * Solo hechos con fuente pública. Las denuncias de corrupción se etiquetan como tales.
 *
 * Historia: juego cerrado de tres patas —
 * Estado (DGM / CESFRONT) · economía (agro / construcción) · cortina (ONG / soberanía).
 * El ciclo deportación–reingreso alimenta el negocio.
 */

import { CUPULA_NODE } from "./cupula.js";

const SRC = {
  nacionalCamiones: {
    label: "El Nacional — mafias y ciclo deportación–reingreso (Dajabón, jun 2026)",
    url: "https://elnacional.com.do/nacionales/ciudades/mafias-convierten-deportacion-haitianos-ciclo-eterno-reingreso-ilicito-haiti-rd_574251.html",
  },
  nacional670k: {
    label: "El Nacional — DGM: 670,500 deportaciones en ~21 meses (Lee Ballester)",
    url: "https://elnacional.com.do/opinion/salen-retornan_575901.html",
  },
  dgm2025: {
    label: "DGM / Impacto Media — 379,553 deportaciones de haitianos en 2025",
    url: "https://www.impactomedia.com/internacionales/republica-dominicana/republica-dominicana-deporto-mas-de-370-000-haitianos-en-2025-un-374-mas-que-en-2024/",
  },
  jadBanano: {
    label: "El Dinero — JAD: ~90% mano de obra no calificada en banano (en gran parte extranjera)",
    url: "https://eldinero.com.do/321857/que-tanto-depende-la-agropecuaria-dominicana-de-la-mano-de-obra-haitiana/",
  },
  jadHaitiana: {
    label: "El Nuevo Diario — JAD: banano es el sector que más usa mano de obra haitiana",
    url: "https://elnuevodiario.com.do/osmar-benitez-el-sector-que-mas-utiliza-mano-de-obra-haitiana-es-el-bananero-estan-biometrizados/",
  },
  amnistia: {
    label: "Amnistía Internacional — deportaciones racistas / expulsiones colectivas (oct 2024)",
    url: "https://www.amnesty.org/es/latest/news/2024/10/dominican-republic-halt-racist-deportations-of-haitians/",
  },
  oim2024: {
    label: "OIM DTM — haitianos deportados a Haití en 2024 (RD como principal expulsor)",
    url: "https://dtm.iom.int/reports/haiti-haitians-deported-haiti-2024",
  },
  debatePlural: {
    label: "Debate Plural — tráfico fronterizo, retenes y condenas (Dajabón)",
    url: "https://debateplural.net/site/2026/09/10/las-manos-que-abren-la-puerta-al-trafico-de-haitianos-3/",
  },
};

/** @type {Array<object>} */
export const MIGRACION_NODES = [
  CUPULA_NODE,

  {
    id: "i-dgm",
    name: "DGM",
    kind: "estado",
    role: "Deporta · controla · publica la cifra",
    summary:
      "Dirección General de Migración. El director Luis Rafael Lee Ballester reportó 670,500 deportaciones de haitianos en ~21 meses (oct 2024–jun 2026). En 2025 sola: 379,553. La cifra oficial es el rostro visible del sistema.",
    mechanism:
      "Opera interdicción y repatriación. Deportar más gente que la comunidad estimada solo cuadra si el reingreso es parte del ciclo.",
    weight: 100,
    amount: 670_500,
    source: SRC.nacional670k,
    themes: ["migracion"],
  },
  {
    id: "i-cesfront",
    name: "CESFRONT",
    kind: "estado",
    role: "Frontera terrestre · retenes · filtros",
    summary:
      "Cuerpo Especializado de Seguridad Fronteriza Terrestre (Min. Defensa). Controla puntos de paso. Testimonios en Dajabón lo nombran junto a Migración y militares en el supuesto cobro por facilitar cruces.",
    mechanism: "Quien filtra la frontera decide quién pasa gratis y quién paga.",
    weight: 92,
    source: SRC.nacionalCamiones,
    themes: ["migracion"],
  },
  {
    id: "e-jad",
    name: "JAD",
    kind: "empresa",
    role: "Agroempresarios · demanda de mano de obra",
    summary:
      "Junta Agroempresarial Dominicana. Osmar Benítez: el banano es el sector que más usa mano de obra haitiana; en banano ~90% de la mano de obra es no calificada y en gran parte extranjera. Siguen arroz, café, ganadería.",
    mechanism:
      "La economía pide brazos. La política pide deportaciones. Las dos órdenes conviven porque sirven a dueños distintos del mismo sistema.",
    weight: 90,
    source: SRC.jadHaitiana,
    themes: ["migracion"],
  },
  {
    id: "c-negocio-cerrado",
    name: "Negocio cerrado",
    kind: "concepto",
    role: "Deportar + reingresar + contratar",
    summary:
      "Mismo patrón que gasolina o AFP: no es caos. Es un circuito. El Estado expulsa, redes (con denuncias de funcionarios) reintroducen, y sectores productivos absorben la mano de obra. La cifra récord no cierra el flujo: lo recircula.",
    mechanism: "Tres patas: logística estatal · peaje fronterizo · demanda laboral.",
    weight: 96,
    source: SRC.nacionalCamiones,
    themes: ["migracion"],
  },
  {
    id: "c-camion-doble-via",
    name: "Camión de doble vía",
    kind: "concepto",
    role: "Deporta de día · alegado reingreso de noche",
    summary:
      "El Nacional (Dajabón): una fuente anónima afirma que los mismos camiones celda de la DGM usados para deportar regresan con indocumentados bajo pago. La placa institucional reduce controles. Es denuncia periodística, no sentencia.",
    mechanism: "Si el vehículo oficial no se detiene en el retén, el peaje se vuelve invisible.",
    weight: 88,
    source: SRC.nacionalCamiones,
    themes: ["migracion"],
  },
  {
    id: "c-ciclo-deportacion",
    name: "Ciclo deportación–reingreso",
    kind: "concepto",
    role: "670,500 salidas · muchas vueltas",
    summary:
      "670,500 deportaciones en ~21 meses superan estimaciones frecuentes de la comunidad haitiana residente (~500 mil en algunos reportes). La aritmética apunta a recirculación: muchas personas cruzan el contador más de una vez.",
    mechanism: "Cada vuelta alimenta operativos, titulares… y peajes.",
    weight: 94,
    amount: 670_500,
    source: SRC.nacional670k,
    themes: ["migracion"],
  },
  {
    id: "c-poteas",
    name: "Poteas y transporte",
    kind: "concepto",
    role: "Guías · choferes · tarifa del cruce",
    summary:
      "«Potea»: quien guía o trafica el cruce (El Nacional). Tarifas citadas: ~RD$17,000 hasta la capital; ~RD$10,000 hasta Santiago. En la cadena también aparecen choferes de transporte.",
    mechanism: "Sin guía y sin flota, el peaje fronterizo no escala.",
    weight: 78,
    amount: 17_000,
    source: SRC.nacionalCamiones,
    themes: ["migracion"],
  },
  {
    id: "p-nelson-peralta",
    name: "Nelson Ramón Peralta",
    kind: "persona",
    role: "Testigo · Dajabón / Loma de Cabrera",
    summary:
      "Vecino citado por El Nacional: «El tráfico de haitianos es incontrolable… es un negocio redondo… hay autoridades que son parte de él.» Nombra Migración, CESFRONT, guardias, G2, choferes y poteas. Dice que deja «más que la droga, más que el petróleo, que el oro».",
    mechanism: "La voz local pone nombres al circuito que las cifras solo dibujan.",
    weight: 70,
    source: SRC.nacionalCamiones,
    themes: ["migracion"],
  },
  {
    id: "c-banano",
    name: "Banano y agro",
    kind: "concepto",
    role: "Hasta ~90% mano de obra no calificada",
    summary:
      "JAD (El Dinero): en banano ~90% de la mano de obra es no calificada, mayoritariamente extranjera; plátano, leche y café ~80–85%. El Nuevo Diario: banano es el sector agro que más usa mano de obra haitiana, seguido de arroz, café y ganadería.",
    mechanism: "Sin esos brazos se cae la cosecha de exportación. Con deportación pura se cae la nómina del campo.",
    weight: 86,
    source: SRC.jadBanano,
    themes: ["migracion"],
  },
  {
    id: "c-construccion-turismo",
    name: "Construcción y servicios",
    kind: "concepto",
    role: "Otra vena de demanda",
    summary:
      "Además del agro, construcción y servicios absorben mano de obra migrante irregular. Misma tensión: el sector necesita personal; la política vende expulsión. El trabajador queda en el medio.",
    mechanism: "La demanda laboral sostiene el reingreso aunque el discurso diga lo contrario.",
    weight: 80,
    source: SRC.jadHaitiana,
    themes: ["migracion", "construccion"],
  },
  {
    id: "c-paradoja-laboral",
    name: "Paradoja laboral",
    kind: "concepto",
    role: "Deportan · contratan · no regularizan",
    summary:
      "Se pide no traer más haitianos y a la vez se depende de ellos. La JAD habla de biometrizar en banano, pero el ciclo de deportación masiva sigue. No es solo “invasión vs soberanía”: es explotación con permiso a medias del Estado.",
    mechanism: "Mano de obra barata + estatus precario = disciplina laboral sin derechos plenos.",
    weight: 84,
    source: SRC.jadBanano,
    themes: ["migracion"],
  },
  {
    id: "i-oim",
    name: "OIM",
    kind: "estado",
    role: "Datos · crítica humanitaria",
    summary:
      "Organización Internacional para las Migraciones. Monitorea retornos a Haití: en 2024 casi 200,000 haitianos fueron deportados desde varios países; RD figura como principal expulsor en la región. Documenta perfiles vulnerables al llegar a Haití.",
    mechanism: "Mide el flujo. Su presión humanitaria choca con el relato soberanista local.",
    weight: 74,
    source: SRC.oim2024,
    themes: ["migracion"],
  },
  {
    id: "o-amnistia",
    name: "Amnistía Internacional",
    kind: "medio",
    role: "Denuncia racismo y expulsiones colectivas",
    summary:
      "Oct 2024: pidió frenar el plan de hasta 10,000 deportaciones semanales. Señala expulsiones colectivas, perfilamiento racial y riesgos para embarazadas, niños y solicitantes de protección.",
    mechanism: "Empuja derechos humanos. El backlash nacionalista usa esa presión como cortina.",
    weight: 72,
    source: SRC.amnistia,
    themes: ["migracion"],
  },
  {
    id: "c-cortina-soberania",
    name: "Cortina de soberanía",
    kind: "concepto",
    role: "ONG vs «invasión» · el negocio sigue",
    summary:
      "Mientras el debate público pelea entre derechos humanos e «invasión haitiana», el circuito de peaje y mano de obra barata no se desmonta. La bronca con ONU/ONG desplaza la pregunta: ¿quién cobra el cruce y quién se beneficia del brazo barato?",
    mechanism: "El relato tapa el balance. El mapa abre la cuenta.",
    weight: 82,
    source: SRC.amnistia,
    themes: ["migracion"],
  },
  {
    id: "c-retenes",
    name: "Retenes y peaje",
    kind: "concepto",
    role: "Chequeos · denuncias de cobro",
    summary:
      "Debate Plural y reportajes de frontera: fuentes describen pagos en retenes a militares/agentes para dejar pasar grupos. Probarlo en tribunal es difícil. Hay condenas históricas (Dajabón 2006: militares sentenciados por cobro en un tráfico mortal).",
    mechanism: "El peaje informal convierte el control en mercancía.",
    weight: 76,
    source: SRC.debatePlural,
    themes: ["migracion"],
  },
];

/** @type {Array<object>} */
export const MIGRACION_EDGES = [
  { source: "i-dgm", target: "c-ciclo-deportacion", type: "ejecuta", note: "670,500 deportaciones · cifra DGM", amount: 670_500, sourceRef: SRC.nacional670k },
  { source: "i-dgm", target: "c-camion-doble-via", type: "opera_logistica", note: "Camiones celda oficiales", sourceRef: SRC.nacionalCamiones },
  { source: "c-camion-doble-via", target: "c-ciclo-deportacion", type: "recircula", note: "Alegado: deporta y regresa con carga", sourceRef: SRC.nacionalCamiones },
  { source: "i-cesfront", target: "c-retenes", type: "controla", note: "Chequeos fronterizos", sourceRef: SRC.nacionalCamiones },
  { source: "c-retenes", target: "c-poteas", type: "permite_o_cobra", note: "Denuncias de peaje en ruta", sourceRef: SRC.debatePlural },
  { source: "c-poteas", target: "c-ciclo-deportacion", type: "reingresa", note: "Guía + tarifa del cruce", sourceRef: SRC.nacionalCamiones },
  { source: "p-nelson-peralta", target: "c-negocio-cerrado", type: "testimonia", note: "«Negocio redondo» · autoridades parte", sourceRef: SRC.nacionalCamiones },
  { source: "p-nelson-peralta", target: "i-dgm", type: "señala", note: "Nombra Migración en el circuito", sourceRef: SRC.nacionalCamiones },
  { source: "p-nelson-peralta", target: "i-cesfront", type: "señala", note: "Nombra CESFRONT / guardias / G2", sourceRef: SRC.nacionalCamiones },
  { source: "e-jad", target: "c-banano", type: "representa", note: "Banano · mayor uso de mano de obra haitiana", sourceRef: SRC.jadHaitiana },
  { source: "c-banano", target: "c-paradoja-laboral", type: "alimenta", note: "~90% no calificada · en gran parte extranjera", sourceRef: SRC.jadBanano },
  { source: "c-construccion-turismo", target: "c-paradoja-laboral", type: "alimenta", note: "Otra vena de demanda", sourceRef: SRC.jadHaitiana },
  { source: "c-ciclo-deportacion", target: "c-paradoja-laboral", type: "tensa", note: "Expulsión vs necesidad de brazos", sourceRef: SRC.nacional670k },
  { source: "c-paradoja-laboral", target: "c-negocio-cerrado", type: "pata", note: "Demanda laboral sostiene el ciclo", sourceRef: SRC.jadBanano },
  { source: "i-oim", target: "c-cortina-soberania", type: "presiona", note: "Datos y crítica humanitaria", sourceRef: SRC.oim2024 },
  { source: "o-amnistia", target: "c-cortina-soberania", type: "presiona", note: "Racismo · expulsiones colectivas", sourceRef: SRC.amnistia },
  { source: "c-cortina-soberania", target: "c-negocio-cerrado", type: "tapa", note: "El relato tapa el peaje y la nómina", sourceRef: SRC.amnistia },
  { source: "c-negocio-cerrado", target: "i-dgm", type: "pata", note: "Estado · deporta y publica", sourceRef: SRC.nacional670k },
  { source: "c-negocio-cerrado", target: "i-cesfront", type: "pata", note: "Frontera · filtro / peaje denunciado", sourceRef: SRC.nacionalCamiones },
  { source: "c-negocio-cerrado", target: "e-jad", type: "pata", note: "Economía · demanda de brazos", sourceRef: SRC.jadHaitiana },
  { source: "c-camion-doble-via", target: "c-negocio-cerrado", type: "ilustra", note: "Logística estatal en el circuito", sourceRef: SRC.nacionalCamiones },
  { source: "i-dgm", target: "c-negocio-cerrado", type: "opera_sobre", note: "La cifra récord no cierra el flujo", sourceRef: SRC.nacional670k },
];
