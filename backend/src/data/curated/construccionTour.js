/**
 * Recorrido — Construcción / cemento.
 * Historia: la materia prima es el poder; Estrella integra la cadena.
 */

export const CONSTRUCCION_TOUR = {
  id: "construccion-materia",
  theme: "construccion",
  title: "Quién fabrica con qué se construye el país",
  epilogue:
    "No es solo “hay mucha construcción”. Es quién vende el cemento, el hormigón y el acero — y quién, además, ejecuta la obra. Multinacionales y productores locales compiten en ADOCEM; Estrella integra verticalmente. Rainieri y Bonetti aparecen como demanda de infraestructura e industria. Misma regla del mapa: pocas casas, muchos sectores.",
  entry: {
    hubId: "c-cadena-construccion",
    satelliteIds: [
      "c-materia-prima",
      "e-adocem",
      "e-grupo-estrella",
      "e-cemento-panam",
      "e-cemex-rd",
      "e-domicem",
      "e-ingenieria-estrella",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Olvida la grúa un segundo.",
      detail:
        "Antes del edificio está la materia prima: cemento, concreto, agregados, acero. Quien controla eso fija el piso del costo de construir viviendas, hoteles y carreteras.",
      nodeIds: ["c-cadena-construccion", "c-materia-prima"],
      panelId: "c-cadena-construccion",
    },
    {
      id: 2,
      line: "El gremio tiene nombre: ADOCEM.",
      detail:
        "Argos, Cemex, Cementos Cibao, Domicem, Cemento Panam y Cemento Santo Domingo. Producción de cemento: de 4.2 Mt (2012) a 6.5 Mt (2023). No es un mercado anónimo de “la industria”.",
      nodeIds: ["e-adocem", "e-cemex-rd", "e-domicem", "e-cementos-cibao", "e-cemento-panam"],
      panelId: "e-adocem",
    },
    {
      id: 3,
      line: "Multinacionales en la mesa.",
      detail:
        "CEMEX opera San Pedro de Macorís (~2.5 Mt reportados). Domicem expandió capacidad de forma agresiva. Argos también está en ADOCEM. Capital extranjero y escala: eso es parte del mapa.",
      nodeIds: ["e-cemex-rd", "e-domicem", "e-argos-rd", "e-adocem"],
      panelId: "e-cemex-rd",
    },
    {
      id: 4,
      line: "Y una casa dominicana integra la cadena.",
      detail:
        "Grupo Estrella: Cemento PANAM, Concreto PANAM, Acero ESTRELLA e Ingeniería ESTRELLA. No solo vende fundas: fabrica material y ejecuta obra. Eso es integración vertical.",
      nodeIds: [
        "e-grupo-estrella",
        "e-cemento-panam",
        "e-concreto-panam",
        "e-acero-estrella",
        "e-ingenieria-estrella",
      ],
      panelId: "e-grupo-estrella",
    },
    {
      id: 5,
      line: "Cemento PANAM es la vena visible.",
      detail:
        "Marca del ecosistema Estrella / Consorcio Minero Dominicano. Está en ADOCEM junto a los grandes. Cuando ves “Panam” en obra, estás viendo una casa del mapa, no un commodity sin dueño.",
      nodeIds: ["e-cemento-panam", "e-grupo-estrella", "c-materia-prima"],
      panelId: "e-cemento-panam",
    },
    {
      id: 6,
      line: "De la planta a la obra.",
      detail:
        "Concreto y acero alimentan Ingeniería Estrella. Misma casa, distintos eslabones. Por eso Construcción no se cuenta solo como “contratos”: se cuenta como cadena.",
      nodeIds: ["e-concreto-panam", "e-acero-estrella", "e-ingenieria-estrella", "c-materia-prima"],
      panelId: "e-ingenieria-estrella",
    },
    {
      id: 7,
      line: "Otras casas aparecen como demanda.",
      detail:
        "Rainieri/Puntacana necesita infraestructura turística. Bonetti/SID necesita planta e industria. No inventamos que fabrican cemento: conectamos quién exige construir a gran escala.",
      nodeIds: ["e-grupo-rainieri", "e-grupo-bonetti", "c-cadena-construccion"],
      panelId: "e-grupo-rainieri",
    },
    {
      id: 8,
      line: "Productores locales también cuentan.",
      detail:
        "Cementos Cibao y Cemento Santo Domingo están en el gremio. El mapa no es solo Estrella vs multinacionales: es un oligopolio de productores con una casa que además construye.",
      nodeIds: ["e-cementos-cibao", "e-cemento-sd", "e-adocem", "c-materia-prima"],
      panelId: "e-cementos-cibao",
    },
    {
      id: 9,
      line: "Por eso esto cierra con Familias y Electricidad.",
      detail:
        "Estrella entra al club de casas. Rainieri ya estaba en turismo y en la zona de CEPM. Construir el país y electrificarlo son capas del mismo poder material. Siguiente puerta: el detalle en cada tema.",
      nodeIds: [
        "c-cadena-construccion",
        "e-grupo-estrella",
        "e-grupo-rainieri",
        "c-materia-prima",
        "e-adocem",
      ],
      panelId: "c-cadena-construccion",
      pathEdges: true,
    },
  ],
};
