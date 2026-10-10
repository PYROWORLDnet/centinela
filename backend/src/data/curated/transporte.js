/**
 * Tema curado — Transporte.
 * Quién mueve la ciudad: Estado (OMSA/Metro) vs federaciones que controlan rutas.
 */

const SRC = {
  acento: {
    label: "Acento — transporte público: lucha por un sector de RD$18,250 MM/año",
    url: "https://acento.com.do/economia/transporte-publico-la-lucha-por-el-control-de-un-sector-que-mueve-mas-de-rd18250-millones-al-ano-9071481.html",
  },
  diarioLibreOmsa: {
    label: "Diario Libre — OMSA al límite: presupuesto ~RD$2,200 MM (2025)",
    url: "https://www.diariolibre.com/actualidad/ciudad/2025/06/15/omsa-al-limite-transporte-masivo-con-el-presupuesto-deficiente/3149368",
  },
  diarioLibre2026: {
    label: "Diario Libre — OMSA en retroceso; Fenatrano opera Corredor Independencia",
    url: "https://www.diariolibre.com/actualidad/ciudad/2026/03/05/la-omsa-en-retroceso-ahora-es-un-sistema-de-respaldo/3458046",
  },
  omsa: {
    label: "OMSA — Operadora Metropolitana de Servicios de Autobuses",
    url: "https://omsa.gob.do/",
  },
  opret: {
    label: "OPRET — Oficina para el Reordenamiento del Transporte (Metro / Teleférico)",
    url: "https://www.opret.gob.do/",
  },
  intrant: {
    label: "INTRANT — Instituto Nacional de Tránsito y Transporte Terrestre",
    url: "https://intrant.gob.do/",
  },
  ley6317: {
    label: "Ley 63-17 — Movilidad, Transporte Terrestre, Tránsito y Seguridad Vial",
    url: "https://intrant.gob.do/transparencia/index.php/base-legal/leyes",
  },
  senadoMarte: {
    label: "Senado — Casimiro Antonio Marte, senador Santiago Rodríguez 2024-2028",
    url: "https://www.senadord.gob.do/provincia/santiago-rodriguez/",
  },
  dumMarte: {
    label: "De Último Minuto — Marte: “si me ponen a elegir entre el Senado y mis autobuses…”",
    url: "https://deultimominuto.com/nacionales/antonio-marte-reclama-mayor-participacion-de-autobuses-conatra-en-el-transporte-escolar/",
  },
  atentoConatra: {
    label: "Atento — Conatra reelige a Antonio Marte (nov 2024)",
    url: "https://atento.com.do/2024/11/30/conatra-reelige-antonio-marte-como-nuevo-presidente/",
  },
  hoyHubieres: {
    label: "Hoy — Conatra y el diputado Juan Hubieres (Fenatrano) sobre subsidios (2016)",
    url: "https://hoy.com.do/economia/conatra-esta-de-acuerdo-con-eliminar-subsidio-combustibles-pero-subira-el-pasaje_656720.html",
  },
  acentoSubsidio: {
    label: "Acento — Hubieres: RD$3 mil MM al transporte vs RD$30 mil MM a grandes empresas (2025)",
    url: "https://acento.com.do/economia/eliminando-todos-los-subsidios-de-combustible-se-pone-fin-a-la-mafia-que-genera-mas-que-el-narcotrafico-9565818.html",
  },
};

