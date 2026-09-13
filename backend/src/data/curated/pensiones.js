/**
 * Modo curado — tema Pensiones.
 * Solo hechos con fuente pública verificable. Montos solo cuando la fuente los publica.
 *
 * Fuentes clave:
 * - SIPEN (composición de inversiones del sistema)
 * - Hacienda (bonos Covid AFP)
 * - Estados financieros AFP Popular Fondo T-1
 * - Sitios corporativos Grupo Popular / AFP
 */

const SRC = {
  sipenInv: {
    label: "SIPEN — composición de inversiones (ene 2025)",
    url: "https://sipen.gob.do/noticias/inversiones-de-los-fondos-de-pensiones-impactan-sector-real-de-la-economia",
  },
  sipenBoletin90: {
    label: "SIPEN Boletín 90 — cartera (vía El Dinero)",
    url: "https://eldinero.com.do/373399/de-que-esta-hecha-tu-pension/",
  },
  haciendaCovid: {
    label: "Hacienda — bonos Covid AFP (RD$40,000 MM)",
    url: "https://www.hacienda.gob.do/afp-adquieren-titulos-del-ministerio-de-hacienda-por-rd40000-millones-para-enfrentar-covid-19/",
  },
  haciendaCovidSeries: {
    label: "Hacienda — series, plazos y cupones Covid",
    url: "https://www.hacienda.gob.do/colocacion-de-bonos-por-rd40000-millones-permitira-mantener-apoyo-a-ciudadanos-y-financiamiento-a-reactivacion-economica/",
  },
  diarioLibreCovid: {
    label: "Diario Libre — cuatro AFP compran RD$40 mil MM (2020)",
    url: "https://www.diariolibre.com/economia/cuatro-afp-compran-deuda-del-ministerio-de-hacienda-por-rd-40-mil-millones-CG18787757",
  },
  afpPopularFs: {
    label: "AFP Popular — EEFF Fondo T-1 auditados 2025",
    url: "https://www.afppopular.com.do/Nosotros/Estados%20Financieros%20Auditados%20%20Documentos/Fondo%20T-1%20Auditados_2025.pdf",
  },
  afpPopular: {
    label: "AFP Popular — sitio oficial",
    url: "https://www.afppopular.com.do/",
  },
  dgii: {
    label: "DGII — impuestos internos",
    url: "https://dgii.gov.do/",
  },
  ley8701: {
    label: "Ley 87-01 — Sistema Dominicano de Seguridad Social (PDF DGII)",
    url: "https://dgii.gov.do/legislacion/leyesTributarias/Documents/Leyes%20de%20Instituciones%20y%20Fondos%20de%20Terceros/87-01.pdf",
  },
  ley8701Comision: {
    label: "Ley 87-01 — comisión de las AFP (SIPEN)",
    url: "https://sipen.gob.do/",
  },
  cnss: {
    label: "CNSS — Consejo Nacional de Seguridad Social",
    url: "https://www.cnss.gob.do/",
  },
  conep: {
    label: "CONEP — Consejo Nacional de la Empresa Privada",
    url: "https://www.conep.org.do/",
  },
  copardom: {
    label: "COPARDOM — Confederación Patronal",
    url: "https://www.copardom.org.do/",
  },
  afpCrecerNosotros: {
    label: "AFP Crecer — Nosotros (Grupo Rizek)",
    url: "https://afpcrecer.com.do/nosotros/",
  },
  afpSiembraAccionista: {
    label: "AFP Siembra — Nuestro accionista (Centro Financiero BHD)",
    url: "https://www.afpsiembra.com/conocenos/nuestro-accionista/",
  },
  grupoPopular: {
    label: "Grupo Popular — sitio oficial",
    url: "https://www.popularenlinea.com/",
  },
  bancoPopular: {
    label: "Banco Popular Dominicano",
    url: "https://www.popularenlinea.com/",
  },
  sipen: {
    label: "SIPEN — Superintendencia de Pensiones",
    url: "https://sipen.gob.do/",
  },
  tss: {
    label: "TSS — Tesorería de la Seguridad Social",
    url: "https://www.tss.gob.do/",
  },
  hacienda: {
    label: "Ministerio de Hacienda",
    url: "https://www.hacienda.gob.do/",
  },
  bc: {
    label: "Banco Central de la República Dominicana",
    url: "https://www.bancentral.gov.do/",
  },
  afpCrecer: {
    label: "AFP Crecer",
    url: "https://www.afpcrecer.com.do/",
  },
  afpSiembra: {
    label: "AFP Siembra",
    url: "https://www.afpsiembra.com.do/",
  },
  afpReservas: {
    label: "AFP Reservas",
    url: "https://www.afpreservas.com.do/",
  },
  banreservas: {
    label: "Banreservas",
    url: "https://www.banreservas.com/",
  },
};

