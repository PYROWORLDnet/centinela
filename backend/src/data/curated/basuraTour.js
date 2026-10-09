/**
 * Recorrido — Basura.
 */

export const BASURA_TOUR = {
  id: "basura-quien-cobra",
  theme: "basura",
  title: "Quién cobra por lo que tiras",
  epilogue:
    "Tu basura paga dos negocios con nombre. Las mismas empresas de recogida vuelven por emergencia, sin concurso. Y el vertedero de Duquesa estaba en tierra que el CEA llamó del Estado, con títulos que el Congreso no aprobó; nadie fue a la justicia y el Estado perdió un arbitraje por US$43.6 millones a favor de sus dueños. Eso es El Núcleo: el negocio no se toca y la factura la pagas tú. Pregunta a tu alcaldía por qué no hubo licitación.",
  entry: {
    hubId: "c-mecanismo-basura",
    satelliteIds: ["e-adn-services", "e-dsc", "c-decreto-213-25", "e-lajun", "c-laudo-duquesa", "c-vecino"],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "¿Quién cobra por lo que tiras?",
      detail:
        "Tu basura pasa por dos cajas registradoras: la empresa que la recoge y el vertedero donde termina. Las dos tienen dueño, y las dos cobran con tus impuestos.",
      nodeIds: ["c-mecanismo-basura", "i-adn", "c-duquesa"],
      panelId: "c-mecanismo-basura",
    },
    {
      id: 2,
      line: "Las mismas empresas, por emergencia.",
      detail:
        "Decreto 213-25 (abril 2025): emergencia de 60 días. Resultado, según Panorama: contrato de ~RD$2,653 MM por 36 meses y sin concurso para las mismas dos empresas que ya estaban.",
      nodeIds: ["c-decreto-213-25", "i-adn", "e-adn-services", "e-dsc"],
      panelId: "c-decreto-213-25",
    },
    {
      id: 3,
      line: "ADN Services y DSC: las de siempre.",
      detail:
        "ADN Services (~RD$1,680 MM, circ. 1 y 3), cuyo propietario según El Caribe es Andrés Ayala, y Disposición Sanitaria Capital (~RD$973 MM, circ. 2). Mismos operadores, nueva justificación.",
      nodeIds: ["e-adn-services", "e-dsc", "i-adn"],
      panelId: "e-adn-services",
    },
    {
      id: 4,
      line: "Todo termina en Duquesa.",
      detail:
        "Diario Libre: ~79% de los desechos del Gran Santo Domingo. Quien controla esa puerta condiciona el negocio entero.",
      nodeIds: ["c-duquesa", "e-adn-services", "e-dsc"],
      panelId: "c-duquesa",
    },
    {
      id: 5,
      line: "Los dueños de Duquesa tienen nombre.",
      detail:
        "Desde 2013, Lajun es 90% del jamaiquino Michael Lee-Chin, con Luis José Asilis (Grupo Metro). Compraron la empresa y el terreno (Diario Libre; El Caribe).",
      nodeIds: ["e-lajun", "c-duquesa", "c-laudo-duquesa"],
      panelId: "e-lajun",
    },
    {
      id: 6,
      line: "Pero la tierra era del Estado.",
      detail:
        "El CEA dijo en 2017 que no vendió ese terreno. Las cámaras del Congreso certificaron que la aprobación de la venta no está en sus archivos (Diario Libre). El origen de los títulos está cuestionado.",
      nodeIds: ["i-cea-basura", "c-duquesa", "e-lajun"],
      panelId: "i-cea-basura",
    },
    {
      id: 7,
      line: "Y el Estado perdió: US$43.6 millones.",
      detail:
        "Laudo arbitral de 2023: el Estado debe pagar US$43,590,090 a Lee-Chin. Diario Libre: desde 2018 se advirtió del fraude en los títulos y ni el CEA, ni la Procuraduría, ni el Congreso fueron a la justicia.",
      nodeIds: ["c-laudo-duquesa", "e-lajun", "i-cea-basura"],
      panelId: "c-laudo-duquesa",
    },
    {
      id: 8,
      line: "Por eso no se toca: eso es El Núcleo.",
      detail:
        "Contrato sin concurso, tierra pública en manos privadas, nadie en la justicia y una factura millonaria. El negocio queda intacto; el que paga es el vecino.",
      nodeIds: ["c-nucleo", "c-laudo-duquesa", "c-decreto-213-25", "c-vecino"],
      panelId: "c-nucleo",
      pathEdges: true,
    },
    {
      id: 9,
      line: "Tu jugada: pregunta por la licitación.",
      detail:
        "Los procesos están en el Portal de Compras (comprasdominicana.gob.do). Búscalos y pregunta a tu alcaldía por qué la emergencia de 60 días se volvió contrato de 3 años.",
      nodeIds: ["c-vecino", "i-adn", "c-decreto-213-25"],
      panelId: "c-vecino",
    },
  ],
};