export const TRANSPORTE_NODES = [
  {
    id: "c-mecanismo-transporte",
    name: "Quién mueve la ciudad",
    kind: "estado",
    role: "Rutas · federaciones · Estado",
    summary:
      "El transporte urbano no es solo “buses”. Es un mercado de miles de millones donde federaciones (Fenatrano, Conatra, Mochotran) concentran unidades con licencia INTRANT, la OMSA opera con presupuesto público insuficiente, y Metro/Teleférico (OPRET) corren en paralelo. Quien controla la ruta controla el peaje diario del pueblo.",
    mechanism: "Sin permiso de ruta no hay negocio; quien reparte permisos reparte poder.",
    weight: 100,
    source: SRC.acento,
    themes: ["transporte"],
  },
  {
    id: "i-intrant",
    name: "INTRANT",
    kind: "estado",
    role: "Licencias y ordenamiento",
    summary:
      "Instituto Nacional de Tránsito y Transporte Terrestre (Ley 63-17). Autoriza operación. Sin licencia INTRANT, la federación no cobra en legalidad.",
    weight: 90,
    source: SRC.intrant,
    themes: ["transporte"],
  },
  {
    id: "e-omsa",
    name: "OMSA",
    kind: "estado",
    role: "Buses estatales · presupuesto público",
    aliases: ["omsa", "oficina metropolitana de servicios de autobuses"],
    summary:
      "Operadora estatal de buses. Diario Libre (2025): presupuesto ~RD$2,200 millones para >70,000 usuarios/día y miles de empleados; en 2026 reportan ~RD$3,000 MM. Convertida en empresa pública (decreto) para abrir capital privado. Compite —y cede terreno— frente a corredores de federaciones.",
    mechanism: "El Estado paga la flota; las federaciones cobran la calle.",
    weight: 92,
    source: SRC.diarioLibreOmsa,
    themes: ["transporte"],
  },
  {
    id: "i-opret",
    name: "OPRET",
    kind: "estado",
    role: "Metro y Teleférico SD",
    summary:
      "Oficina para el Reordenamiento del Transporte: Metro de Santo Domingo y Teleférico. Inversión masiva en rieles mientras el bus sigue repartido entre Estado y gremios. Santiago sigue sin metro: el mapa de hierro es capital-céntrico.",
    weight: 88,
    source: SRC.opret,
    themes: ["transporte"],
  },
  {
    id: "o-fenatrano",
    name: "Fenatrano",
    kind: "sindicato",
    role: "Federación · ~49% unidades licenciadas",
    aliases: ["fenatrano", "federación nacional de transporte"],
    summary:
      "Federación Nacional de Transporte Nueva Opción. Acento: ~49% de las unidades con licencia de operación en INTRANT — la mayor cobertura. Opera corredores (p. ej. Independencia, 68 buses) reportados por Diario Libre (2026).",
    mechanism: "Quien concentra unidades concentra la renta del pasaje.",
    weight: 94,
    source: SRC.acento,
    themes: ["transporte"],
  },
  {
    id: "o-conatra",
    name: "Conatra",
    kind: "sindicato",
    role: "Confederación · ~11% unidades",
    aliases: ["conatra", "conatra transporte"],
    summary:
      "Central Nacional de Organizaciones del Transporte. Acento: ~11% de unidades licenciadas; junto a Mochotran controló corredores (Charles de Gaulle, Churchill, Núñez de Cáceres).",
    weight: 84,
    source: SRC.acento,
    themes: ["transporte"],
  },
  {
    id: "o-mochotran",
    name: "Mochotran",
    kind: "sindicato",
    role: "Consorcio · ~20% unidades",
    aliases: ["mochotran"],
    summary:
      "Consorcio de Empresas del Transporte (Mochotran). Acento: ~20% de cobertura de unidades licenciadas; socio de corredores urbanos junto a Conatra.",
    weight: 80,
    source: SRC.acento,
    themes: ["transporte"],
  },
  {
    id: "c-corredores",
    name: "Corredores privados",
    kind: "empresa",
    role: "Rutas reformadas · renta del pasaje",
    summary:
      "Modelo de corredores donde federaciones operan buses de alta capacidad en avenidas clave. Diario Libre documenta Corredor Independencia (Fenatrano) y la pérdida de centralidad de la OMSA. El pasajero paga; el permiso vale oro.",
    weight: 78,
    source: SRC.diarioLibre2026,
    themes: ["transporte"],
  },
  {
    id: "c-pasajero",
    name: "El pasajero",
    kind: "trabajador",
    role: "Quien paga el sistema dos veces",
    summary:
      "Paga pasaje a federaciones y, vía presupuesto, sostiene OMSA/Metro. No elige el mapa de rutas: lo hereda. El teleférico y el metro existen en Santo Domingo; Santiago espera. La geografía del transporte es geografía de poder.",
    weight: 70,
    source: SRC.acento,
    themes: ["transporte"],
  },
  {
    id: "p-antonio-marte",
    name: "Antonio Marte",
    kind: "partido",
    role: "Presidente de Conatra · senador · dueño de autobuses",
    aliases: ["antonio marte", "casimiro antonio marte", "grupo sidra", "tarea bus", "aetra bus", "ppg"],
    summary:
      "Según la ficha oficial del Senado: presidente de Conatra, presidente de Grupo Sidra (Tarea Bus, Aetra Bus y otras), presidente del Partido Primero La Gente (PPG) y senador por Santiago Rodríguez en 2020-2024 y 2024-2028. En 2024 dijo en radio: “Si a mí me pusieran a elegir entre el Senado y los autobuses que tengo, yo elijo a los autobuses” (De Último Minuto). También dijo que Conatra fue “la primera empresa aliada al gobierno para los corredores” (Atento).",
    mechanism: "El gremio, la empresa, el partido y la curul en una sola persona.",
    weight: 96,
    source: SRC.senadoMarte,
    themes: ["transporte"],
  },
  {
    id: "p-juan-hubieres",
    name: "Juan Hubieres",
    kind: "partido",
    role: "Presidente de Fenatrano · exdiputado",
    aliases: ["juan hubieres", "hubieres"],
    summary:
      "Presidente de Fenatrano, la federación con más unidades licenciadas. En 2016 el periódico Hoy lo presentaba como diputado y presidente de Fenatrano a la vez. Hoy denuncia, sin que sea sentencia, que el subsidio al combustible favorece a grandes empresas y que parte se revende en el mercado negro.",
    mechanism: "Los dos gremios más grandes han tenido su silla en el Congreso.",
    weight: 90,
    source: SRC.hoyHubieres,
    themes: ["transporte"],
  },
  {
    id: "c-subsidio-combustible",
    name: "El subsidio que no ves",
    kind: "estado",
    role: "Combustible subsidiado · quién se lleva la parte grande",
    summary:
      "Según Juan Hubieres (Acento, 2025): el transporte de carga y pasajeros recibe unos RD$3 mil millones en subsidio de gasoil, mientras el gran sector empresarial recibe unos RD$30 mil millones, sin contar las generadoras eléctricas; menciona a Barrick Gold, zonas de turismo y zonas francas. Es una denuncia de parte interesada, pero coincide con el mapa de Centinela: el combustible y la electricidad son piezas del Núcleo.",
    mechanism: "A la guagua le dan la propina; la parte grande va a otra mesa.",
    weight: 88,
    source: SRC.acentoSubsidio,
    themes: ["transporte"],
  },
];

