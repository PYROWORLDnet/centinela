/**
 * Modo curado — tema Salud / SeNaSa.
 * Solo hechos con fuente pública. Acusaciones penales se etiquetan como tales.
 *
 * Historia: la salud pública no es solo el hospital.
 * Es una red de plata: SeNaSa paga, SISALRIL regula, SNS atiende,
 * PROMESE/CAL y gestores privados mueven medicamentos,
 * y los contratos (capitación, prospectivos, farmacia) deciden quién cobra.
 * El afiliado queda en el medio.
 */

import { CUPULA_NODE } from "./cupula.js";

const SRC = {
  senasaRed: {
    label: "SeNaSa — continuidad de servicios · +7.4 M afiliados · red de prestadores (dic 2025)",
    url: "https://www.arssenasa.gob.do/index.php/blog/2025/12/07/senasa-reafirma-continuidad-y-estabilidad-de-sus-servicios-para-mas-de-7-4-millones-de-afiliados/",
  },
  senasaSite: {
    label: "Seguro Nacional de Salud (SeNaSa)",
    url: "https://www.arssenasa.gob.do/",
  },
  sisalrilSfs: {
    label: "SISALRIL — Seguro Familiar de Salud / Plan Básico",
    url: "https://www.sisalril.gob.do/seguro-familiar-de-salud/",
  },
  sns: {
    label: "Servicio Nacional de Salud (SNS)",
    url: "https://sns.gob.do/",
  },
  promese: {
    label: "PROMESE/CAL — Programa de Medicamentos Esenciales",
    url: "https://promesecal.gob.do/",
  },
  dgcpAnula: {
    label: "DGCP — anula contratación directa SeNaSa–Farmacard (ago 2025)",
    url: "https://www.dgcp.gob.do/noticias/dgcp-anula-contratacion-directa-entre-senasa-y-farmacard-por-violacion-a-la-ley-de-contrataciones-publicas/",
  },
  senasaLicitacion: {
    label: "Presidencia — SeNaSa publica licitación de administrador de medicamentos",
    url: "https://www.presidencia.gob.do/noticias/senasa-publica-licitacion-para-seleccionar-nuevo-administrador-de-medicamentos",
  },
  farmacardDefiende: {
    label: "Listín Diario — Farmacard defiende legalidad del contrato con SeNaSa (sep 2025)",
    url: "https://listindiario.com/la-republica/sector-salud/20250916/farmacard-defiende-legalidad-contrato-senasa_874478.html",
  },
  deficitDirector: {
    label: "Noticia Libre — director confirma déficit ~RD$15,000 MM y desmonte de contratos capitados",
    url: "https://noticialibre.com/2026/01/nuevo-director-de-senasa-confirma-deficit-de-casi-15-mil-millones-y-valida-denuncia-de-operacion-cobra/",
  },
  observatorio: {
    label: "Participación Ciudadana — 7º Informe Observatorio (especial SeNaSa / Operación Cobra)",
    url: "https://pciudadana.org/wp-content/uploads/2026/01/Septimo-Informe-Senasa.pdf",
  },
  regimenSubsidiado: {
    label: "SeNaSa — Régimen Subsidiado",
    url: "https://www.arssenasa.gob.do/index.php/regimen-subsidiado/",
  },
};

