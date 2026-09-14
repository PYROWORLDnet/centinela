/**
 * Recorrido — Juego / bancas.
 */

export const JUEGO_TOUR = {
  id: "juego-bancas",
  theme: "juego",
  title: "Quién cobra el chance",
  epilogue:
    "La esquina del chance no es folklore: es un sector con Lotería estatal, federación de bancas y decretos que revelan cuántos puntos operan fuera del padrón. Regularizar es repartir legalidad. El jugador pone el efectivo; Fenabanca y Hacienda pelean el marco; la DGII entra a fiscalizar. Sin fuente no inventamos dueños de cada banca; con fuente sí mostramos el mecanismo.",
  entry: {
    hubId: "c-mecanismo-juego",
    satelliteIds: [
      "i-loteria-nacional",
      "o-fenabanca",
      "c-decreto-197-26",
      "c-brecha-bancas",
      "i-hacienda-juego",
      "c-jugador",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "El chance también tiene mapa de poder.",
      detail:
        "Antes del número ganador está quién puede venderlo. Lotería, bancas y regularización son el mecanismo. El billete es la máscara.",
      nodeIds: ["c-mecanismo-juego", "i-loteria-nacional", "o-fenabanca"],
      panelId: "c-mecanismo-juego",
    },
    {
      id: 2,
      line: "La Lotería Nacional es el polo estatal.",
      detail:
        "Sorteos oficiales, portal de transparencia, y rol operativo en el plan de regularización (Decreto 197-26). No es solo “juegos”: es institución que sienta a otros en la mesa.",
      nodeIds: ["i-loteria-nacional", "c-decreto-197-26", "c-jugador"],
      panelId: "i-loteria-nacional",
    },
    {
      id: 3,
      line: "El Decreto 197-26 reactiva la depuración.",
      detail:
        "Presidencia: plan nacional para culminar validación y formalización de bancas, puntos de venta y apuestas. Incorpora DGII. Deroga el esquema 295-22. Regularizar es decidir el padrón.",
      nodeIds: ["c-decreto-197-26", "i-hacienda-juego", "i-dgii-juego"],
      panelId: "c-decreto-197-26",
    },
    {
      id: 4,
      line: "Fenabanca sienta a los dueños de bancas.",
      detail:
        "Federación de asociaciones de bancas. Está en el consejo consultivo. Valora el decreto y pide ajustes — incluido, según prensa, más músculo contra la ilegalidad.",
      nodeIds: ["o-fenabanca", "c-decreto-197-26", "c-brecha-bancas"],
      panelId: "o-fenabanca",
    },
    {
      id: 5,
      line: "La brecha: ~31 mil legales vs ~71 mil vistas.",
      detail:
        "Fenabanca (RCC): en la regularización de 2022 se identificaron ~71,192 establecimientos frente a ~30,974 bancas legales. Más de 40 mil puntos fuera de norma. El mercado real desborda el padrón.",
      nodeIds: ["c-brecha-bancas", "o-fenabanca", "c-jugador"],
      panelId: "c-brecha-bancas",
    },
    {
      id: 6,
      line: "Hacienda escribe las reglas del peaje.",
      detail:
        "El ministerio debe proponer y adecuar normas para que el plan avance. Sin reglamento, la regularización es titular; con reglamento, es filtro.",
      nodeIds: ["i-hacienda-juego", "c-decreto-197-26", "o-fenabanca"],
      panelId: "i-hacienda-juego",
    },
    {
      id: 7,
      line: "La DGII entra a mirar el RNC.",
      detail:
        "Verificación fiscal, incorporación provisional al régimen y fiscalización. El chance en efectivo sin rastro es el agujero que el decreto dice querer tapar.",
      nodeIds: ["i-dgii-juego", "c-brecha-bancas", "c-decreto-197-26"],
      panelId: "i-dgii-juego",
    },
    {
      id: 8,
      line: "El jugador financia el mapa.",
      detail:
        "Cada jugada alimenta legales e ilegales. No vota el consejo consultivo. Hereda la opacidad. Por eso el tema importa: es renta cotidiana del barrio convertida en sector.",
      nodeIds: ["c-jugador", "i-loteria-nacional", "c-brecha-bancas"],
      panelId: "c-jugador",
    },
    {
      id: 9,
      line: "Cierra: regularizar es poder.",
      detail:
        "Lotería + Fenabanca + Hacienda + DGII + la brecha. No hace falta inventar un dueño oculto de cada esquina. Basta ver quién sienta la mesa y cuántos quedan fuera. Eso toca El Núcleo.",
      nodeIds: [
        "c-mecanismo-juego",
        "c-la-cupula",
        "i-loteria-nacional",
        "o-fenabanca",
        "c-brecha-bancas",
      ],
      panelId: "c-mecanismo-juego",
      pathEdges: true,
    },
  ],
};