export const TRANSPORTE_EDGES = [
  { source: "c-mecanismo-transporte", target: "i-intrant", type: "regula_via", sourceRef: SRC.intrant },
  { source: "c-mecanismo-transporte", target: "e-omsa", type: "incluye", sourceRef: SRC.omsa },
  { source: "c-mecanismo-transporte", target: "i-opret", type: "incluye", sourceRef: SRC.opret },
  { source: "c-mecanismo-transporte", target: "o-fenatrano", type: "incluye", sourceRef: SRC.acento },
  { source: "i-intrant", target: "o-fenatrano", type: "licencia", note: "~49% unidades (Acento)", sourceRef: SRC.acento },
  { source: "i-intrant", target: "o-conatra", type: "licencia", note: "~11% unidades (Acento)", sourceRef: SRC.acento },
  { source: "i-intrant", target: "o-mochotran", type: "licencia", note: "~20% unidades (Acento)", sourceRef: SRC.acento },
  { source: "o-fenatrano", target: "c-corredores", type: "opera", note: "Corredor Independencia (prensa 2026)", sourceRef: SRC.diarioLibre2026 },
  { source: "o-conatra", target: "c-corredores", type: "opera", sourceRef: SRC.acento },
  { source: "o-mochotran", target: "c-corredores", type: "opera", sourceRef: SRC.acento },
  { source: "e-omsa", target: "c-pasajero", type: "transporta", sourceRef: SRC.diarioLibreOmsa },
  { source: "c-corredores", target: "c-pasajero", type: "cobra", sourceRef: SRC.diarioLibre2026 },
  { source: "i-opret", target: "c-pasajero", type: "transporta", note: "Metro / Teleférico SD", sourceRef: SRC.opret },
  { source: "p-antonio-marte", target: "o-conatra", type: "preside", sourceRef: SRC.senadoMarte },
  { source: "p-juan-hubieres", target: "o-fenatrano", type: "preside", sourceRef: SRC.hoyHubieres },
  { source: "o-conatra", target: "c-corredores", type: "aliado_del_gobierno", note: "“Primera empresa aliada para los corredores”", sourceRef: SRC.atentoConatra },
  { source: "c-subsidio-combustible", target: "o-fenatrano", type: "reparte", note: "~RD$3 mil MM al transporte (según Hubieres)", sourceRef: SRC.acentoSubsidio },
  { source: "c-subsidio-combustible", target: "c-pasajero", type: "lo_paga", sourceRef: SRC.acentoSubsidio },
  { source: "c-nucleo", target: "p-antonio-marte", type: "no_se_toca", note: "El dueño de autobuses vota en el Senado", sourceRef: SRC.senadoMarte },
  { source: "c-nucleo", target: "c-subsidio-combustible", type: "no_se_toca", note: "Combustible y generadoras: el perímetro", sourceRef: SRC.acentoSubsidio },
];
