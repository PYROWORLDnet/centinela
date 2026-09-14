/**
 * Recorrido — Transporte.
 */

export const TRANSPORTE_TOUR = {
  id: "transporte-quien-mueve",
  theme: "transporte",
  title: "Quién cobra el pasaje",
  epilogue:
    "La ciudad se mueve porque alguien reparte rutas. INTRANT licencia; Fenatrano, Conatra y Mochotran concentran unidades; OMSA gasta presupuesto público y pierde centralidad; OPRET pone rieles en la capital. El pasajero paga dos veces. Santiago mira el metro de lejos. Eso no es “tráfico”: es mapa de poder.",
  entry: {
    hubId: "c-mecanismo-transporte",
    satelliteIds: ["i-intrant", "e-omsa", "o-fenatrano", "o-conatra", "i-opret", "c-pasajero"],
    line: null,
  },
  steps: [
    { id: 1, line: "El pasaje es un peaje político.", detail: "Antes del bus está el permiso. Quien licencia rutas decide quién cobra cada día en la avenida.", nodeIds: ["c-mecanismo-transporte", "i-intrant", "c-pasajero"], panelId: "c-mecanismo-transporte" },
    { id: 2, line: "INTRANT tiene la llave.", detail: "Ley 63-17: sin licencia no hay operación legal. El papel del instituto no es decorativo: es el grifo del negocio.", nodeIds: ["i-intrant", "o-fenatrano", "o-conatra"], panelId: "i-intrant" },
    { id: 3, line: "Fenatrano concentra la flota licenciada.", detail: "Acento: ~49% de las unidades con permiso. La federación más grande no pide permiso a la OMSA: opera corredores propios.", nodeIds: ["o-fenatrano", "c-corredores", "i-intrant"], panelId: "o-fenatrano" },
    { id: 4, line: "Conatra y Mochotran completan el oligopolio.", detail: "~11% y ~20%. Juntos con Fenatrano dibujan quién manda en la calle cuando el Estado no llena la demanda.", nodeIds: ["o-conatra", "o-mochotran", "c-corredores"], panelId: "o-conatra" },
    { id: 5, line: "OMSA: mucho presupuesto, menos centralidad.", detail: "RD$2,200 MM (2025) / ~RD$3,000 MM (2026) según Diario Libre. Miles de empleados. Aun así, los corredores privados le comen el mapa.", nodeIds: ["e-omsa", "c-corredores", "c-pasajero"], panelId: "e-omsa" },
    { id: 6, line: "Los corredores son la nueva renta.", detail: "Independencia (Fenatrano), Núñez de Cáceres, Charles de Gaulle… El modelo “reformado” traslada operación a federaciones. El Estado regula; el gremio cobra.", nodeIds: ["c-corredores", "o-fenatrano", "e-omsa"], panelId: "c-corredores" },
    { id: 7, line: "Metro y teleférico: hierro en la capital.", detail: "OPRET construye el sistema férreo de Santo Domingo. Es transporte masivo real — y también un recordatorio: la inversión grande se queda donde está el poder simbólico del Estado.", nodeIds: ["i-opret", "c-pasajero", "c-mecanismo-transporte"], panelId: "i-opret" },
    { id: 8, line: "El pasajero no elige el mapa.", detail: "Paga federación y, con impuestos, OMSA/Metro. No vota la ruta del concho. Hereda el reparto.", nodeIds: ["c-pasajero", "o-fenatrano", "e-omsa", "i-opret"], panelId: "c-pasajero" },
    { id: 9, line: "Por eso esto toca El Núcleo.", detail: "Permisos, federaciones, presupuesto y rieles no son “sector transporte”. Son piezas del mismo centro que decide qué se toca y qué no. Sigue el mapa.", nodeIds: ["c-mecanismo-transporte", "c-la-cupula", "i-intrant", "o-fenatrano"], panelId: "c-mecanismo-transporte", pathEdges: true },
  ],
};
