/**
 * Temas curados de Centinela.
 * Cada tema tiene pills propios; "todos" (ruta /todos) es el modo masivo archivado.
 */
export const THEMES = [
  {
    id: "pensiones",
    label: "Pensiones",
    ready: true,
    pills: [
      { id: "all", label: "Todos" },
      { id: "estado", label: "Estado" },
      { id: "afp", label: "AFP" },
      { id: "banco", label: "Bancos" },
      { id: "familia", label: "Familias" },
      { id: "empresa", label: "Empleadores" },
      { id: "persona", label: "Trabajadores" },
      { id: "fondo", label: "Fondos" },
    ],
  },
  {
    id: "partidos",
    label: "Partidos",
    ready: true,
    pills: [
      { id: "all", label: "Todos" },
      { id: "partido", label: "Partidos" },
      { id: "financiador", label: "Financiadores" },
      { id: "estado", label: "JCE" },
      { id: "persona", label: "Personas" },
      { id: "medio", label: "Medios" },
    ],
  },
  {
    id: "gasolina",
    label: "Gasolina",
    ready: true,
    pills: [
      { id: "all", label: "Todos" },
      { id: "estado", label: "Estado" },
      { id: "familia", label: "Familias" },
      { id: "empresa", label: "Empresas" },
      { id: "afp", label: "AFP" },
      { id: "financiador", label: "Subsidios" },
      { id: "persona", label: "Personas" },
    ],
  },
  {
    id: "deuda",
    label: "Deuda",
    ready: false,
    pills: [
      { id: "all", label: "Todos" },
      { id: "estado", label: "Estado" },
      { id: "banco", label: "Bancos" },
      { id: "afp", label: "AFP" },
      { id: "prestamo", label: "Prestamistas" },
    ],
  },
  {
    id: "medios",
    label: "Medios",
    ready: false,
    pills: [
      { id: "all", label: "Todos" },
      { id: "medio", label: "Medios" },
      { id: "familia", label: "Familias" },
      { id: "empresa", label: "Empresas" },
      { id: "persona", label: "Personas" },
    ],
  },
  {
    id: "familias",
    label: "Familias",
    ready: false,
    pills: [
      { id: "all", label: "Todos" },
      { id: "familia", label: "Familias" },
      { id: "empresa", label: "Empresas" },
      { id: "persona", label: "Personas" },
      { id: "medio", label: "Medios" },
    ],
  },
];

export const THEME_COLORS = {
  afp: "#f0c14a",
  banco: "#3d7cff",
  financiador: "#3d7cff",
  familia: "#e8364f",
  partido: "#3ecf8e",
  estado: "#9aa3b2",
  medio: "#a78bfa",
  persona: "#f5f7fa",
  fondo: "#e8d48b",
  empresa: "#5ecfc4",
  empleador: "#e8a87c",
  trabajador: "#7ec8e3",
};

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || null;
}
