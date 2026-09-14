/**
 * Modo curado — tema Todo.
 * Hub de entrada al mapa completo: una sola red, puertas (y las que vengan).
 */

export const TODO_NODES = [
  {
    id: "c-sistema",
    name: "El sistema",
    kind: "estado",
    role: "Una sola red",
    summary:
      "Centinela no es mapas sueltos. Es una red: tu sueldo, la deuda, los bancos, los partidos, la gasolina, la luz, la aduana, los medios, la construcción, la escuela pública (ADP), la salud (SeNaSa), la migración, la minería, la cooperación ONU/ONG y las casas que los cruzan. Cada tema es una puerta. El Todo es el plano.",
    mechanism:
      "Empiezas aquí para entender el mecanismo completo. Luego entras a cada tema para ver el detalle con fuentes.",
    weight: 100,
    themes: ["todo"],
  },
  {
    id: "c-ocho-puertas",
    name: "Las puertas",
    kind: "estado",
    role: "Roadmap del mapa",
    summary:
      "Pensiones · Partidos · Gasolina · Electricidad · Deuda · Familias · Medios · Banca · Aduana · Construcción · ADP · Salud · Migración · Minería · ONU/ONG. El navbar hace scroll; el Todo se queda como resumen.",
    mechanism: "Cada puerta cuenta un mecanismo. Juntas cuentan el país.",
    weight: 88,
    themes: ["todo"],
  },
  {
    id: "c-casas-puente",
    name: "Casas que cruzan",
    kind: "familia",
    role: "El patrón que se repite",
    summary:
      "La Cúpula: Vicini, Corripio, Rainieri, Fanjul, Rizek, González Cuadra, Brache, Estrella, Félix García, Popular, BHD, Banreservas, La Sirena, El Nacional. No es un tema: es el nodo que agrupa las casas que cruzan todos los sectores.",
    mechanism: "El mismo apellido en AFP, combustible, medios, turismo o cemento no es casualidad: es arquitectura.",
    weight: 92,
    themes: ["todo"],
  },
];

export const TODO_EDGES = [
  { source: "c-sistema", target: "c-ocho-puertas", type: "describe", note: "El plano y sus puertas" },
  { source: "c-sistema", target: "c-casas-puente", type: "atraviesa", note: "Las casas cruzan sectores" },
  { source: "c-sistema", target: "i-cnss", type: "abre", note: "Puerta · Pensiones" },
  { source: "c-sistema", target: "i-jce", type: "abre", note: "Puerta · Partidos" },
  { source: "c-sistema", target: "i-micm", type: "abre", note: "Puerta · Gasolina" },
  { source: "c-sistema", target: "i-sie", type: "abre", note: "Puerta · Electricidad" },
  { source: "c-sistema", target: "i-hacienda", type: "abre", note: "Puerta · Deuda" },
  { source: "c-sistema", target: "c-casas", type: "abre", note: "Puerta · Familias" },
  { source: "c-sistema", target: "c-filtros", type: "abre", note: "Puerta · Medios" },
  { source: "c-sistema", target: "i-junta-monetaria", type: "abre", note: "Puerta · Banca" },
  { source: "c-sistema", target: "i-dga", type: "abre", note: "Puerta · Aduana" },
  { source: "c-sistema", target: "c-cadena-construccion", type: "abre", note: "Puerta · Construcción" },
  { source: "c-sistema", target: "i-dgm", type: "abre", note: "Puerta · Migración" },
  { source: "c-sistema", target: "c-pueblo-viejo", type: "abre", note: "Puerta · Minería" },
  { source: "c-sistema", target: "c-mecanismo-ong", type: "abre", note: "Puerta · ONU/ONG" },
  { source: "c-sistema", target: "c-mecanismo-adp", type: "abre", note: "Puerta · ADP" },
  { source: "c-sistema", target: "c-mecanismo-salud", type: "abre", note: "Puerta · Salud" },
  { source: "c-casas-puente", target: "e-grupo-rizek", type: "ejemplo", note: "Puente multi-sector" },
  { source: "c-casas-puente", target: "e-grupo-vicini", type: "ejemplo", note: "Capital histórico" },
  { source: "c-casas-puente", target: "e-grupo-corripio", type: "ejemplo", note: "Medios" },
  { source: "c-casas-puente", target: "e-grupo-popular", type: "ejemplo", note: "Banca + AFP" },
  { source: "c-casas-puente", target: "e-grupo-marti", type: "ejemplo", note: "Combustible retail" },
  { source: "c-casas-puente", target: "e-grupo-bonetti", type: "ejemplo", note: "Alimentos / escala" },
  { source: "c-casas-puente", target: "e-grupo-rainieri", type: "ejemplo", note: "Turismo" },
  { source: "c-casas-puente", target: "e-grupo-estrella", type: "ejemplo", note: "Construcción / cemento" },
  { source: "c-casas-puente", target: "c-la-cupula", type: "nombra", note: "El agrupamiento transversal" },
  { source: "c-casas-puente", target: "e-grupo-fanjul", type: "ejemplo", note: "Azúcar / Este" },
  { source: "c-casas-puente", target: "e-grupo-ccn", type: "ejemplo", note: "Retail CCN" },
  { source: "c-casas-puente", target: "e-grupo-brache", type: "ejemplo", note: "Rica + consejo Popular" },
  { source: "c-casas-puente", target: "e-grupo-linda", type: "ejemplo", note: "Medios + AES" },
  { source: "c-casas-puente", target: "e-grupo-ramos", type: "ejemplo", note: "La Sirena" },
];
