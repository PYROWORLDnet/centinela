/**
 * Recorrido — Transporte.
 */

export const TRANSPORTE_TOUR = {
  id: "transporte-quien-mueve",
  theme: "transporte",
  title: "Quién cobra el pasaje",
  epilogue:
    "El dueño de las guaguas vota en el Senado: Antonio Marte preside Conatra, Grupo Sidra, un partido, y tiene curul. Las federaciones se reparten la flota con permiso y los corredores. Y del subsidio al combustible, según el propio Fenatrano, a la guagua le toca la parte chica: la grande va a grandes empresas y generadoras, piezas del Núcleo. Votes por quien votes, el gremio tiene silla. Mira en el Senado quién te representa y de qué es dueño.",
  entry: {
    hubId: "c-mecanismo-transporte",
    satelliteIds: ["p-antonio-marte", "p-juan-hubieres", "o-fenatrano", "o-conatra", "c-subsidio-combustible", "c-pasajero"],
    line: null,
  },
  steps: [
    { id: 1, line: "¿Quién cobra tu pasaje?", detail: "Antes de la guagua está el permiso. Ley 63-17: sin licencia del INTRANT no hay operación legal. Quien tiene permisos cobra cada día en la avenida.", nodeIds: ["c-mecanismo-transporte", "i-intrant", "c-pasajero"], panelId: "c-mecanismo-transporte" },
    { id: 2, line: "Tres gremios se reparten la flota.", detail: "Acento: Fenatrano ~49% de las unidades con permiso, Mochotran ~20%, Conatra ~11%. Y operan corredores propios.", nodeIds: ["o-fenatrano", "o-mochotran", "o-conatra", "i-intrant"], panelId: "o-fenatrano" },
    { id: 3, line: "El dueño de las guaguas es senador.", detail: "Ficha oficial del Senado: Antonio Marte preside Conatra, Grupo Sidra (Tarea Bus, Aetra Bus) y el partido PPG, y es senador por Santiago Rodríguez desde 2020.", nodeIds: ["p-antonio-marte", "o-conatra", "c-mecanismo-transporte"], panelId: "p-antonio-marte" },
    { id: 4, line: "“Entre el Senado y mis autobuses, elijo los autobuses.”", detail: "Lo dijo él mismo en 2024 (De Último Minuto). Y que Conatra fue “la primera empresa aliada al gobierno para los corredores” (Atento).", nodeIds: ["p-antonio-marte", "c-corredores", "o-conatra"], panelId: "p-antonio-marte" },
    { id: 5, line: "El otro gremio también tuvo curul.", detail: "En 2016, Hoy presentaba a Juan Hubieres como diputado y presidente de Fenatrano a la vez. Los dos gremios más grandes han tenido silla donde se votan sus reglas.", nodeIds: ["p-juan-hubieres", "o-fenatrano", "p-antonio-marte"], panelId: "p-juan-hubieres" },
    { id: 6, line: "OMSA: presupuesto público, menos calle.", detail: "~RD$2,200 MM (2025) y ~RD$3,000 MM (2026) según Diario Libre. Mientras, los corredores pasan a las federaciones. El Estado regula; el gremio cobra.", nodeIds: ["e-omsa", "c-corredores", "c-pasajero"], panelId: "e-omsa" },
    { id: 7, line: "El subsidio: la parte chica y la grande.", detail: "Según Hubieres (Acento, 2025): ~RD$3 mil MM de gasoil subsidiado al transporte y ~RD$30 mil MM a grandes empresas, sin contar generadoras. Es denuncia de parte, pero apunta a combustible y electricidad: el perímetro del Núcleo.", nodeIds: ["c-subsidio-combustible", "o-fenatrano", "c-pasajero"], panelId: "c-subsidio-combustible" },
    { id: 8, line: "Por eso no se toca: eso es El Núcleo.", detail: "Votes por quien votes, el gremio ya tiene silla en el Congreso, y el combustible grande se reparte en otra mesa. El voto cambia la cara; la ruta sigue con dueño.", nodeIds: ["c-nucleo", "p-antonio-marte", "c-subsidio-combustible", "c-mecanismo-transporte"], panelId: "c-nucleo", pathEdges: true },
    { id: 9, line: "Tu jugada: mira quién te representa.", detail: "La web del Senado y las declaraciones juradas en la Cámara de Cuentas dicen quién es dueño de qué. Busca a tu senador y a tu diputado.", nodeIds: ["c-pasajero", "p-antonio-marte", "i-intrant"], panelId: "c-pasajero" },
  ],
};
