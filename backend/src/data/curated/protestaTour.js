/**
 * Recorrido — Protesta.
 * Megáfono que solo brinca por lo suyo → protesta con permiso → paro y miedo → cierre.
 */

export const PROTESTA_TOUR = {
  id: "protesta-anestesia",
  theme: "protesta",
  title: "La anestesia de las redes y la trampa de la protesta autorizada",
  epilogue:
    "El sistema no necesita prohibir la protesta. Le basta con que los del megáfono solo brinquen cuando les tocan lo suyo, que los que dicen estar en contra le pidan permiso para marchar, y que el que quiera parar el país tenga miedo. Pero la Ley Mordaza dejó la prueba: cuando se juntan con una demanda concreta y una fecha, el Congreso cambia una ley en 18 días. El patriotismo no se demuestra en un post.",
  entry: {
    hubId: "c-mecanismo-protesta",
    satelliteIds: [
      "c-queja-digital",
      "c-plaza-bandera-2026",
      "l-44-26",
      "o-antigua-orden",
      "c-no-objecion",
      "c-art-384",
      "c-paros-regionales",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Todos se quejan. Nadie para el país.",
      detail:
        "La gasolina sube, los apagones vuelven, la canasta aprieta. No es que al pueblo no le importe. Hay tres trampas: el megáfono que solo suena por lo suyo, la protesta con permiso y el miedo escrito en el Código Penal.",
      nodeIds: ["c-mecanismo-protesta", "c-queja-digital", "c-no-objecion", "c-art-384"],
      panelId: "c-mecanismo-protesta",
    },
    {
      id: 2,
      line: "Los del megáfono: mucho video, cero calle.",
      detail:
        "Los influencers nos informan cada alza. En mayo de 2026 la gasolina regular estaba en RD$301.50 el galón. A finales de septiembre el gasoil subió RD$3 más, y esa semana el subsidio costó RD$1,770 millones que pagamos todos. ¿Y qué hacen? El video, el meme, el comentario. La semana siguiente, otra alza y otra vez lo mismo.",
      nodeIds: ["c-queja-digital", "c-alza-combustibles-2026", "i-micm", "c-subsidio", "c-contribuyente"],
      panelId: "c-queja-digital",
    },
    {
      id: 3,
      line: "Pero cuando les tocaron lo suyo, brincaron.",
      detail:
        "La llamada Ley Mordaza: artículos de difamación del nuevo Código Penal que podían meterlos presos por lo que publican. Ahí sí convocaron. El 9 de julio de 2026, miles llenaron la Plaza de la Bandera. Ya en mayo de 2025 habían marchado contra el proyecto de ley de medios. Por la gasolina, nunca se vio una convocatoria así.",
      nodeIds: ["c-plaza-bandera-2026", "c-mordaza-2025", "c-queja-digital", "l-74-25"],
      panelId: "c-plaza-bandera-2026",
    },
    {
      id: 4,
      line: "Y para ellos sí funcionó: 18 días.",
      detail:
        "Al día siguiente de la plaza, el gobierno depositó un consenso en el Congreso. El 27 de julio ya era la Ley 44-26: bajaron las penas de difamación. Cuando el golpe era para ellos, se resolvió en 18 días. Con los apagones y las facturas altas, el pueblo protesta solo en su barrio, sin megáfono.",
      nodeIds: ["l-44-26", "c-plaza-bandera-2026", "i-senado", "c-factura-vs-tarifa", "c-apagones"],
      panelId: "l-44-26",
    },
    {
      id: 5,
      line: "Segunda trampa: pedirle permiso al sistema.",
      detail:
        "La Antigua Orden Dominicana marcha contra lo que el Estado no controla en la frontera. Pero para marchar, le pide permiso a ese mismo Estado. Para Friusa, en marzo de 2025, Interior y Policía le dio la no objeción con fecha, hora y ruta. Es como pedirle permiso al ladrón para vigilar tu casa.",
      nodeIds: ["o-antigua-orden", "i-interior-policia", "c-no-objecion", "c-cortina-soberania"],
      panelId: "o-antigua-orden",
    },
    {
      id: 6,
      line: "Ruta, horario y acera: una válvula de escape.",
      detail:
        "De 2 a 6 de la tarde, por la acera, en 1.4 kilómetros, con más de mil policías y militares. Cuando un grupo se salió de la ruta, lacrimógenas. Y lo más fuerte: la Constitución, en su artículo 48, dice que reunirse no requiere permiso previo. El gobierno dice que respetó la protesta y al otro día todo sigue igual.",
      nodeIds: ["c-no-objecion", "c-art-48", "i-interior-policia", "o-antigua-orden"],
      panelId: "c-no-objecion",
    },
    {
      id: 7,
      line: "Lo que sí asusta al poder: parar.",
      detail:
        "Con los choferes, que pueden detener el país en un día, el gobierno abrió una mesa permanente y les da gasoil subsidiado para que no suban el pasaje. Cuando FALPO convoca paros en Salcedo o Bonao, la noche antes llegan SWAT, Linces y Ejército, y en Salcedo hubo detenidos horas antes. Al paro lo tratan distinto porque es lo único que les cuesta.",
      nodeIds: ["c-mesa-transportistas", "c-paros-regionales", "c-mecanismo-transporte", "c-art-48"],
      panelId: "c-paros-regionales",
    },
    {
      id: 8,
      line: "Tercera trampa: el miedo escrito.",
      detail:
        "El artículo 384 del nuevo Código Penal, la Ley 74-25, castiga la insurrección con 30 a 40 años, la misma pena del asesinato. El homicidio simple da de 10 a 20. Habla de cualquier violencia colectiva y de quien participe o se involucre en ella. Juristas advierten que es tan abierto que puede caerle encima a quien convoca una protesta donde otros causan disturbios. Y si hay choque con la Policía en una manifestación, el artículo 313 da de 5 a 10 años. No hace falta condenar a nadie: basta con que el organizador tenga miedo.",
      nodeIds: ["c-art-384", "c-art-313", "l-74-25", "c-paros-regionales"],
      panelId: "c-art-384",
    },
    {
      id: 9,
      line: "Dominicanos, despertemos.",
      detail:
        "Megáfono que solo suena por lo suyo, protesta con permiso y miedo escrito: así el pueblo se desahoga y el centro no se toca. El patriotismo no se demuestra en un post. Se demuestra con organización, con una demanda concreta y una fecha. La Ley Mordaza probó que así sí funciona. Eso toca El Núcleo.",
      nodeIds: [
        "c-mecanismo-protesta",
        "c-pueblo",
        "c-nucleo",
        "l-44-26",
        "c-queja-digital",
        "o-antigua-orden",
        "c-art-384",
      ],
      panelId: "c-mecanismo-protesta",
      pathEdges: true,
    },
  ],
};
