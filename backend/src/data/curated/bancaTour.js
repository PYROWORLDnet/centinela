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
        "Ley 183-02: tres ex officio (gobernador del Banco Central, ministro de Hacienda y Economía, superintendente de Bancos) y seis designados por dos años. Hoy la presidencia es de Valdez Albizu; Hacienda, Magín Díaz; Superintendencia, Enmanuel Cedeño Brea (sep 2026). El art. 11 prohíbe a un designado dirigir un banco o tener participación en el capital de las entidades que regula.",
      nodeIds: ["i-junta-monetaria", "i-banco-central", "c-corazon-bancario"],
      panelId: "i-junta-monetaria",
    },
    {
      id: 2,
      line: "Rizek estuvo en esa mesa. Ya no.",
      detail:
        "Héctor José Rizek Llabaly integró la Junta desde 1985 hasta su muerte, el 28 de marzo de 2026. Miembro histórico, no actual. La misma familia de AFP Crecer y PATSA. El asiento quedó en el archivo; la casa sigue en el mapa.",
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
      line: "Rizek entra por la AFP — y por la Junta histórica.",
      detail:
        "No tiene el “Banco Rizek” en este mapa, pero tiene AFP Crecer y tuvo asiento en la Junta Monetaria hasta 2026. Otra forma de estar en el corazón del sistema.",
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
