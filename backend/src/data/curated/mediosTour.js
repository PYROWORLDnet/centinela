/**
 * Recorrido — Medios.
 */

export const MEDIOS_TOUR = {
  id: "medios-filtros",
  theme: "medios",
  title: "Quién filtra lo que lees y ves",
  epilogue:
    "No es que los medios “mientan” siempre. Es que no te cuentan lo que no les conviene. Y lo que no te cuentan es, muchas veces, exactamente el mapa que Centinela muestra: las mismas casas detrás de AFP, bancos, combustible… y titulares.",
  entry: {
    hubId: "c-filtros",
    satelliteIds: [
      "e-grupo-corripio",
      "m-listin",
      "e-grupo-vicini",
      "e-grupo-rizek",
      "m-telesistema",
      "m-teleantillas",
      "m-hoy",
    ],
    line: null,
  },
  steps: [
    {
      id: 1,
      line: "La información también tiene dueño.",
      detail:
        "Diarios y canales no son neutralidad flotante. Son empresas — y en RD, empresas de casas que ya conoces por otros temas. Empezar por ahí cambia cómo lees una portada.",
      nodeIds: ["c-filtros", "e-grupo-corripio", "m-listin"],
      panelId: "c-filtros",
    },
    {
      id: 2,
      line: "Corripio concentra pantallas.",
      detail:
        "Hoy, Telesistema 11, Teleantillas, El Día, El Nacional y más. Un solo conglomerado con varios micrófonos. Eso no es pluralismo automático: es escala.",
      nodeIds: ["e-grupo-corripio", "m-hoy", "m-telesistema", "m-teleantillas", "m-el-dia", "m-el-nacional"],
      panelId: "e-grupo-corripio",
    },
    {
      id: 3,
      line: "Listín Diario: un diario, varias casas.",
      detail:
        "En 2010 asumieron el control: Vicini, Rizek, Bermúdez y Corripio. El periódico más emblemático del país quedó cruzado por las mismas familias del capital.",
      nodeIds: ["m-listin", "e-grupo-vicini", "e-grupo-rizek", "e-grupo-corripio"],
      panelId: "m-listin",
    },
    {
      id: 4,
      line: "Vicini también está en ese cruce.",
      detail:
        "Juan Bautista Vicini Lluberes firmó el control accionario de 2010. La casa Vicini/INICIA no es solo “historia antigua”: aparece en el medio que marca agenda.",
      nodeIds: ["e-grupo-vicini", "m-listin"],
      panelId: "e-grupo-vicini",
    },
    {
      id: 5,
      line: "Rizek también.",
      detail:
        "Héctor José y Samir Rizek figuran entre los accionistas de 2010. La misma familia de AFP Crecer y PATSA/Refidomsa toca el diario. Otra vena del mismo mapa.",
      nodeIds: ["e-grupo-rizek", "m-listin"],
      panelId: "e-grupo-rizek",
    },
    {
      id: 6,
      line: "Cuando hablan de pensiones…",
      detail:
        "…el titular pasa por filtros de casas que también pesan en AFP y banca. No hace falta inventar una conspiración de cada nota. Basta con ver quién es el dueño del canal.",
      nodeIds: ["c-filtros", "e-grupo-rizek", "e-grupo-corripio", "m-listin"],
      panelId: "c-filtros",
    },
    {
      id: 7,
      line: "Cuando hablan de gasolina o deuda…",
      detail:
        "Misma lógica. El público consume “noticia”. El mapa muestra “casa”. Centinela existe para que esas dos lecturas se toquen.",
      nodeIds: ["c-filtros", "e-grupo-vicini", "e-grupo-rizek", "m-telesistema"],
      panelId: "m-telesistema",
    },
    {
      id: 8,
      line: "Pluralismo de marcas ≠ pluralismo de dueños.",
      detail:
        "Puedes tener cinco logos y dos o tres casas detrás. Contar canales no es contar poder. Contar familias sí.",
      nodeIds: ["e-grupo-corripio", "m-hoy", "m-teleantillas", "m-el-nacional", "c-filtros"],
      panelId: "e-grupo-corripio",
    },
    {
      id: 9,
      line: "Por eso este tema cierra el círculo.",
      detail:
        "Medios no son un anexo cultural. Son infraestructura de poder de las mismas casas. Si no ves al dueño, crees que el debate es libre. Si lo ves, entiendes el filtro.",
      nodeIds: [
        "c-filtros",
        "e-grupo-corripio",
        "e-grupo-vicini",
        "e-grupo-rizek",
        "m-listin",
        "m-telesistema",
        "m-teleantillas",
      ],
      panelId: "c-filtros",
      pathEdges: true,
    },
  ],
};
