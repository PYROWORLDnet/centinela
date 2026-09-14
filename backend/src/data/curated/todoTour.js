/**
 * Recorrido narrativo — tema Todo.
 * Roadmap del sistema: una historia que une las puertas.
 */

export const TODO_TOUR = {
  id: "todo-roadmap",
  theme: "todo",
  title: "Cómo se sostiene el sistema",
  epilogue:
    "Ya viste el plano. Pensiones, deuda, banca, partidos, gasolina, electricidad, aduana, medios, construcción, migración, minería, ONU/ONG y familias no son silos: son la misma red vista por puertas distintas. Entra a cada tema para el detalle con fuentes. El mapa crece; el mecanismo es el mismo.",
  entry: {
    hubId: "c-sistema",
    satelliteIds: [
      "c-ocho-puertas",
      "i-cnss",
      "i-jce",
      "i-micm",
      "i-sie",
      "i-hacienda",
      "c-casas",
      "c-filtros",
      "i-junta-monetaria",
      "i-dga",
      "c-cadena-construccion",
      "i-dgm",
      "c-pueblo-viejo",
      "c-mecanismo-ong",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Esto no son pantallas sueltas.",
      detail:
        "Es una sola red. Cada tema es una puerta. El Todo es el plano: cómo se conectan tu sueldo, el Estado, los bancos, los partidos, el combustible, la luz, la aduana, los medios, la construcción, la migración, la minería, la cooperación internacional y las casas.",
      nodeIds: ["c-sistema", "c-ocho-puertas"],
      panelId: "c-sistema",
    },
    {
      id: 2,
      line: "Empieza por tu nómina.",
      detail:
        "Cada mes te descuentan. Ese dinero va a una AFP. Gran parte se presta al Estado. Tu pensión financia deuda pública. En Pensiones está el ciclo completo.",
      nodeIds: ["i-cnss", "c-sistema", "e-afp-popular", "e-afp-crecer"],
      panelId: "i-cnss",
      pathFrom: ["c-sistema"],
    },
    {
      id: 3,
      line: "Esa deuda hay que pagarla.",
      detail:
        "Hacienda emite. AFP y bancos compran. Tú pagas impuestos que cubren intereses. El dinero da la vuelta y vuelve a los mismos nodos.",
      nodeIds: ["i-hacienda", "c-sistema", "e-grupo-popular", "e-grupo-rizek"],
      panelId: "i-hacienda",
      pathFrom: ["c-sistema"],
    },
    {
      id: 4,
      line: "El corazón que bombea ese dinero es la banca.",
      detail:
        "Junta Monetaria, bancos y AFP del mismo capital. Popular, BHD, Banreservas: depósitos, pensiones y acceso a la deuda pública.",
      nodeIds: ["i-junta-monetaria", "e-banco-popular", "e-banco-bhd", "e-banreservas"],
      panelId: "i-junta-monetaria",
      pathFrom: ["c-sistema"],
    },
    {
      id: 5,
      line: "¿Quién escribe las reglas del juego político?",
      detail:
        "Sin independientes (Ley 13-26). El dinero público premia a los grandes. El partido chico no gana: negocia e integra.",
      nodeIds: ["i-jce", "c-sistema"],
      panelId: "i-jce",
      pathFrom: ["c-sistema"],
    },
    {
      id: 6,
      line: "Cada semana pagas en la bomba.",
      detail:
        "El MICM fija el precio. El Estado es dueño de la refinería. Rizek/PATSA y Martí tocan suministro y manguera. Tú pagas el subsidio.",
      nodeIds: ["i-micm", "e-refidomsa", "e-grupo-rizek", "e-grupo-marti"],
      panelId: "i-micm",
      pathFrom: ["c-sistema"],
    },
    {
      id: 7,
      line: "Y cada mes, la luz.",
      detail:
        "SIE regula. Las EDE (estatales) reparte. Pérdidas enormes → subsidio del presupuesto. Punta Catalina y generación mixta. En el Este turístico, CEPM/InterEnergy. Misma lógica: Estado + privados + contribuyente.",
      nodeIds: ["i-sie", "c-sistema", "e-edesur", "c-subsidio-electrico", "e-cepm"],
      panelId: "i-sie",
      pathFrom: ["c-sistema"],
    },
    {
      id: 8,
      line: "Por la aduana entra lo que consumes.",
      detail:
        "La DGA es la puerta. Martí, Corripio, Rizek, Bonetti — quien importa con volumen no llega solo.",
      nodeIds: ["i-dga", "e-grupo-marti", "e-grupo-bonetti", "e-grupo-corripio"],
      panelId: "i-dga",
      pathFrom: ["c-sistema"],
    },
    {
      id: 9,
      line: "Con qué se construye el país.",
      detail:
        "Cemento, concreto, acero, obra. ADOCEM agrupa productores. Estrella integra la cadena. Multinacionales (Cemex, Domicem…) compiten en la materia prima.",
      nodeIds: ["c-cadena-construccion", "e-grupo-estrella", "e-cemento-panam", "e-adocem"],
      panelId: "c-cadena-construccion",
      pathFrom: ["c-sistema"],
    },
    {
      id: 10,
      line: "Bajo tierra: el oro y el contrato.",
      detail:
        "Pueblo Viejo no es solo una mina. Es el CEAM de 2002 (RNF 3.2%), Barrick 60% / Newmont 40%, la enmienda 2013 y el debate de si el Estado cobra el windfall del oro. En Minería está el mapa con fuentes; Hacienda siente la caja.",
      nodeIds: ["c-pueblo-viejo", "c-ceam-2002", "e-barrick", "i-hacienda", "c-comunidades-cotui"],
      panelId: "c-pueblo-viejo",
      pathFrom: ["c-sistema"],
    },
    {
      id: 11,
      line: "Quién financia la presión internacional.",
      detail:
        "USAID pone cientos de millones; socios locales (FINJUS, IDDI) y agencias ONU (OIM, PNUD) ejecutan; Amnistía empuja con informes; el Estado responde con soberanía. En ONU/ONG está el circuito — y la cortina que a veces tapa otras cuentas.",
      nodeIds: [
        "c-mecanismo-ong",
        "i-usaid",
        "o-amnistia",
        "c-backlash-soberania",
        "c-cortina-soberania",
      ],
      panelId: "c-mecanismo-ong",
      pathFrom: ["c-sistema"],
    },
    {
      id: 12,
      line: "Los medios filtran lo que ves.",
      detail:
        "Corripio concentra pantallas. Vicini y otros pesan en el papel. A menudo omiten el mapa.",
      nodeIds: ["c-filtros", "e-grupo-corripio", "e-grupo-vicini", "m-listin"],
      panelId: "c-filtros",
      pathFrom: ["c-sistema"],
    },
    {
      id: 13,
      line: "Debajo de todo: las casas.",
      detail:
        "La Cúpula agrupa las casas: Vicini, Corripio, Rainieri, Fanjul, Rizek, González Cuadra, Brache, Estrella, Félix García, Popular, BHD, Banreservas, La Sirena, El Nacional. Familias es el mapa de apellidos; los otros temas son los sectores. La Cúpula no es un tema: es el nodo que aparece al buscar cualquiera de esos nombres.",
      nodeIds: [
        "c-casas",
        "c-casas-puente",
        "c-la-cupula",
        "e-grupo-vicini",
        "e-grupo-rizek",
        "e-grupo-estrella",
        "e-grupo-rainieri",
      ],
      panelId: "c-casas",
      pathFrom: ["c-sistema"],
    },
    {
      id: 14,
      line: "El puente no es solo Rizek.",
      detail:
        "Roryk cruza AFP, combustible y —históricamente— la Junta Monetaria (Héctor José falleció en 2026). Estrella cruza cemento, obra y CDN. Linda cruza medios y AES. Brache cruza Rica y el consejo de Popular. Rainieri cruza turismo y la zona de CEPM.",
      nodeIds: [
        "c-casas-puente",
        "c-la-cupula",
        "e-grupo-rizek",
        "e-grupo-estrella",
        "e-grupo-linda",
        "e-grupo-brache",
      ],
      panelId: "c-la-cupula",
    },
    {
      id: 15,
      line: "Y la frontera también es un negocio.",
      detail:
        "Migración: deportan 670,500 y el ciclo sigue. Camiones, retenes, agro y construcción. Misma lógica de juego cerrado — con la logística del Estado en el medio. En Migración está el mapa.",
      nodeIds: ["i-dgm", "c-sistema", "c-negocio-cerrado", "e-jad"],
      panelId: "i-dgm",
      pathFrom: ["c-sistema"],
    },
    {
      id: 16,
      line: "Ahora elige una puerta.",
      detail:
        "Escuchaste el plano. En el navbar haz scroll: Migración, Minería y ONU/ONG ya están. Dale play en cada tema. El Todo siempre será el resumen para entender el sistema de un tirón.",
      nodeIds: ["c-ocho-puertas", "c-sistema"],
      panelId: "c-ocho-puertas",
    },
  ],
};
