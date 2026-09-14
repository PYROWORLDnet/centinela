/**
 * Recorrido narrativo — tema Minería (Pueblo Viejo).
 *
 * Historia: el contrato que vendió el oro.
 * 2002 RNF 3.2% → Barrick/Newmont → enmienda 2013 →
 * windfall sin ajuste pleno → comunidades al lado de la riqueza.
 */

export const MINERIA_TOUR = {
  id: "mineria-pueblo-viejo",
  theme: "mineria",
  title: "Quién se queda con el oro",
  epilogue:
    "No es solo una mina. Es un contrato de 2002 con RNF 3.2%, heredado por Barrick (60%) y Newmont (40%), “parcheado” en 2013 y tensionado hoy por el precio récord del oro. El Estado cobra cientos de millones —y aún así el debate es si cobra lo que el diseño progresivo pedía—. En Cotuí, familias vivieron años pidiendo agua y mudanza al lado de una de las minas más grandes del mundo. La soberanía no se pierde solo al firmar: se pierde cada día que no se actualiza el trato.",
  entry: {
    hubId: "c-pueblo-viejo",
    satelliteIds: [
      "c-ceam-2002",
      "e-barrick",
      "e-newmont",
      "c-enmienda-2013",
      "c-tasa-efectiva",
      "c-comunidades-cotui",
      "c-soberania-mineral",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Pueblo Viejo no es un cerro. Es un contrato.",
      detail:
        "Cotuí, Sánchez Ramírez. Una de las minas de oro más grandes del hemisferio. Lo que define cuánto se queda el país no es el metal bajo tierra: es el régimen fiscal que lo arrienda. Empieza ahí.",
      nodeIds: ["c-pueblo-viejo", "i-mem"],
      panelId: "c-pueblo-viejo",
    },
    {
      id: 2,
      line: "2002: se firmó con 3.2% de RNF.",
      detail:
        "25 de marzo de 2002, gobierno de Hipólito Mejía: Contrato Especial de Arrendamiento (CEAM) con Placer Dome. El Congreso lo aprobó (Res. 125-02). EITI-RD / MEM: regalía RNF de 3.2% sobre precio de venta menos costos de producción (sin cobre/zinc), más PUN variable e impuestos generales. Con esa regalía, el Estado cobraba poco; la empresa se quedaba con el resto del margen.",
      nodeIds: ["c-ceam-2002", "e-placer-dome", "c-pueblo-viejo"],
      panelId: "c-ceam-2002",
    },
    {
      id: 3,
      line: "2006: entra Barrick. Hoy: 60/40 con Newmont.",
      detail:
        "Barrick compra Placer Dome a nivel global y hereda Pueblo Viejo. El 40% pasa por Goldcorp y luego a Newmont (2019). Operador: Barrick. Socio: Newmont. El vehículo local es Pueblo Viejo Dominicana. Misma mina, dueños globales.",
      nodeIds: ["e-barrick", "e-newmont", "e-pvdc", "e-placer-dome"],
      panelId: "e-barrick",
      pathFrom: ["e-placer-dome"],
    },
    {
      id: 4,
      line: "2013: Danilo renegocia. Mejora… no cierra el cuento.",
      detail:
        "Bajo presión, el gobierno anuncia la segunda enmienda: ingresos 2013–2016 de ~US$377 MM a ~US$2,200 MM (escenario US$1,600/oz) y mayor participación sobre EBITDA (Diario Libre). Nace un impuesto mínimo más duro que el royalty viejo. Fue un parche político real — no el final de la renta del oro.",
      nodeIds: ["c-enmienda-2013", "c-ceam-2002", "e-pvdc"],
      panelId: "c-enmienda-2013",
    },
    {
      id: 5,
      line: "El oro se dispara. ¿Se actualiza la fórmula?",
      detail:
        "Jaime Aristy Escuder sostiene que, con oro cerca de US$5,000/oz, el diseño del acuerdo apuntaría a una tasa efectiva ~38.55%, pero el cobro efectivo estaría ~13.39% si no se ajustan parámetros. Es su análisis — no un boletín de Hacienda. La pregunta pública es simple: el windfall del precio, ¿se reparte o se queda?",
      nodeIds: ["c-tasa-efectiva", "c-enmienda-2013", "c-soberania-mineral"],
      panelId: "c-tasa-efectiva",
    },
    {
      id: 6,
      line: "Lo que sí se pagó: cientos de millones.",
      detail:
        "Barrick reporta >US$385 MM al Estado en 2020 (con adelantos COVID) y ~US$649.5 MM en impuestos directos y regalías en 2025 (RD$40,068.6 MM). Es caja grande. No contradice el debate de tasa: muestra lo recaudado bajo el régimen vigente. Hacienda lo siente; Cotuí también espera ver el progreso.",
      nodeIds: ["c-aportes-estado", "i-hacienda", "e-barrick"],
      panelId: "c-aportes-estado",
      pathFrom: ["e-barrick"],
    },
    {
      id: 7,
      line: "Al lado de la mina: polvo, botellones y espera.",
      detail:
        "Earthworks y The Guardian documentan comunidades aguas abajo: polvo negro diario, ~15 galones de agua embotellada dos veces por semana desde ~2011, reportes de cultivos y ganado afectados, y años pidiendo reubicación. Censos hablan de 369–450 familias. Barrick y el Estado disputan cuánto es legado histórico vs operación actual. En jun 2025 Presidencia anunció un acuerdo de reasentamiento (>RD$20,000 MM) — el mapa marca la demora, no niega el papel firmado.",
      nodeIds: ["c-comunidades-cotui", "c-pueblo-viejo"],
      panelId: "c-comunidades-cotui",
    },
    {
      id: 8,
      line: "Soberanía: se firma… y se omite.",
      detail:
        "2002 abrió la puerta con RNF 3.2%. 2013 la estrecharon. El presente decide si se actualiza el trato cuando el oro corre. La soberanía mineral no es un himno: es una fórmula fiscal y una provincia que vive pegada al yacimiento. Si el Estado no usa las herramientas de ajuste, la renta se va sola.",
      nodeIds: [
        "c-soberania-mineral",
        "c-ceam-2002",
        "c-enmienda-2013",
        "c-tasa-efectiva",
        "c-comunidades-cotui",
        "e-barrick",
        "c-pueblo-viejo",
      ],
      panelId: "c-soberania-mineral",
      pathEdges: true,
    },
  ],
};
