/**
 * Modo curado — tema ADP / sindicatos docentes.
 * Solo hechos con fuente pública. Acusaciones de corrupción se etiquetan como tales.
 *
 * Historia: quién controla la escuela pública no es solo el Minerd.
 * Es un duelo permanente ADP ↔ Estado: plata del 4%, acuerdos, paros, evaluación.
 * El estudiante queda en el medio.
 */

import { CUPULA_NODE } from "./cupula.js";

const SRC = {
  pactoEducativo: {
    label: "Minerd — Pacto Nacional para la Reforma Educativa (2014–2030)",
    url: "https://www.ministeriodeeducacion.gob.do/comunicaciones/publicaciones/pacto-nacional-para-la-reforma-educativaen-la-republica-dominicana-2014-2030",
  },
  acuerdo11: {
    label: "Noticias SIN — ADP y Minerd priorizan 11 puntos del acuerdo (may 2024)",
    url: "https://noticiassin.com/adp-y-minerd-daran-prioridad-a-11-puntos-de-acuerdo-suscrito/",
  },
  aumento10: {
    label: "El Nacional — ADP acepta aumento salarial 10% con condiciones (may 2024)",
    url: "https://elnacional.com.do/nacionales/adp-acepta-aumento-salarial-del-10-con-condiciones_507048.html",
  },
  puntosPendientes: {
    label: "Diario Libre — ADP acusa al Minerd de no resolver temas pendientes (ene 2025)",
    url: "https://www.diariolibre.com/actualidad/educacion/2025/01/24/la-adp-acusa-al-minerd-de-no-resolver-temas-pendientes/2978420",
  },
  paroMinerd: {
    label: "Minerd — lamenta impacto de paro de docencia ADP en centros con alta asistencia",
    url: "https://www.ministeriodeeducacion.gob.do/comunicaciones/noticias/minerd-lamenta-centros-educativos-con-asistencia-de-mas-de-85-de-estudiantes-fueron-afectados-por-paro-de-docencia-adp",
  },
  cuatroPib: {
    label: "El Nacional — ADP: el 4% del PIB ha sido fuente de corrupción (denuncia Hidalgo)",
    url: "https://elnacional.com.do/nacionales/adp-dice-4-ha-sido-fuente-de-corrupcion_481014.html",
  },
  hidalgo15: {
    label: "El Caribe — Hidalgo: Minerd solo cumplió ~15% del acuerdo 2021",
    url: "https://www.elcaribe.com.do/destacado/hidalgo-educacion-solo-cumplio-el-15-del-acuerdo-firmado/",
  },
  minerd: {
    label: "Ministerio de Educación (Minerd)",
    url: "https://www.ministeriodeeducacion.gob.do/",
  },
  adpSite: {
    label: "Asociación Dominicana de Profesores (ADP)",
    url: "https://adp.org.do/",
  },
};

