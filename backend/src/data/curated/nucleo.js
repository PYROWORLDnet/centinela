/**
 * Modo curado — tema El Núcleo.
 * No es un tema paralelo: es el hilo que une todos los demás.
 *
 * Conclusión: ningún presidente puede tocar el Núcleo mientras el Núcleo
 * siga en venta. Votar por un partido nuevo no cambia el sistema.
 *
 * Comparativos externos (Singapur, China, Tailandia, Bukele) sirven de contraste
 * en el recorrido — no como modelo a copiar.
 */

import { CUPULA_NODE } from "./cupula.js";
import { SRC_SHARED, pickNodes } from "./shared.js";

const SRC = {
  ...SRC_SHARED,
  jce: {
    label: "Junta Central Electoral",
    url: "https://jce.gob.do/",
  },
  ley3318: {
    label: "Ley 33-18 — Partidos, Agrupaciones y Movimientos Políticos (PDF CEPAL)",
    url: "https://oig.cepal.org/sites/default/files/2018_ley33_18_rdo.pdf",
  },
  sie: {
    label: "Superintendencia de Electricidad (SIE)",
    url: "https://www.sie.gob.do/",
  },
  edesur: {
    label: "Edesur Dominicana",
    url: "https://www.edesur.com.do/",
  },
  cdn: {
    label: "CDN — Cadena de Noticias",
    url: "https://cdn.com.do/",
  },
  refidomsa: {
    label: "Refidomsa",
    url: "https://www.refidomsa.com.do/",
  },
  bukeleAp: {
    label: "AP — Bukele y consolidación de poder en El Salvador (2024)",
    url: "https://apnews.com/article/el-salvador-nayib-bukele-election",
  },
  xuReuters: {
    label: "Reuters — Xu Jiayin / Evergrande (cobertura judicial China)",
    url: "https://www.reuters.com/world/china/",
  },
  singapurMom: {
    label: "Ministry of Manpower (Singapur) — foreign workforce",
    url: "https://www.mom.gov.sg/passes-and-permits",
  },
  tailandiaLand: {
    label: "Department of Lands (Tailandia) — marco de propiedad",
    url: "https://www.dol.go.th/",
  },
};

const NO_TOCA = "Este nodo no se toca.";

const SHARED_IDS = [
  "c-la-cupula",
  "e-afp-popular",
  "e-afp-crecer",
  "e-grupo-popular",
  "e-grupo-rizek",
  "e-grupo-vicini",
  "e-grupo-corripio",
  "e-grupo-estrella",
  "e-grupo-bonetti",
  "i-hacienda",
  "m-listin",
];

