/**
 * Temas curados de Centinela.
 */
export const THEMES = [
  { id: "nucleo", label: "El Núcleo", ready: true, pills: [] },
  { id: "todo", label: "Guía", ready: true, pills: [] },
  { id: "pensiones", label: "Pensiones", ready: true, pills: [] },
  { id: "partidos", label: "Partidos", ready: true, pills: [] },
  { id: "gasolina", label: "Gasolina", ready: true, pills: [] },
  { id: "electricidad", label: "Electricidad", ready: true, pills: [] },
  { id: "deuda", label: "Deuda", ready: true, pills: [] },
  { id: "familias", label: "Familias", ready: true, pills: [] },
  { id: "medios", label: "Medios", ready: true, pills: [] },
  { id: "banca", label: "Banca", ready: true, pills: [] },
  { id: "aduana", label: "Aduana", ready: true, pills: [] },
  { id: "construccion", label: "Construcción", ready: true, pills: [] },
  { id: "migracion", label: "Migración", ready: true, pills: [] },
  { id: "mineria", label: "Minería", ready: true, pills: [] },
  { id: "ong", label: "ONU/ONG", ready: true, pills: [] },
  { id: "adp", label: "ADP", ready: true, pills: [] },
  { id: "salud", label: "Salud", ready: true, pills: [] },
  { id: "agua", label: "Agua", ready: true, pills: [] },
  { id: "azucar", label: "Azúcar", ready: true, pills: [] },
  { id: "transporte", label: "Transporte", ready: true, pills: [] },
  { id: "basura", label: "Basura", ready: true, pills: [] },
  { id: "juego", label: "Juego", ready: true, pills: [] },
  { id: "protesta", label: "Protesta", ready: true, pills: [] },
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
