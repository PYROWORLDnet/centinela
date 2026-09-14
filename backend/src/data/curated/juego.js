/**
 * Tema curado — Juego / bancas.
 * Lotería Nacional, Fenabanca y el plan de regularización.
 * Solo hechos con fuente. Sin fuente = sin nodo.
 * Nota: el tema "banca" es banca financiera; este es juego de azar.
 */

import { CUPULA_NODE } from "./cupula.js";

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
};

export const JUEGO_NODES = [
  CUPULA_NODE,
  {
    id: "c-mecanismo-juego",
    name: "Quién controla el juego",
    kind: "estado",
    role: "Lotería · bancas · regularización",
    summary:
      "El juego de azar en RD no es solo “entretenimiento”. Es un mapa de concesiones, puntos de venta, federaciones de bancas y un Estado que intenta regularizar lo que ya opera. La Lotería Nacional concentra sorteos oficiales; Fenabanca agrupa dueños de bancas; los decretos de regularización revelan la brecha entre lo legal y lo que realmente existe en la esquina.",
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
  { source: "c-mecanismo-juego", target: "c-la-cupula", type: "atraviesa", sourceRef: SRC.presidencia19726 },
];
