/**
 * Recorrido — Banca y Seguros.
 */

export const BANCA_TOUR = {
  id: "banca-corazon",
  theme: "banca",
  title: "El corazón que bombea el dinero",
  epilogue:
    "No es solo un “sistema bancario”. Es un reparto de casas: cada una con su banco, su AFP, su acceso a la deuda pública. Tú eres el cliente que deposita, cotiza y paga comisiones — mientras el flujo vuelve a los mismos nodos.",
  entry: {
    hubId: "i-junta-monetaria",
    satelliteIds: [
      "i-superintendencia-bancos",
      "i-banco-central",
      "e-banco-popular",
      "e-banco-bhd",
      "e-banreservas",
      "p-hector-rizek",
      "c-corazon-bancario",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Arriba está la Junta Monetaria.",
      detail:
        "Ahí se definen reglas del dinero. No es un detalle técnico: es la mesa donde el sistema financiero toma forma. Y en esa mesa también se sientan nombres con casa propia.",
      nodeIds: ["i-junta-monetaria", "i-banco-central", "c-corazon-bancario"],
      panelId: "i-junta-monetaria",
    },
    {
      id: 2,
      line: "Rizek está en esa mesa desde 1985.",
      detail:
        "Héctor José Rizek Llabaly: miembro de la Junta Monetaria desde 1985 (Bloomberg Línea). La misma familia de AFP Crecer y PATSA. Regulación y negocio, misma casa.",
      nodeIds: ["p-hector-rizek", "i-junta-monetaria", "e-grupo-rizek", "e-afp-crecer"],
      panelId: "p-hector-rizek",
    },
    {
      id: 3,
      line: "Abajo, los bancos grandes.",
      detail:
        "Popular, BHD, Banreservas. Tres pilares. Privados de casa y el estatal. La Superintendencia los supervisa; el flujo real es el de depósitos, crédito y papeles del Estado.",
      nodeIds: ["e-banco-popular", "e-banco-bhd", "e-banreservas", "i-superintendencia-bancos"],
      panelId: "c-corazon-bancario",
    },
    {
      id: 4,
      line: "Popular: banco + AFP del mismo ecosistema.",
      detail:
        "Grupo Popular controla Banco Popular y AFP Popular. Misma casa, dos puertas al bolsillo del ciudadano: el depósito y la pensión.",
      nodeIds: ["e-grupo-popular", "e-banco-popular", "e-afp-popular"],
      panelId: "e-grupo-popular",
    },
    {
      id: 5,
      line: "BHD: banco + AFP Siembra.",
      detail:
        "Centro Financiero BHD → banco y AFP Siembra. Otra casa, el mismo patrón: intermediación financiera + administración de pensiones.",
      nodeIds: ["e-grupo-bhd", "e-banco-bhd", "e-afp-siembra"],
      panelId: "e-grupo-bhd",
    },
    {
      id: 6,
      line: "Banreservas + AFP Reservas.",
      detail:
        "El brazo estatal del mismo diseño: banco público y AFP del ecosistema Reservas. El Estado también juega con ficha propia en el tablero.",
      nodeIds: ["e-banreservas", "e-afp-reservas"],
      panelId: "e-banreservas",
    },
    {
      id: 7,
      line: "Rizek entra por la AFP — y por la Junta.",
      detail:
        "No tiene el “Banco Rizek” en este mapa, pero tiene AFP Crecer y asiento histórico en la Junta Monetaria. Otra forma de estar en el corazón del sistema.",
      nodeIds: ["e-grupo-rizek", "e-afp-crecer", "i-junta-monetaria", "p-hector-rizek"],
      panelId: "e-grupo-rizek",
    },
    {
      id: 8,
      line: "Esos bancos compran la deuda del Estado.",
      detail:
        "El tema Deuda lo detalla con cifras. Aquí el punto es estructural: el corazón bancario es acreedor del fisco. Por eso banca, deuda y pensiones son la misma red.",
      nodeIds: ["e-banco-popular", "e-banco-bhd", "e-banreservas", "i-banco-central"],
      panelId: "i-banco-central",
    },
    {
      id: 9,
      line: "No compiten como crees. Se reparten.",
      detail:
        "Cada casa grande quiere su banco, su AFP, su acceso al flujo. El ciudadano ve “opciones”. El mapa ve un oligopolio familiar con regulador incluido.",
      nodeIds: [
        "c-corazon-bancario",
        "i-junta-monetaria",
        "e-grupo-popular",
        "e-grupo-bhd",
        "e-grupo-rizek",
        "e-banreservas",
      ],
      panelId: "c-corazon-bancario",
      pathEdges: true,
    },
  ],
};