/** @type {Array<object>} */
export const SALUD_NODES = [
  CUPULA_NODE,

  {
    id: "c-mecanismo-salud",
    name: "Mecanismo salud",
    kind: "estado",
    role: "Plata · contratos · red · afiliado",
    summary:
      "La salud pública no se entiende mirando solo el hospital. SeNaSa administra el riesgo de más de 7.4 millones de afiliados; SISALRIL regula el Plan Básico; el SNS opera la red pública; PROMESE/CAL y gestores privados mueven la farmacia. Los contratos —capitación, prospectivos, administrador de medicamentos— deciden quién cobra antes de que llegue la consulta.",
    mechanism: "Quien arma la red de pago arma el acceso real a la medicina.",
    weight: 100,
    source: SRC.senasaRed,
    themes: ["salud"],
  },
  {
    id: "i-senasa",
    name: "SeNaSa",
    kind: "estado",
    role: "ARS pública · +7.4 M afiliados",
    summary:
      "Seguro Nacional de Salud: ARS pública autónoma. Administra el régimen subsidiado y afiliados contributivos que la eligen. En dic 2025 reportó continuidad de servicios para más de 7.4 millones de afiliados y una red con 185 hospitales, 301 clínicas, 979 farmacias habilitadas y miles de médicos independientes.",
    mechanism: "Concentra la mayor cartera de afiliados del país: es el cheque que llega al prestador.",
    weight: 98,
    source: SRC.senasaRed,
    themes: ["salud"],
  },
  {
    id: "i-sisalril",
    name: "SISALRIL",
    kind: "estado",
    role: "Regulador del Seguro Familiar de Salud",
    summary:
      "Superintendencia de Salud y Riesgos Laborales. Define y vigila el Plan Básico / catálogo de prestaciones, supervisa a las ARS y opina sobre el encaje normativo de contratos (como en el expediente DGCP–Farmacard).",
    mechanism: "Sin SISALRIL, el catálogo y las reglas de las ARS no tienen árbitro.",
    weight: 90,
    source: SRC.sisalrilSfs,
    themes: ["salud"],
  },
  {
    id: "i-sns",
    name: "SNS",
    kind: "estado",
    role: "Red pública de atención",
    summary:
      "Servicio Nacional de Salud: opera hospitales y la atención primaria del Estado. En el régimen subsidiado, SeNaSa y PROMESE/CAL se coordinan con el SNS para servicios farmacéuticos ambulatorios. El hospital público es un nodo de la red — no el dueño del flujo de plata.",
    mechanism: "Atiende. No siempre decide quién se contrata para pagar.",
    weight: 88,
    source: SRC.sns,
    themes: ["salud"],
  },
  {
    id: "i-promese",
    name: "PROMESE/CAL",
    kind: "estado",
    role: "Medicamentos esenciales · régimen subsidiado",
    summary:
      "Programa de Medicamentos Esenciales / Central de Apoyo Logístico. Canal estatal de fármacos para el subsidiado, con coordinación SeNaSa–PROMESE–SNS. Convive —y a veces compite en la práctica— con gestores privados de farmacia ambulatoria.",
    mechanism: "La pastilla del subsidiado pasa por aquí… o por el contrato privado del mes.",
    weight: 86,
    source: SRC.promese,
    themes: ["salud"],
  },
  {
    id: "c-red-prestadores",
    name: "Red de prestadores",
    kind: "empresa",
    role: "Hospitales · clínicas · farmacias · médicos",
    summary:
      "Según SeNaSa (dic 2025): 185 hospitales, 103 centros de atención primaria, 301 clínicas, 460 centros especializados, 147 laboratorios, +50 centros de imágenes, 979 farmacias habilitadas y +7,812 médicos independientes. La ARS no “es” la red: la contrata y le paga.",
    mechanism: "Sin contrato con la ARS, el prestador no cobra el Plan Básico.",
    weight: 92,
    source: SRC.senasaRed,
    themes: ["salud"],
  },
  {
    id: "c-contratos-capita",
    name: "Contratos capitados / prospectivos",
    kind: "financiador",
    role: "Pago fijo · menos fiscalización de acto",
    summary:
      "Modalidades de pago a prestadores privados con monto fijo (capitación) o prospectivo. El nuevo director de SeNaSa dijo públicamente que desmontó esas modalidades: ~RD$112 MM mensuales en capitados a seis entidades y ~RD$60 MM en prospectivos. Cifras atribuidas a su declaración, no a una auditoría publicada aquí.",
    mechanism: "Pago fijo sin acto por acto = incentivo a volumen de contrato, no a factura clínica.",
    weight: 94,
    source: SRC.deficitDirector,
    themes: ["salud"],
  },
  {
    id: "e-farmacard",
    name: "Farmacard",
    kind: "empresa",
    role: "Gestor de farmacia ambulatoria",
    summary:
      "Contrato directo con SeNaSa (feb 2025) para administrar asistencia farmacéutica ambulatoria vía red. La DGCP lo anuló (RIC-0109-2025) por violar la Ley 340-06: el servicio es administrativo/tecnológico, no un “servicio de salud” excluido. Se permitió vigencia temporal (~70 días hábiles) mientras se licita. Farmacard defiende ahorros y legalidad en prensa.",
    mechanism: "Quien administra la tarjeta de medicamentos administra el cuello de botella del afiliado.",
    weight: 91,
    source: SRC.dgcpAnula,
    themes: ["salud"],
  },
  {
    id: "i-dgcp",
    name: "DGCP",
    kind: "estado",
    role: "Árbitro de compras públicas",
    summary:
      "Dirección General de Contrataciones Públicas. Anuló el procedimiento y el contrato SeNaSa–Farmacard, ordenó licitación competitiva por el SECP y remitió a Contraloría, Cámara de Cuentas y SISALRIL. Hecho administrativo firme en la resolución citada — distinto del expediente penal.",
    mechanism: "Cuando el contrato toca fondos públicos, la 340-06 manda… salvo que alguien diga lo contrario.",
    weight: 84,
    source: SRC.dgcpAnula,
    themes: ["salud"],
  },
  {
    id: "c-licitacion-medicamentos",
    name: "Licitación de medicamentos",
    kind: "estado",
    role: "Proceso competitivo post-anulación",
    summary:
      "Tras la RIC-0109-2025, SeNaSa anunció convocatoria a licitación pública para elegir nueva plataforma administradora de medicamentos, en plazo fijado por la DGCP. El mecanismo vuelve a la competencia formal; el afiliado sigue dependiendo de quién gane el pliego.",
    mechanism: "La anulación no cierra el grifo: cambia quién puede sentarse a la mesa.",
    weight: 80,
    source: SRC.senasaLicitacion,
    themes: ["salud"],
  },
  {
    id: "c-operacion-cobra",
    name: "Operación Cobra",
    kind: "estado",
    role: "Expediente penal · acusación MP",
    summary:
      "Investigación del Ministerio Público sobre presunta red de corrupción administrativa y desvío en SeNaSa. Reportes periodísticos y el Observatorio de Participación Ciudadana citan impacto en reservas técnicas por encima de RD$18,000 MM y destitución del entonces director (ago 2025). Son acusaciones e informes — no sentencia condenatoria en este nodo.",
    mechanism: "Cuando el seguro público sangra reservas, el riesgo lo carga el afiliado mañana.",
    weight: 89,
    source: SRC.observatorio,
    themes: ["salud"],
  },
  {
    id: "c-deficit-senasa",
    name: "Déficit operacional",
    kind: "financiador",
    role: "~RD$14,700–15,000 MM (declaración dirección)",
    summary:
      "Edward Guzmán, director designado en ago 2025, declaró haber encontrado un déficit operacional cercano a RD$14,700–15,000 millones y validó en entrevista la gravedad del esquema investigado. Cifra de gestión / declaración pública, no de estados auditados reproducidos aquí.",
    mechanism: "El hueco contable es el reverso de los contratos que nadie fiscalizó a tiempo.",
    weight: 87,
    source: SRC.deficitDirector,
    themes: ["salud"],
  },
  {
    id: "c-afiliado",
    name: "Afiliado",
    kind: "trabajador",
    role: "Paga cotización o es subsidiado · espera el servicio",
    summary:
      "Titular del Plan Básico: contributivo (con diferenciales) o subsidiado (cobertura 100% del catálogo, vía SIUBEN). No firma el contrato de Farmacard ni la capitación de la clínica. Pierde cuando hay preautorización trabada, farmacia sin stock o prestador que ya no está en la red.",
    mechanism: "El nodo más grande del sistema es el que menos vota el contrato.",
    weight: 96,
    source: SRC.regimenSubsidiado,
    themes: ["salud"],
  },
  {
    id: "c-regimen-subsidiado",
    name: "Régimen subsidiado",
    kind: "financiador",
    role: "Plata del Estado · población vulnerable",
    summary:
      "Cubre trabajadores por cuenta propia de bajos ingresos, desempleados, personas con discapacidad e indigentes, con evaluación SIUBEN. Financiado fundamentalmente por el Estado. SeNaSa es la ARS que administra ese bloque — el más sensible políticamente.",
    mechanism: "Aquí el cotizante no es el afiliado: es el presupuesto nacional.",
    weight: 85,
    source: SRC.regimenSubsidiado,
    themes: ["salud"],
  },
];