/** @type {Array<object>} */
export const PENSIONES_NODES = [
  // —— Poder: CNSS y tripartismo ——
  {
    id: "i-cnss",
    name: "CNSS",
    kind: "estado",
    role: "Consejo Nacional de Seguridad Social",
    summary:
      "Órgano rector del SDSS (Ley 87-01). No es solo el gobierno: sesiona con gobierno, empleadores y trabajadores. Las resoluciones requieren voto favorable de los tres sectores — tripartismo con veto.",
    mechanism:
      "Las decisiones requieren voto favorable de los tres sectores. El sector empleador (bancos, empresas) tiene poder de veto.",
    weight: 100,
    source: SRC.ley8701,
    themes: ["pensiones"],
  },
  {
    id: "b-gobierno",
    name: "Bloque Gobierno",
    kind: "estado",
    role: "Sector público en el CNSS",
    summary:
      "Ministros (Trabajo preside), Salud, Banco Central y otras entidades públicas. Preside y propone, pero no puede aprobar resoluciones sin empleadores y trabajadores.",
    mechanism: "Preside. No decide solo.",
    weight: 78,
    source: SRC.ley8701,
    themes: ["pensiones"],
  },
  {
    id: "b-empleadores",
    name: "Bloque Empleadores",
    kind: "empresa",
    role: "Sector empleador en el CNSS · veto",
    summary:
      "Tres representantes de los empleadores escogidos por sus sectores (Ley 87-01). Sin su voto favorable, no hay resolución válida. Ahí está el poder de veto del empresariado — bancos y grupos económicos.",
    mechanism: "Veto sobre cualquier reforma. Sin su voto, no pasa.",
    weight: 92,
    source: SRC.ley8701,
    themes: ["pensiones"],
  },
  {
    id: "b-trabajadores",
    name: "Bloque Trabajadores",
    kind: "persona",
    role: "Sector laboral en el CNSS · veto",
    summary:
      "Tres representantes de los trabajadores escogidos por sus sectores (CNUS, CNTD, CASC y demás centrales). También tienen veto: sin su voto favorable no hay resolución válida.",
    mechanism: "Veto sobre cualquier reforma. Sin su voto, no pasa.",
    weight: 80,
    source: SRC.ley8701,
    themes: ["pensiones"],
  },
  {
    id: "e-conep",
    name: "CONEP",
    kind: "empresa",
    role: "Consejo Nacional de la Empresa Privada",
    summary:
      "Gremio del empresariado privado. Forma parte del ecosistema que ocupa el asiento empleador en la gobernanza del SDSS.",
    weight: 62,
    source: SRC.conep,
    themes: ["pensiones"],
  },
  {
    id: "e-copardom",
    name: "COPARDOM",
    kind: "empresa",
    role: "Confederación Patronal",
    summary:
      "Confederación patronal. Representa intereses del sector empleador en el diálogo tripartito de seguridad social.",
    weight: 58,
    source: SRC.copardom,
    themes: ["pensiones"],
  },
  {
    id: "i-comision-clasificadora",
    name: "Comisión Clasificadora de Riesgos",
    kind: "estado",
    role: "Límites de inversión de los fondos",
    summary:
      "Determina grado de riesgo, diversificación y límites máximos de inversión por tipo de instrumento (Art. 99, Ley 87-01). Integrada por SIPEN, Banco Central, Superintendencia de Bancos, Seguros, Valores y un representante técnico de afiliados.",
    weight: 70,
    source: SRC.ley8701,
    themes: ["pensiones"],
  },

  {
    id: "c-fondos-pensiones",
    name: "Fondos de Pensiones (sistema)",
    kind: "fondo",
    role: "Capitalización individual",
    summary:
      "Patrimonio de los afiliados del sistema contributivo (Ley 87-01). Lo administran las AFP; no es patrimonio de la AFP.",
    amount: null,
    weight: 96,
    source: SRC.sipen,
    themes: ["pensiones"],
  },
  {
    id: "c-cotizaciones",
    name: "Cotizaciones de trabajadores y empleadores",
    kind: "fondo",
    role: "Aportes obligatorios",
    summary:
      "Aportes mensuales que la TSS recauda y envía a las cuentas de capitalización individual en las AFP.",
    amount: null,
    weight: 70,
    source: SRC.tss,
    themes: ["pensiones"],
  },
  {
    id: "i-sipen",
    name: "SIPEN",
    kind: "estado",
    role: "Superintendencia de Pensiones",
    summary:
      "Regula y supervisa a las AFP. El Superintendente se designa por decreto del Poder Ejecutivo de una terna sometida por el CNSS (Art. 109, Ley 87-01). Ejecuta decisiones del CNSS sobre el seguro de vejez.",
    weight: 82,
    source: SRC.ley8701,
    themes: ["pensiones"],
  },
  {
    id: "i-tss",
    name: "TSS",
    kind: "estado",
    role: "Tesorería de la Seguridad Social",
    summary: "Recauda cotizaciones del SDSS y las distribuye al sistema de pensiones y otros regímenes.",
    weight: 50,
    source: SRC.tss,
    themes: ["pensiones"],
  },
  {
    id: "i-hacienda",
    name: "Ministerio de Hacienda",
    kind: "estado",
    role: "Emisor de deuda pública",
    summary:
      "Emite bonos del Gobierno Central. SIPEN Boletín 90 (vía El Dinero): ~57.02% de la cartera de fondos de pensiones es deuda de Hacienda.",
    weight: 90,
    source: SRC.sipenBoletin90,
    themes: ["pensiones", "deuda"],
  },
  {
    id: "i-banco-central",
    name: "Banco Central",
    kind: "estado",
    role: "Emisor de títulos · miembro CNSS / Comisión",
    summary:
      "Emite títulos de deuda. SIPEN Boletín 90 (vía El Dinero): ~7.87% de la cartera en títulos del Banco Central. Su Gobernador integra el CNSS y la Comisión Clasificadora de Riesgos.",
    weight: 75,
    source: SRC.sipenBoletin90,
    themes: ["pensiones", "deuda"],
  },
  {
    id: "c-impuestos",
    name: "Impuestos (ITBIS, ISR)",
    kind: "estado",
    role: "Ingresos del Gobierno Central",
    summary:
      "ITBIS, ISR y demás impuestos internos que recauda la DGII. Financian el presupuesto, incluido el servicio de la deuda pública.",
    weight: 86,
    source: SRC.dgii,
    themes: ["pensiones", "deuda"],
  },

  // AFPs
  {
    id: "e-afp-popular",
    name: "AFP Popular",
    kind: "afp",
    role: "Administradora · Grupo Popular",
    summary:
      "AFP del Grupo Popular. Administra el Fondo T-1 de afiliados y cobra comisión sobre capital administrado.",
    weight: 88,
    source: SRC.afpPopular,
    themes: ["pensiones"],
  },
  {
    id: "e-afp-crecer",
    name: "AFP Crecer",
    kind: "afp",
    role: "Administradora · Grupo Rizek",
    summary:
      "AFP del Grupo Rizek (adquirida en 2019). Administra cuentas de capitalización individual bajo la Ley 87-01.",
    weight: 72,
    source: SRC.afpCrecerNosotros,
    themes: ["pensiones"],
  },
  {
    id: "e-afp-siembra",
    name: "AFP Siembra",
    kind: "afp",
    role: "Administradora · Centro Financiero BHD",
    summary:
      "AFP cuyo accionista mayoritario es el Centro Financiero BHD. Absorbió AFP León en 2007.",
    weight: 70,
    source: SRC.afpSiembraAccionista,
    themes: ["pensiones"],
  },
  {
    id: "e-afp-reservas",
    name: "AFP Reservas",
    kind: "afp",
    role: "Administradora · ecosistema Banreservas",
    summary:
      "AFP del ecosistema Reservas / Banreservas — la vía estatal del sistema de pensiones contributivo.",
    weight: 70,
    source: SRC.afpReservas,
    themes: ["pensiones"],
  },

  // Grupos / bancos
  {
    id: "e-grupo-popular",
    name: "Grupo Popular",
    kind: "familia",
    role: "Conglomerado financiero",
    summary:
      "Grupo que agrupa Banco Popular Dominicano, AFP Popular y otras filiales. Dueño de la AFP; el sector empleador del CNSS es la mesa donde ese ecosistema empresarial tiene voz y veto.",
    weight: 90,
    source: SRC.grupoPopular,
    themes: ["pensiones", "familias"],
  },
  {
    id: "e-banco-popular",
    name: "Banco Popular Dominicano",
    kind: "banco",
    role: "Banco múltiple",
    summary: "Principal banco del Grupo Popular.",
    weight: 80,
    source: SRC.bancoPopular,
    themes: ["pensiones"],
  },
  {
    id: "e-banreservas",
    name: "Banreservas",
    kind: "banco",
    role: "Banco de Reservas · estatal",
    summary: "Banco estatal. Ecosistema de AFP Reservas — la AFP pública del sistema.",
    weight: 74,
    source: SRC.banreservas,
    themes: ["pensiones"],
  },
  {
    id: "e-grupo-bhd",
    name: "Centro Financiero BHD",
    kind: "familia",
    role: "Conglomerado financiero",
    summary:
      "Accionista mayoritario de AFP Siembra. Conglomerado con banca, seguros y seguridad social.",
    weight: 78,
    source: SRC.afpSiembraAccionista,
    themes: ["pensiones", "familias"],
  },
  {
    id: "e-banco-bhd",
    name: "Banco BHD",
    kind: "banco",
    role: "Banco múltiple",
    summary: "Banco del Centro Financiero BHD.",
    weight: 58,
    source: { label: "BHD", url: "https://www.bhd.com.do/" },
    themes: ["pensiones"],
  },
  {
    id: "e-grupo-rizek",
    name: "Grupo Rizek",
    kind: "familia",
    role: "Conglomerado · dueño AFP Crecer",
    summary:
      "Grupo económico diversificado. Desde 2019 controla AFP Crecer (sitio oficial de la AFP).",
    weight: 76,
    source: SRC.afpCrecerNosotros,
    themes: ["pensiones", "familias"],
  },

  // Instrumentos / hechos de monto
  {
    id: "c-bonos-hacienda-sistema",
    name: "Bonos Ministerio de Hacienda (en fondos)",
    kind: "fondo",
    role: "~57% de la cartera (SIPEN Boletín 90)",
    summary:
      "Según SIPEN Boletín 90 (reportado por El Dinero), el 57.02% de la cartera de los fondos de pensiones es deuda soberana del Ministerio de Hacienda. Con el Banco Central (~7.87%), casi dos de cada tres pesos van al Estado.",
    amount: null,
    weight: 95,
    source: SRC.sipenBoletin90,
    themes: ["pensiones", "deuda"],
  },
  {
    id: "c-titulos-bc-sistema",
    name: "Títulos Banco Central (en fondos)",
    kind: "fondo",
    role: "~7.9% de la cartera (SIPEN Boletín 90)",
    summary:
      "SIPEN Boletín 90 (vía El Dinero): 7.87% de la cartera de fondos de pensiones en títulos del Banco Central.",
    weight: 78,
    source: SRC.sipenBoletin90,
    themes: ["pensiones", "deuda"],
  },
  {
    id: "c-bonos-covid-40mm",
    name: "Bonos Covid Hacienda RD$40,000 MM",
    kind: "fondo",
    role: "Emisión especial mayo 2020",
    summary:
      "Emisión especial adquirida a partes iguales por AFP Crecer, Popular, Reservas y Siembra. Series a 10, 15 y 20 años; cupones 10%, 10.25% y 10.875% (Hacienda).",
    amount: 40_000_000_000,
    weight: 82,
    source: SRC.haciendaCovid,
    themes: ["pensiones", "deuda"],
  },
  {
    id: "c-afp-popular-gob-central",
    name: "Bonos del Gobierno (Fondo T-1 AFP Popular)",
    kind: "fondo",
    role: "RD$27,797 MM · EEFF auditados 2025",
    summary:
      "EEFF auditados 2025 del Fondo T-1 AFP Popular: línea «Gobierno Central» por RD$27,797,360,758 (bonos Ministerio de Hacienda; incluye USD14,982,028). Fuente: PDF oficial AFP Popular.",
    amount: 27_797_360_758,
    weight: 84,
    source: SRC.afpPopularFs,
    themes: ["pensiones"],
  },
];

