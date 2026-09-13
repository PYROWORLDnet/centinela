/**
 * Recorrido — Electricidad.
 * Historia: la factura es la punta; el subsidio es el mecanismo.
 */

export const ELECTRICIDAD_TOUR = {
  id: "electricidad-factura",
  theme: "electricidad",
  title: "Quién controla la luz que pagas",
  epilogue:
    "No es solo “mal servicio”. Es un sistema: el Estado reparte con las EDE, genera con Punta Catalina e hidro, se asocia en Haina e Itabo, y cuando se pierde casi la mitad de la energía comprada, el presupuesto — tu impuesto — tapa el hueco. En el Este turístico opera otro circuito (CEPM/InterEnergy). Misma lógica que gasolina: Estado + privados + contribuyente.",
  entry: {
    hubId: "i-sie",
    satelliteIds: [
      "c-sistema-electrico",
      "e-edesur",
      "e-edenorte",
      "e-edeeste",
      "c-subsidio-electrico",
      "e-punta-catalina",
      "e-cepm",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "La luz no es un misterio. Es una cadena.",
      detail:
        "Se genera, se transmite, se reparte y te llega la factura. La Superintendencia de Electricidad (SIE) es el regulador: vigila el marco del subsector. Empieza por ahí si quieres entender el recibo.",
      nodeIds: ["i-sie", "c-sistema-electrico", "c-factura-luz"],
      panelId: "i-sie",
    },
    {
      id: 2,
      line: "Tres empresas te “reparten” la luz.",
      detail:
        "Edesur, Edenorte y Edeeste. No son tres mercados libres: son el brazo de distribución del Estado. Sus acciones pasaron a FONPER. Quien controla las EDE controla el cable hasta tu casa.",
      nodeIds: ["e-edesur", "e-edenorte", "e-edeeste", "i-fonper", "c-sistema-electrico"],
      panelId: "e-edesur",
    },
    {
      id: 3,
      line: "El problema no es solo el apagón: es la pérdida.",
      detail:
        "Informe MEM vía Diario Libre (ene–jun 2026): pérdidas totales ~43.5% de la energía que las EDE compran — no facturada o no cobrada. Por cada 100 que entra al sistema de distribución, casi 44 se evaporan en el papel.",
      nodeIds: ["c-subsidio-electrico", "e-edesur", "e-edenorte", "e-edeeste"],
      panelId: "c-subsidio-electrico",
    },
    {
      id: 4,
      line: "Ese hueco lo tapa el presupuesto.",
      detail:
        "El subsidio eléctrico proyectado ronda RD$118,000 millones en ese escenario de cierre. No es caridad: es transferencia pública para cubrir el déficit de las EDE. Hacienda / presupuesto = tus impuestos.",
      nodeIds: ["c-subsidio-electrico", "i-hacienda", "c-factura-luz"],
      panelId: "i-hacienda",
      pathFrom: ["c-subsidio-electrico"],
    },
    {
      id: 5,
      line: "¿Quién genera? El Estado es dueño grande.",
      detail:
        "Punta Catalina (termoestatal / EGEPC). EGEHID (hidro, 100% Estado). ETED transmite. El Caribe lo resume: el sector público sigue siendo el mayor dueño del mercado eléctrico.",
      nodeIds: ["e-punta-catalina", "e-egehid", "e-eted", "c-sistema-electrico"],
      panelId: "e-punta-catalina",
    },
    {
      id: 6,
      line: "También hay generación mixta y privada.",
      detail:
        "EGE Haina: capital mixto con mayoría estatal reportada. EGE Itabo: ~mitad Estado (FONPER) y ~mitad AES, con administración privada. No es “todo privatizado” ni “todo del gobierno”: es un juego cerrado de socios.",
      nodeIds: ["e-ege-haina", "e-ege-itabo", "e-aes", "i-fonper"],
      panelId: "e-ege-itabo",
    },
    {
      id: 7,
      line: "En el Este turístico: otro circuito.",
      detail:
        "CEPM (InterEnergy) genera, transmite y reparte en Punta Cana, Bávaro, Macao y la zona hotelera. No es Edeeste: es concesión privada. Por eso el mapa de “la luz del país” y “la luz del turismo” no son el mismo cable.",
      nodeIds: ["e-cepm", "e-interenergy", "c-sistema-electrico"],
      panelId: "e-cepm",
    },
    {
      id: 8,
      line: "Rainieri no es dueño de CEPM — pero el destino depende de esa luz.",
      detail:
        "Grupo Puntacana armó el enclave turístico. CEPM nació para dar energía confiable a esa zona. Conectamos el destino con el circuito: sin inventar ownership. InterEnergy controla CEPM; el turismo del Este lo necesita.",
      nodeIds: ["e-grupo-rainieri", "e-cepm", "e-interenergy"],
      panelId: "e-grupo-rainieri",
      pathFrom: ["e-cepm"],
    },
    {
      id: 9,
      line: "Misma lógica que ya viste en gasolina.",
      detail:
        "Estado pone marco y empresas. Privados pesan en generación y en el Este. Tú pagas tarifa y, encima, el subsidio vía impuestos. Electricidad no es un tema técnico: es el mecanismo del recibo.",
      nodeIds: [
        "c-sistema-electrico",
        "c-subsidio-electrico",
        "c-factura-luz",
        "i-sie",
        "e-cepm",
        "e-punta-catalina",
      ],
      panelId: "c-sistema-electrico",
      pathEdges: true,
    },
  ],
};
