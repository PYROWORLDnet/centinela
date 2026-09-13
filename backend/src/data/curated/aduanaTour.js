/**
 * Recorrido — Aduana / Importaciones.
 */

export const ADUANA_TOUR = {
  id: "aduana-puerta",
  theme: "aduana",
  title: "Por dónde entra lo que consumes",
  epilogue:
    "No es que “no haya productos”. Es que los productos entran por donde las casas con escala saben entrar — y tú pagas el precio que resulta de esa puerta: aranceles, permisos, licencias y, en combustibles, hasta el subsidio que cierra el círculo.",
  entry: {
    hubId: "i-dga",
    satelliteIds: [
      "i-micm",
      "c-comercio-puerta",
      "c-importadores",
      "e-grupo-marti",
      "e-grupo-corripio",
      "e-grupo-rizek",
      "e-grupo-bonetti",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Todo lo que consumes cruza una puerta.",
      detail:
        "La Dirección General de Aduanas no es un trámite aburrido. Es el filtro del comercio exterior. Aranceles, fiscalización, permisos: ahí se decide mucho del precio final.",
      nodeIds: ["i-dga", "c-comercio-puerta"],
      panelId: "i-dga",
    },
    {
      id: 2,
      line: "Al lado está el MICM.",
      detail:
        "Licencias, regulación comercial, precios de combustibles. Aduana y Comercio no son mundos separados: juntos arman el marco por el que pasa lo importado.",
      nodeIds: ["i-micm", "i-dga", "c-comercio-puerta"],
      panelId: "i-micm",
    },
    {
      id: 3,
      line: "¿Quién cruza esa puerta con escala?",
      detail:
        "Las mismas casas del mapa: Martí (combustible), Corripio (distribución), Rizek (cacao/export), Bonetti/SID (alimentos). La aduana ve contenedores. El mapa ve familias.",
      nodeIds: ["c-importadores", "e-grupo-marti", "e-grupo-corripio", "e-grupo-rizek", "e-grupo-bonetti"],
      panelId: "c-importadores",
    },
    {
      id: 4,
      line: "Martí: combustible que entra y se reparte.",
      detail:
        "Tropigas y Sunix importan y distribuyen GLP y líquidos. Sin esa cadena, no hay “precio en bomba” que regular. La aduana es el primer eslabón.",
      nodeIds: ["e-grupo-marti", "e-tropigas", "e-sunix", "i-dga"],
      panelId: "e-grupo-marti",
    },
    {
      id: 5,
      line: "Roryk también usa la puerta — hacia afuera.",
      detail:
        "Rizek Cacao exporta. La misma familia de AFP Crecer y PATSA opera comercio exterior. Importar y exportar son dos sentidos de la misma puerta de poder.",
      nodeIds: ["e-grupo-rizek", "e-rizek-cacao", "i-dga"],
      panelId: "e-rizek-cacao",
    },
    {
      id: 6,
      line: "Corripio: distribución en el mercado interno.",
      detail:
        "Además de medios, el grupo tiene brazo comercial y de distribución. Lo que entra al país termina en góndolas y redes que también tienen dueño.",
      nodeIds: ["e-grupo-corripio", "c-importadores"],
      panelId: "e-grupo-corripio",
    },
    {
      id: 7,
      line: "Bonetti / SID: alimentos e industria.",
      detail:
        "Otra casa con escala industrial. En un país que importa buena parte de lo que come y consume, la industria local y el comercio exterior se entrelazan.",
      nodeIds: ["e-grupo-bonetti", "c-importadores"],
      panelId: "e-grupo-bonetti",
    },
    {
      id: 8,
      line: "Permisos y reglas no son neutrales.",
      detail:
        "Cumplir aduana y comercio cuesta capacidad: abogados, logística, capital. Las casas grandes la tienen. El importador chico juega en otra liga — parecido al partido nuevo en política.",
      nodeIds: ["c-comercio-puerta", "i-dga", "i-micm", "c-importadores"],
      panelId: "c-comercio-puerta",
    },
    {
      id: 9,
      line: "Por eso aduana cierra el mapa ciudadano.",
      detail:
        "Pensiones, partidos, gasolina, deuda, medios, familias, banca… y la puerta por donde entra lo que consumes. No son temas de revista. Son capas de cómo funciona el mundo dominicano aquí.",
      nodeIds: [
        "i-dga",
        "c-comercio-puerta",
        "e-grupo-marti",
        "e-grupo-rizek",
        "e-grupo-corripio",
        "e-grupo-bonetti",
        "i-micm",
      ],
      panelId: "i-dga",
      pathEdges: true,
    },
  ],
};
