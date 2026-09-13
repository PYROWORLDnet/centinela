/**
 * Recorrido — Electricidad.
 * Historia: la factura es la punta; el subsidio y los PPA caros son el mecanismo.
 */

export const ELECTRICIDAD_TOUR = {
  id: "electricidad-factura",
  theme: "electricidad",
  title: "Quién controla la luz que pagas",
  epilogue:
    "No es solo “mal servicio”. Es un sistema: el Estado reparte con las EDE, genera con Punta Catalina e hidro, se asocia en Haina e Itabo, compra respaldo caro (SIBA / KarPowerShip) y, cuando se pierde más de un tercio de la energía, el presupuesto — tu impuesto — tapa el hueco. En el Este turístico opera otro circuito (CEPM/InterEnergy). Misma lógica que gasolina: Estado + privados + contribuyente. Tú pagas dos veces.",
  entry: {
    hubId: "i-sie",
    satelliteIds: [
      "c-sistema-electrico",
      "e-edesur",
      "c-subsidio-electrico",
      "c-pagas-dos-veces",
      "c-contratos-caros",
      "e-karpowership",
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
        "2025: pérdidas acumuladas 37.2% y subsidio de RD$105,849.1 MM (EH+). Ene–jun 2026: pérdidas totales ~43.5% de la energía comprada (MEM vía Diario Libre). Por cada 100 que entra a distribución, casi 44 se evaporan en el papel.",
      nodeIds: ["c-subsidio-electrico", "e-edesur", "e-edenorte", "e-edeeste"],
      panelId: "c-subsidio-electrico",
    },
    {
      id: 4,
      line: "Ese hueco lo tapa el presupuesto — tú.",
      detail:
        "Factura en el recibo + impuestos que financian el subsidio. Por eso el mapa dice “pagas dos veces”. Hacienda / presupuesto = la segunda factura invisible.",
      nodeIds: ["c-pagas-dos-veces", "c-subsidio-electrico", "i-hacienda", "c-factura-luz"],
      panelId: "c-pagas-dos-veces",
      pathFrom: ["c-subsidio-electrico"],
    },
    {
      id: 5,
      line: "Cuando falta luz, entra el respaldo… caro.",
      detail:
        "SIBA Energy y KarPowerShip (barcazas en Azua) son contratos de contingencia. El Dinero / MEM 2025: sin ellas ~12.44 ¢US$/kWh de promedio contratado; con ellas ~27.50. SIBA ~67.66; KarPowerShip ~168 — hasta ~12× el resto. Poco volumen, mucho precio cuando despachan.",
      nodeIds: ["c-contratos-caros", "e-siba", "e-karpowership", "c-apagones"],
      panelId: "c-contratos-caros",
    },
    {
      id: 6,
      line: "¿Quién genera el resto? El Estado pesa fuerte.",
      detail:
        "Punta Catalina (termoestatal / EGEPC). EGEHID (hidro, 100% Estado). ETED transmite. El Caribe lo resume: el sector público sigue siendo el mayor dueño del mercado eléctrico.",
      nodeIds: ["e-punta-catalina", "e-egehid", "e-eted", "c-sistema-electrico"],
      panelId: "e-punta-catalina",
    },
    {
      id: 7,
      line: "También hay generación mixta y privada.",
      detail:
        "EGE Haina: capital mixto con mayoría estatal reportada. EGE Itabo: ~mitad Estado (FONPER) y ~mitad AES, con administración privada. No es “todo privatizado” ni “todo del gobierno”: es un juego cerrado de socios.",
      nodeIds: ["e-ege-haina", "e-ege-itabo", "e-aes", "i-fonper"],
      panelId: "e-ege-itabo",
    },
    {
      id: 8,
      line: "En el Este turístico: otro circuito.",
      detail:
        "CEPM (InterEnergy) genera, transmite y reparte en Punta Cana, Bávaro, Macao y la zona hotelera. No es Edeeste: es concesión privada. Por eso el mapa de “la luz del país” y “la luz del turismo” no son el mismo cable.",
      nodeIds: ["e-cepm", "e-interenergy", "c-sistema-electrico"],
      panelId: "e-cepm",
    },
    {
      id: 9,
      line: "Rainieri no es dueño de CEPM — pero el destino depende de esa luz.",
      detail:
        "Grupo Puntacana armó el enclave turístico. CEPM nació para dar energía confiable a esa zona. Conectamos el destino con el circuito: sin inventar ownership. InterEnergy controla CEPM; el turismo del Este lo necesita.",
      nodeIds: ["e-grupo-rainieri", "e-cepm", "e-interenergy"],
      panelId: "e-grupo-rainieri",
      pathFrom: ["e-cepm"],
    },
    {
      id: 10,
      line: "Regla ciudadana: sigue el cable y el cheque.",
      detail:
        "EDE pierden. Presupuesto tapa. Respaldo caro encarece el hueco. Apagón de todas formas. Este turístico con otro dueño. Misma lógica que gasolina: Estado + privados + contribuyente. Si solo miras el recibo, te comes media historia.",
      nodeIds: [
        "c-sistema-electrico",
        "c-subsidio-electrico",
        "c-pagas-dos-veces",
        "c-contratos-caros",
        "c-factura-luz",
        "e-cepm",
      ],
      panelId: "c-sistema-electrico",
      pathEdges: true,
    },
  ],
};