/** @type {Array<object>} */
export const ADP_NODES = [
  CUPULA_NODE,

  {
    id: "c-mecanismo-adp",
    name: "Mecanismo ADP",
    kind: "estado",
    role: "Negociación · paro · escuela en el medio",
    summary:
      "La escuela pública no se gobierna solo desde el despacho del ministro. Se negocia —a veces se pelea— con la ADP: salarios, evaluación, infraestructura, nombramientos. El 4% del PIB es el botín presupuestario; el paro es el músculo; el estudiante es quien pierde días de clase.",
    mechanism: "Quién sienta la mesa docente define el calendario real de la escuela.",
    weight: 100,
    source: SRC.acuerdo11,
    themes: ["adp"],
  },
  {
    id: "o-adp",
    name: "ADP",
    kind: "partido",
    role: "Sindicato docente · interlocutor permanente",
    summary:
      "Asociación Dominicana de Profesores: gremio que agrupa al magisterio público y negocia con el Minerd. Firma acuerdos, convoca paros y condiciona aumentos al cumplimiento de puntos previos. Es el actor sindical más visible del sistema preuniversitario.",
    mechanism: "Sin la ADP en la mesa, el Ministerio no cierra la política docente en la práctica.",
    weight: 98,
    source: SRC.adpSite,
    themes: ["adp"],
  },
  {
    id: "i-minerd",
    name: "Minerd",
    kind: "estado",
    role: "Rector del sistema preuniversitario",
    summary:
      "Ministerio de Educación. Contraparte estatal de la ADP: salarios, evaluación de desempeño, infraestructura, nombramientos, alimentación escolar. Publica comunicados cuando los paros afectan la asistencia estudiantil y defiende el cumplimiento parcial de acuerdos.",
    mechanism: "Paga, regula y negocia — pero no administra la escuela en solitario.",
    weight: 96,
    source: SRC.minerd,
    themes: ["adp"],
  },
  {
    id: "p-eduardo-hidalgo",
    name: "Eduardo Hidalgo",
    kind: "persona",
    role: "Presidente ADP · voz del gremio",
    summary:
      "Presidente del Comité Ejecutivo Nacional de la ADP. Negoció el aumento del 10% (may 2024) condicionado a 11 puntos; ha dicho públicamente que el Minerd cumplió ~15% del acuerdo de 2021 y que el 4% del PIB ha sido “fuente de corrupción” (denuncia, no sentencia judicial).",
    mechanism: "La cara que firma, denuncia y convoca.",
    weight: 88,
    source: SRC.aumento10,
    themes: ["adp"],
  },
  {
    id: "c-cuatro-porciento",
    name: "4% del PIB",
    kind: "financiador",
    role: "Piso presupuestario de la educación",
    summary:
      "Compromiso político/legal de destinar ~4% del PIB a educación preuniversitaria (Pacto Educativo 2014–2030 / conquista reivindicada por la ADP). Hidalgo ha denunciado mal manejo y corrupción en el uso de esos fondos — etiqueta: denuncia gremial, no veredicto. La pelea no es solo “si hay 4%”: es quién controla cómo se gasta.",
    mechanism: "Mucha plata sin mapa de gasto = batalla política permanente.",
    weight: 94,
    source: SRC.pactoEducativo,
    themes: ["adp", "deuda"],
  },
  {
    id: "c-acuerdo-adp-minerd",
    name: "Acuerdo ADP–Minerd",
    kind: "estado",
    role: "2021 · ratificado 2023 · 11 puntos 2024",
    summary:
      "Acuerdo suscrito ~30 jun 2021 (en presencia de Abinader) y ratificado jul 2023. En may 2024 ADP y Minerd priorizaron 11 puntos: infraestructura, nombramientos, evaluación de desempeño con escala vigente, alimentación escolar, licencias, maestros “bloqueados”, incentivos a directores/coordinadores, comisión bipartita con veeduría del Defensor del Pueblo.",
    mechanism: "El papel firma la paz temporal. El cronograma decide si aguanta.",
    weight: 92,
    source: SRC.acuerdo11,
    themes: ["adp"],
  },
  {
    id: "c-aumento-10",
    name: "Aumento 10%",
    kind: "financiador",
    role: "Mayo 2024 · 8% + 2%",
    summary:
      "El Nacional: el Gobierno ofreció 8%; en mesa se sumó 2% adicional → 10% total, aceptado por la ADP bajo mediación del Defensor del Pueblo. Condicionado al avance de los 11 puntos del acuerdo. La ADP siguió pidiendo otro 10% para 2025 por inflación.",
    mechanism: "El porcentaje es el titular. La condición es el mecanismo.",
    weight: 90,
    amount: 10,
    source: SRC.aumento10,
    themes: ["adp"],
  },
  {
    id: "c-evaluacion-docente",
    name: "Evaluación docente",
    kind: "estado",
    role: "Incentivo · escala en disputa",
    summary:
      "Punto crítico del acuerdo. May 2024: se ratificó aplicar evaluación en 2024–2025 con la escala entonces vigente. Ene 2025: ADP denuncia desacuerdo — Minerd planteó bajar el incentivo de docentes “mejorables” (60–69 pts) del 17% hacia un rango menor; el gremio quiere mantener la escala actual.",
    mechanism: "Quién define la regla del incentivo define el bolsillo del aula.",
    weight: 86,
    source: SRC.puntosPendientes,
    themes: ["adp"],
  },
  {
    id: "c-paro-docente",
    name: "Paro docente",
    kind: "trabajador",
    role: "Arma de presión · costo en clase",
    summary:
      "La ADP convoca paralizaciones cuando acusa incumplimiento. El Minerd publica el impacto: en un paro documentado, centros con hasta ~85% de asistencia estudiantil quedaron afectados y el ministerio habló de violación del “Acuerdo Minerd-ADP 2023 por la Defensa y Derecho a la Educación”. El paro es legalidad sindical en tensión con el derecho a aprender.",
    mechanism: "Presión laboral con externalidad educativa.",
    weight: 91,
    source: SRC.paroMinerd,
    themes: ["adp"],
  },
  {
    id: "c-estudiantes",
    name: "Estudiantes",
    kind: "trabajador",
    role: "Quienes pagan el día perdido",
    summary:
      "No firman el acuerdo ni cobran el aumento. Cuando hay paro, el Minerd reporta aulas con alta asistencia estudiantil y baja docencia. Son el eslabón sin silla en la mesa ADP–Minerd.",
    mechanism: "La negociación se hace en su nombre; el costo del impasse lo viven ellos.",
    weight: 88,
    source: SRC.paroMinerd,
    themes: ["adp"],
  },
  {
    id: "c-incumplimiento",
    name: "Incumplimiento en disputa",
    kind: "estado",
    role: "15% vs “mayoría cumplida”",
    summary:
      "Hidalgo (El Caribe): el Minerd solo habría cumplido ~15% del acuerdo de 2021. El Minerd ha dicho que cumplió la mayoría y que faltan acciones (prensa 2024–2025). No es un dato único oficial: es el choque de narrativas que alimenta el próximo paro o la próxima mesa.",
    mechanism: "Sin matriz pública de cumplimiento, cada lado vende su porcentaje.",
    weight: 84,
    source: SRC.hidalgo15,
    themes: ["adp"],
  },
];