/** @type {Array<object>} */
export const PENSIONES_EDGES = [
  // —— Mecanismo de poder (CNSS) ——
  {
    source: "i-cnss",
    target: "b-gobierno",
    type: "integra",
    note: "Sector público · preside, no decide solo",
    sourceRef: SRC.ley8701,
  },
  {
    source: "i-cnss",
    target: "b-empleadores",
    type: "integra",
    note: "Sector empleador · veto (Art. 24 Ley 87-01)",
    sourceRef: SRC.ley8701,
  },
  {
    source: "i-cnss",
    target: "b-trabajadores",
    type: "integra",
    note: "Sector laboral · veto (Art. 24 Ley 87-01)",
    sourceRef: SRC.ley8701,
  },
  {
    source: "i-cnss",
    target: "i-sipen",
    type: "designa_terna",
    note: "Superintendente: terna del CNSS → decreto Poder Ejecutivo (Art. 109)",
    sourceRef: SRC.ley8701,
  },
  {
    source: "i-cnss",
    target: "i-comision-clasificadora",
    type: "marco_legal",
    note: "Límites de inversión de los fondos (Art. 99)",
    sourceRef: SRC.ley8701,
  },
  {
    source: "i-sipen",
    target: "i-comision-clasificadora",
    type: "integra",
    note: "Superintendente de Pensiones es miembro de la Comisión",
    sourceRef: SRC.ley8701,
  },
  {
    source: "b-empleadores",
    target: "e-conep",
    type: "representado_por",
    note: "Gremio del empresariado privado",
    sourceRef: SRC.conep,
  },
  {
    source: "b-empleadores",
    target: "e-copardom",
    type: "representado_por",
    note: "Confederación patronal",
    sourceRef: SRC.copardom,
  },
  {
    source: "b-empleadores",
    target: "e-grupo-popular",
    type: "ecosistema_empresarial",
    note: "Dueños de AFP son actores del sector empleador; el bloque tiene veto en el CNSS",
    sourceRef: SRC.ley8701,
  },
  {
    source: "b-empleadores",
    target: "e-grupo-bhd",
    type: "ecosistema_empresarial",
    note: "Dueños de AFP Siembra; mismo sector con veto en el CNSS",
    sourceRef: SRC.ley8701,
  },
  {
    source: "b-empleadores",
    target: "e-grupo-rizek",
    type: "ecosistema_empresarial",
    note: "Dueños de AFP Crecer; mismo sector con veto en el CNSS",
    sourceRef: SRC.ley8701,
  },
  {
    source: "b-gobierno",
    target: "e-banreservas",
    type: "controla",
    note: "Banco estatal",
    sourceRef: SRC.banreservas,
  },
  {
    source: "e-banreservas",
    target: "e-afp-reservas",
    type: "ecosistema",
    note: "AFP del ecosistema Reservas",
    sourceRef: SRC.afpReservas,
  },
  {
    source: "e-grupo-popular",
    target: "e-afp-popular",
    type: "controla",
    note: "AFP Popular forma parte del Grupo Popular",
    sourceRef: SRC.grupoPopular,
  },
  {
    source: "e-grupo-popular",
    target: "e-banco-popular",
    type: "controla",
    sourceRef: SRC.grupoPopular,
  },
  {
    source: "e-grupo-bhd",
    target: "e-afp-siembra",
    type: "controla",
    note: "Accionista mayoritario (sitio AFP Siembra)",
    sourceRef: SRC.afpSiembraAccionista,
  },
  {
    source: "e-grupo-bhd",
    target: "e-banco-bhd",
    type: "controla",
    sourceRef: { label: "BHD", url: "https://www.bhd.com.do/" },
  },
  {
    source: "e-grupo-rizek",
    target: "e-afp-crecer",
    type: "controla",
    note: "Adquisición 2019 (sitio AFP Crecer)",
    sourceRef: SRC.afpCrecerNosotros,
  },
  {
    source: "i-sipen",
    target: "e-afp-popular",
    type: "regula",
    sourceRef: SRC.sipen,
  },
  {
    source: "i-sipen",
    target: "e-afp-crecer",
    type: "regula",
    sourceRef: SRC.sipen,
  },
  {
    source: "i-sipen",
    target: "e-afp-siembra",
    type: "regula",
    sourceRef: SRC.sipen,
  },
  {
    source: "i-sipen",
    target: "e-afp-reservas",
    type: "regula",
    sourceRef: SRC.sipen,
  },

  // —— Flujo de fondos ——
  {
    source: "e-afp-popular",
    target: "c-fondos-pensiones",
    type: "administra",
    note: "Administra patrimonio de afiliados (Fondo T-1)",
    sourceRef: SRC.afpPopularFs,
  },
  {
    source: "e-afp-crecer",
    target: "c-fondos-pensiones",
    type: "administra",
    sourceRef: SRC.sipen,
  },
  {
    source: "e-afp-siembra",
    target: "c-fondos-pensiones",
    type: "administra",
    sourceRef: SRC.sipen,
  },
  {
    source: "e-afp-reservas",
    target: "c-fondos-pensiones",
    type: "administra",
    sourceRef: SRC.sipen,
  },
  {
    source: "c-cotizaciones",
    target: "i-tss",
    type: "recaudadas_por",
    sourceRef: SRC.tss,
  },
  {
    source: "i-tss",
    target: "c-fondos-pensiones",
    type: "canaliza_hacia",
    sourceRef: SRC.tss,
  },
  {
    source: "c-fondos-pensiones",
    target: "c-bonos-hacienda-sistema",
    type: "invertido_en",
    note: "57.02% de la cartera (SIPEN Boletín 90)",
    sourceRef: SRC.sipenBoletin90,
  },
  {
    source: "c-fondos-pensiones",
    target: "c-titulos-bc-sistema",
    type: "invertido_en",
    note: "7.87% de la cartera (SIPEN Boletín 90)",
    sourceRef: SRC.sipenBoletin90,
  },
  {
    source: "c-bonos-hacienda-sistema",
    target: "i-hacienda",
    type: "emitido_por",
    sourceRef: SRC.sipenBoletin90,
  },
  {
    source: "c-titulos-bc-sistema",
    target: "i-banco-central",
    type: "emitido_por",
    sourceRef: SRC.sipenBoletin90,
  },
  {
    source: "e-afp-popular",
    target: "c-bonos-covid-40mm",
    type: "adquirio",
    note: "Parte igual · cupones 10–10.875% · plazos 10–20 años",
    amount: 10_000_000_000,
    sourceRef: SRC.haciendaCovidSeries,
  },
  {
    source: "e-afp-crecer",
    target: "c-bonos-covid-40mm",
    type: "adquirio",
    amount: 10_000_000_000,
    sourceRef: SRC.haciendaCovid,
  },
  {
    source: "e-afp-siembra",
    target: "c-bonos-covid-40mm",
    type: "adquirio",
    amount: 10_000_000_000,
    sourceRef: SRC.haciendaCovid,
  },
  {
    source: "e-afp-reservas",
    target: "c-bonos-covid-40mm",
    type: "adquirio",
    amount: 10_000_000_000,
    sourceRef: SRC.haciendaCovid,
  },
  {
    source: "c-bonos-covid-40mm",
    target: "i-hacienda",
    type: "emitido_por",
    amount: 40_000_000_000,
    sourceRef: SRC.haciendaCovid,
  },
  {
    source: "e-afp-popular",
    target: "c-afp-popular-gob-central",
    type: "reporta_inversion",
    amount: 27_797_360_758,
    note: "Gobierno Central en EEFF Fondo T-1 auditados 2025",
    sourceRef: SRC.afpPopularFs,
  },
  {
    source: "c-afp-popular-gob-central",
    target: "i-hacienda",
    type: "expuesto_a",
    sourceRef: SRC.afpPopularFs,
  },
  {
    source: "i-hacienda",
    target: "c-fondos-pensiones",
    type: "paga_intereses_a",
    note: "Servicio de deuda sobre bonos en cartera de pensiones",
    sourceRef: SRC.sipenBoletin90,
  },
  {
    source: "c-impuestos",
    target: "i-hacienda",
    type: "financian",
    note: "Ingresos tributarios del Gobierno Central (DGII)",
    sourceRef: SRC.dgii,
  },
  {
    source: "e-afp-popular",
    target: "e-grupo-popular",
    type: "comision_para",
    note: "La AFP cobra comisión por administrar; pertenece al Grupo Popular",
    sourceRef: SRC.ley8701Comision,
  },
];

export const PENSIONES_THEME = "pensiones";
