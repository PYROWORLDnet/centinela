/**
 * Recorrido — Basura.
 */

export const BASURA_TOUR = {
  id: "basura-quien-cobra",
  theme: "basura",
  title: "Quién cobra por lo que tiras",
  epilogue:
    "La basura sale de tu casa y entra a un mapa de poder: decreto de emergencia, ayuntamiento que contrata, empresas que se quedan con la ruta, vertedero que concentra el Gran Santo Domingo y una disputa de tierra que empezó cuando el CEA cedió el suelo. No es “suciedad”. Es contrato + puerta del basurero. El vecino paga dos veces: impuesto y hedor.",
  entry: {
    hubId: "c-mecanismo-basura",
    satelliteIds: ["i-adn", "c-duquesa", "e-adn-services", "e-dsc", "e-lajun", "c-vecino"],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "No empieces por el camión.",
      detail:
        "Empieza por el sistema: quién firma el contrato, quién opera la ruta y quién controla dónde se tira. La basura es el servicio que nadie quiere mirar — y por eso es fácil repartirlo en silencio.",
      nodeIds: ["c-mecanismo-basura", "i-adn", "c-duquesa"],
      panelId: "c-mecanismo-basura",
    },
    {
      id: 2,
      line: "El ADN es la mesa del contrato.",
      detail:
        "El Ayuntamiento del Distrito Nacional compra recolección. Cuando vencen los contratos y Duquesa se pone crítica, la continuidad se vuelve argumento de poder: hay que adjudicar ya.",
      nodeIds: ["i-adn", "c-decreto-213-25", "c-duquesa"],
      panelId: "i-adn",
    },
    {
      id: 3,
      line: "El Decreto 213-25 abre la excepción.",
      detail:
        "Emergencia nacional en residuos del DN. Habilita compras por excepción. La figura jurídica acorta el concurso; el resultado político es quién se queda con años de servicio.",
      nodeIds: ["c-decreto-213-25", "i-adn", "e-adn-services"],
      panelId: "c-decreto-213-25",
    },
    {
      id: 4,
      line: "ADN Services y DSC: las de siempre.",
      detail:
        "Prensa documenta un paquete ~RD$2,653 MM a 36 meses: ADN Services (~1,680 MM, circ. 1 y 3) y Disposición Sanitaria Capital (~973 MM, circ. 2). Mismos operadores, nueva justificación.",
      nodeIds: ["e-adn-services", "e-dsc", "i-adn"],
      panelId: "e-adn-services",
    },
    {
      id: 5,
      line: "Duquesa es el cuello de botella.",
      detail:
        "Diario Libre: ~79% de los desechos del Gran Santo Domingo. Sin esa puerta, no hay recolección que funcione. Quien condiciona el vertedero condiciona el negocio entero.",
      nodeIds: ["c-duquesa", "e-adn-services", "e-dsc"],
      panelId: "c-duquesa",
    },
    {
      id: 6,
      line: "Lajun aparece en el conflicto de la tierra.",
      detail:
        "La empresa reclama propiedad/operación. El reportaje de Diario Libre reconstruye irregularidades y el origen estatal del suelo. El vertedero no es solo ingeniería: es título y poder.",
      nodeIds: ["e-lajun", "c-duquesa", "i-cea-basura"],
      panelId: "e-lajun",
    },
    {
      id: 7,
      line: "El CEA puso la tierra hace décadas.",
      detail:
        "En los 90s el Estado (CEA) facilitó al Ayuntamiento el uso del área. Privatizar la operación no borra el origen: el mapa de la basura nace de una cesión pública.",
      nodeIds: ["i-cea-basura", "c-duquesa", "c-mecanismo-basura"],
      panelId: "i-cea-basura",
    },
    {
      id: 8,
      line: "Medio Ambiente proyecta años de cierre técnico.",
      detail:
        "Esa proyección (5–6 años en prensa) alimenta el relato de que no se puede cambiar de proveedor de un día para otro. El tiempo del vertedero se convierte en argumento del contrato.",
      nodeIds: ["i-medio-ambiente", "c-duquesa", "c-decreto-213-25"],
      panelId: "i-medio-ambiente",
    },
    {
      id: 9,
      line: "El vecino hereda el reparto.",
      detail:
        "Paga el servicio y convive con el resultado. No elige al adjudicatario. Por eso Basura toca El Núcleo: contratos de excepción + infraestructura crítica = perímetro que se toca poco y se renueva mucho.",
      nodeIds: ["c-vecino", "c-mecanismo-basura", "c-la-cupula", "i-adn"],
      panelId: "c-mecanismo-basura",
      pathEdges: true,
    },
  ],
};