/** @type {Array<object>} */
export const SALUD_EDGES = [
  {
    source: "c-mecanismo-salud",
    target: "i-senasa",
    type: "centra",
    note: "La ARS pública es el corazón del pago",
    sourceRef: SRC.senasaRed,
  },
  {
    source: "c-mecanismo-salud",
    target: "c-afiliado",
    type: "existe_por",
    note: "Sin afiliado no hay seguro",
    sourceRef: SRC.senasaRed,
  },
  {
    source: "i-sisalril",
    target: "i-senasa",
    type: "regula",
    note: "Plan Básico · supervisión ARS",
    sourceRef: SRC.sisalrilSfs,
  },
  {
    source: "i-sisalril",
    target: "c-red-prestadores",
    type: "marca_reglas",
    note: "Catálogo único de prestaciones",
    sourceRef: SRC.sisalrilSfs,
  },
  {
    source: "i-senasa",
    target: "c-red-prestadores",
    type: "contrata",
    note: "Red: hospitales, clínicas, farmacias, médicos",
    sourceRef: SRC.senasaRed,
  },
  {
    source: "i-senasa",
    target: "i-sns",
    type: "paga_en",
    note: "Prestación pública dentro de la red",
    sourceRef: SRC.sns,
  },
  {
    source: "i-senasa",
    target: "i-promese",
    type: "coordina",
    note: "Farmacia ambulatoria régimen subsidiado",
    sourceRef: SRC.promese,
  },
  {
    source: "i-promese",
    target: "i-sns",
    type: "abastece",
    note: "Medicamentos esenciales en red pública",
    sourceRef: SRC.promese,
  },
  {
    source: "i-senasa",
    target: "c-contratos-capita",
    type: "pago_via",
    note: "Capitación / prospectivos (desmonte declarado 2025)",
    sourceRef: SRC.deficitDirector,
  },
  {
    source: "c-contratos-capita",
    target: "c-red-prestadores",
    type: "financia",
    note: "Pago fijo a prestadores privados",
    sourceRef: SRC.deficitDirector,
  },
  {
    source: "i-senasa",
    target: "e-farmacard",
    type: "contrato_directo",
    note: "Administración farmacia ambulatoria (anulado)",
    sourceRef: SRC.dgcpAnula,
  },
  {
    source: "i-dgcp",
    target: "e-farmacard",
    type: "anula",
    note: "RIC-0109-2025 · Ley 340-06",
    sourceRef: SRC.dgcpAnula,
  },
  {
    source: "i-dgcp",
    target: "i-senasa",
    type: "ordena",
    note: "Licitación competitiva · SECP",
    sourceRef: SRC.dgcpAnula,
  },
  {
    source: "i-sisalril",
    target: "i-dgcp",
    type: "opina",
    note: "Objeto no excluido de 340-06",
    sourceRef: SRC.dgcpAnula,
  },
  {
    source: "i-senasa",
    target: "c-licitacion-medicamentos",
    type: "convoca",
    note: "Nueva plataforma de medicamentos",
    sourceRef: SRC.senasaLicitacion,
  },
  {
    source: "c-licitacion-medicamentos",
    target: "e-farmacard",
    type: "reemplaza",
    note: "Competencia tras vigencia temporal",
    sourceRef: SRC.senasaLicitacion,
  },
  {
    source: "c-operacion-cobra",
    target: "i-senasa",
    type: "investiga",
    note: "Expediente MP · acusación (no sentencia)",
    sourceRef: SRC.observatorio,
  },
  {
    source: "c-operacion-cobra",
    target: "c-deficit-senasa",
    type: "explica",
    note: "Dirección vincula hueco a esquema irregular",
    sourceRef: SRC.deficitDirector,
  },
  {
    source: "c-deficit-senasa",
    target: "i-senasa",
    type: "pesa_sobre",
    note: "Déficit operacional declarado",
    sourceRef: SRC.deficitDirector,
  },
  {
    source: "c-regimen-subsidiado",
    target: "i-senasa",
    type: "administra",
    note: "Bloque financiado por el Estado",
    sourceRef: SRC.regimenSubsidiado,
  },
  {
    source: "c-regimen-subsidiado",
    target: "c-afiliado",
    type: "cubre",
    note: "SIUBEN · cobertura 100% catálogo",
    sourceRef: SRC.regimenSubsidiado,
  },
  {
    source: "c-afiliado",
    target: "c-red-prestadores",
    type: "usa",
    note: "Consulta, farmacia, internamiento",
    sourceRef: SRC.senasaRed,
  },
  {
    source: "e-farmacard",
    target: "c-afiliado",
    type: "dispensa_a",
    note: "Cuello de botella de medicamentos",
    sourceRef: SRC.farmacardDefiende,
  },
  {
    source: "c-red-prestadores",
    target: "c-afiliado",
    type: "atiende",
    note: "Punto final del mecanismo",
    sourceRef: SRC.senasaRed,
  },
];
