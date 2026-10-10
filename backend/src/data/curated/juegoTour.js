/**
 * Recorrido — Juego / bancas.
 */

export const JUEGO_TOUR = {
  id: "juego-bancas",
  theme: "juego",
  title: "Quién cobra el chance",
  epilogue:
    "Detrás de la caseta hay una lotería; detrás de varias loterías y consorcios hay curules. Diputados y senadores de PRM, PLD y FP han declarado ser dueños de bancas, y el proyecto de ley no les prohíbe votar las reglas de su propio negocio. Por eso el juego no se toca: cambias de partido y la banca conserva su asiento. Eso es El Núcleo. Lo que sí puedes hacer: buscar la declaración jurada de tu legislador en la Cámara de Cuentas.",
  entry: {
    hubId: "c-mecanismo-juego",
    satelliteIds: [
      "c-curules-banca",
      "e-loteka-fixtil",
      "e-lotedom",
      "c-ley-juego",
      "c-brecha-bancas",
      "c-jugador",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "¿Quién gana cuando tú juegas?",
      detail:
        "Panorama (2025): hay más bancas que colmados, que farmacias, que escuelas. Casi todo en efectivo. El número ganador cambia cada noche; el que cobra no.",
      nodeIds: ["c-mecanismo-juego", "c-jugador", "i-loteria-nacional"],
      panelId: "c-mecanismo-juego",
    },
    {
      id: 2,
      line: "Detrás de la caseta hay una lotería.",
      detail:
        "Las bancas venden bajo la sombrilla de una lotería: la Nacional (estatal) o concesionarias electrónicas privadas como Leidsa, Loteka o Lotedom (Dirección de Casinos). Cientos de consorcios cuelgan de esas sombrillas.",
      nodeIds: ["c-mecanismo-juego", "e-loteka-fixtil", "e-lotedom", "i-loteria-nacional"],
      panelId: "c-mecanismo-juego",
    },
    {
      id: 3,
      line: "Loteka: el dueño es al portador.",
      detail:
        "Su matriz, Fixtil Corporation, es extranjera y con acciones al portador: no se sabe con certeza quién es dueño (Panorama). Pero dos legisladores declaran acciones en Fixtil, y Nuria mostró a Donald Guerrero, luego ministro de Hacienda, presidiendo la empresa dueña de la marca.",
      nodeIds: ["e-loteka-fixtil", "c-curules-banca", "c-brecha-bancas"],
      panelId: "e-loteka-fixtil",
    },
    {
      id: 4,
      line: "Lotedom: concesión y curul, misma persona.",
      detail:
        "Panorama: el diputado Orlando Martínez (PRM) es accionista mayoritario de Lotedom, con más de 6,700 bancas, y dueño de Bancas OM. El periódico señala al menos 1,381 sin permisos: señalamiento, no sentencia.",
      nodeIds: ["e-lotedom", "c-curules-banca", "c-brecha-bancas"],
      panelId: "e-lotedom",
    },
    {
      id: 5,
      line: "Curules con banca: PRM, PLD y FP.",
      detail:
        "En sus propias declaraciones juradas, al menos ocho o nueve diputados aparecían como dueños de consorcios de bancas (Diario Libre; Nuria, 2022): Martínez, Cuevas y Florián (PRM); Echavarría y Gil (PLD); Espiritusanto (FP), hoy senador. No es un partido: son los tres.",
      nodeIds: ["c-curules-banca", "e-lotedom", "e-loteka-fixtil"],
      panelId: "c-curules-banca",
    },
    {
      id: 6,
      line: "La brecha: más de 40 mil fuera del padrón.",
      detail:
        "Fenabanca (RCC): ~31 mil bancas legales frente a ~71 mil identificadas en 2022. La propia federación ha denunciado bancas sin regularizar en consorcios de legisladores. Son denuncias: el punto es quién debería fiscalizarse a sí mismo.",
      nodeIds: ["c-brecha-bancas", "o-fenabanca", "c-curules-banca"],
      panelId: "c-brecha-bancas",
    },
    {
      id: 7,
      line: "La ley la votan los dueños.",
      detail:
        "El Decreto 197-26 reactiva la regularización y Hacienda llevó un proyecto de ley al Congreso. Panorama: no pone tope de bancas, no prohíbe legisladores banqueros, no prohíbe acciones al portador. El regulado se sienta en la curul del regulador.",
      nodeIds: ["c-ley-juego", "c-curules-banca", "c-decreto-197-26", "i-hacienda-juego"],
      panelId: "c-ley-juego",
    },
    {
      id: 8,
      line: "Por eso no se toca: eso es El Núcleo.",
      detail:
        "Votes por el partido que votes, la banca ya tiene asiento en el Congreso. El voto cambia la cara; los dueños del juego siguen en la mesa donde se escriben sus reglas.",
      nodeIds: ["c-nucleo", "c-curules-banca", "c-ley-juego", "c-mecanismo-juego"],
      panelId: "c-nucleo",
      pathEdges: true,
    },
    {
      id: 9,
      line: "Tu jugada: mira la declaración jurada.",
      detail:
        "Las declaraciones juradas de legisladores son públicas en la Cámara de Cuentas. Busca a tu diputado y a tu senador: ahí aparece quién es dueño de qué. Exige tope de bancas e incompatibilidad para legisladores.",
      nodeIds: ["c-jugador", "c-curules-banca", "c-ley-juego"],
      panelId: "c-jugador",
    },
  ],
};
