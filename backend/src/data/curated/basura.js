/**
 * Tema curado — Basura.
 * Recolección, vertederos y contratos: quién cobra por lo que nadie quiere ver.
 * Solo hechos con fuente. Sin fuente = sin nodo.
 */

const SRC = {
  diarioLibreDuquesa: {
    label: "Diario Libre — Duquesa, un vertedero fuera de control",
    url: "https://www.diariolibre.com/actualidad/ciudad/duquesa-un-vertedero-fuera-de-control-HA7471823",
  },
  diarioLibreContratos: {
    label: "Diario Libre — Alcaldía DN y contratos de recogida (Decreto 213-25)",
    url: "https://www.diariolibre.com/actualidad/ciudad/2025/05/20/alcaldia-dn-evito-una-crisis-con-los-contratos-de-recogida-de-basura/3119045",
  },
  rdeDigital: {
    label: "RDE Digital — ADN contrato ~RD$2,653 MM a ADN Services y DSC",
    url: "https://rdedigital.com/adn-entrega-contrato-por-rd2-mil-mm-sin-licitacion/",
  },
  panorama: {
    label: "Panorama — contrato de excepción ADN Services + Disposición Sanitaria Capital",
    url: "https://panorama.com.do/ayuntamiento-del-dn-concedera-contrato-de-rd2-mil-millones-por-emergencia-sanitaria-a-empresas-adn-services-y-disposicion-sanitaria-capital/",
  },
  adn: {
    label: "Ayuntamiento del Distrito Nacional",
    url: "https://adn.gob.do/",
  },
  medioAmbiente: {
    label: "Ministerio de Medio Ambiente y Recursos Naturales",
    url: "https://ambiente.gob.do/",
  },
  cea: {
    label: "Consejo Estatal del Azúcar (CEA) — origen documental de Duquesa",
    url: "https://cea.gob.do/",
  },
  diarioLibreLaudo: {
    label: "Diario Libre — Estado deberá pagar más de US$43 millones a Lajun (oct 2023)",
    url: "https://www.diariolibre.com/actualidad/nacional/2023/10/07/estado-dominicano-debera-pagar-mas-de-43-millones-a-lajun/2484487",
  },
  diarioLibreTitulos: {
    label: "Diario Libre — Lajun gana arbitraje con títulos de origen fraudulento (oct 2023)",
    url: "https://www.diariolibre.com/actualidad/justicia/2023/10/11/lajun-gana-arbitraje-con-titulos-de-origen-fraudulento/2488531",
  },
  elCaribeLajun: {
    label: "El Caribe — Revenden Duquesa: dueños de Lajun",
    url: "https://www.elcaribe.com.do/panorama/pais/revenden-duquesa-por-135-millones-dolares-empresas/",
  },
  elCaribeAdnServices: {
    label: "El Caribe — La basura se acumula en el GSD (propietario de ADN Services)",
    url: "https://www.elcaribe.com.do/panorama/pais/la-basura-se-acumula-montones-gsd/",
  },
};

