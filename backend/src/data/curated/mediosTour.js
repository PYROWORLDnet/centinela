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
      "c-pauta-oficial",
      "i-diecom",
      "e-grupo-vicini",
      "e-grupo-rizek",
      "m-telesistema",
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
        "Hoy, Telesistema 11, Teleantillas, El Día, El Nacional y más. Un solo conglomerado con varios micrófonos. El Nacional es Corripio: si lo buscas, caes en esta casa — y en La Cúpula.",
      nodeIds: ["e-grupo-corripio", "m-hoy", "m-telesistema", "m-teleantillas", "m-el-dia", "m-el-nacional", "c-la-cupula"],
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
      line: "La pauta oficial es el otro filtro.",
      detail:
        "El Estado gasta miles de millones en publicidad (Digepres vía prensa: ~RD$11,292 MM en 2024; ~RD$10,252 MM previstos en 2025 tras modificación). Esa plata no es decorado: es oxígeno. Quien la reparte condiciona quién respira.",
      nodeIds: ["c-pauta-oficial", "i-diecom", "c-filtros"],
      panelId: "c-pauta-oficial",
    },
    {
      id: 7,
      line: "DIECOM + Decreto 1-24: el peaje con reglas.",
      detail:
        "DIECOM coordina la comunicación del Ejecutivo. El Decreto 1-24 exige criterios objetivos y prohíbe usar la pauta como propaganda electoral o subsidio encubierto. No elimina el poder de la pauta: obliga a dejar rastro.",
      nodeIds: ["i-diecom", "c-decreto-1-24", "c-pauta-oficial"],
      panelId: "i-diecom",
    },
    {
      id: 8,
      line: "Dueños + pauta = doble candado.",
      detail:
        "Corripio, Listín, CDN… Las mismas casas del mapa reciben (o pelean) la pauta estatal. Pluralismo de logos no es pluralismo de dueños ni de facturas del Estado.",
      nodeIds: ["c-pauta-oficial", "e-grupo-corripio", "m-listin", "e-grupo-linda", "m-cdn"],
      panelId: "c-pauta-oficial",
    },
    {
      id: 9,
      line: "Por eso Medios cierra el círculo.",
      detail:
        "Ownership + pauta oficial. Si no ves al dueño ni al pagador estatal, crees que el debate es libre. Si los ves, entiendes el filtro. Eso toca El Núcleo.",
      nodeIds: [
        "c-filtros",
        "c-pauta-oficial",
        "e-grupo-corripio",
        "e-grupo-vicini",
        "e-grupo-rizek",
        "m-listin",
        "c-la-cupula",
      ],
      panelId: "c-filtros",
      pathEdges: true,
    },
  ],
};
