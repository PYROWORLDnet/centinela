/**
 * Modo curado — tema Agua.
 * Solo hechos con fuente pública.
 *
 * Historia: el agua potable no es solo la tubería.
 * Es una red: CAASD (Gran SD), INAPA (resto del país), CORAASAN (Santiago),
 * INDRHI (recurso/presas), tarifa subsidiada, cobranza rota,
 * y cuando falla la red — camiones cisterna con proveedor casi único.
 * El usuario del barrio paga dos veces: factura + cisterna.
 */

import { CUPULA_NODE } from "./cupula.js";

const SRC = {
  caasd: {
    label: "CAASD — Corporación del Acueducto y Alcantarillado de Santo Domingo",
    url: "https://www.caasd.gob.do/",
  },
  caasdCisterna: {
    label: "CAASD — suministro de agua en camiones cisterna",
    url: "https://www.caasd.gob.do/servicio/suministro-de-agua-en-camiones-cisterna/",
  },
  caasdTarifa: {
    label: "Presidencia — CAASD actualiza tarifa comercial/industrial/gubernamental (dic 2025)",
    url: "https://presidencia.gob.do/noticias/caasd-aplica-actualizacion-tarifaria-clientes-comerciales-industriales-y-gubernamentales",
  },
  caasdMemoria: {
    label: "CAASD — Memoria institucional 2023 (viajes cisterna · producción)",
    url: "https://transparencia.caasd.gob.do/wp-content/uploads/2024/04/Memoria-Institucional-2023.pdf",
  },
  inapa: {
    label: "INAPA — Instituto Nacional de Aguas Potables y Alcantarillados",
    url: "https://www.inapa.gob.do/",
  },
  inapaSequia: {
    label: "Revista Mercado — INAPA pide racionalizar uso del agua por sequía",
    url: "https://revistamercado.do/money-invest/daily-news/alerta-por-baja-en-rios-y-presas-en-rd-inapa-llama-a-racionalizar-el-uso-del-agua-por-la-sequia/",
  },
  coraasan: {
    label: "CORAASAN — Corporación del Acueducto y Alcantarillado de Santiago",
    url: "https://www.coraasan.gob.do/",
  },
  indrhi: {
    label: "INDRHI — Instituto Nacional de Recursos Hidráulicos",
    url: "https://www.indrhi.gob.do/",
  },
  cisternaLicitacion: {
    label: "Noticias SIN — CAASD licita ~32 mil viajes de agua por ~RD$60 MM",
    url: "https://noticiassin.com/caasd-licita-unos-32-mil-viajes-de-agua-por-60-millones-de-pesos/",
  },
  cobroTarifa: {
    label: "Acento — cobranza CAASD ~28% · INAPA ~30% · CORAASAN ~70%",
    url: "https://acento.com.do/economia/inapa-no-contemplan-aumento-en-tarifa-de-agua-coraasan-tampoco-pero-validara-planificacion-de-la-caasd-9607272.html",
  },
  costoReal: {
    label: "CAASD — FAQ: costo real ~RD$40/m³ · residencial RD$6/m³",
    url: "https://www.caasd.gob.do/preguntas-frecuentes/",
  },
};

