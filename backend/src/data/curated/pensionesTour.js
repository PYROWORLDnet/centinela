/**
 * Recorrido narrativo — tema Pensiones.
 * Solo hechos con fuente citable. Montos solo si la fuente los publica.
 *
 * Ownership verificable:
 * - Grupo Popular → AFP Popular (sitio corporativo)
 * - Grupo Rizek → AFP Crecer (sitio AFP Crecer)
 * - Centro Financiero BHD → AFP Siembra (sitio AFP Siembra)
 * - Banreservas → AFP Reservas (ecosistema)
 */

export const PENSIONES_TOUR = {
  id: "pensiones-ciclo",
  theme: "pensiones",
  title: "Quién controla tu pensión",
  epilogue:
    "No es un político suelto. No es un partido. Es un sistema: tu sueldo financia la deuda del Estado, el Estado te cobra impuestos para pagar intereses a las mismas AFP, y los dueños de esas AFP pesan en la mesa que escribe las reglas — con poder de veto. Mientras no lo veas, no puedes cambiarlo.",
  entry: {
    hubId: "i-cnss",
    satelliteIds: [
      "b-gobierno",
      "b-empleadores",
      "b-trabajadores",
      "i-sipen",
      "i-comision-clasificadora",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "Cada mes te descuentan de la nómina.",
      detail:
        "Ese dinero no se queda debajo del colchón. Va a una AFP: Popular, Crecer, Siembra o Reservas. Ellas administran tu pensión. No es “ahorro del banco”: es tu plata de trabajador, obligatoria por ley.",
      nodeIds: ["c-cotizaciones", "c-fondos-pensiones", "e-afp-popular"],
      panelId: "c-fondos-pensiones",
    },
    {
      id: 2,
      line: "La AFP no guarda tu dinero: lo presta al gobierno.",
      detail:
        "Según SIPEN (Boletín 90, vía El Dinero), ~57% de la cartera del sistema está en deuda de Hacienda y ~7.9% en títulos del Banco Central: casi dos de cada tres pesos van al Estado. Ejemplo concreto: el Fondo T-1 de AFP Popular reportó RD$27,797 millones en Gobierno Central en sus EEFF auditados 2025. Tu pensión se convierte en deuda pública.",
      nodeIds: ["e-afp-popular", "c-afp-popular-gob-central", "c-bonos-hacienda-sistema", "i-hacienda"],
      panelId: "c-afp-popular-gob-central",
      pathFrom: ["e-afp-popular"],
    },
    {
      id: 3,
      line: "¿Y el bono Covid de RD$40,000 millones?",
      detail:
        "En mayo 2020, Hacienda vendió títulos especiales a AFP Popular, Crecer, Reservas y Siembra, a partes iguales (RD$10,000 MM cada una). Plazos de 10, 15 y 20 años; cupones 10%, 10.25% y 10.875%. Cuando el Estado necesitó plata urgente, usó el ahorro de los trabajadores. Fuentes: Hacienda y ADAFP / prensa.",
      nodeIds: [
        "c-bonos-covid-40mm",
        "e-afp-popular",
        "e-afp-crecer",
        "e-afp-siembra",
        "e-afp-reservas",
        "i-hacienda",
      ],
      panelId: "c-bonos-covid-40mm",
    },
    {
      id: 4,
      line: "Esa deuda hay que pagarla. ¿Con qué? Con tus impuestos.",
      detail:
        "Hacienda paga intereses a los fondos de pensiones. Esos intereses salen del presupuesto: ITBIS, ISR y lo que cobras en la pulpería y en la nómina. Te descontaron para “ahorrar”, prestaron ese ahorro al Estado, y te cobran otra vez para pagar el préstamo. Doble carga sobre el mismo trabajador.",
      nodeIds: ["c-impuestos", "i-hacienda", "c-fondos-pensiones"],
      panelId: "c-impuestos",
      pathFrom: ["i-hacienda"],
    },
    {
      id: 5,
      line: "Mientras tanto, alguien cobra comisión.",
      detail:
        "La AFP cobra por administrar. AFP Popular pertenece al Grupo Popular. Crecer al Grupo Rizek. Siembra al Centro Financiero BHD. Reservas al ecosistema Banreservas. Tú asumes el riesgo de la deuda pública; ellos cobran por el camino.",
      nodeIds: ["e-grupo-popular", "e-afp-popular", "e-banco-popular"],
      panelId: "e-grupo-popular",
      pathFrom: ["e-afp-popular"],
    },
    {
      id: 6,
      line: "¿Quién escribe las reglas? El CNSS.",
      detail:
        "El Consejo Nacional de Seguridad Social es el órgano rector del sistema. No es un ministerio suelto: es una mesa con gobierno, empleadores y trabajadores. Ahí se decide cómo funciona tu pensión.",
      nodeIds: ["i-cnss", "b-gobierno", "b-empleadores", "b-trabajadores"],
      panelId: "i-cnss",
    },
    {
      id: 7,
      line: "Los empleadores tienen veto.",
      detail:
        "Ley 87-01, Art. 24: una resolución del CNSS solo es válida si incluye el voto favorable de al menos un representante del gobierno, uno de los trabajadores y uno de los empleadores. Eso es tripartismo con veto. Sin el voto empleador, no hay reforma.",
      nodeIds: ["b-empleadores", "e-conep", "e-copardom", "i-cnss"],
      panelId: "b-empleadores",
      pathFrom: ["i-cnss"],
    },
    {
      id: 8,
      line: "SIPEN — el regulador nace del CNSS.",
      detail:
        "SIPEN supervisa a las AFP. El Superintendente se nombra por decreto del Poder Ejecutivo de una terna que presenta el CNSS (Art. 109, Ley 87-01). Quien pesa en el CNSS también pesa en quién te regula.",
      nodeIds: ["i-sipen", "i-cnss", "e-afp-popular"],
      panelId: "i-sipen",
      pathFrom: ["i-cnss"],
    },
    {
      id: 9,
      line: "Por eso el sistema se traba.",
      detail:
        "Depende de deuda tomada de tus pensiones, paga intereses con tus impuestos, y la mesa que podría cambiar las reglas tiene veto del mismo ecosistema empresarial que controla las AFP. Tú financias dos veces. Ellos cobran. Las reglas se escriben ahí.",
      nodeIds: [
        "i-cnss",
        "b-empleadores",
        "e-grupo-popular",
        "e-afp-popular",
        "i-sipen",
        "i-hacienda",
        "c-impuestos",
      ],
      panelId: "i-cnss",
      pathEdges: true,
    },
  ],
};

export function getPensionesTour() {
  return PENSIONES_TOUR;
}
