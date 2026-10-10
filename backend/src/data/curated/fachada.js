/**
 * Modo curado — tema Fachada democrática.
 * Lo que miden los rankings (la cáscara) vs lo que dicen la ley, los tribunales y la gente (la fruta).
 * Reutiliza l-74-25, c-art-384 y c-art-313 del tema Protesta.
 */

const SRC = {
  vdem2026: {
    label: "V-Dem — Democracy Report 2026 (RD: democracia electoral en profundización)",
    url: "https://www.v-dem.net/documents/76/V-Dem_Institute_Democracy_Report_2026_Spanish_lowres.pdf",
  },
  presidenciaVdem: {
    label: "Presidencia — “ejemplo democrático global” según V-Dem 2026",
    url: "https://www.presidencia.gob.do/noticias/presidente-abinader-posiciona-republica-dominicana-como-ejemplo-democratico-global-revela",
  },
  eiu2024: {
    label: "The Economist Intelligence Unit — Democracy Index 2024 (RD 6.62, puesto 52)",
    url: "https://cnc.gob.do/wp-content/uploads/2025/05/Indice-de-Democracia-2024.pdf",
  },
  eiuDiarioLibre: {
    label: "Diario Libre — RD sube nueve posiciones, puesto 52 de 167",
    url: "https://www.diariolibre.com/usa/actualidad/2025/03/11/republica-dominicana-ocupa-puesto-52-en-el-indice-de-democracia/3029767",
  },
  freedomHouse2026: {
    label: "Freedom House — Freedom in the World 2026: Dominican Republic (67/100)",
    url: "https://freedomhouse.org/country/dominican-republic/freedom-world/2026",
  },
  ley7425: {
    label: "Ley 74-25 — Código Penal (texto oficial, Presidencia)",
    url: "https://presidencia.gob.do/sites/default/files/laws/2025-08/Ley%20Nu%CC%81m.%2074-25%20%28Co%CC%81digo%20Penal%20RD%29.pdf",
  },
  frenteCivico: {
    label: "La República Online — Frente Cívico y Social: “La ley debe proteger al pueblo, no oprimirlo”",
    url: "https://larepublicaonline.com/la-ley-debe-proteger-al-pueblo-no-oprimirlo/",
  },
  adp2024: {
    label: "El Nuevo Diario — presidente de la ADP: arts. 332 y 333 del proyecto amenazan la protesta (jul 2024)",
    url: "https://elnuevodiario.com.do/presidente-adp-alerta-nuevo-codigo-penal-amenaza-contra-el-derecho-a-las-protestas/",
  },
  onuMuniciones: {
    label: "Noticia.do — informe final ONU S/2026/714: 908,001 artículos desviados de la Policía",
    url: "https://noticia.do/municiones-rd-haiti-defensa-onu/",
  },
  onuErd: {
    label: "RDE Digital — ONU S/2026/241: 25 de 89 cartuchos de 400 Mawozo con marca ERD",
    url: "https://rdedigital.com/onu-vincula-municiones-dominicanas-con-banda-400-mawozo/",
  },
  hoyMuniciones: {
    label: "Hoy — ONU atribuye el desvío a presunta corrupción de policías y militares",
    url: "https://hoy.com.do/el-mundo/el-caribe/informe-sobre-haiti-banda-400-mawozo-utilizo-900-mil-municiones-policia-ejercito-rd_1104974.html",
  },
  mideRespuesta: {
    label: "EFE / Swissinfo — Defensa: calibre .50 de “antigua fabricación”, no ha podido determinar cómo llegó a Haití (8 oct 2026)",
    url: "https://www.swissinfo.ch/spa/defensa-da-explicaciones-sobre-municiones-dominicanas-%22encontradas-en-hait%C3%AD%22,-seg%C3%BAn-medios/92189691",
  },
  tenienteSanJuan: {
    label: "Listín Diario — segundo teniente detenido con 1,516 cartuchos en San Juan (dic 2025)",
    url: "https://listindiario.com/la-republica/20261008/ministerio-defensa-investiga-municios-bandas-haitianas_925416.html",
  },
  pandoraJuicio: {
    label: "El País Dominicano — Operación Pandora: coronel a juicio; condena de 5 años domiciliaria (sep 2026)",
    url: "https://elpaisdominicano.do/2026/09/14/envian-a-juicio-a-coronel-y-otros-implicados-en-robo-de-municiones-de-la-policia-nacional/",
  },
  pandoraPgr: {
    label: "Procuraduría — Operación Pandora: desfalco de RD$92,191,732.92 en municiones",
    url: "https://pgr.gob.do/ministerio-publico-solicita-enviar-a-juicio-a-todos-los-acusados-por-robo-de-miles-de-proyectiles-de-la-policia/",
  },
  pandoraOct: {
    label: "El Seis — Caso Pandora: archivan cargos a un imputado; expediente habla de ventas a bandas en Haití (oct 2026)",
    url: "https://elseis.do/noticias/caso-pandora-jueza-archiva-cargos-a-imputado-y-envia-a-juicio-a-policias",
  },
  latino2026: {
    label: "Diario Libre — Latinobarómetro 2026: apoyo a la democracia 47%; 68% no se siente representado por el Congreso",
    url: "https://www.diariolibre.com/politica/general/2026/10/03/como-esta-el-apoyo-a-la-democracia-en-rd-segun-latinobarometro-2026/3677294",
  },
  latinoInforme: {
    label: "Corporación Latinobarómetro — Informe 2026 (1,000 entrevistas en RD, may–jun 2026)",
    url: "http://www.latinobarometro.org/documents/informe-latinobarometro-2026.pdf",
  },
  latinoDetalle: {
    label: "Frecuencia Nacional — Latinobarómetro 2026: 18% apoya régimen autoritario; 36% cree que la democracia funciona sin Congreso",
    url: "https://frecuencianacionalrd.com/informe-democratica-2026-rd/",
  },
};

