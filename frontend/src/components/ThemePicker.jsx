import { THEMES } from "../lib/themes";

export default function ThemePicker({ value, onChange }) {
  return (
    <div className="theme-picker" role="group" aria-label="Elige un estilo visual">
      <p className="theme-picker__title">Estilos — elige uno</p>
      <div className="theme-picker__row">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`theme-card theme-card--${t.id}${value === t.id ? " is-active" : ""}`}
            onClick={() => onChange(t.id)}
            aria-pressed={value === t.id}
          >
            <span className="theme-card__swatches" aria-hidden>
              {Object.values(t.colors)
                .slice(0, 4)
                .map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
            </span>
            <strong>{t.name}</strong>
            <span>{t.tagline}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