/** @type {Array<object>} */
export const ADP_EDGES = [
  {
    source: "o-adp",
    target: "c-mecanismo-adp",
    type: "define",
    note: "Gremio · interlocutor",
    sourceRef: SRC.adpSite,
  },
  {
    source: "i-minerd",
    target: "c-mecanismo-adp",
    type: "define",
    note: "Estado · rector",
    sourceRef: SRC.minerd,
  },
  {
    source: "p-eduardo-hidalgo",
    target: "o-adp",
    type: "lidera",
    note: "Presidente Comité Ejecutivo",
    sourceRef: SRC.aumento10,
  },
  {
    source: "o-adp",
    target: "i-minerd",
    type: "negocia_con",
    note: "Mesa permanente",
    sourceRef: SRC.acuerdo11,
  },
  {
    source: "c-acuerdo-adp-minerd",
    target: "o-adp",
    type: "vincula",
    note: "2021 / 2023 / 11 puntos",
    sourceRef: SRC.acuerdo11,
  },
  {
    source: "c-acuerdo-adp-minerd",
    target: "i-minerd",
    type: "vincula",
    note: "Contraparte estatal",
    sourceRef: SRC.acuerdo11,
  },
  {
    source: "c-aumento-10",
    target: "c-acuerdo-adp-minerd",
    type: "condicionado_a",
    note: "10% a cambio de avanzar 11 puntos",
    sourceRef: SRC.aumento10,
  },
  {
    source: "o-adp",
    target: "c-aumento-10",
    type: "acepta",
    note: "May 2024 · mediación Defensor",
    sourceRef: SRC.aumento10,
  },
  {
    source: "i-minerd",
    target: "c-aumento-10",
    type: "ofrece",
    note: "8% + 2%",
    sourceRef: SRC.aumento10,
  },
  {
    source: "c-cuatro-porciento",
    target: "i-minerd",
    type: "financia",
    note: "Piso ~4% PIB preuniversitaria",
    sourceRef: SRC.pactoEducativo,
  },
  {
    source: "o-adp",
    target: "c-cuatro-porciento",
    type: "reivindica",
    note: "Conquista · denuncia mal uso",
    sourceRef: SRC.cuatroPib,
  },
  {
    source: "c-evaluacion-docente",
    target: "c-acuerdo-adp-minerd",
    type: "punto_de",
    note: "Escala e incentivo en disputa",
    sourceRef: SRC.puntosPendientes,
  },
  {
    source: "o-adp",
    target: "c-paro-docente",
    type: "convoca",
    note: "Plan de lucha",
    sourceRef: SRC.paroMinerd,
  },
  {
    source: "c-incumplimiento",
    target: "c-paro-docente",
    type: "alimenta",
    note: "Narrativa de incumplimiento → presión",
    sourceRef: SRC.hidalgo15,
  },
  {
    source: "c-paro-docente",
    target: "c-estudiantes",
    type: "impacta",
    note: "Días de clase perdidos",
    sourceRef: SRC.paroMinerd,
  },
  {
    source: "c-mecanismo-adp",
    target: "c-estudiantes",
    type: "deja_en_medio",
    note: "Sin silla en la mesa",
    sourceRef: SRC.paroMinerd,
  },
  {
    source: "p-eduardo-hidalgo",
    target: "c-incumplimiento",
    type: "denuncia",
    note: "~15% cumplido (versión ADP)",
    sourceRef: SRC.hidalgo15,
  },
  {
    source: "p-eduardo-hidalgo",
    target: "c-cuatro-porciento",
    type: "denuncia",
    note: "Mal manejo / corrupción (alegato)",
    sourceRef: SRC.cuatroPib,
  },
  {
    source: "c-mecanismo-adp",
    target: "c-acuerdo-adp-minerd",
    type: "opera_via",
    note: "El papel de la tregua",
    sourceRef: SRC.acuerdo11,
  },
  {
    source: "c-mecanismo-adp",
    target: "c-paro-docente",
    type: "opera_via",
    note: "El músculo si el papel falla",
    sourceRef: SRC.paroMinerd,
  },
];
