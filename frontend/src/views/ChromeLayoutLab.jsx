import { useState } from "react";

const THEMES = [
  "Guía",
  "Pensiones",
  "Partidos",
  "Gasolina",
  "Electricidad",
  "Deuda",
  "Familias",
  "Medios",
  "Banca",
  "Aduana",
  "Construcción",
  "Migración",
  "Minería",
  "ONU/ONG",
  "ADP",
  "Salud",
  "Agua",
];

const OPTIONS = [
  {
    id: "a",
    name: "A · Fila superior",
    blurb: "Search a la izquierda, temas en slider a la derecha. Cercano a lo de ahora.",
  },
  {
    id: "b",
    name: "B · Centro apilado",
    blurb: "Search centrado arriba; debajo, el slider de temas también centrado. El mapa respira a los lados.",
  },
  {
    id: "c",
    name: "C · Temas arriba · search abajo-izq",
    blurb: "Slider de temas a lo ancho arriba. Search flotante abajo a la izquierda, lejos del mapa central.",
  },
];

/**
 * Solo mockups de search + navbar de temas.
 * Ruta: /layouts — elige A, B o C.
 */
export default function ChromeLayoutLab({ onBack }) {
  const [pick, setPick] = useState("a");
  const [activeTheme, setActiveTheme] = useState("Guía");

  return (
    <div className="layout-lab">
      <aside className="layout-lab__rail" aria-label="Opciones de chrome">
        <button type="button" className="layout-lab__back" onClick={onBack}>
          ← Volver al mapa
        </button>
        <p className="layout-lab__eyebrow">Solo search + temas</p>
        <h1 className="layout-lab__title">¿Dónde va el chrome?</h1>
        <p className="layout-lab__lead">
          Tres colocaciones. Los temas siempre scrollean en horizontal — no se agranda la fila.
        </p>
        <div className="layout-lab__opts" role="radiogroup" aria-label="Layouts">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={pick === o.id}
              className={`layout-lab__opt${pick === o.id ? " is-on" : ""}`}
              onClick={() => setPick(o.id)}
            >
              <strong>{o.name}</strong>
              <span>{o.blurb}</span>
            </button>
          ))}
        </div>
        <p className="layout-lab__hint">Dime A, B o C y lo dejamos fijo en la app.</p>
      </aside>

      <div className="layout-lab__stage" data-layout={pick}>
        <div className="layout-lab__sky" aria-hidden>
          <span className="layout-lab__dot" style={{ left: "18%", top: "28%" }} />
          <span className="layout-lab__dot" style={{ left: "42%", top: "46%" }} />
          <span className="layout-lab__dot" style={{ left: "61%", top: "33%" }} />
          <span className="layout-lab__dot" style={{ left: "74%", top: "58%" }} />
          <span className="layout-lab__dot" style={{ left: "33%", top: "62%" }} />
          <span className="layout-lab__line" />
        </div>

        {pick === "a" && (
          <header className="mock-chrome mock-chrome--a">
            <FakeSearch className="mock-search mock-search--inline" />
            <ThemeSlider active={activeTheme} onPick={setActiveTheme} />
          </header>
        )}

        {pick === "b" && (
          <header className="mock-chrome mock-chrome--b">
            <FakeSearch className="mock-search mock-search--center" />
            <ThemeSlider active={activeTheme} onPick={setActiveTheme} centered />
          </header>
        )}

        {pick === "c" && (
          <>
            <header className="mock-chrome mock-chrome--c">
              <ThemeSlider active={activeTheme} onPick={setActiveTheme} full />
            </header>
            <FakeSearch className="mock-search mock-search--corner" />
          </>
        )}

        <div className="layout-lab__badge" aria-hidden>
          Vista previa · {OPTIONS.find((o) => o.id === pick)?.name}
        </div>
      </div>
    </div>
  );
}

function FakeSearch({ className }) {
  return (
    <div className={className} role="search">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span>Rizek, Banreservas, Edesur…</span>
    </div>
  );
}

function ThemeSlider({ active, onPick, centered, full }) {
  return (
    <nav
      className={`mock-themes${centered ? " mock-themes--center" : ""}${full ? " mock-themes--full" : ""}`}
      aria-label="Temas (slider)"
    >
      <div className="mock-themes__track">
        {THEMES.map((t) => (
          <button
            key={t}
            type="button"
            className={active === t ? "is-on" : undefined}
            onClick={() => onPick(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </nav>
  );
}
