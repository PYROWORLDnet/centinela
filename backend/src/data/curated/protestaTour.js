/**
 * Recorrido — Protesta.
 * Queja → alza semanal → calle por el micrófono → Ley 44-26 → mesa transportista → permiso → paro local → art. 384 → cierre.
 */

export const PROTESTA_TOUR = {
  id: "protesta-anestesia",
  theme: "protesta",
  title: "Por qué todos se quejan y nadie para el país",
  epilogue:
    "El sistema no necesita prohibir la protesta. Le basta con tres cosas: que la queja se quede en el timeline, que la marcha quepa en un horario y una acera, y que el paro grande dé miedo. Pero julio de 2026 demostró lo contrario: cuando la gente se juntó con una demanda concreta y una fecha límite, el Congreso cambió una ley en 18 días. La pregunta no es si protestar sirve. Es por qué esa fuerza aparece cuando tocan el micrófono y no cuando sube la gasolina.",
  entry: {
    hubId: "c-mecanismo-protesta",
    satelliteIds: [
      "c-queja-digital",
      "c-plaza-bandera-2026",
      "l-44-26",
      "c-no-objecion",
      "c-art-384",
      "c-paros-regionales",
      "c-mesa-transportistas",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Todos se quejan. Nadie para el país.",
      detail:
        "La gasolina sube, los apagones vuelven, la canasta aprieta. No es que a la gente no le importe. Hay tres candados: la queja que no cuesta, la marcha con permiso y el miedo escrito en el Código Penal.",
      nodeIds: ["c-mecanismo-protesta", "c-queja-digital", "c-no-objecion", "c-art-384"],
      panelId: "c-mecanismo-protesta",
    },
    {
      id: 2,
      line: "Primer candado: la queja en el timeline.",
      detail:
        "El MICM anuncia los precios cada semana en redes. En mayo de 2026 la gasolina regular estaba en RD$301.50 el galón. A finales de septiembre el gasoil subió RD$3 más, y esa semana el subsidio costó RD$1,770 millones. Lo compartimos, lo comentamos y a la semana siguiente se repite. Una queja sin fecha ni demanda no obliga a nadie.",
      nodeIds: ["c-queja-digital", "c-alza-combustibles-2026", "i-micm", "c-subsidio", "c-contribuyente"],
      panelId: "c-queja-digital",
    },
    {
      id: 3,
      line: "Cuando tocaron el micrófono, sí hubo calle.",
      detail:
        "En mayo de 2025, periodistas marcharon contra el proyecto de ley de medios. El 9 de julio de 2026, miles llenaron la Plaza de la Bandera, convocados por redes, con Ricardo Ripoll y El Piro al frente, contra los artículos de difamación del nuevo Código Penal. Se habló también de la reforma fiscal y el costo de la vida. Pero el detonante fue la ley que tocaba su trabajo.",
      nodeIds: ["c-plaza-bandera-2026", "c-mordaza-2025", "c-queja-digital", "l-74-25"],
      panelId: "c-plaza-bandera-2026",
    },
    {
      id: 4,
      line: "Y funcionó: Ley 44-26 en 18 días.",
      detail:
        "Al día siguiente el Ejecutivo depositó un consenso. El 27 de julio ya era ley: la difamación bajó a uno o dos años y quedó protegida la crítica sobre corrupción cuando tiene sustento. Demanda concreta, masa y fecha límite. Esa es la prueba de que la presión sí mueve al sistema.",
      nodeIds: ["l-44-26", "c-plaza-bandera-2026", "i-senado", "l-74-25"],
      panelId: "l-44-26",
    },
    {
      id: 5,
      line: "El que sí puede parar, negoció.",
      detail:
        "Los choferes pueden detener el país en un día. En 2026 el Gobierno abrió una mesa permanente: gasoil subsidiado a cambio de no subir el pasaje. La CNTT encendió velas en Santiago, pero las federaciones se sentaron en el Palacio. El sector con fuerza se calma con subsidio, y ese subsidio también lo pagas tú.",
      nodeIds: ["c-mesa-transportistas", "c-mecanismo-transporte", "c-subsidio", "c-alza-combustibles-2026"],
      panelId: "c-mesa-transportistas",
    },
    {
      id: 6,
      line: "Segundo candado: la marcha con permiso.",
      detail:
        "Friusa, marzo de 2025: Interior y Policía autorizó a la Antigua Orden a marchar de 2 a 6 de la tarde, por la acera, en 1.4 kilómetros. Desplegaron más de mil agentes. Cuando un grupo se salió de la ruta, hubo lacrimógenas. La Constitución dice que reunirse no requiere permiso previo. Pero si la protesta cabe en el horario del poder, al poder no le cuesta nada.",
      nodeIds: ["c-no-objecion", "i-interior-policia", "o-antigua-orden", "c-art-48"],
      panelId: "c-no-objecion",
    },
    {
      id: 7,
      line: "El paro existe, pero es local.",
      detail:
        "Navarrete, Licey, Salcedo, Tenares y ahora Bonao: paros de 24 y 48 horas por calles, acueductos y luz. Antes de cada paro llegan SWAT, Linces y Ejército. En Salcedo hubo detenidos horas antes. Cada pueblo para por su lista y el país nunca para junto. Las protestas por apagones también son de barrio.",
      nodeIds: ["c-paros-regionales", "c-factura-vs-tarifa", "c-apagones", "c-art-48"],
      panelId: "c-paros-regionales",
    },
    {
      id: 8,
      line: "Tercer candado: el miedo escrito.",
      detail:
        "El artículo 384 castiga la insurrección con 30 a 40 años: la pena del asesinato y el doble del homicidio simple. En el papel exige violencia colectiva, así que la protesta pacífica no es insurrección. Pero palabras como cualquier, involucrarse y pueda afectar quedan abiertas, y juristas advierten del riesgo. Si la protesta termina en un choque con la Policía, el artículo 313 da de 5 a 10 años. No hace falta condenar a nadie: basta con que el organizador lo piense dos veces.",
      nodeIds: ["c-art-384", "c-art-313", "l-74-25", "c-paros-regionales"],
      panelId: "c-art-384",
    },
    {
      id: 9,
      line: "Por eso no se para el país.",
      detail:
        "Queja sin costo, marcha con horario y miedo escrito. Así el pueblo se desahoga y el centro no se toca. Pero julio de 2026 dejó la receta a la vista: masa, una demanda concreta y una fecha. Eso toca El Núcleo.",
      nodeIds: [
        "c-mecanismo-protesta",
        "c-pueblo",
        "c-nucleo",
        "l-44-26",
        "c-queja-digital",
        "c-no-objecion",
        "c-art-384",
      ],
      panelId: "c-mecanismo-protesta",
      pathEdges: true,
    },
  ],
};
