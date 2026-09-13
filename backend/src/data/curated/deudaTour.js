/**
 * Recorrido — Deuda.
 * Historia: emite → compran → impuestos pagan → el dinero vuelve a los mismos.
 */

export const DEUDA_TOUR = {
  id: "deuda-ciclo",
  theme: "deuda",
  title: "Quién le presta al Estado — y quién cobra",
  epilogue:
    "No es deuda “externa” misteriosa. Es deuda con los mismos grupos que controlan pensiones, bancos y, en parte, el combustible. Tú cotizas. Tú pagas impuestos. Ellos cobran intereses.",
  entry: {
    hubId: "i-hacienda",
    satelliteIds: [
      "i-banco-central",
      "c-afp-bonos",
      "c-bancos-deuda",
      "c-intereses-2026",
      "c-impuestos-deuda",
      "e-grupo-rizek",
      "e-grupo-popular",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "El Estado necesita plata. Emite deuda.",
      detail:
        "Hacienda coloca bonos. El Banco Central emite títulos. No es abstracto: es una promesa de pagarte después — con intereses — sacada del presupuesto futuro.",
      nodeIds: ["i-hacienda", "i-banco-central", "c-deuda-total"],
      panelId: "i-hacienda",
    },
    {
      id: 2,
      line: "¿Quién compra? Sobre todo AFP y bancos.",
      detail:
        "Acento: las AFP tienen más de RD$803 mil millones en deuda del Gobierno y del BC. Las entidades financieras, más de RD$900 mil millones. Tu pensión y los depósitos bancarios se convierten en crédito al Estado.",
      nodeIds: ["c-afp-bonos", "c-bancos-deuda", "e-afp-popular", "e-banco-popular"],
      panelId: "c-afp-bonos",
    },
    {
      id: 3,
      line: "Las cuatro AFP están en ese circuito.",
      detail:
        "Popular, Crecer, Siembra, Reservas — cada una con su dueño: Grupo Popular, Rizek, BHD, ecosistema Banreservas. No es “el mercado”. Son casas con nombre.",
      nodeIds: [
        "e-afp-popular",
        "e-afp-crecer",
        "e-afp-siembra",
        "e-afp-reservas",
        "e-grupo-popular",
        "e-grupo-rizek",
        "e-grupo-bhd",
      ],
      panelId: "e-afp-crecer",
    },
    {
      id: 4,
      line: "Esa deuda hay que pagarla. Con intereses.",
      detail:
        "CREES: en 2026 el pago de intereses llegaría a RD$362,550 millones — 22.3% del gasto total, por encima de Educación. La mayor “partida” no es un ministerio de servicios: es el servicio de la deuda.",
      nodeIds: ["c-intereses-2026", "i-hacienda"],
      panelId: "c-intereses-2026",
    },
    {
      id: 5,
      line: "¿De dónde salen esos intereses? De tus impuestos.",
      detail:
        "ITBIS, ISR, lo que pagas en la pulpería y en la nómina. Cotizaste a la AFP que compró el bono. Ahora el Estado te cobra otra vez para pagarle intereses a esa AFP. Doble vuelta sobre el mismo trabajador.",
      nodeIds: ["c-impuestos-deuda", "c-intereses-2026", "c-afp-bonos"],
      panelId: "c-impuestos-deuda",
      pathFrom: ["c-intereses-2026"],
    },
    {
      id: 6,
      line: "El dinero vuelve a los mismos grupos.",
      detail:
        "Popular, BHD, Rizek, Reservas — dueños de bancos y AFP — son tenedores. El Estado les debe. El presupuesto les paga. El ciclo no es “ayuda al país”: es un negocio estable con el fisco como cliente cautivo.",
      nodeIds: [
        "e-grupo-popular",
        "e-grupo-bhd",
        "e-grupo-rizek",
        "e-banreservas",
        "c-intereses-2026",
      ],
      panelId: "e-grupo-popular",
    },
    {
      id: 7,
      line: "Y la deuda “externa” también se privatizó.",
      detail:
        "Acento: acreedores privados controlan ~76% de la deuda externa del gobierno (antes dominaban organismos y gobiernos). El país no solo se endeuda: se endeuda con privados.",
      nodeIds: ["c-acreedores-privados", "c-deuda-total"],
      panelId: "c-acreedores-privados",
    },
    {
      id: 8,
      line: "Rizek conecta esta deuda con otras venas.",
      detail:
        "La misma familia controla AFP Crecer (compra deuda con tu pensión) y facilitó Refidomsa vía PATSA. Deuda, pensiones y combustible no son silos. Son el mismo mapa.",
      nodeIds: ["e-grupo-rizek", "e-afp-crecer", "e-patsa", "c-afp-bonos"],
      panelId: "e-grupo-rizek",
    },
    {
      id: 9,
      line: "Por eso el ciclo se repite.",
      detail:
        "Se emite más deuda, se rueda la anterior, se pagan intereses, se vuelve a emitir. Mientras las AFP y los bancos necesiten papel “seguro” y el Estado necesite caja, el circuito sigue — y tú sigues en los dos lados de la factura.",
      nodeIds: [
        "i-hacienda",
        "c-deuda-total",
        "c-afp-bonos",
        "c-bancos-deuda",
        "c-intereses-2026",
        "c-impuestos-deuda",
        "e-grupo-rizek",
        "e-grupo-popular",
      ],
      panelId: "i-hacienda",
      pathEdges: true,
    },
  ],
};
