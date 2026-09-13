/**
 * Modo curado — tema Todo.
 * Hub de entrada al mapa completo: una sola red, diez puertas (y las que vengan).
 */

export const TODO_NODES = [
  {
    id: "c-sistema",
    name: "El sistema",
    kind: "estado",
    role: "Una sola red",
    summary:
      "Centinela no es mapas sueltos. Es una red: tu sueldo, la deuda, los bancos, los partidos, la gasolina, la luz, la aduana, los medios, la construcción y las casas que los cruzan. Cada tema es una puerta. El Todo es el plano.",
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
      "Pensiones · Partidos · Gasolina · Electricidad · Deuda · Familias · Medios · Banca · Aduana · Construcción. Más adelante: inmigración y otros. El navbar hace scroll; el Todo se queda como resumen.",
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
      "Rizek no es el único puente. Vicini, Corripio, Popular, BHD, Martí, Bonetti, Rainieri, Estrella — y otras — tocan varios sectores a la vez. Cuando abrimos un tema nuevo, muchas de estas casas vuelven a aparecer.",
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
  { source: "c-casas-puente", target: "e-grupo-rizek", type: "ejemplo", note: "Puente multi-sector" },
  { source: "c-casas-puente", target: "e-grupo-vicini", type: "ejemplo", note: "Capital histórico" },
  { source: "c-casas-puente", target: "e-grupo-corripio", type: "ejemplo", note: "Medios" },
  { source: "c-casas-puente", target: "e-grupo-popular", type: "ejemplo", note: "Banca + AFP" },
  { source: "c-casas-puente", target: "e-grupo-marti", type: "ejemplo", note: "Combustible retail" },
  { source: "c-casas-puente", target: "e-grupo-bonetti", type: "ejemplo", note: "Alimentos / escala" },
  { source: "c-casas-puente", target: "e-grupo-rainieri", type: "ejemplo", note: "Turismo" },
  { source: "c-casas-puente", target: "e-grupo-estrella", type: "ejemplo", note: "Construcción / cemento" },
];
