/**
 * Recorrido narrativo — tema Salud / SeNaSa.
 *
 * Historia: quién cobra antes de que te atiendan.
 * Afiliado → SeNaSa → contratos → red → farmacia.
 */

export const SALUD_TOUR = {
  id: "salud-quien-cobra",
  theme: "salud",
  title: "Quién cobra antes de que te atiendan",
  epilogue:
    "No es solo “el hospital está lleno”. Es una red de pago: SeNaSa concentra +7.4 M de afiliados; SISALRIL marca el catálogo; el SNS atiende; PROMESE y gestores privados pelean la farmacia; la capitación y los contratos directos decidieron quién cobraba fijo. La DGCP anuló Farmacard; el MP investiga Operación Cobra. El afiliado sigue esperando la pastilla.",
  entry: {
    hubId: "c-mecanismo-salud",
    satelliteIds: [
      "i-senasa",
      "i-sisalril",
      "c-red-prestadores",
      "c-contratos-capita",
      "e-farmacard",
      "c-afiliado",
      "c-operacion-cobra",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "La salud pública es una red de plata.",
      detail:
        "Si solo miras el hospital, te comes media historia. SeNaSa paga, SISALRIL regula, el SNS atiende, y los contratos —capitación, farmacia, prospectivos— deciden quién cobra antes de la consulta. Empieza por el mecanismo.",
      nodeIds: ["c-mecanismo-salud", "i-senasa", "c-afiliado"],
      panelId: "c-mecanismo-salud",
    },
    {
      id: 2,
      line: "SeNaSa es el cheque más grande.",
      detail:
        "ARS pública: más de 7.4 millones de afiliados. Régimen subsidiado + contributivos que la eligen. Reportó 185 hospitales, 301 clínicas, 979 farmacias y miles de médicos en red. Quien concentra la cartera concentra el poder de contratar.",
      nodeIds: ["i-senasa", "c-regimen-subsidiado", "c-red-prestadores"],
      panelId: "i-senasa",
    },
    {
      id: 3,
      line: "SISALRIL pone las reglas del Plan Básico.",
      detail:
        "El catálogo de prestaciones es común a todas las ARS. La diferencia está en el régimen (subsidiado al 100% vs diferenciales en contributivo) y en cómo cada ARS arma y paga su red. El regulador también opina cuando un contrato pretende saltarse la 340-06.",
      nodeIds: ["i-sisalril", "i-senasa", "c-red-prestadores"],
      panelId: "i-sisalril",
    },
    {
      id: 4,
      line: "La red no es SeNaSa: se contrata.",
      detail:
        "Hospitales públicos (SNS), clínicas privadas, laboratorios, farmacias, médicos independientes. Sin contrato, no hay pago del Plan Básico. El afiliado camina esa red; la ARS decide quién está dentro.",
      nodeIds: ["c-red-prestadores", "i-sns", "i-senasa", "c-afiliado"],
      panelId: "c-red-prestadores",
      pathFrom: ["i-senasa"],
    },
    {
      id: 5,
      line: "Capitación: plata fija, menos acto por acto.",
      detail:
        "La nueva dirección declaró haber desmontado contratos capitados (~RD$112 MM/mes a seis entidades) y prospectivos (~RD$60 MM). Cifras de declaración pública. El mecanismo importa: pago fijo sin factura clínica detallada cambia los incentivos.",
      nodeIds: ["c-contratos-capita", "i-senasa", "c-red-prestadores"],
      panelId: "c-contratos-capita",
    },
    {
      id: 6,
      line: "Farmacard: el cuello de la pastilla.",
      detail:
        "Contrato directo feb 2025 para administrar farmacia ambulatoria. La DGCP lo anuló: no era “servicio de salud” excluido de la 340-06, sino gestión administrativa/tecnológica. Vigencia temporal mientras se licita. Farmacard alega ahorros; el pliego decide el siguiente.",
      nodeIds: ["e-farmacard", "i-dgcp", "i-senasa", "c-licitacion-medicamentos"],
      panelId: "e-farmacard",
    },
    {
      id: 7,
      line: "Operación Cobra: el expediente paralelo.",
      detail:
        "El Ministerio Público investiga un presunto esquema de corrupción y desvío en SeNaSa. Informes citados hablan de impacto en reservas técnicas >RD$18,000 MM. Acusación e investigación — no sentencia. El déficit operacional declarado (~RD$15,000 MM) es el reverso contable que la dirección dice haber encontrado.",
      nodeIds: ["c-operacion-cobra", "c-deficit-senasa", "i-senasa"],
      panelId: "c-operacion-cobra",
    },
    {
      id: 8,
      line: "En el medio: el afiliado.",
      detail:
        "No firma la capitación. No elige el administrador de farmacia. Pierde cuando la preautorización se traba o el prestador sale de la red. PROMESE sigue en el subsidiado; la licitación reabre la farmacia privada. Misma regla del mapa: sigue la plata, no el discurso.",
      nodeIds: [
        "c-afiliado",
        "c-mecanismo-salud",
        "i-promese",
        "e-farmacard",
        "c-red-prestadores",
      ],
      panelId: "c-afiliado",
      pathEdges: true,
    },
  ],
};
