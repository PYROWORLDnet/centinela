/**
 * Recorrido — Azúcar / Batey.
 * Historia: el azúcar no es dulce para quien lo corta.
 */

export const AZUCAR_TOUR = {
  id: "azucar-batey",
  theme: "azucar",
  title: "Quién endulza · quién carga la caña",
  epilogue:
    "El azúcar que exporta el país sale de un mapa viejo: CEA que arrienda, casas que operan, bateyes que alojan. Fanjul/Central Romana y Vicini/CAEI no son anécdotas. Son dueños de la vena. El cañero —muchas veces sin papeles— es el eslabón que el titular casi nunca muestra. Sin fuente no inventamos cifras de semi-esclavitud; con fuente sí mostramos el mecanismo.",
  entry: {
    hubId: "c-mecanismo-azucar",
    satelliteIds: [
      "c-batey",
      "e-central-romana",
      "e-grupo-fanjul",
      "e-caei",
      "e-grupo-vicini",
      "e-cac",
      "i-cea",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "No empieces por el precio del azúcar.",
      detail:
        "Empieza por el sistema: tierra, ingenio, batey, mano de obra. El commodity es la máscara. El mecanismo es quién manda en el campo.",
      nodeIds: ["c-mecanismo-azucar", "c-batey", "e-central-romana"],
      panelId: "c-mecanismo-azucar",
    },
    {
      id: 2,
      line: "El batey es el nodo que casi nadie pone en portada.",
      detail:
        "Asentamientos de compañía. Techo atado al trabajo. Reportajes en Central Romana describen jornadas brutales, vivienda precaria y familias atrapadas por la falta de documentos. Eso no es “folklore rural”: es diseño laboral.",
      nodeIds: ["c-batey", "c-mano-obra-cana", "e-central-romana"],
      panelId: "c-batey",
    },
    {
      id: 3,
      line: "Central Romana: el ingenio más grande.",
      detail:
        "Empresa privada histórica del Este. Madre Jones y Cronkite News la sitúan en el centro de la denuncia internacional sobre cañeros haitianos. El azúcar llega a marcas globales; el batey se queda en el mapa local.",
      nodeIds: ["e-central-romana", "e-grupo-fanjul", "c-batey"],
      panelId: "e-central-romana",
    },
    {
      id: 4,
      line: "Detrás está la casa Fanjul.",
      detail:
        "Los Fanjul —azúcar en Florida y el Caribe— aparecen ligados a Central Romana en la cobertura investigativa. Misma lógica del mapa Centinela: el ingenio no flota solo; tiene apellido.",
      nodeIds: ["e-grupo-fanjul", "e-central-romana", "c-la-cupula"],
      panelId: "e-grupo-fanjul",
    },
    {
      id: 5,
      line: "Vicini / INICIA: la otra vena azucarera.",
      detail:
        "CAEI opera el ingenio Cristóbal Colón bajo Putney/INICIA. Diario Libre documentó la propiedad Vicini. Capital histórico + agroindustria: otra casa, otra planta.",
      nodeIds: ["e-grupo-vicini", "e-caei", "c-mecanismo-azucar"],
      panelId: "e-caei",
    },
    {
      id: 6,
      line: "El Estado no salió del azúcar: arrendó.",
      detail:
        "CEA sigue siendo pieza. Con la Ley 141-97 se capitalizaron/arrendaron ingenios. Barahona pasó al CAC en 1999. Privatizar la operación no borra al dueño residual: lo desplaza.",
      nodeIds: ["i-cea", "c-ley-capitalizacion", "e-cac"],
      panelId: "i-cea",
    },
    {
      id: 7,
      line: "CAC: el arrendatario del Sur.",
      detail:
        "Consorcio Azucarero Central opera Barahona bajo contrato con el CEA. Su propia historia corporativa admite el arrendamiento de 1999 y el cambio de capital hacia socios dominico-guatemaltecos.",
      nodeIds: ["e-cac", "i-cea", "c-mecanismo-azucar"],
      panelId: "e-cac",
    },
    {
      id: 8,
      line: "La mano de obra es el secreto a voces.",
      detail:
        "Sin cañeros no hay exportación. La vulnerabilidad migratoria abarata la negociación. Por eso el batey conecta Azúcar con Migración y con El Núcleo: un sistema que necesita trabajo barato para no tocarse.",
      nodeIds: ["c-mano-obra-cana", "c-batey", "e-central-romana"],
      panelId: "c-mano-obra-cana",
    },
    {
      id: 9,
      line: "Cierra el círculo: casas + Estado + batey.",
      detail:
        "Fanjul, Vicini, CEA, CAC, batey. No son temas separados. Son una sola red vista desde la caña. Si solo ves “azúcar”, te comiste la máscara. Si ves el batey, viste el mecanismo.",
      nodeIds: [
        "c-mecanismo-azucar",
        "e-grupo-fanjul",
        "e-grupo-vicini",
        "i-cea",
        "c-batey",
        "c-la-cupula",
      ],
      panelId: "c-mecanismo-azucar",
      pathEdges: true,
    },
  ],
};
