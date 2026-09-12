export const CATEGORIES = [
  { id: "all", label: "Todos", short: "Todos" },
  { id: "caso", label: "Casos", short: "Casos" },
  { id: "persona", label: "Personas", short: "Pers." },
  { id: "empresa", label: "Empresas", short: "Emp." },
  { id: "institucion", label: "Instituciones", short: "Inst." },
  { id: "contrato", label: "Contratos", short: "Contr." },
  { id: "prestamo", label: "Préstamos", short: "Prést." },
];

export const CATEGORY_COLOR = {
  caso: "#f0c14a",
  persona: "#5ec8e8",
  empresa: "#3d9b8f",
  institucion: "#7b8cff",
  contrato: "#e07a5f",
  prestamo: "#c4a882",
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