const LOCAL_NODES = [
  {
    id: "c-nucleo",
    name: "El Núcleo",
    kind: "estado",
    role: "El centro que nadie toca",
    summary:
      "No es un partido. No es un presidente. Es el centro del sistema: las AFP que compran la deuda, la refinería y el subsidio, el sistema eléctrico, Hacienda, los medios y las casas que cruzan sectores. Mientras ese centro siga en venta —accesible con dinero, apellido o deuda política— el que llega al Palacio ya llega debiendo.",
    mechanism: "El voto cambia la cara. El Núcleo decide qué se puede tocar.",
    weight: 100,
    source: SRC.jce,
    themes: ["nucleo"],
  },
  {
    id: "c-regla-intocable",
    name: "La regla",
    kind: "estado",
    role: "No se toca · ni con voto ni con discurso",
    summary:
      "La regla implícita: hay nodos que se reforman en el discurso y nodos que no se tocan en la práctica. AFP, combustible, electricidad, deuda, medios y financiamiento partidario forman ese perímetro. Un gobierno nuevo hereda la dependencia.",
    mechanism: "Si el Núcleo se vende, el presidente se alquila.",
    weight: 96,
    source: SRC.ley3318,
    themes: ["nucleo"],
  },
  {
    id: "c-voto-no-basta",
    name: "El voto no basta",
    kind: "estado",
    role: "Cara nueva · misma dependencia",
    summary:
      "Cambiar de partido o de presidente no desmonta el Núcleo. El que llega necesita financiar campaña, gobernar con deuda, combustibles, luz y narrativa mediática. Esas llaves ya están repartidas.",
    mechanism: "Promesa sin consecuencia = aplauso al mismo sistema.",
    weight: 94,
    source: SRC.jce,
    themes: ["nucleo"],
  },
  {
    id: "c-pueblo",
    name: "El pueblo",
    kind: "trabajador",
    role: "Único actor que puede dejar de aplaudir",
    summary:
      "No firma los contratos de las AFP ni fija el subsidio. Pero sostiene el sistema con cotizaciones, impuestos, factura eléctrica y voto. Los sistemas no se caen solos: se caen cuando la gente deja de aplaudir y exige hechos.",
    mechanism: "El Núcleo deja de ser intocable cuando el pueblo deja de creerle promesas.",
    weight: 98,
    source: SRC.jce,
    themes: ["nucleo"],
  },
  {
    id: "i-jce",
    name: "JCE",
    kind: "estado",
    role: "Árbitro electoral · plata a partidos",
    summary:
      "Junta Central Electoral: reglas del juego y distribución del financiamiento público. Quien llega al poder pasa por aquí — y por la plata que el sistema ya repartió.",
    mechanism: "El acceso al Palacio queda filtrado por reglas y financiamiento.",
    weight: 90,
    source: SRC.jce,
    themes: ["nucleo", "partidos"],
  },
  {
    id: "p-prm",
    name: "PRM",
    kind: "partido",
    role: "Fuerza mayor · ciclo de gobierno",
    summary:
      "Partido Revolucionario Moderno. Una de las tres fuerzas del tramo mayor de financiamiento público. Cara distinta; misma mesa del sistema.",
    mechanism: "Gobernar no es lo mismo que tocar el Núcleo.",
    weight: 82,
    source: SRC.jce,
    themes: ["nucleo", "partidos"],
  },
  {
    id: "p-pld",
    name: "PLD",
    kind: "partido",
    role: "Fuerza tradicional · tramo mayor",
    summary:
      "Partido de la Liberación Dominicana. Alternancia histórica dentro del mismo perímetro de dependencias: deuda, energía, combustibles, pensiones.",
    mechanism: "Alternancia de siglas ≠ cambio de Núcleo.",
    weight: 80,
    source: SRC.jce,
    themes: ["nucleo", "partidos"],
  },
  {
    id: "p-fp",
    name: "FP",
    kind: "partido",
    role: "Fuerza del Pueblo · tramo mayor",
    summary:
      "Fuerza del Pueblo. Tercera pata del financiamiento grande. Compite por el Palacio dentro de las mismas reglas.",
    mechanism: "Tres siglas grandes; un solo perímetro intocable.",
    weight: 80,
    source: SRC.jce,
    themes: ["nucleo", "partidos"],
  },
  {
    id: "e-refidomsa",
    name: "Refidomsa",
    kind: "estado",
    role: "Refinería · canal combustible",
    summary:
      "Refinería Dominicana de Petróleo. Pieza estatal de la cadena; el precio al público se estabiliza con subsidio. Canal que alimenta al Núcleo vía factura y presupuesto.",
    mechanism: "Sin este canal, el Estado no estabiliza la bomba.",
    weight: 88,
    source: SRC.refidomsa,
    themes: ["nucleo", "gasolina"],
  },
  {
    id: "e-patsa",
    name: "PATSA",
    kind: "empresa",
    role: "Puente Rizek · Refidomsa 2021",
    summary:
      "Vehículo ligado al Grupo Rizek en la operación que llevó al Estado al 100% de Refidomsa (Hacienda, 2021). Misma casa: pensiones (AFP Crecer) y combustible.",
    mechanism: "Una casa, varios canales hacia el Núcleo.",
    weight: 84,
    source: SRC.haciendaPatsa,
    themes: ["nucleo", "gasolina", "familias"],
  },
  {
    id: "c-sistema-electrico",
    name: "Sistema eléctrico",
    kind: "estado",
    role: "Generación · distribución · pérdidas",
    summary:
      "Generadores, EDEs y regulador: subsidios y contratos. Las pérdidas se socializan; la generación cobra. Canal permanente hacia el Núcleo.",
    mechanism: "La luz que pagas financia un circuito que el Palacio no desmonta solo.",
    weight: 88,
    source: SRC.sie,
    themes: ["nucleo", "electricidad"],
  },
  {
    id: "e-edesur",
    name: "Edesur",
    kind: "estado",
    role: "Distribución · Gran Santo Domingo",
    summary:
      "Empresa distribuidora estatal. Cara visible del racionamiento y las pérdidas que empujan el subsidio eléctrico.",
    mechanism: "Distribuir mal sale caro — y lo paga el contribuyente.",
    weight: 78,
    source: SRC.edesur,
    themes: ["nucleo", "electricidad"],
  },
  {
    id: "m-cdn",
    name: "CDN",
    kind: "medio",
    role: "Cadena de Noticias · Grupo Estrella",
    summary:
      "Canal de noticias ligado al Grupo Estrella. Ejemplo de cómo el Núcleo se narra desde medios con dueño multi-sector.",
    mechanism: "Quien cruza obra y pantallas filtra qué se discute del mapa.",
    weight: 76,
    source: SRC.cdn,
    themes: ["nucleo", "medios"],
  },
  {
    id: "c-ejemplo-singapur",
    name: "Singapur",
    kind: "estado",
    role: "Contraste · el centro no se vende",
    summary:
      "Abrió la economía, pero el centro del poder no se negocia como mercancía electoral. Aquí el contraste es claro: mucho capital extranjero no significa que el núcleo del Estado esté en venta.",
    mechanism: "Mucho capital extranjero ≠ núcleo en venta.",
    weight: 70,
    source: SRC.singapurMom,
    themes: ["nucleo"],
  },
  {
    id: "c-ejemplo-china",
    name: "China · Xu Jiayin",
    kind: "estado",
    role: "Contraste · el dinero no compra inmunidad",
    summary:
      "El caso de Xu Jiayin (Evergrande): fortuna extrema y aun así enfrentó al Estado. No es para igualar países — es para marcar la idea: si el cheque comprara el núcleo, el más rico nunca caería.",
    mechanism: "Si el dinero comprara el núcleo, no habría castigo al más rico.",
    weight: 68,
    source: SRC.xuReuters,
    themes: ["nucleo"],
  },
  {
    id: "c-ejemplo-tailandia",
    name: "Tailandia",
    kind: "estado",
    role: "Contraste · filtros al capital",
    summary:
      "Hay restricciones históricas a que el capital extranjero compre tierra a voluntad. Contrasta con el relato de que en RD el dinero abre casi todas las puertas.",
    mechanism: "Primero demuestras valor al sistema; no al revés.",
    weight: 66,
    source: SRC.tailandiaLand,
    themes: ["nucleo"],
  },
  {
    id: "p-bukele",
    name: "Nayib Bukele",
    kind: "persona",
    role: "Contraste · llegar sin deberle al circuito",
    summary:
      "El contraste no es “copiar a Bukele”. Es la condición: un pueblo que ya no tiene miedo, un establishment desacreditado, y alguien que no llega debiendo el poder al mismo circuito. Sin eso, “un nuevo” es solo otra cara.",
    mechanism: "No basta ser “nuevo”. Hay que no deberle al Núcleo.",
    weight: 72,
    source: SRC.bukeleAp,
    themes: ["nucleo"],
  },
];

