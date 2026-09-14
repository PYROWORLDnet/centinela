/**
 * Recorrido narrativo — tema Agua.
 *
 * Historia: de la presa al tanquero.
 * Caudal → corporación → tarifa rota → cisterna → barrio.
 */

export const AGUA_TOUR = {
  id: "agua-presa-al-tanquero",
  theme: "agua",
  title: "Del caudal al camión cisterna",
  epilogue:
    "No es solo “no hay lluvia”. Es un mecanismo: INDRHI y las cuencas mandan el caudal; CAASD/INAPA/CORAASAN operan la red; la tarifa residencial está lejos del costo; la cobranza es débil; el contrato de cisternas convierte la emergencia en línea presupuestaria — con un sindicato-proveedor casi único. El barrio paga dos veces.",
  entry: {
    hubId: "c-mecanismo-agua",
    satelliteIds: [
      "i-caasd",
      "i-inapa",
      "i-indrhi",
      "c-tarifa-subsidiada",
      "c-camiones-cisterna",
      "o-siprocadiagua",
      "c-usuario-barrio",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "El agua es una red, no solo una llave.",
      detail:
        "Si solo miras el grifo, te comes media historia. Hay corporaciones, cuencas, tarifas políticas, cobranza rota y —cuando falla la tubería— un mercado de cisternas. Empieza por el mecanismo.",
      nodeIds: ["c-mecanismo-agua", "i-caasd", "c-usuario-barrio"],
      panelId: "c-mecanismo-agua",
    },
    {
      id: 2,
      line: "Tres operadores, un mismo esquema.",
      detail:
        "CAASD en el Gran Santo Domingo. INAPA en el resto del país. CORAASAN en Santiago. Cada uno con red, tarifa y cobranza propias — mismo problema: costo alto, precio político, servicio irregular.",
      nodeIds: ["i-caasd", "i-inapa", "i-coraasan", "c-mecanismo-agua"],
      panelId: "i-caasd",
    },
    {
      id: 3,
      line: "Arriba de la toma: el recurso.",
      detail:
        "INDRHI y las cuencas (Haina, Nizao, Isa-Mana…). Cuando baja el caudal, la planta produce menos. La sequía no inventa el lío: lo agrava y lo hace visible.",
      nodeIds: ["i-indrhi", "c-fuentes-superficiales", "c-sequia", "i-caasd"],
      panelId: "i-indrhi",
    },
    {
      id: 4,
      line: "La tarifa no cubre el costo.",
      detail:
        "CAASD dice: producir un m³ ~RD$40; venderlo residencial a RD$6. Actualizó comerciales/industriales; el residencial se quedó. El hueco es política pública — y factura abierta.",
      nodeIds: ["c-tarifa-subsidiada", "i-caasd", "c-usuario-barrio"],
      panelId: "c-tarifa-subsidiada",
    },
    {
      id: 5,
      line: "Y encima, casi no se cobra.",
      detail:
        "Cifras citadas en prensa: CAASD ~28% de cobranza, INAPA ~30%, CORAASAN ~70%. Poca recaudación + tarifa bajo costo = corporación flaca y dependencia de emergencias.",
      nodeIds: ["c-cobranza-rota", "i-caasd", "i-inapa", "i-coraasan"],
      panelId: "c-cobranza-rota",
    },
    {
      id: 6,
      line: "Cuando la red calla, entra el tanquero.",
      detail:
        "CAASD tiene servicio formal de cisternas para sequía, averías y zonas sin agua. La Memoria 2023 cuenta miles de viajes a hogares e instituciones. El plan B se vuelve el servicio real.",
      nodeIds: ["c-camiones-cisterna", "i-caasd", "c-sequia", "c-usuario-barrio"],
      panelId: "c-camiones-cisterna",
      pathFrom: ["i-caasd"],
    },
    {
      id: 7,
      line: "Ese plan B tiene contrato — y proveedor casi único.",
      detail:
        "Licitación ~RD$60.9 MM, ~32 mil viajes, ~250 camiones. El informe pericial señaló a SIPROCADIAGUA (FENATRADO) como único con flotilla suficiente. Emergencia presupuestada; competencia estrecha.",
      nodeIds: ["c-contrato-cisterna", "o-siprocadiagua", "c-camiones-cisterna", "i-caasd"],
      panelId: "o-siprocadiagua",
    },
    {
      id: 8,
      line: "En la esquina: el usuario del barrio.",
      detail:
        "No fija la tarifa. No gana la licitación del tanquero. Paga la factura simbólica y, cuando no sale agua, el viaje. Misma regla del mapa: sigue el caudal y la plata, no el discurso del “servicio público”.",
      nodeIds: [
        "c-usuario-barrio",
        "c-mecanismo-agua",
        "c-tarifa-subsidiada",
        "c-camiones-cisterna",
        "o-siprocadiagua",
      ],
      panelId: "c-usuario-barrio",
      pathEdges: true,
    },
  ],
};