export const FACHADA_NODES = [
  {
    id: "c-fachada-democratica",
    name: "La fachada democrática",
    kind: "estado",
    role: "La cáscara vs la fruta",
    aliases: ["fachada", "democracia", "democracia formal", "democracia real", "simulación"],
    summary:
      "Si le preguntas a una inteligencia artificial si República Dominicana es una democracia, te dirá que sí, porque lee los libros de texto y los informes internacionales: hay elecciones cada cuatro años, hay oposición y hay una Constitución con derechos. Esa es la democracia formal, la cáscara. La democracia real, la fruta, es otra cosa: que la gente tenga poder, que las instituciones funcionen, que la justicia sea pareja y que protestar no te cueste 40 años.",
    mechanism: "Los rankings miden la cáscara; la ley y los tribunales muestran la fruta.",
    weight: 100,
    source: SRC.eiu2024,
    themes: ["fachada"],
  },
  {
    id: "c-democracia-formal",
    name: "Democracia formal",
    kind: "estado",
    role: "Elecciones ✓ · oposición ✓ · Constitución ✓",
    summary:
      "En lo que se ve desde afuera, el país aprueba con nota alta. The Economist le da 9.17 de 10 en proceso electoral y pluralismo, su mejor categoría. Pero en funcionamiento del gobierno saca 5.00 y en cultura política 4.38. Votar bien no es lo mismo que gobernar bien.",
    mechanism: "9.17 en la urna, 5.00 en el gobierno.",
    weight: 90,
    source: SRC.eiu2024,
    themes: ["fachada"],
  },
  {
    id: "r-vdem-2026",
    name: "V-Dem 2026",
    kind: "medio",
    role: "“Profundizando su democracia” · celebrado por Presidencia",
    aliases: ["v-dem", "democracy report"],
    summary:
      "El Democracy Report 2026 del Instituto V-Dem (Universidad de Gotemburgo) pone a República Dominicana entre los tres únicos países del mundo que están “profundizando” su democracia, junto a Sri Lanka y las Islas Salomón. La Presidencia lo celebró y dijo que el país es “un referente regional y global en materia de gobernanza democrática”. Pero el mismo informe clasifica al país como “democracia electoral”, no como “democracia liberal”, que es la categoría donde funcionan los contrapesos, la justicia y la igualdad ante la ley.",
    mechanism: "Mejorar no es llegar: el propio V-Dem no nos pone en la categoría alta.",
    weight: 88,
    source: SRC.vdem2026,
    themes: ["fachada"],
  },
  {
    id: "r-eiu-2024",
    name: "Índice de Democracia 2024 (The Economist)",
    kind: "medio",
    role: "6.62 · puesto 52 · “democracia defectuosa”",
    aliases: ["the economist", "eiu", "índice de democracia"],
    summary:
      "The Economist Intelligence Unit clasifica al país como “democracia defectuosa” con 6.62 sobre 10, en el puesto 52 de 167, nueve posiciones más arriba que en 2023. Los mejores puntajes: proceso electoral (9.17), libertades civiles (7.35) y participación (7.22). Los peores: funcionamiento del gobierno (5.00) y cultura política (4.38).",
    weight: 86,
    source: SRC.eiuDiarioLibre,
    themes: ["fachada"],
  },
  {
    id: "r-freedom-house-2026",
    name: "Freedom House 2026",
    kind: "medio",
    role: "67/100 · “Parcialmente Libre”",
    aliases: ["freedom house", "parcialmente libre"],
    summary:
      "Freedom in the World 2026 le da al país 67 sobre 100 y lo clasifica como “Parcialmente Libre” (un punto menos que en 2025). Dice que las elecciones son “generalmente libres y competitivas”. Pero al rascar, las notas bajan: protección contra la corrupción 2 de 4, debido proceso 2 de 4, protección contra el uso ilegítimo de la fuerza 2 de 4 e igualdad ante la ley 1 de 4. El mismo informe dice que la corrupción generalizada debilita las instituciones y que el uso excesivo de la fuerza policial sigue siendo un problema.",
    mechanism: "Urna aprobada, justicia y corrupción en 2 de 4.",
    weight: 86,
    source: SRC.freedomHouse2026,
    themes: ["fachada"],
  },
  {
    id: "o-frente-civico",
    name: "Frente Cívico y Social",
    kind: "trabajador",
    role: "Advierte contra el art. 384",
    summary:
      "Desde agosto de 2025, el Frente Cívico y Social advierte que la Ley 74-25 puede usarse para criminalizar la protesta pacífica, intimidar la denuncia ciudadana y blindar al poder frente a la fiscalización. Señala el artículo 384 y el riesgo de perseguir a ciudadanos, activistas y periodistas con figuras penales ambiguas: “Protestar no es insurrección.”",
    weight: 78,
    source: SRC.frenteCivico,
    themes: ["fachada"],
  },
  {
    id: "c-art-333-proyecto",
    name: "Arts. 332 y 333 del proyecto (2024)",
    kind: "estado",
    role: "Denunciados por la ADP · no quedaron así en la ley",
    summary:
      "En julio de 2024, cuando el Código Penal todavía era un proyecto, el presidente de la ADP denunció que los artículos 332 y 333 criminalizaban la protesta y la huelga, y que el 333 daba de 4 a 10 años a quien organizara o participara en reuniones o manifestaciones contra las autoridades. En la Ley 74-25 aprobada, el 332 es soborno a funcionarios judiciales y el 333 es ocultamiento de pruebas: ese delito de protesta no quedó con esa forma. Lo que sí quedó es el art. 313: de 5 a 10 años si alguien resiste con violencia a un funcionario durante una manifestación.",
    mechanism: "La presión cambió el texto; el miedo quedó en otros artículos.",
    weight: 80,
    source: SRC.adp2024,
    themes: ["fachada"],
  },
  {
    id: "c-municiones-onu",
    name: "Municiones dominicanas en Haití (ONU)",
    kind: "estado",
    role: "908,001 artículos desviados de la Policía",
    aliases: ["municiones", "400 mawozo", "panel de expertos", "erd"],
    summary:
      "El Panel de Expertos de la ONU sobre Haití (informe final S/2026/714, septiembre de 2026) recoge que un inventario de la Policía Nacional encontró 908,001 artículos desviados de sus depósitos, principalmente municiones: más de 489,000 cartuchos de 9 mm, 230,000 de 5.56 × 45 mm, 26,000 de 7.62 × 39 mm y 93,000 de escopeta. En una muestra de 89 cartuchos incautados a la banda 400 Mawozo, 25 tenían la marca “ERD” del Ejército. La ONU atribuye el desvío a presuntos actos de corrupción de policías y militares, pero aclara que no puede determinar cuánto de ese material llegó a Haití.",
    mechanism: "Las balas salieron de los depósitos del Estado; la cadena de mando no aparece.",
    weight: 92,
    source: SRC.onuMuniciones,
    themes: ["fachada"],
  },
  {
    id: "e-400-mawozo",
    name: "400 Mawozo",
    kind: "concepto",
    role: "Banda armada haitiana",
    summary:
      "Banda haitiana que, según el Panel de Expertos de la ONU, está entre las mejor armadas del país y entre los principales importadores ilegales de armas y municiones, por redes desde Estados Unidos, a través de República Dominicana y del mercado ilícito dominicano.",
    weight: 74,
    source: SRC.onuErd,
    themes: ["fachada"],
  },
  {
    id: "c-respuesta-defensa",
    name: "“No ha sido posible determinar”",
    kind: "estado",
    role: "Respuesta del Ministerio de Defensa (8 oct 2026)",
    summary:
      "Sobre las municiones calibre .50, el Ministerio de Defensa dijo que son de “antigua fabricación” y que, por el tiempo transcurrido, “no ha sido posible determinar hasta el momento” cómo llegaron a Haití, aunque sigue investigando. Como ejemplo de acción citó un caso de diciembre de 2025: un segundo teniente del Ejército y un ciudadano haitiano detenidos en La Tinaja, San Juan, con 1,516 cartuchos en una motocicleta. El oficial está en prisión preventiva y el caso sigue abierto.",
    weight: 84,
    source: SRC.mideRespuesta,
    themes: ["fachada"],
  },
  {
    id: "c-operacion-pandora",
    name: "Operación Pandora",
    kind: "estado",
    role: "Robo de municiones de la Policía · 2 años después",
    aliases: ["pandora", "caso pandora", "robo de municiones"],
    summary:
      "En noviembre de 2024 se desmanteló una red dentro de la Intendencia de Armas de la Policía que robaba y vendía municiones. El Ministerio Público calcula el desfalco en RD$92,191,732.92 y, según el expediente, parte iba a bandas en Haití. Dos años después solo hay dos condenas, por acuerdo: un segundo teniente con 5 años de arresto domiciliario y otra imputada con 3 años (la mitad en su casa y la mitad suspendidos). El coronel que custodiaba las armas apenas fue enviado a juicio en septiembre de 2026, y a otro imputado le archivaron los cargos en octubre.",
    mechanism: "Robar balas del Estado: 5 años en la casa, y el juicio grande todavía por empezar.",
    weight: 92,
    source: SRC.pandoraJuicio,
    themes: ["fachada"],
  },
  {
    id: "c-dos-varas",
    name: "Dos varas de medir",
    kind: "estado",
    role: "40 años escritos vs 5 años en la casa",
    summary:
      "Por la ley, la “insurrección” (cualquier violencia colectiva que ponga en peligro el gobierno) da de 30 a 40 años de prisión mayor, igual que un asesinato. Por los tribunales, el primer condenado de la red que robó municiones de la Policía cumple 5 años en su casa. La pena dura está escrita para la calle; la blanda está aplicada para el uniforme.",
    mechanism: "La ley mira hacia abajo con lupa y hacia arriba con neblina.",
    weight: 94,
    source: SRC.pandoraJuicio,
    themes: ["fachada"],
  },
  {
    id: "r-latinobarometro-2026",
    name: "Latinobarómetro 2026",
    kind: "trabajador",
    role: "Lo que dice el propio pueblo",
    aliases: ["latinobarómetro", "apoyo a la democracia"],
    summary:
      "Encuesta cara a cara a 1,000 dominicanos (mayo–junio de 2026). Solo el 47% apoya la democracia, por debajo del 52% de América Latina. El 68% no se siente representado por el Congreso Nacional y solo el 31% sí. El 18% apoya abiertamente un régimen autoritario y el 36% cree que la democracia puede funcionar sin Congreso. Siete de cada diez dicen que sin elecciones no hay democracia: la gente quiere votar, pero no siente que ese voto la represente.",
    mechanism: "Defienden la urna, pero no confían en los que salen de ella.",
    weight: 90,
    source: SRC.latino2026,
    themes: ["fachada"],
  },
];

