/**
 * Recorrido narrativo — tema Migración.
 *
 * Historia: juego cerrado.
 * El Estado deporta · redes (con denuncias de autoridades) reingresan ·
 * la economía contrata. La pelea ONU/ONG vs «soberanía» es la cortina.
 */

export const MIGRACION_TOUR = {
  id: "migracion-negocio-cerrado",
  theme: "migracion",
  title: "Quién gana con el cruce",
  epilogue:
    "No es que «no se pueda frenar la migración». Es que hay un negocio montado con la logística del propio Estado y con la demanda del agro y la construcción. Deportan 670,500 —y el ciclo sigue— porque el peaje y la nómina barata no se tocan. Las ONG pelean el relato; el mapa muestra la cuenta. El Estado no puede frenar del todo lo que el sistema mismo alimenta.",
  entry: {
    hubId: "i-dgm",
    satelliteIds: [
      "i-cesfront",
      "e-jad",
      "c-negocio-cerrado",
      "c-camion-doble-via",
      "c-ciclo-deportacion",
      "c-paradoja-laboral",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "670,500 deportaciones. La cifra es oficial.",
      detail:
        "El director de la DGM, Luis Rafael Lee Ballester, reportó 670,500 deportaciones de haitianos en unos 21 meses (octubre 2024–junio 2026). En 2025 sola: 379,553. No es rumor de redes: es el propio Estado contando. La pregunta no es si deportan. Es por qué el flujo no se agota.",
      nodeIds: ["i-dgm", "c-ciclo-deportacion"],
      panelId: "i-dgm",
    },
    {
      id: 2,
      line: "Si deportas más gente de la que «hay», alguien está volviendo.",
      detail:
        "Esas 670,500 salidas superan estimaciones frecuentes de la comunidad haitiana residente. La aritmética no cuadra con una expulsión definitiva: cuadra con un ciclo. Misma persona, varias vueltas por el contador. Cada vuelta alimenta operativos… y peajes.",
      nodeIds: ["c-ciclo-deportacion", "i-dgm"],
      panelId: "c-ciclo-deportacion",
    },
    {
      id: 3,
      line: "En Dajabón lo dicen sin rodeos: es un negocio redondo.",
      detail:
        "Nelson Ramón Peralta, vecino de Loma de Cabrera, a El Nacional: el tráfico es incontrolable, «hay autoridades que son parte de él». Nombra Migración, CESFRONT, guardias, G2, choferes y poteas. Afirma que deja «más que la droga, más que el petróleo, que el oro». Es testimonio publicado — no una sentencia — pero pone nombres al circuito.",
      nodeIds: ["p-nelson-peralta", "i-dgm", "i-cesfront", "c-negocio-cerrado"],
      panelId: "p-nelson-peralta",
    },
    {
      id: 4,
      line: "El camión que deporta… ¿regresa lleno?",
      detail:
        "El Nacional cita una fuente anónima: los mismos camiones celda de la DGM que expulsan de día volverían de noche con indocumentados bajo pago. La placa institucional reduce controles. «¿Quién va a detener un vehículo oficial?» Es denuncia periodística. Si es cierta, la logística del Estado es también la logística del peaje.",
      nodeIds: ["c-camion-doble-via", "i-dgm", "c-ciclo-deportacion"],
      panelId: "c-camion-doble-via",
      pathFrom: ["i-dgm"],
    },
    {
      id: 5,
      line: "Frontera: filtro, no muro.",
      detail:
        "CESFRONT y retenes deciden el paso. Reportajes y fiscales describen cobros para dejar pasar grupos; probarlo es difícil. En 2006, en Dajabón, militares fueron condenados por cobrar en un tráfico que terminó con 24 muertos. El peaje informal convierte el control en mercancía. Las poteas cobran ~RD$17,000 a la capital, ~RD$10,000 a Santiago (El Nacional).",
      nodeIds: ["i-cesfront", "c-retenes", "c-poteas"],
      panelId: "i-cesfront",
    },
    {
      id: 6,
      line: "Mientras deportan, el campo pide brazos.",
      detail:
        "La JAD (Osmar Benítez): el banano es el sector que más usa mano de obra haitiana; en banano ~90% de la mano de obra es no calificada y en gran parte extranjera. Arroz, café, ganadería siguen. Construcción y servicios tiran de la misma vena. Deportar sin regularizar no cierra la demanda: la precariedad.",
      nodeIds: ["e-jad", "c-banano", "c-construccion-turismo", "c-paradoja-laboral"],
      panelId: "e-jad",
    },
    {
      id: 7,
      line: "Paradoja: expulsan y contratan.",
      detail:
        "Se pide no traer más haitianos y a la vez se depende de ellos. Biometrizar en banano no desmonta el ciclo de deportación masiva. El trabajador produce, a veces cotiza, y vive con miedo al operativo. No es solo migración: es explotación con permiso a medias del Estado.",
      nodeIds: ["c-paradoja-laboral", "c-ciclo-deportacion", "e-jad"],
      panelId: "c-paradoja-laboral",
      pathFrom: ["e-jad"],
    },
    {
      id: 8,
      line: "ONG y «soberanía»: la pelea que tapa la cuenta.",
      detail:
        "OIM documenta a RD como gran expulsor hacia Haití. Amnistía denuncia expulsiones colectivas y racismo (plan de hasta 10,000 semanales, oct 2024). Esa presión alimenta el discurso de «nos quitan la soberanía». Mientras el público pelea el relato, el peaje y la nómina barata siguen. La cortina no es el negocio: tapa el negocio.",
      nodeIds: ["i-oim", "o-amnistia", "c-cortina-soberania", "c-negocio-cerrado"],
      panelId: "c-cortina-soberania",
    },
    {
      id: 9,
      line: "Tres patas. Un solo juego.",
      detail:
        "DGM publica la cifra y mueve la logística. CESFRONT/retenes filtran (con denuncias de peaje). JAD y sectores productivos demandan brazos. Poteas y transporte cobran el cruce. ONU/ONG pelean el relato. Tú ves «invasión» o «derechos». El mapa muestra el circuito: el Estado no puede frenar del todo lo que el sistema mismo alimenta.",
      nodeIds: [
        "c-negocio-cerrado",
        "i-dgm",
        "i-cesfront",
        "e-jad",
        "c-camion-doble-via",
        "c-paradoja-laboral",
        "c-cortina-soberania",
      ],
      panelId: "c-negocio-cerrado",
      pathEdges: true,
    },
  ],
};