export const BASURA_NODES = [
  {
    id: "c-mecanismo-basura",
    name: "Quién cobra la basura",
    kind: "estado",
    role: "Recolección · vertedero · contrato",
    summary:
      "La basura no es un servicio neutro. Es un mercado de contratos municipales, un vertedero que concentra el Gran Santo Domingo, y empresas que se renuevan —a veces por excepción— cuando vence el ciclo. Quien opera la ruta y quien controla el vertedero cobra dos veces: en la calle y en la puerta del basurero.",
    mechanism: "Sin contrato no hay camión; sin vertedero no hay contrato que valga.",
    weight: 100,
    source: SRC.diarioLibreDuquesa,
    themes: ["basura"],
  },
  {
    id: "i-adn",
    name: "Ayuntamiento DN (ADN)",
    kind: "estado",
    role: "Contrata recolección en la capital",
    aliases: ["adn", "ayuntamiento distrito nacional", "alcaldía dn"],
    summary:
      "Contrata la recolección de residuos del Distrito Nacional. En 2025, tras el Decreto 213-25 de emergencia, procedió a contrataciones por excepción para continuidad del servicio ante el vencimiento de contratos y la crisis de accesos a Duquesa.",
    weight: 92,
    source: SRC.diarioLibreContratos,
    themes: ["basura"],
  },
  {
    id: "c-decreto-213-25",
    name: "Decreto 213-25",
    kind: "estado",
    role: "Emergencia · compras por excepción",
    summary:
      "Decreto presidencial (abril 2025) que declara emergencia nacional en la gestión de residuos sólidos del Distrito Nacional y habilita contrataciones de excepción (Ley 340-06 / Reglamento 416-23). Panorama: la emergencia se declaró por 60 días, pero el contrato a las mismas dos empresas es por 36 meses y sin concurso.",
    mechanism: "La emergencia acorta el concurso; el contrato define quién cobra años.",
    weight: 88,
    source: SRC.diarioLibreContratos,
    themes: ["basura"],
  },
  {
    id: "e-adn-services",
    name: "ADN Services",
    kind: "empresa",
    role: "Recolectora · circunscripciones 1 y 3",
    aliases: ["adn services"],
    summary:
      "Empresa que ha operado recolección en el DN por años. El Caribe identifica como su propietario a Andrés Ayala. Reportes (RDE Digital / Panorama) atribuyen en el proceso de excepción ~RD$1,680 MM para circunscripciones 1 y 3, dentro de un paquete total ~RD$2,653 MM a 36 meses junto a DSC.",
    weight: 86,
    source: SRC.rdeDigital,
    themes: ["basura"],
  },
  {
    id: "e-dsc",
    name: "Disposición Sanitaria Capital (DSC)",
    kind: "empresa",
    role: "Recolectora · circunscripción 2",
    aliases: ["dsc", "disposicion sanitaria capital"],
    summary:
      "Operadora histórica de recolección en la capital. En el mismo proceso de excepción, prensa reporta ~RD$973 MM para la circunscripción 2. Continuidad de proveedor bajo figura de emergencia.",
    weight: 84,
    source: SRC.panorama,
    themes: ["basura"],
  },
  {
    id: "c-duquesa",
    name: "Vertedero de Duquesa",
    kind: "empresa",
    role: "Disposición final · Gran Santo Domingo",
    aliases: ["duquesa", "vertedero duquesa"],
    summary:
      "Principal vertedero del Gran Santo Domingo. Diario Libre: concentra ~79% de los desechos de la zona (DN, SDE, SDO, SDN y municipios aledaños). Accesos deteriorados y cierre técnico proyectado a años: cuello de botella que condiciona toda la recolección.",
    mechanism: "Quien controla la puerta del vertedero condiciona el negocio del camión.",
    weight: 96,
    source: SRC.diarioLibreDuquesa,
    themes: ["basura"],
  },
  {
    id: "e-lajun",
    name: "Lajun Corporation",
    kind: "empresa",
    role: "Opera / reclama Duquesa",
    aliases: ["lajun", "lajún", "lajun corporation"],
    summary:
      "Administró Duquesa de 2007 a 2017 por contrato con el Ayuntamiento de Santo Domingo Norte. Desde 2013 su accionista mayoritario (90%) es el jamaiquino Michael Lee-Chin (Portland Holdings), con Luis José Asilis (Grupo Metro), que compraron también el terreno (Diario Libre; El Caribe). El CEA dijo en 2017 que esa tierra era del Estado, y las cámaras del Congreso certificaron que la aprobación de la venta no reposa en sus archivos (Diario Libre).",
    weight: 90,
    source: SRC.diarioLibreDuquesa,
    themes: ["basura"],
  },
  {
    id: "i-cea-basura",
    name: "CEA (origen Duquesa)",
    kind: "estado",
    role: "Tierra estatal · contrato histórico",
    summary:
      "Diario Libre: hacia 1995, por decreto, el CEA suscribió con el Ayuntamiento DN un contrato de uso (~20 años, ~36.7 ha) del área que sería Duquesa. El Estado puso la tierra; el negocio del vertedero se privatizó en la práctica.",
    weight: 78,
    source: SRC.diarioLibreDuquesa,
    themes: ["basura", "azucar"],
  },
  {
    id: "i-medio-ambiente",
    name: "Medio Ambiente",
    kind: "estado",
    role: "Supervisión · cierre técnico",
    summary:
      "Ministerio que opina sobre el vertedero. Prensa: proyectó que el cierre técnico de Duquesa podría tomar 5–6 años — argumento usado en la cadena de justificación de la emergencia y la continuidad operativa.",
    weight: 72,
    source: SRC.diarioLibreContratos,
    themes: ["basura"],
  },
  {
    id: "c-laudo-duquesa",
    name: "El laudo de Duquesa",
    kind: "estado",
    role: "US$43.6 MM que paga el Estado",
    aliases: ["laudo lajun", "arbitraje duquesa", "lee-chin"],
    summary:
      "En octubre de 2023 un tribunal arbitral (CNUDMI/UNCITRAL) condenó al Estado dominicano a pagar US$43,590,090 a Michael Lee-Chin por el caso Duquesa (Diario Libre). Diario Libre recuerda que desde 2018 se advirtió del fraude en los títulos y que ni el CEA, ni la Procuraduría, ni el Congreso llevaron el caso a la justicia local. Acción Verde calcula que el pueblo pagará más de RD$2,500 millones.",
    mechanism: "La tierra era del Estado; la factura también.",
    weight: 94,
    source: SRC.diarioLibreLaudo,
    themes: ["basura"],
  },
  {
    id: "c-vecino",
    name: "El vecino",
    kind: "trabajador",
    role: "Paga impuestos · convive con el hedor",
    summary:
      "Financia el contrato con impuestos municipales y convive con retrasos, moscas y humo. No adjudica el contrato ni opera el vertedero. Hereda el resultado del reparto.",
    weight: 70,
    source: SRC.diarioLibreDuquesa,
    themes: ["basura"],
  },
];

