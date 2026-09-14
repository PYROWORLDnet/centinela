/**
 * Recorrido narrativo — tema ADP / sindicatos docentes.
 *
 * Historia: quién manda en la escuela pública.
 * 4% → acuerdo → aumento condicionado → evaluación → paro → estudiantes.
 */

export const ADP_TOUR = {
  id: "adp-quien-manda-escuela",
  theme: "adp",
  title: "Quién manda en la escuela pública",
  epilogue:
    "No es solo “los maestros quieren más sueldo”. Es un mecanismo: el 4% del PIB pone la caja; ADP y Minerd pelean el cronograma; el aumento del 10% llegó atado a 11 puntos; la evaluación de desempeño sigue en disputa; el paro es el músculo; el estudiante pierde el día. Mientras el cumplimiento sea un porcentaje de cada lado, la escuela vive en tregua renovable.",
  entry: {
    hubId: "c-mecanismo-adp",
    satelliteIds: [
      "o-adp",
      "i-minerd",
      "c-cuatro-porciento",
      "c-acuerdo-adp-minerd",
      "c-aumento-10",
      "c-paro-docente",
      "c-estudiantes",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "La escuela no se gobierna solo desde el Minerd.",
      detail:
        "Hay un mecanismo permanente: el Ministerio paga y regula; la ADP negocia, condiciona y puede paralizar. Si solo miras al ministro, te comes media historia. Empieza por el circuito ADP ↔ Estado.",
      nodeIds: ["c-mecanismo-adp", "o-adp", "i-minerd"],
      panelId: "c-mecanismo-adp",
    },
    {
      id: 2,
      line: "La ADP es el interlocutor que no se va.",
      detail:
        "Asociación Dominicana de Profesores: el gremio del magisterio público. Firma acuerdos, acepta aumentos con condiciones y convoca paros. Eduardo Hidalgo es la voz que pone el porcentaje y la denuncia en el titular.",
      nodeIds: ["o-adp", "p-eduardo-hidalgo", "i-minerd"],
      panelId: "o-adp",
    },
    {
      id: 3,
      line: "El piso de la pelea es el 4% del PIB.",
      detail:
        "El Pacto Educativo 2014–2030 y la conquista gremial del ~4% del PIB a preuniversitaria ponen la caja. Hidalgo ha dicho que ese 4% ha sido “fuente de corrupción” — denuncia pública, no sentencia. La disputa real: no solo si se asigna, sino cómo se gasta.",
      nodeIds: ["c-cuatro-porciento", "i-minerd", "o-adp"],
      panelId: "c-cuatro-porciento",
    },
    {
      id: 4,
      line: "Hay un papel: el acuerdo ADP–Minerd.",
      detail:
        "Firmado en 2021 (con Abinader presente), ratificado en jul 2023. En may 2024 priorizaron 11 puntos: escuelas, nombramientos, evaluación, alimentación, licencias, maestros bloqueados, incentivos, comisión bipartita con el Defensor del Pueblo. El papel es la tregua.",
      nodeIds: ["c-acuerdo-adp-minerd", "o-adp", "i-minerd"],
      panelId: "c-acuerdo-adp-minerd",
    },
    {
      id: 5,
      line: "El 10% no vino solo: vino con condiciones.",
      detail:
        "May 2024: de 8% del Gobierno a 10% total (+2% en mesa), aceptado por la ADP. Condicionado a avanzar los 11 puntos. El titular es el porcentaje; el mecanismo es el canje aumento ↔ cumplimiento.",
      nodeIds: ["c-aumento-10", "c-acuerdo-adp-minerd", "o-adp"],
      panelId: "c-aumento-10",
      pathFrom: ["c-acuerdo-adp-minerd"],
    },
    {
      id: 6,
      line: "La evaluación docente es el nervio del bolsillo.",
      detail:
        "Acordaron aplicarla en 2024–2025 con la escala vigente. En ene 2025 la ADP denuncia que el Minerd quiere recortar el incentivo de docentes “mejorables”. Quien mueve la escala mueve el ingreso del aula.",
      nodeIds: ["c-evaluacion-docente", "c-acuerdo-adp-minerd", "o-adp"],
      panelId: "c-evaluacion-docente",
    },
    {
      id: 7,
      line: "Si el papel no alcanza, entra el paro.",
      detail:
        "La ADP convoca paralizaciones por incumplimiento. El Minerd documenta el golpe: centros con hasta ~85% de asistencia estudiantil afectados. Cada lado vende su narrativa de quién rompió el acuerdo.",
      nodeIds: ["c-paro-docente", "c-incumplimiento", "o-adp", "i-minerd"],
      panelId: "c-paro-docente",
    },
    {
      id: 8,
      line: "En el medio: los estudiantes.",
      detail:
        "No firman. No cobran el 10%. Pierden el día de clase cuando la mesa se rompe. Hidalgo habla de ~15% de cumplimiento; el Minerd habla de mayoría cumplida. Mientras no haya matriz pública compartida, la escuela vive de tregua en tregua.",
      nodeIds: [
        "c-estudiantes",
        "c-mecanismo-adp",
        "c-paro-docente",
        "c-incumplimiento",
        "o-adp",
        "i-minerd",
      ],
      panelId: "c-estudiantes",
      pathEdges: true,
    },
  ],
};