/** @type {Array<object>} */
export const AGUA_NODES = [
  CUPULA_NODE,

  {
    id: "c-mecanismo-agua",
    name: "Mecanismo agua",
    kind: "estado",
    role: "Acueducto · subsidio · cisterna · usuario",
    summary:
      "El agua potable no es solo la tubería. CAASD abastece el Gran Santo Domingo; INAPA el resto del país; CORAASAN Santiago. INDRHI administra el recurso en presa y cuenca. La tarifa residencial está lejos del costo real; la cobranza es baja; cuando la red falla, entran los camiones cisterna — a menudo con un proveedor casi único. El barrio paga la factura y, encima, el viaje.",
    mechanism: "Quien controla el caudal, la tarifa y el camión controla el acceso al agua.",
    weight: 100,
    source: SRC.caasd,
    themes: ["agua"],
  },
  {
    id: "i-caasd",
    name: "CAASD",
    kind: "estado",
    role: "Acueducto del Gran Santo Domingo",
    summary:
      "Corporación del Acueducto y Alcantarillado de Santo Domingo. Produce, potabiliza y distribuye en el Distrito Nacional y municipios del Gran SD. En sequía ha reportado caídas de producción del 30–35% y opera planes de contingencia con trasvases y cisternas.",
    mechanism: "Dueña de la red en la capital: fija servicio, tarifa local y contratos de emergencia.",
    weight: 98,
    source: SRC.caasd,
    themes: ["agua"],
  },
  {
    id: "i-inapa",
    name: "INAPA",
    kind: "estado",
    role: "Agua potable fuera del Gran SD",
    summary:
      "Instituto Nacional de Aguas Potables y Alcantarillados. Opera acueductos en provincias y municipios fuera de las corporaciones metropolitanas. En sequía pide racionalizar el uso y reporta inversión multimillonaria en tuberías y caudal. No subió tarifa residencial al ritmo de CAASD comercial.",
    mechanism: "El mapa del agua fuera de la capital pasa por aquí.",
    weight: 92,
    source: SRC.inapa,
    themes: ["agua"],
  },
  {
    id: "i-coraasan",
    name: "CORAASAN",
    kind: "estado",
    role: "Acueducto de Santiago",
    summary:
      "Corporación del Acueducto y Alcantarillado de Santiago. Operador metropolitano del Cibao. Reporta la cobranza más alta del trío (~70% vs ~28% CAASD y ~30% INAPA, según cobertura de prensa sobre tarifas). Valida si alineará planificación tarifaria con CAASD.",
    mechanism: "Misma lógica de corporación: red local, tarifa, cobranza — distinto desempeño de cobro.",
    weight: 84,
    source: SRC.coraasan,
    themes: ["agua"],
  },
  {
    id: "i-indrhi",
    name: "INDRHI",
    kind: "estado",
    role: "Recurso hídrico · presas · cuencas",
    summary:
      "Instituto Nacional de Recursos Hidráulicos. Administra embalses, riego y el agua “arriba” de la toma del acueducto. Cuando bajan Haina, Nizao, Isa-Mana y demás afluentes, el déficit llega a CAASD/INAPA como menos metros cúbicos en planta — no como un problema de “la factura”.",
    mechanism: "Sin agua en la presa, no hay magia en la tubería.",
    weight: 88,
    source: SRC.indrhi,
    themes: ["agua"],
  },
  {
    id: "c-sequia",
    name: "Sequía / caudal bajo",
    kind: "estado",
    role: "Choque climático · menos m³ en planta",
    summary:
      "Episodios de baja precipitación reducen ríos y embalses. CAASD ha documentado caídas de producción del 30–35% en el Gran SD; INAPA llama a racionalizar. El déficit de caudal empuja trasvases, racionamiento y —al final— más viajes de cisterna.",
    mechanism: "La sequía no inventa el mecanismo: lo pone en evidencia.",
    weight: 90,
    source: SRC.inapaSequia,
    themes: ["agua"],
  },
  {
    id: "c-tarifa-subsidiada",
    name: "Tarifa subsidiada",
    kind: "financiador",
    role: "Residencial ~RD$6/m³ · costo ~RD$40/m³",
    summary:
      "CAASD publica que el costo de producir un m³ ronda RD$40 y se vende residencial a RD$6 (~RD$0.022/galón). En dic 2025 actualizó tarifas comerciales, industriales y gubernamentales (sin tocar residencial, según el anuncio). El hueco lo cubre el Estado / la corporación.",
    mechanism: "Precio político abajo; costo técnico arriba. Alguien paga la diferencia.",
    weight: 94,
    source: SRC.costoReal,
    themes: ["agua"],
  },
  {
    id: "c-cobranza-rota",
    name: "Cobranza rota",
    kind: "financiador",
    role: "CAASD ~28% · INAPA ~30% · CORAASAN ~70%",
    summary:
      "Cobertura de prensa sobre la actualización tarifaria cita niveles de cobranza: CAASD alrededor de 28%, INAPA ~30%, CORAASAN ~70%. Poca recaudación + tarifa bajo costo = corporaciones dependientes de transferencias y de contratos de emergencia.",
    mechanism: "Si no cobras el servicio, el camión se vuelve política permanente.",
    weight: 91,
    source: SRC.cobroTarifa,
    themes: ["agua"],
  },
  {
    id: "c-camiones-cisterna",
    name: "Camiones cisterna",
    kind: "empresa",
    role: "Plan B cuando la red falla",
    summary:
      "CAASD ofrece suministro por cisterna en sequía, averías largas o zonas sin servicio regular. Memoria 2023: miles de viajes a hogares e instituciones prioritarias. En contingencia, la cisterna deja de ser excepción y se vuelve el servicio real del barrio.",
    mechanism: "Cuando la tubería calla, el tanquero habla.",
    weight: 93,
    source: SRC.caasdCisterna,
    themes: ["agua"],
  },
  {
    id: "o-siprocadiagua",
    name: "SIPROCADIAGUA",
    kind: "partido",
    role: "Sindicato · proveedor casi único de viajes",
    summary:
      "Sindicato de Propietarios de Camiones Distribuidores de Agua (D.N.), afiliado a FENATRADO. En licitación CAASD (~RD$60.9 MM, ~32,102 viajes, ~250 camiones) el informe pericial lo trató como proveedor único con capacidad operativa. Competencia formal; oferta real concentrada.",
    mechanism: "Un solo actor con la flotilla = cuello de botella del agua de emergencia.",
    weight: 89,
    source: SRC.cisternaLicitacion,
    themes: ["agua"],
  },
  {
    id: "c-contrato-cisterna",
    name: "Contrato de cisternas",
    kind: "financiador",
    role: "~RD$60.9 MM · ~32 mil viajes",
    summary:
      "Proceso CAASD para alquiler/transporte de agua en sequía (nov–abr). Monto reportado ~RD$60.9 millones; ~32,102 viajes de tanqueros 2,000–2,500 galones; promedio citado ~3,150 viajes/semana en el Gran SD. Justificado por ausencia de flotilla propia suficiente.",
    mechanism: "La emergencia se presupuestó: el camión es línea de gasto, no accidente.",
    weight: 87,
    amount: 60_900_000,
    source: SRC.cisternaLicitacion,
    themes: ["agua"],
  },
  {
    id: "c-usuario-barrio",
    name: "Usuario del barrio",
    kind: "trabajador",
    role: "Paga factura · y a veces el viaje",
    summary:
      "Residencial: tarifa baja, servicio irregular en muchos sectores. Cuando no sale agua del grifo, compra cisterna o espera el camión institucional. Doble costo: la factura (aunque sea simbólica) y el plan B. No negocia el contrato con SIPROCADIAGUA.",
    mechanism: "El nodo más grande del sistema es el que menos diseña la red.",
    weight: 96,
    source: SRC.caasdCisterna,
    themes: ["agua"],
  },
  {
    id: "c-fuentes-superficiales",
    name: "Fuentes superficiales",
    kind: "estado",
    role: "Haina · Nizao · Isa-Mana · Duey · Isabela…",
    summary:
      "Los sistemas de producción del Gran SD dependen de cuencas y tomas sobre ríos reportados en baja durante sequía (Haina, Isa-Mana, Duey, Isabela, Nizao, entre otros). Menos caudal en la toma = menos m³ potabilizados = más racionamiento.",
    mechanism: "La geografía manda antes que el recibo.",
    weight: 82,
    source: SRC.inapaSequia,
    themes: ["agua"],
  },
];

