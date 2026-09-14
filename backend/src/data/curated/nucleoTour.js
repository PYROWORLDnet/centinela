/**
 * Recorrido narrativo — El Núcleo.
 * 9 pasos: por qué votar por un partido nuevo no cambia el sistema.
 */

export const NUCLEO_TOUR = {
  id: "nucleo-no-se-toca",
  theme: "nucleo",
  title: "El Núcleo no se toca",
  epilogue:
    "No es un partido. No es un presidente. Es un sistema. Y los sistemas no se caen solos. Se caen cuando la gente deja de aplaudir. Cuando deja de creer en promesas. Cuando exige hechos. Cuando el Núcleo deja de ser intocable. No es que ningún presidente nuevo pueda cambiar esto. Es que ninguno va a poder hacerlo mientras el Núcleo siga en venta. El Núcleo no se toca. Ni con dinero, ni con apellidos, ni con poder. Y el que lo toque, que lo pague.",
  entry: {
    hubId: "c-nucleo",
    satelliteIds: [
      "p-prm",
      "p-pld",
      "p-fp",
      "e-afp-popular",
      "e-refidomsa",
      "c-sistema-electrico",
      "i-hacienda",
      "c-la-cupula",
      "c-pueblo",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "No es un partido. No es un presidente. Es el Núcleo.",
      detail:
        "PRM, PLD, FP: tres caras conectadas al mismo centro. Compiten por el Palacio. No compiten por desmontar el perímetro. El tema no es quién gana la próxima elección. Es qué nadie puede tocar.",
      nodeIds: ["c-nucleo", "p-prm", "p-pld", "p-fp", "c-regla-intocable"],
      panelId: "c-nucleo",
    },
    {
      id: 2,
      line: "El dinero entra por todos lados.",
      detail:
        "Pensiones (AFP), gasolina (subsidio/refinería), electricidad (pérdidas y contratos), deuda (bonos de Hacienda). Cada tema que ya exploraste es un canal que alimenta al Núcleo. No son silos: son tuberías al mismo centro.",
      nodeIds: [
        "c-nucleo",
        "e-afp-popular",
        "e-afp-crecer",
        "e-refidomsa",
        "c-sistema-electrico",
        "i-hacienda",
      ],
      panelId: "c-nucleo",
    },
    {
      id: 3,
      line: "El Estado ya no decide solo.",
      detail:
        "El Núcleo controla —vía casas y contratos— las AFP que compran los bonos, los generadores que venden la energía, los importadores y la refinería que tocan la gasolina. El Estado depende de ellos para funcionar. Gobernar es negociar con ese centro.",
      nodeIds: [
        "c-nucleo",
        "e-grupo-rizek",
        "e-afp-crecer",
        "e-patsa",
        "e-grupo-popular",
        "c-sistema-electrico",
      ],
      panelId: "e-grupo-rizek",
    },
    {
      id: 4,
      line: "Por eso el presidente nuevo no puede cambiar nada.",
      detail:
        "JCE reparte financiamiento. PRM, PLD y FP concentran la plata grande. El que llega, ya llegó debiendo: campaña, gobernabilidad, deuda, luz, combustible, narrativa. La cadena no empieza en el Palacio. Empieza en el Núcleo.",
      nodeIds: ["i-jce", "p-prm", "p-pld", "p-fp", "c-nucleo", "c-voto-no-basta"],
      panelId: "i-jce",
      pathFrom: ["c-nucleo"],
    },
    {
      id: 5,
      line: "Ejemplos del mundo: el núcleo no se vende.",
      detail:
        "Ilustraciones — no recetas. Singapur: apertura con núcleo estatal que no se negocia como mercancía. China: el dinero extremo (Xu Jiayin / Evergrande) no compra inmunidad soberana. Tailandia: filtros históricos a la tierra extranjera. ¿RD? En este mapa, el dinero abre casi todas las puertas.",
      nodeIds: [
        "c-nucleo",
        "c-ejemplo-singapur",
        "c-ejemplo-china",
        "c-ejemplo-tailandia",
      ],
      panelId: "c-ejemplo-singapur",
    },
    {
      id: 6,
      line: "El ejemplo de Bukele.",
      detail:
        "Ilustración — no endoso. No es que sea “nuevo”. Es la narrativa de llegar cuando el pueblo ya no tiene miedo, el establishment está desacreditado, y él no le debe el poder al mismo circuito. Sin esas condiciones, “un nuevo” es solo otra cara.",
      nodeIds: ["p-bukele", "c-voto-no-basta", "c-pueblo", "c-nucleo"],
      panelId: "p-bukele",
    },
    {
      id: 7,
      line: "Por eso no basta con “un nuevo”.",
      detail:
        "Tiene que ser alguien que no negocie el perímetro. Que toque el Núcleo sin pedir permiso. Pero eso solo ocurre si el pueblo ya no tiene miedo — y si deja de tratar el voto como talismán.",
      nodeIds: ["c-voto-no-basta", "c-pueblo", "c-nucleo", "c-regla-intocable"],
      panelId: "c-voto-no-basta",
    },
    {
      id: 8,
      line: "El pueblo tiene que dejar de creer en promesas.",
      detail:
        "Creer en hechos. En arrestos. En consecuencias. No en discursos. No en “buenas ideas”. No en el próximo que diga “yo sí voy a cambiar”. Mientras el aplauso sea barato, el Núcleo sigue caro de tocar.",
      nodeIds: ["c-pueblo", "c-voto-no-basta", "c-nucleo"],
      panelId: "c-pueblo",
    },
    {
      id: 9,
      line: "Mientras el Núcleo siga en venta, el que llegue hará lo mismo.",
      detail:
        "El cambio no empieza en el Palacio. Empieza cuando el Núcleo deja de ser intocable. Y eso no lo hace un presidente. Lo hace un pueblo que deja de aplaudir. Los otros temas muestran los mecanismos. Este muestra por qué ninguno se cambia solo con un voto.",
      nodeIds: [
        "c-nucleo",
        "c-pueblo",
        "c-la-cupula",
        "e-afp-popular",
        "e-refidomsa",
        "c-sistema-electrico",
        "i-hacienda",
        "m-listin",
      ],
      panelId: "c-nucleo",
      pathEdges: true,
    },
  ],
};