function dedupe(nodes) {
  const seen = new Set();
  const out = [];
  for (const n of nodes) {
    if (!n?.id || seen.has(n.id)) continue;
    seen.add(n.id);
    out.push(n);
  }
  return out;
}

const SHARED = pickNodes(SHARED_IDS).map((n) => ({
  ...n,
  themes: Array.from(new Set([...(n.themes || []), "nucleo"])),
}));

export const NUCLEO_NODES = dedupe([CUPULA_NODE, ...LOCAL_NODES, ...SHARED]);

function spoke(target, note = NO_TOCA) {
  return {
    source: "c-nucleo",
    target,
    type: "no_se_toca",
    note,
    sourceRef: SRC.jce,
  };
}

export const NUCLEO_EDGES = [
  {
    source: "c-nucleo",
    target: "c-regla-intocable",
    type: "impone",
    note: "La regla del perímetro",
    sourceRef: SRC.ley3318,
  },
  {
    source: "c-nucleo",
    target: "c-voto-no-basta",
    type: "explica",
    note: "Por qué la alternancia no alcanza",
    sourceRef: SRC.jce,
  },
  {
    source: "c-pueblo",
    target: "c-nucleo",
    type: "puede_tocar",
    note: "Solo si deja de aplaudir y exige hechos",
    sourceRef: SRC.jce,
  },
  {
    source: "c-voto-no-basta",
    target: "c-pueblo",
    type: "desplaza_a",
    note: "El cambio no empieza en el Palacio",
    sourceRef: SRC.jce,
  },

  spoke("p-prm", "No se toca. Cara distinta, mismo centro."),
  spoke("p-pld", "No se toca. Alternancia de siglas."),
  spoke("p-fp", "No se toca. Misma mesa."),
  spoke("i-jce", "No se toca. Árbitro del acceso."),

  spoke("e-afp-popular"),
  spoke("e-afp-crecer"),
  spoke("e-grupo-popular"),
  spoke("e-refidomsa"),
  spoke("e-patsa"),
  spoke("c-sistema-electrico"),
  spoke("e-edesur"),
  spoke("i-hacienda"),
  spoke("m-listin"),
  spoke("m-cdn"),
  spoke("e-grupo-corripio"),
  spoke("e-grupo-vicini"),
  spoke("e-grupo-rizek"),
  spoke("e-grupo-estrella"),
  spoke("e-grupo-bonetti"),
  spoke("c-mecanismo-azucar", "No se toca. Tierra, batey y casas azucareras."),
  spoke("c-mecanismo-transporte", "No se toca. Rutas, federaciones y presupuesto."),
  spoke("c-mecanismo-basura", "No se toca. Contratos y vertedero."),
  spoke("c-mecanismo-juego", "No se toca. Lotería, bancas y regularización."),
  spoke("c-pauta-oficial", "No se toca. Pauta oficial como oxígeno mediático."),
  spoke("c-la-cupula", "La Cúpula es la cara del Núcleo. No se toca."),

  {
    source: "e-grupo-rizek",
    target: "e-afp-crecer",
    type: "controla",
    note: "Pensiones → Núcleo",
    sourceRef: SRC.afpCrecer,
  },
  {
    source: "e-grupo-rizek",
    target: "e-patsa",
    type: "controla",
    note: "Combustible → Núcleo",
    sourceRef: SRC.haciendaPatsa,
  },

  {
    source: "i-jce",
    target: "p-prm",
    type: "financia",
    note: "Financiamiento público concentrado",
    sourceRef: SRC.jce,
  },
  {
    source: "i-jce",
    target: "p-pld",
    type: "financia",
    note: "Financiamiento público concentrado",
    sourceRef: SRC.jce,
  },
  {
    source: "i-jce",
    target: "p-fp",
    type: "financia",
    note: "Financiamiento público concentrado",
    sourceRef: SRC.jce,
  },
  {
    source: "p-prm",
    target: "c-nucleo",
    type: "llega_debiendo",
    note: "Gobernar exige al Núcleo",
    sourceRef: SRC.jce,
  },
  {
    source: "p-pld",
    target: "c-nucleo",
    type: "llega_debiendo",
    note: "Alternancia dentro del perímetro",
    sourceRef: SRC.jce,
  },
  {
    source: "p-fp",
    target: "c-nucleo",
    type: "llega_debiendo",
    note: "Misma dependencia estructural",
    sourceRef: SRC.jce,
  },

  {
    source: "i-hacienda",
    target: "e-afp-popular",
    type: "vende_deuda",
    note: "Bonos ↔ pensiones",
    sourceRef: SRC.hacienda,
  },
  {
    source: "i-hacienda",
    target: "e-afp-crecer",
    type: "vende_deuda",
    note: "Bonos ↔ pensiones",
    sourceRef: SRC.hacienda,
  },

  {
    source: "c-nucleo",
    target: "c-ejemplo-singapur",
    type: "contrasta",
    note: "Contraste: el centro no se vende",
    sourceRef: SRC.singapurMom,
  },
  {
    source: "c-nucleo",
    target: "c-ejemplo-china",
    type: "contrasta",
    note: "Contraste: dinero ≠ soberanía",
    sourceRef: SRC.xuReuters,
  },
  {
    source: "c-nucleo",
    target: "c-ejemplo-tailandia",
    type: "contrasta",
    note: "Contraste: filtros al capital",
    sourceRef: SRC.tailandiaLand,
  },
  {
    source: "c-voto-no-basta",
    target: "p-bukele",
    type: "contrasta",
    note: "Contraste: llegar sin deber",
    sourceRef: SRC.bukeleAp,
  },
  {
    source: "p-bukele",
    target: "c-pueblo",
    type: "requiere",
    note: "Sin pueblo sin miedo, no hay ruptura",
    sourceRef: SRC.bukeleAp,
  },
];
