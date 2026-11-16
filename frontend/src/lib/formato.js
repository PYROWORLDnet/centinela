const nf0 = new Intl.NumberFormat("es-DO", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("es-DO", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

/** RD$ en millones: 998726953951 → "RD$998,727M" */
export function millones(v, { sufijo = "M" } = {}) {
  const m = v / 1e6;
  const s = Math.abs(m) < 10 && m !== 0 ? nf1.format(Math.abs(m)) : nf0.format(Math.abs(m));
  return `${m < 0 ? "−" : ""}RD$${s}${sufijo}`;
}

/** Pesos completos: 4905.3 → "RD$4,905" */
export function pesos(v) {
  return `${v < 0 ? "−" : ""}RD$${nf0.format(Math.abs(Math.round(v)))}`;
}

/** Monto corto para contratos: 26200 → RD$26,200; 48200000 → RD$48.2M */
export function monto(v) {
  if (Math.abs(v) >= 1e6) return `RD$${nf1.format(v / 1e6)}M`;
  return pesos(v);
}

export function numero(v) {
  return nf0.format(v);
}

export function pct(v, dec = 0) {
  return `${(v * 100).toFixed(dec)}%`;
}

export function variacion(actual, anterior) {
  if (!anterior) return null;
  return actual / anterior - 1;
}

export function fecha(iso) {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return d.toLocaleDateString("es-DO", { day: "numeric", month: "short", year: "numeric" });
}

const MINUS = new Set(["de", "del", "la", "las", "los", "y", "e", "el", "a", "en", "para", "por", "con"]);
/** "MINISTERIO DE EDUCACIÓN" → "Ministerio de Educación" (las siglas cortas se respetan). */
export function tituloCaso(s) {
  return String(s || "")
    .split(/\s+/)
    .map((w, i) => {
      if (/^[A-ZÁÉÍÓÚÑ]{2,5}$/.test(w) && !/[AEIOUÁÉÍÓÚ]{2}/.test(w) && w.length <= 4) return w;
      const l = w.toLowerCase();
      return i > 0 && MINUS.has(l) ? l : l.charAt(0).toUpperCase() + l.slice(1);
    })
    .join(" ");
}
