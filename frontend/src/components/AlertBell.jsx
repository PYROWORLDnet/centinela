import { useEffect, useRef, useState } from "react";
import { useJson } from "../lib/useGraph";

const SEEN_KEY = "centinela:alerts:seen";

function money(amount, currency = "USD") {
  if (amount == null) return null;
  const code = currency === "DOP" ? "DOP" : currency === "EUR" ? "EUR" : "USD";
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: code,
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(amount);
}

function kindLabel(kind) {
  if (kind === "pipeline") return "En preparación";
  if (kind === "inhabilitado") return "Inhabilitado";
  return "Préstamo";
}

export default function AlertBell({ onOpenAlert }) {
  const { data } = useJson("/api/alerts");
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const wrapRef = useRef(null);
  const alerts = data?.alerts || [];
  const unseen = alerts.filter((a) => !seen.includes(a.id)).length;

  useEffect(() => {
    function onDoc(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDoc, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc, true);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function toggle() {
    setOpen((v) => !v);
  }

  function markAll() {
    const ids = alerts.map((a) => a.id);
    setSeen(ids);
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  }

  function openItem(alert) {
    if (!seen.includes(alert.id)) {
      const next = [...seen, alert.id];
      setSeen(next);
      localStorage.setItem(SEEN_KEY, JSON.stringify(next));
    }
    setOpen(false);
    onOpenAlert?.(alert);
  }

  return (
    <div className="glocke" ref={wrapRef}>
      <button
        type="button"
        className={`glocke__btn${unseen ? " has-new" : ""}${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls="centinela-bitacora"
        aria-label={unseen ? `${unseen} avisos nuevos` : "Avisos"}
        onClick={toggle}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            d="M12 3.2c-2.6 0-4.7 2-4.7 4.6v2.1c0 1.4-.6 2.8-1.6 3.8l-.6.6c-.4.4-.2 1.1.4 1.1h14.2c.6 0 .8-.7.4-1.1l-.6-.6c-1-1-1.6-2.4-1.6-3.8V7.8c0-2.6-2.1-4.6-4.7-4.6Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.6 19.2c.6 1.2 2.2 1.8 3.6 1.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        {unseen > 0 && <span className="glocke__badge">{unseen > 9 ? "9+" : unseen}</span>}
      </button>

      {open && (
        <div id="centinela-bitacora" className="glocke__panel" role="dialog" aria-label="Lo que se movió">
          <header className="glocke__head">
            <div>
              <p className="glocke__kicker">Bitácora</p>
              <h2>Lo que se movió</h2>
            </div>
            {unseen > 0 && (
              <button type="button" className="glocke__clear" onClick={markAll}>
                Marcar leído
              </button>
            )}
          </header>
          <ul className="glocke__list">
            {alerts.length === 0 && (
              <li className="glocke__empty">Aún no hay avisos cargados.</li>
            )}
            {alerts.map((alert) => (
              <li key={alert.id}>
                <button type="button" onClick={() => openItem(alert)}>
                  <span className={`glocke__stamp is-${alert.kind}`}>{kindLabel(alert.kind)}</span>
                  <strong>{alert.title}</strong>
                  <em>{alert.body}</em>
                  <span className="glocke__meta">
                    {alert.date && <time>{alert.date}</time>}
                    {alert.amount != null && (
                      <b>{money(alert.amount, alert.currency)}</b>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <footer className="glocke__foot">
            Solo lo de los últimos 90 días · pipeline y fuentes oficiales
          </footer>
        </div>
      )}
    </div>
  );
}
