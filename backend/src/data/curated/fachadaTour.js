/**
 * Recorrido — Fachada democrática.
 * Lo que dicen los rankings → lo que dice la ley → lo que pasa con las balas → lo que dice la gente → cierre.
 */

export const FACHADA_TOUR = {
  id: "fachada-democratica",
  theme: "fachada",
  title: "La fachada democrática: lo que el mundo nos vende vs. lo que la ley nos impone",
  epilogue:
    "Los rankings miden la cáscara: si hay elecciones, si hay oposición, si hay Constitución. Y en eso el país aprueba. Pero cuando se mide la fruta, las notas bajan: 5.00 en funcionamiento del gobierno, 2 de 4 en corrupción y en debido proceso. Hay una vara para abajo, con 30 a 40 años escritos para la violencia en la calle, y otra para arriba, con 5 años en la casa por robarle balas al Estado. La simulación funciona mientras la creamos.",
  entry: {
    hubId: "c-fachada-democratica",
    satelliteIds: [
      "c-democracia-formal",
      "r-vdem-2026",
      "r-eiu-2024",
      "r-freedom-house-2026",
      "c-art-384",
      "c-municiones-onu",
      "c-dos-varas",
      "r-latinobarometro-2026",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Pregúntale a una inteligencia artificial si somos una democracia.",
      detail:
        "Te dirá que sí. Lee los libros de texto y los informes internacionales: hay elecciones cada cuatro años, hay partidos de oposición y hay una Constitución que garantiza derechos. Eso es la democracia formal, la cáscara. Pero hoy vamos a rascar la cáscara para ver la fruta.",
      nodeIds: ["c-fachada-democratica", "c-democracia-formal"],
      panelId: "c-fachada-democratica",
    },
    {
      id: 2,
      line: "Lo que el mundo nos vende: “profundizando su democracia”.",
      detail:
        "El Democracy Report 2026 del Instituto V-Dem pone al país entre los tres únicos del mundo que están profundizando su democracia, junto a Sri Lanka y las Islas Salomón. La Presidencia lo celebró: “un referente regional y global”. Pero el mismo informe nos clasifica como “democracia electoral”, no como “democracia liberal”, que es donde funcionan los contrapesos y la igualdad ante la ley. Mejorar no es llegar.",
      nodeIds: ["r-vdem-2026", "c-democracia-formal", "c-fachada-democratica"],
      panelId: "r-vdem-2026",
    },
    {
      id: 3,
      line: "The Economist: 6.62. Freedom House: 67. Ahora rasquemos.",
      detail:
        "The Economist nos da 6.62 de 10, puesto 52 de 167, nueve posiciones arriba: “democracia defectuosa”. Freedom House nos da 67 de 100 y dice que las elecciones son “generalmente libres y competitivas”. Pero en esos mismos informes: proceso electoral 9.17, funcionamiento del gobierno 5.00, cultura política 4.38. Corrupción 2 de 4, debido proceso 2 de 4, protección contra el abuso de la fuerza 2 de 4, igualdad ante la ley 1 de 4. Aprobamos la urna. Lo demás, no.",
      nodeIds: ["r-eiu-2024", "r-freedom-house-2026", "c-democracia-formal", "c-fachada-democratica"],
      panelId: "r-freedom-house-2026",
    },
    {
      id: 4,
      line: "Lo que la ley nos impone: 30 a 40 años.",
      detail:
        "El nuevo Código Penal, la Ley 74-25, en su artículo 384, castiga la insurrección con 30 a 40 años de prisión mayor. Y define insurrección como cualquier violencia colectiva que ponga en peligro las instituciones, incluyendo a quien participe o se involucre. Es la misma pena del asesinato, el doble del homicidio simple, que da de 10 a 20. El Frente Cívico y Social advierte que esto puede usarse para criminalizar la protesta y blindar al poder: “Protestar no es insurrección.”",
      nodeIds: ["c-art-384", "l-74-25", "o-frente-civico", "c-fachada-democratica"],
      panelId: "c-art-384",
    },
    {
      id: 5,
      line: "Los maestros lo vieron venir.",
      detail:
        "En julio de 2024, cuando el Código todavía era proyecto, el presidente de la ADP denunció que los artículos 332 y 333 daban de 4 a 10 años a quien organizara o participara en manifestaciones contra las autoridades. Esa presión sirvió: en la ley aprobada, el 332 es soborno y el 333 es ocultamiento de pruebas. Pero el miedo no se fue, se mudó: el artículo 313 da de 5 a 10 años si hay violencia contra un funcionario durante una manifestación. Y quedó el 384.",
      nodeIds: ["c-art-333-proyecto", "o-adp", "c-art-313", "l-74-25"],
      panelId: "c-art-333-proyecto",
    },
    {
      id: 6,
      line: "Mientras tanto, nuestras balas aparecen en Haití.",
      detail:
        "El Panel de Expertos de la ONU recoge que un inventario de la Policía Nacional encontró 908,001 artículos desviados de sus depósitos: más de 489,000 cartuchos de 9 mm, 230,000 de 5.56 y 26,000 de 7.62. En una muestra de 89 cartuchos incautados a la banda 400 Mawozo, 25 tenían la marca ERD del Ejército. La ONU lo atribuye a presunta corrupción de policías y militares, aunque no puede decir cuánto llegó a Haití. ¿La respuesta de Defensa? Que las de calibre .50 son de “antigua fabricación” y que “no ha sido posible determinar” cómo llegaron. Como ejemplo, citó a un teniente detenido en San Juan con 1,516 cartuchos, que sigue en prisión preventiva.",
      nodeIds: ["c-municiones-onu", "e-400-mawozo", "c-respuesta-defensa", "c-operacion-pandora"],
      panelId: "c-municiones-onu",
    },
    {
      id: 7,
      line: "Dos varas de medir.",
      detail:
        "La red que robaba municiones dentro de la Policía, la Operación Pandora, dejó un desfalco de RD$92 millones, según el Ministerio Público. Dos años después hay dos condenas por acuerdo: la más alta, 5 años de arresto domiciliario. El coronel que custodiaba las armas apenas fue enviado a juicio en septiembre, y lo espera en libertad, con fianza. Para el que se involucre en una protesta que termine en violencia, 30 a 40 años escritos. Para el que le roba balas al Estado, la casa. La vara dura es para abajo.",
      nodeIds: ["c-dos-varas", "c-operacion-pandora", "c-art-384", "c-pueblo"],
      panelId: "c-dos-varas",
    },
    {
      id: 8,
      line: "Lo que dice el propio pueblo.",
      detail:
        "El Latinobarómetro 2026 entrevistó cara a cara a 1,000 dominicanos. Solo el 47% apoya la democracia, por debajo del 52% de América Latina. El 68% no se siente representado por el Congreso; solo el 31% sí. El 36% cree que la democracia puede funcionar sin Congreso y el 18% apoya abiertamente un régimen autoritario. La gente quiere votar, pero no se siente representada por los que salen de esa urna.",
      nodeIds: ["r-latinobarometro-2026", "i-senado", "c-voto-no-basta", "c-fachada-democratica"],
      panelId: "r-latinobarometro-2026",
    },
    {
      id: 9,
      line: "Esa no es una democracia. Es una simulación.",
      detail:
        "Hay elecciones, hay oposición y hay Constitución, y por eso los informes nos aplauden. Pero tenemos una ley que deja 40 años colgando sobre quien sale a la calle, balas del Estado en manos de bandas sin que nadie responda y una justicia con dos varas de medir. Y una mayoría que no se siente representada. Entonces, ¿cuánto tiempo más vamos a seguir creyendo que lo es? Eso toca El Núcleo.",
      nodeIds: [
        "c-fachada-democratica",
        "c-democracia-formal",
        "c-art-384",
        "c-municiones-onu",
        "c-dos-varas",
        "r-latinobarometro-2026",
        "c-pueblo",
        "c-nucleo",
      ],
      panelId: "c-fachada-democratica",
      pathEdges: true,
    },
  ],
};
