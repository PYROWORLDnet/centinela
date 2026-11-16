import { useEffect, useState } from "react";
import Inicio from "./views/Inicio.jsx";
import Entradas from "./views/Entradas.jsx";
import Gastos from "./views/Gastos.jsx";
import Contratos from "./views/Contratos.jsx";
import Provincia from "./views/Provincia.jsx";
import TuParte from "./views/TuParte.jsx";

const TABS = [
  { path: "/", label: "Inicio", icon: "◉", View: Inicio },
  { path: "/entradas", label: "Entradas", icon: "↓", View: Entradas },
  { path: "/gastos", label: "Gastos", icon: "↑", View: Gastos },
  { path: "/contratos", label: "Contratos", icon: "≡", View: Contratos },
  { path: "/provincia", label: "Provincia", icon: "⌖", View: Provincia },
  { path: "/tu-parte", label: "Tu parte", icon: "☺", View: TuParte },
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
          <a key={t.path} href={t.path} className={t === tab ? "on" : ""}>
            <i>{t.icon}</i>
            {t.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
