/** Colores de respaldo para el panel (el tema curado suele pasar su propia paleta). */
export const CATEGORY_COLOR = {
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

export function formatMoney(n, currency = "DOP") {
  if (n == null) return "—";
  const code = ["USD", "DOP", "EUR", "JPY", "SDR"].includes(currency) ? currency : "USD";
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: code === "SDR" ? "USD" : code,
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(n);
}
