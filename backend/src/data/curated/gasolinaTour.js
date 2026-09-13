/**
 * Recorrido narrativo — tema Gasolina.
 *
 * Historia: juego cerrado de tres patas.
 * Estado da legalidad · privados dan suministro · contribuyente da el subsidio.
 * Los números son prueba. El cuento es quién controla la cadena.
 */

export const GASOLINA_TOUR = {
  id: "gasolina-juego-cerrado",
  theme: "gasolina",
  title: "Quién decide lo que pagas en la bomba",
  epilogue:
    "No es monopolio estatal puro ni mercado libre. Es un juego cerrado: el Estado da la legalidad, dos grupos privados dan el suministro, y tú pagas el subsidio que mantiene el precio. Roryk toca combustible y pensiones. Martí toca la manguera. El contribuyente toca la factura.",
  entry: {
    hubId: "i-micm",
    satelliteIds: [
      "e-refidomsa",
      "e-grupo-rizek",
      "e-grupo-marti",
      "c-subsidio",
      "c-contribuyente",
      "c-juego-cerrado",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Cada semana, el MICM fija el precio.",
      detail:
        "No es el mercado libre el que te cobra en la bomba. Es el Ministerio de Industria y Comercio: publica precios y, cuando el petróleo internacional sube, destina subsidios para que el precio no se mueva. Quien fija el número visible, no necesariamente controla toda la cadena.",
      nodeIds: ["i-micm", "c-subsidio"],
      panelId: "i-micm",
    },
    {
      id: 2,
      line: "El Estado es dueño de la refinería.",
      detail:
        "Refidomsa es 100% estatal desde agosto 2021. Procesa ~30,000 barriles diarios. Pero el crudo no nace aquí: según la propia Refidomsa (vía Diario Libre), viene de St. James, EE.UU., con contrato Shell. Dueño de la planta ≠ dueño del petróleo.",
      nodeIds: ["e-refidomsa", "c-crudo-importado", "e-shell"],
      panelId: "e-refidomsa",
    },
    {
      id: 3,
      line: "¿Cómo recuperó el Estado el 49%? Con Roryk de por medio.",
      detail:
        "Hacienda: PATSA LTD, del Grupo Rizek, permutó con PDV Caribe el 49% de Refidomsa a cambio de bonos venezolanos, y de inmediato vendió esas acciones al Estado por €74 millones. El Estado quedó con el 100%. Roryk fue el facilitador.",
      nodeIds: ["e-grupo-rizek", "e-patsa", "e-refidomsa"],
      panelId: "e-patsa",
      pathFrom: ["e-grupo-rizek"],
    },
    {
      id: 4,
      line: "La misma familia administra tus pensiones.",
      detail:
        "Grupo Rizek controla AFP Crecer. Misma casa que facilitó la operación Refidomsa. Dos venas: una hacia el combustible, otra hacia tu fondo de pensión. Cuando haces clic en Roryk, esas dos aristas tienen que verse juntas.",
      nodeIds: ["e-grupo-rizek", "e-afp-crecer", "e-patsa", "e-refidomsa"],
      panelId: "e-grupo-rizek",
    },
    {
      id: 5,
      line: "El GLP —de la importación a tu casa— es Martí.",
      detail:
        "Tropigas (Grupo Martí) participa en toda la cadena del gas licuado: importación hasta entrega al consumidor final. Desde un camión en 1964 hasta absorber Shell Gas en 1997. Quien controla el GLP controla la cocina y una parte enorme del día a día.",
      nodeIds: ["e-grupo-marti", "e-tropigas", "p-carlos-marti"],
      panelId: "e-tropigas",
    },
    {
      id: 6,
      line: "Gasolina y diésel: también Martí, vía Sunix.",
      detail:
        "Sunix Petroleum, del mismo grupo, importa y distribuye combustibles líquidos. Estaciones, flota, red. El Estado tiene la refinería; el grupo privado tiene la manguera que llega al tanque.",
      nodeIds: ["e-grupo-marti", "e-sunix", "e-refidomsa"],
      panelId: "e-sunix",
      pathFrom: ["e-grupo-marti"],
    },
    {
      id: 7,
      line: "Cuando el petróleo sube, ¿quién paga la diferencia?",
      detail:
        "Semana del 12–18 sep 2026: el MICM destinó RD$1,631.5 millones en subsidios — RD$55.21 por galón de gasolina regular, RD$108.93 de gasoil regular, RD$117.28 de gasoil óptimo. Acumulado 2026: más de RD$32,000 millones. El precio se ve estable. El riesgo se traslada al presupuesto.",
      nodeIds: ["c-subsidio", "c-acumulado-2026", "i-micm", "c-contribuyente"],
      panelId: "c-subsidio",
    },
    {
      id: 8,
      line: "El riesgo del importador se convierte en tu factura.",
      detail:
        "Importadores y distribuidores venden a precio congelado. El Estado cubre la brecha con impuestos. En apariencia gana el consumidor. En la estructura, el contribuyente financia el estabilizador del juego cerrado — mientras los mismos grupos siguen controlando suministro y margen de la cadena.",
      nodeIds: ["c-contribuyente", "c-subsidio", "e-tropigas", "e-sunix"],
      panelId: "c-contribuyente",
      pathFrom: ["c-subsidio"],
    },
    {
      id: 9,
      line: "Tres patas. Un solo juego.",
      detail:
        "Estado (Refidomsa / MICM) · Grupo Rizek (PATSA + AFP Crecer) · Grupo Martí (Tropigas / Sunix). Legalidad, intermediación y distribución. El que falta en el organigrama corporativo eres tú: pagas el subsidio que mantiene el precio. No es monopolio. Es oligopolio con factura pública.",
      nodeIds: [
        "c-juego-cerrado",
        "e-refidomsa",
        "e-grupo-rizek",
        "e-grupo-marti",
        "i-micm",
        "c-contribuyente",
        "e-afp-crecer",
      ],
      panelId: "c-juego-cerrado",
      pathEdges: true,
    },
  ],
};