export const BASURA_EDGES = [
  { source: "c-mecanismo-basura", target: "i-adn", type: "incluye", sourceRef: SRC.adn },
  { source: "c-mecanismo-basura", target: "c-duquesa", type: "revela", note: "Sin vertedero no hay sistema", sourceRef: SRC.diarioLibreDuquesa },
  { source: "c-decreto-213-25", target: "i-adn", type: "habilita", note: "Emergencia → contratación por excepción", sourceRef: SRC.diarioLibreContratos },
  { source: "i-adn", target: "e-adn-services", type: "contrata", note: "~RD$1,680 MM · circ. 1 y 3 (prensa)", sourceRef: SRC.rdeDigital },
  { source: "i-adn", target: "e-dsc", type: "contrata", note: "~RD$973 MM · circ. 2 (prensa)", sourceRef: SRC.panorama },
  { source: "e-adn-services", target: "c-duquesa", type: "vierte_en", sourceRef: SRC.diarioLibreDuquesa },
  { source: "e-dsc", target: "c-duquesa", type: "vierte_en", sourceRef: SRC.diarioLibreDuquesa },
  { source: "e-lajun", target: "c-duquesa", type: "opera", note: "Reclamo de propiedad/operación documentado", sourceRef: SRC.diarioLibreDuquesa },
  { source: "i-cea-basura", target: "c-duquesa", type: "cedio_tierra", note: "Contrato CEA–ADN años 90 (prensa)", sourceRef: SRC.diarioLibreDuquesa },
  { source: "i-medio-ambiente", target: "c-duquesa", type: "supervisa", note: "Cierre técnico multi-año", sourceRef: SRC.diarioLibreContratos },
  { source: "i-adn", target: "c-vecino", type: "sirve", sourceRef: SRC.adn },
  { source: "c-duquesa", target: "c-vecino", type: "afecta", sourceRef: SRC.diarioLibreDuquesa },
  { source: "e-lajun", target: "c-laudo-duquesa", type: "gana", note: "US$43.6 MM (2023)", sourceRef: SRC.diarioLibreLaudo },
  { source: "c-laudo-duquesa", target: "c-vecino", type: "cobra_a", note: "Lo paga el presupuesto", sourceRef: SRC.diarioLibreTitulos },
  { source: "i-cea-basura", target: "c-laudo-duquesa", type: "no_actuo", note: "Títulos cuestionados sin acción judicial (prensa)", sourceRef: SRC.diarioLibreTitulos },
  { source: "c-decreto-213-25", target: "e-adn-services", type: "renueva", note: "Emergencia de 60 días, contrato de 36 meses", sourceRef: SRC.panorama },
  { source: "c-nucleo", target: "c-laudo-duquesa", type: "no_se_toca", note: "Nadie fue a la justicia; paga el pueblo", sourceRef: SRC.diarioLibreTitulos },
];
