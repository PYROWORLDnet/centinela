import { useEffect, useState } from "react";
import Inicio from "./views/Inicio.jsx";
import Entradas from "./views/Entradas.jsx";
import Gastos from "./views/Gastos.jsx";
import Contratos from "./views/Contratos.jsx";
import Provincia from "./views/Provincia.jsx";
import TuParte from "./views/TuParte.jsx";

const ICONOS = {
  inicio: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  entradas: <path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14" />,
  gastos: <path d="M12 20V8m0 0-5 5m5-5 5 5M5 4h14" />,
  contratos: (
    <>
      <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5M9 13h7M9 17h5" />
    </>
  ),
  provincia: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  tuparte: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h2m3 0h3M8 15h2m3 0h3M8 18h2m3 0h3" />
    </>
  ),
};

function Icono({ nombre }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONOS[nombre]}
    </svg>
  );
}

const TABS = [
  { path: "/", label: "Inicio", icon: "inicio", View: Inicio },
  { path: "/entradas", label: "Entradas", icon: "entradas", View: Entradas },
  { path: "/gastos", label: "Gastos", icon: "gastos", View: Gastos },
  { path: "/contratos", label: "Contratos", icon: "contratos", View: Contratos },
  { path: "/provincia", label: "Provincia", icon: "provincia", View: Provincia },
  { path: "/tu-parte", label: "Tu parte", icon: "tuparte", View: TuParte },
];

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const on = () => setPath(window.location.pathname);
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);
  const go = (to) => {
    if (to === window.location.pathname) return;
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  };
  return [path, go];
}

export default function App() {
  const [path, go] = usePath();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/finanzas")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Error ${r.status}`))))
      .then(setDatos)
      .catch((e) => setError(e.message));
  }, []);

  // Enlaces internos sin recargar la página.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest("a[href^='/']");
      if (!a || a.target || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      go(a.getAttribute("href"));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  });

  const clean = path.replace(/\/+$/, "") || "/";
  const tab = TABS.find((t) => t.path === clean) || TABS[0];
  const { View } = tab;

  return (
    <div className="app">
      {error && <div className="loading">No se pudieron cargar los datos ({error}). Intenta de nuevo.</div>}
      {!error && !datos && <div className="loading">Cargando datos oficiales…</div>}
      {datos && <View datos={datos} go={go} />}
      <nav className="tab">
        {TABS.map((t) => (
          <a key={t.path} href={t.path} className={t === tab ? "on" : ""} aria-label={t.label} aria-current={t === tab ? "page" : undefined}>
            <Icono nombre={t.icon} />
            {t === tab && t.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
