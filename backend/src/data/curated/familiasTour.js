/**
 * Recorrido — Familias.
 */

export const FAMILIAS_TOUR = {
  id: "familias-casas",
  theme: "familias",
  title: "No son empresas. Son casas.",
  epilogue:
    "No son solo “empresarios exitosos”. Son familias que durante generaciones han capturado sectores enteros. No compiten solo en el mercado. Compiten por el Estado. Y cuando lo capturan, el Estado trabaja con ellas — y a menudo para ellas.",
  entry: {
    hubId: "c-casas",
    satelliteIds: [
      "e-grupo-vicini",
      "e-grupo-rizek",
      "e-grupo-corripio",
      "e-grupo-popular",
      "e-grupo-marti",
      "e-grupo-bonetti",
      "e-grupo-rainieri",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Olvida el organigrama de empresas sueltas.",
      detail:
        "En RD el poder económico se lee por casas: Vicini, Rizek, Corripio, Popular, BHD, Martí, Bonetti, Rainieri. Cada una toca varios sectores a la vez. Esa es la unidad real.",
      nodeIds: ["c-casas", "e-grupo-vicini", "e-grupo-rizek", "e-grupo-corripio"],
      panelId: "c-casas",
    },
    {
      id: 2,
      line: "Vicini / INICIA: capital viejo.",
      detail:
        "Más de un siglo en el país. En 2016 VICINI pasó a llamarse INICIA. Juan Bautista Vicini fue uno de los que asumieron Listín Diario en 2010. Casa histórica, brazo en medios y activos.",
      nodeIds: ["e-grupo-vicini", "m-listin", "c-casas"],
      panelId: "e-grupo-vicini",
    },
    {
      id: 3,
      line: "Rizek: pensiones, combustible, cacao… y la Junta Monetaria.",
      detail:
        "AFP Crecer. PATSA/Refidomsa. Rizek Cacao. Héctor José Rizek Llabaly: miembro de la Junta Monetaria desde 1985. Misma familia, cuatro venas. Si buscas “Rizek”, esto es lo que debe verse junto.",
      nodeIds: [
        "e-grupo-rizek",
        "e-afp-crecer",
        "e-patsa",
        "e-refidomsa",
        "e-rizek-cacao",
        "p-hector-rizek",
        "i-junta-monetaria",
      ],
      panelId: "e-grupo-rizek",
    },
    {
      id: 4,
      line: "Corripio: la pantalla y el titular.",
      detail:
        "Hoy, Telesistema, Teleantillas, El Día, El Nacional — y participación en Listín. Quien concentra pantallas concentra la conversación pública.",
      nodeIds: ["e-grupo-corripio", "m-listin"],
      panelId: "e-grupo-corripio",
    },
    {
      id: 5,
      line: "Popular y BHD: banca + AFP.",
      detail:
        "Grupo Popular → Banco Popular + AFP Popular. Centro Financiero BHD → banco + AFP Siembra. El mismo capital que guarda tu depósito administra tu pensión.",
      nodeIds: [
        "e-grupo-popular",
        "e-banco-popular",
        "e-afp-popular",
        "e-grupo-bhd",
        "e-banco-bhd",
      ],
      panelId: "e-grupo-popular",
    },
    {
      id: 6,
      line: "Martí: la manguera del combustible.",
      detail:
        "Tropigas y Sunix — GLP y líquidos desde la importación hasta la entrega. Otra casa, otro sector crítico del día a día.",
      nodeIds: ["e-grupo-marti", "c-casas"],
      panelId: "e-grupo-marti",
    },
    {
      id: 7,
      line: "Bonetti / SID y Rainieri / Puntacana.",
      detail:
        "Alimentos e industria (SID). Turismo e infraestructura propia (Puntacana + aeropuerto). Dos casas más que no viven de un solo negocio.",
      nodeIds: ["e-grupo-bonetti", "e-grupo-rainieri", "c-casas"],
      panelId: "e-grupo-bonetti",
    },
    {
      id: 8,
      line: "Listín: un nodo, varias familias.",
      detail:
        "En 2010 Vicini, Rizek, Bermúdez y Corripio asumieron el control accionario. El medio no es “de un solo dueño”: es un cruce de casas. Por eso el grafo no puede fragmentarse por tema.",
      nodeIds: ["m-listin", "e-grupo-vicini", "e-grupo-rizek", "e-grupo-corripio"],
      panelId: "m-listin",
    },
    {
      id: 9,
      line: "El Estado se sienta en esa geografía.",
      detail:
        "Cuando ves deuda, pensiones, gasolina o medios, no son mundos aparte. Son capas de las mismas casas. Centinela las nombra para que dejen de parecer “el mercado” anónimo.",
      nodeIds: [
        "c-casas",
        "e-grupo-rizek",
        "e-grupo-vicini",
        "e-grupo-corripio",
        "e-grupo-popular",
        "e-grupo-marti",
        "i-junta-monetaria",
      ],
      panelId: "c-casas",
      pathEdges: true,
    },
  ],
};
