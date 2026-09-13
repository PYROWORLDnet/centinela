/**
 * Recorrido narrativo — tema Partidos.
 *
 * Historia:
 * sin independientes → solo por partido → el dinero premia a tres →
 * el chico no gana, negocia → cobra → se integra.
 * Los montos son prueba, no el cuento.
 */

export const PARTIDOS_TOUR = {
  id: "partidos-mecanismo",
  theme: "partidos",
  title: "Para qué sirve el que no puede ganar",
  epilogue:
    "Te hablan de democracia de ciudadanos. La ley te obliga a pasar por un partido. Y el partido nuevo no es la salida: es la puerta de entrada al mismo edificio. El que entra, negocia. El que negocia, se queda.",
  entry: {
    hubId: "i-jce",
    satelliteIds: [
      "p-prm",
      "p-fp",
      "p-pld",
      "p-nuevos",
      "c-financiamiento",
      "c-sin-independientes",
      "l-33-18",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Primero: ya no puedes votar por un independiente.",
      detail:
        "En marzo de 2026 se promulgó la Ley 13-26: se eliminaron las candidaturas independientes. Presidencia, Congreso, alcaldías — si quieres aparecer en la boleta, tienes que ir dentro de un partido, una agrupación o un movimiento. Sin organización política, no hay candidatura. Eso no es un detalle: es el candado.",
      nodeIds: ["c-sin-independientes", "l-13-26", "i-jce", "p-prm", "p-nuevos"],
      panelId: "c-sin-independientes",
    },
    {
      id: 2,
      line: "Y para ser partido, necesitas el sello de la JCE.",
      detail:
        "Firmas, estatutos, órganos, sede, plazos. La Junta Central Electoral decide quién entra al club. Puedes inventarte un movimiento y reunir gente. Hasta que la JCE te reconozca, no eres jugador. El sistema no empieza en la urna: empieza en el registro.",
      nodeIds: ["i-jce", "c-requisitos", "p-nuevos"],
      panelId: "c-requisitos",
      pathFrom: ["i-jce"],
    },
    {
      id: 3,
      line: "Dentro del club, el Estado reparte dinero público.",
      detail:
        "Hay un pastel de financiamiento para los partidos reconocidos. No se reparte a dedo: lo escribe la Ley 33-18. Tres partidos grandes se llevan casi todo. El resto pelea por las migajas. El discurso habla de pluralismo. La caja habla de otra cosa.",
      nodeIds: ["i-jce", "l-33-18", "c-financiamiento", "p-prm", "p-fp", "p-pld"],
      panelId: "c-financiamiento",
    },
    {
      id: 4,
      line: "PRM, FP y PLD se quedan con la mayor parte.",
      detail:
        "Los tres que ya dominan la política se llevan la gran tajada del financiamiento público — cientos de millones cada uno al año. Con eso hacen campaña, estructura, propaganda. No es mérito mágico: es la regla escrita para quien ya pasó cierto umbral de votos.",
      nodeIds: ["p-prm", "p-fp", "p-pld", "c-regla-80"],
      panelId: "c-regla-80",
    },
    {
      id: 5,
      line: "Los chicos reciben apenas para existir.",
      detail:
        "Partidos medianos y nuevos también tocan dinero público… pero órdenes de magnitud menos. Suficiente para mantener un local y un discurso. No para competir de verdad por la presidencia. Puedes estar en la boleta. Eso no significa que puedas ganar.",
      nodeIds: ["p-medianos", "p-nuevos", "c-regla-8", "c-comparacion"],
      panelId: "c-comparacion",
    },
    {
      id: 6,
      line: "Entonces el partido nuevo no juega para ganar.",
      detail:
        "Con esa asimetría, soñar con la presidencia es el show. El juego real es otro: juntar un bloque de votos que un grande necesite cuando no cierra solo — sobre todo con la regla del 50%+1 y la segunda vuelta. El chico no vende un presidente. Vende su pedazo de electorado.",
      nodeIds: ["p-nuevos", "c-50-mas-uno", "c-negociacion", "p-prm", "p-fp", "p-pld"],
      panelId: "c-negociacion",
      pathFrom: ["p-nuevos"],
    },
    {
      id: 7,
      line: "Negocia: su valor es el bloque, no el cargo soñado.",
      detail:
        "Cuando un grande necesita aliados, el partido pequeño se sienta a la mesa. Históricamente esos bloques han sido decisivos para armar gobiernos. La gente cree que el chico “va por la presidencia”. Él sabe que va por la negociación.",
      nodeIds: ["c-negociacion", "p-nuevos", "p-prm", "p-fp", "p-pld"],
      panelId: "c-negociacion",
    },
    {
      id: 8,
      line: "El precio: cuando el grande gana, el chico cobra.",
      detail:
        "Una posición en el gobierno, una senaduría, una diputación, un pedazo de presupuesto, acceso. Da igual cuánto prometió “cambio” en campaña. A la hora de la verdad, cobra — y entra al mismo poder que decía enfrentar.",
      nodeIds: ["c-negociacion", "c-precio", "p-nuevos", "p-prm"],
      panelId: "c-precio",
      pathFrom: ["c-negociacion"],
    },
    {
      id: 9,
      line: "No es que “no quieran cambiar”.",
      detail:
        "Es que el sistema te obliga a pasar por un partido, premia con dinero a los mismos tres, y empuja a los demás a negociar en vez de ganar. El partido nuevo no abre una democracia de ciudadanos sueltos. Abre otra puerta al mismo edificio. El que entra, negocia. El que negocia, se queda.",
      nodeIds: [
        "c-sin-independientes",
        "i-jce",
        "p-prm",
        "p-fp",
        "p-pld",
        "p-nuevos",
        "c-negociacion",
        "c-precio",
        "l-13-26",
      ],
      panelId: "i-jce",
      pathEdges: true,
    },
  ],
};