export const FACHADA_EDGES = [
  {
    source: "c-fachada-democratica",
    target: "c-democracia-formal",
    type: "muestra",
    note: "La cáscara",
    sourceRef: SRC.eiu2024,
  },
  {
    source: "r-vdem-2026",
    target: "c-democracia-formal",
    type: "mide",
    note: "“Democracia electoral”, no liberal",
    sourceRef: SRC.vdem2026,
  },
  {
    source: "r-eiu-2024",
    target: "c-democracia-formal",
    type: "mide",
    note: "Proceso electoral 9.17",
    sourceRef: SRC.eiu2024,
  },
  {
    source: "r-freedom-house-2026",
    target: "c-democracia-formal",
    type: "mide",
    note: "Elecciones “generalmente libres y competitivas”",
    sourceRef: SRC.freedomHouse2026,
  },
  {
    source: "r-vdem-2026",
    target: "c-fachada-democratica",
    type: "alimenta",
    note: "Presidencia: “referente regional y global”",
    sourceRef: SRC.presidenciaVdem,
  },
  {
    source: "r-eiu-2024",
    target: "c-fachada-democratica",
    type: "matiza",
    note: "Gobierno 5.00 · cultura política 4.38",
    sourceRef: SRC.eiu2024,
  },
  {
    source: "r-freedom-house-2026",
    target: "c-fachada-democratica",
    type: "matiza",
    note: "Corrupción 2/4 · debido proceso 2/4 · fuerza 2/4",
    sourceRef: SRC.freedomHouse2026,
  },
  {
    source: "c-fachada-democratica",
    target: "l-74-25",
    type: "choca_con",
    note: "La ley que se aplica al que protesta",
    sourceRef: SRC.ley7425,
  },
  {
    source: "o-frente-civico",
    target: "c-art-384",
    type: "advierte",
    note: "“Protestar no es insurrección”",
    sourceRef: SRC.frenteCivico,
  },
  {
    source: "o-adp",
    target: "c-art-333-proyecto",
    type: "denuncia",
    note: "Julio de 2024, durante el debate del proyecto",
    sourceRef: SRC.adp2024,
  },
  {
    source: "c-art-333-proyecto",
    target: "l-74-25",
    type: "no_quedo_en",
    note: "En la ley final, 332 = soborno y 333 = ocultamiento de pruebas",
    sourceRef: SRC.ley7425,
  },
  {
    source: "c-art-333-proyecto",
    target: "c-art-313",
    type: "sobrevive_como",
    note: "5–10 años por violencia en una manifestación",
    sourceRef: SRC.ley7425,
  },
  {
    source: "c-municiones-onu",
    target: "e-400-mawozo",
    type: "llegan_a",
    note: "25 de 89 cartuchos con marca ERD",
    sourceRef: SRC.onuErd,
  },
  {
    source: "c-operacion-pandora",
    target: "c-municiones-onu",
    type: "explica_parte",
    note: "Red dentro de la Intendencia de Armas",
    sourceRef: SRC.onuMuniciones,
  },
  {
    source: "c-municiones-onu",
    target: "c-respuesta-defensa",
    type: "responde",
    note: "Calibre .50 de “antigua fabricación”",
    sourceRef: SRC.mideRespuesta,
  },
  {
    source: "c-respuesta-defensa",
    target: "e-400-mawozo",
    type: "no_explica",
    note: "Teniente con 1,516 cartuchos, en prisión preventiva",
    sourceRef: SRC.tenienteSanJuan,
  },
  {
    source: "c-operacion-pandora",
    target: "c-dos-varas",
    type: "demuestra",
    note: "5 años de arresto domiciliario",
    sourceRef: SRC.pandoraJuicio,
  },
  {
    source: "c-art-384",
    target: "c-dos-varas",
    type: "demuestra",
    note: "30–40 años escritos",
    sourceRef: SRC.ley7425,
  },
  {
    source: "c-operacion-pandora",
    target: "e-400-mawozo",
    type: "abastece",
    note: "Según el expediente, ventas a bandas en Haití",
    sourceRef: SRC.pandoraOct,
  },
  {
    source: "c-operacion-pandora",
    target: "c-fachada-democratica",
    type: "rasca",
    note: "Desfalco de RD$92 MM",
    sourceRef: SRC.pandoraPgr,
  },
  {
    source: "r-latinobarometro-2026",
    target: "i-senado",
    type: "no_se_siente_representado",
    note: "68% no; 31% sí",
    sourceRef: SRC.latino2026,
  },
  {
    source: "r-latinobarometro-2026",
    target: "c-fachada-democratica",
    type: "contradice",
    note: "Apoyo a la democracia 47% vs 52% regional",
    sourceRef: SRC.latinoInforme,
  },
  {
    source: "r-latinobarometro-2026",
    target: "c-voto-no-basta",
    type: "confirma",
    note: "Quieren votar, pero no confían en el voto",
    sourceRef: SRC.latinoDetalle,
  },
  {
    source: "c-dos-varas",
    target: "c-pueblo",
    type: "castiga",
    note: "La vara dura es para abajo",
    sourceRef: SRC.pandoraJuicio,
  },
  {
    source: "c-fachada-democratica",
    target: "c-nucleo",
    type: "protege",
    note: "La fachada tapa el centro",
    sourceRef: SRC.freedomHouse2026,
  },
];