/** @type {Array<object>} */
export const AGUA_EDGES = [
  {
    source: "c-mecanismo-agua",
    target: "i-caasd",
    type: "centra",
    note: "Capital = CAASD",
    sourceRef: SRC.caasd,
  },
  {
    source: "c-mecanismo-agua",
    target: "c-usuario-barrio",
    type: "existe_por",
    note: "Sin usuario no hay servicio que justificar",
    sourceRef: SRC.caasd,
  },
  {
    source: "i-indrhi",
    target: "c-fuentes-superficiales",
    type: "administra",
    note: "Presas, riego, recurso arriba de la toma",
    sourceRef: SRC.indrhi,
  },
  {
    source: "c-fuentes-superficiales",
    target: "i-caasd",
    type: "abastece",
    note: "Caudal hacia plantas del Gran SD",
    sourceRef: SRC.inapaSequia,
  },
  {
    source: "c-fuentes-superficiales",
    target: "i-inapa",
    type: "abastece",
    note: "Sistemas provinciales",
    sourceRef: SRC.inapa,
  },
  {
    source: "c-sequia",
    target: "c-fuentes-superficiales",
    type: "reduce",
    note: "Menos lluvia → menos caudal",
    sourceRef: SRC.inapaSequia,
  },
  {
    source: "c-sequia",
    target: "i-caasd",
    type: "golpea",
    note: "Producción −30–35% reportado en sequía",
    sourceRef: SRC.inapaSequia,
  },
  {
    source: "i-caasd",
    target: "c-tarifa-subsidiada",
    type: "cobra_via",
    note: "Residencial ~RD$6/m³ vs costo ~RD$40",
    sourceRef: SRC.costoReal,
  },
  {
    source: "i-caasd",
    target: "c-cobranza-rota",
    type: "recauda",
    note: "~28% de cobranza citada",
    sourceRef: SRC.cobroTarifa,
  },
  {
    source: "i-inapa",
    target: "c-cobranza-rota",
    type: "recauda",
    note: "~30% de cobranza citada",
    sourceRef: SRC.cobroTarifa,
  },
  {
    source: "i-coraasan",
    target: "c-cobranza-rota",
    type: "recauda",
    note: "~70% de cobranza citada",
    sourceRef: SRC.cobroTarifa,
  },
  {
    source: "c-tarifa-subsidiada",
    target: "c-usuario-barrio",
    type: "factura_a",
    note: "Precio político del m³ residencial",
    sourceRef: SRC.caasdTarifa,
  },
  {
    source: "i-caasd",
    target: "c-camiones-cisterna",
    type: "activa",
    note: "Contingencia: sequía, avería, zona sin red",
    sourceRef: SRC.caasdCisterna,
  },
  {
    source: "c-sequia",
    target: "c-camiones-cisterna",
    type: "dispara",
    note: "Menos red → más tanquero",
    sourceRef: SRC.inapaSequia,
  },
  {
    source: "i-caasd",
    target: "c-contrato-cisterna",
    type: "licita",
    note: "~RD$60.9 MM · ~32 mil viajes",
    amount: 60_900_000,
    sourceRef: SRC.cisternaLicitacion,
  },
  {
    source: "c-contrato-cisterna",
    target: "o-siprocadiagua",
    type: "proveedor",
    note: "Proveedor único citado en informe pericial",
    sourceRef: SRC.cisternaLicitacion,
  },
  {
    source: "o-siprocadiagua",
    target: "c-camiones-cisterna",
    type: "opera",
    note: "Flotilla y choferes del servicio",
    sourceRef: SRC.cisternaLicitacion,
  },
  {
    source: "c-camiones-cisterna",
    target: "c-usuario-barrio",
    type: "abastece",
    note: "El plan B llega a la esquina",
    sourceRef: SRC.caasdCisterna,
  },
  {
    source: "i-caasd",
    target: "c-usuario-barrio",
    type: "sirve",
    note: "Red formal del Gran SD",
    sourceRef: SRC.caasd,
  },
  {
    source: "i-inapa",
    target: "c-usuario-barrio",
    type: "sirve",
    note: "Red formal fuera de corporaciones",
    sourceRef: SRC.inapa,
  },
  {
    source: "i-coraasan",
    target: "c-usuario-barrio",
    type: "sirve",
    note: "Red formal de Santiago",
    sourceRef: SRC.coraasan,
  },
  {
    source: "c-cobranza-rota",
    target: "c-contrato-cisterna",
    type: "empuja_a",
    note: "Poca recaudación + déficit → más emergencia contratada",
    sourceRef: SRC.cobroTarifa,
  },
];
