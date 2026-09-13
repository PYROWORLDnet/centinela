/**
 * Recorrido narrativo — tema ONU / ONG.
 *
 * Historia: quién financia, quién presiona, por qué hay backlash.
 * Plata → socios → informes → reacción soberanista → cortina.
 */

export const ONG_TOUR = {
  id: "ong-quien-financia",
  theme: "ong",
  title: "Quién financia la presión",
  epilogue:
    "No es un juicio a «las ONG». Es un mecanismo: donantes (USAID y otros) ponen cientos de millones; socios locales e internacionales ejecutan; Amnistía y agencias ONU mueven la presión normativa; el Estado responde con soberanía en voz alta. Esa pelea es real — y a veces tapa otras cuentas del mapa. Sigue la plata. Mira la reacción. Pregunta qué quedó fuera del titular.",
  entry: {
    hubId: "c-mecanismo-ong",
    satelliteIds: [
      "i-usaid",
      "c-flujo-plata",
      "o-finjus",
      "i-oim",
      "o-amnistia",
      "c-presion-normativa",
      "c-backlash-soberania",
      "c-cortina-soberania",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "No empieces por el grito. Empieza por el circuito.",
      detail:
        "ONU/ONG en RD no es un villano suelto ni un coro de santos. Es un mecanismo: entra plata, salen proyectos e informes, sube la presión política, y el Estado contesta con soberanía. Si solo ves el insulto en redes, te comes la cortina.",
      nodeIds: ["c-mecanismo-ong", "i-usaid", "o-amnistia"],
      panelId: "c-mecanismo-ong",
    },
    {
      id: 2,
      line: "La plata tiene número: US$238 millones en pipeline USAID.",
      detail:
        "MEPyD (feb 2025): 24 iniciativas USAID en implementación valorizadas en US$238.3 MM no reembolsables. USAFacts: en FY2024 EE.UU. obligó ~US$107.8 MM de ayuda a RD (USAID ~US$39.2 MM ese año). Eso no es rumor de Telegram: es inventario estatal y dato fiscal estadounidense.",
      nodeIds: ["i-usaid", "i-mepyd", "c-flujo-plata"],
      panelId: "i-usaid",
    },
    {
      id: 3,
      line: "La plata no cae del cielo: cae en socios.",
      detail:
        "MEPyD nombra ejecutores: Chemonics, PACT, Winrock, PNUD, ministerios… La Embajada EE.UU. publicó alianzas USAID con FINJUS, IDDI y PUCMM para sociedad civil y seguridad ciudadana. «Las ONG» en abstracto no existen: existen contratos y grants con nombre.",
      nodeIds: ["c-flujo-plata", "o-finjus", "o-iddi", "i-pnud"],
      panelId: "c-flujo-plata",
      pathFrom: ["i-usaid"],
    },
    {
      id: 4,
      line: "La ONU también mide — y eso duele.",
      detail:
        "OIM documenta deportaciones hacia Haití (DTM 2024) y trabaja con PNUD en la frontera. No legisla en el Congreso, pero publica cifras que alimentan titulares y diplomacia. Datos + mandato humanitario = presión blanda.",
      nodeIds: ["i-oim", "i-pnud", "c-presion-normativa"],
      panelId: "i-oim",
    },
    {
      id: 5,
      line: "Amnistía no trae el cheque USAID. Trae el costo político.",
      detail:
        "Oct 2024: Amnistía pidió frenar las «deportaciones racistas» y expulsiones colectivas tras el plan de hasta 10,000 semanales. En 2025 atacó el protocolo hospitalario. Distinto del pipeline USAID: aquí la arma es el informe y el titular.",
      nodeIds: ["o-amnistia", "c-presion-normativa"],
      panelId: "o-amnistia",
    },
    {
      id: 6,
      line: "El Estado no se queda callado: vende soberanía.",
      detail:
        "Abinader a Amnistía: «que vayan a trabajar en Haití». Frente a críticas de la ONU por el protocolo en hospitales, insiste en que deportan conforme a la ley. Eso es backlash documentado — reacción política al costo reputacional, no prueba de que «la ONU manda el país».",
      nodeIds: ["c-backlash-soberania", "o-amnistia", "c-presion-normativa"],
      panelId: "c-backlash-soberania",
      pathFrom: ["o-amnistia"],
    },
    {
      id: 7,
      line: "La pelea es real. También puede tapar el resto del mapa.",
      detail:
        "Mientras el feed pelea derechos humanos vs soberanía, otras cuentas siguen: peaje fronterizo, mano de obra barata, contratos extractivos. Earthworks, por ejemplo, presiona el frente minero. La cortina no niega la pelea: advierte qué queda fuera de cámara.",
      nodeIds: ["c-cortina-soberania", "o-earthworks", "c-mecanismo-ong"],
      panelId: "c-cortina-soberania",
    },
    {
      id: 8,
      line: "Regla Centinela: sigue la plata, mira la reacción.",
      detail:
        "Donante → socio → presión → backlash. Si el titular solo te deja furioso con «la ONU» o solo con «el gobierno», te faltó una pata. En Migración verás cómo esta cortina se cruza con el negocio del cruce. Aquí el mapa es el circuito completo.",
      nodeIds: [
        "c-mecanismo-ong",
        "i-usaid",
        "c-flujo-plata",
        "o-amnistia",
        "c-backlash-soberania",
        "c-cortina-soberania",
      ],
      panelId: "c-mecanismo-ong",
      pathEdges: true,
    },
  ],
};
