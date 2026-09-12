import { useEffect, useId, useRef, useState } from "react";

export default function SearchBar({
  onSelect,
  disabled,
  colors,
  id = "centinela-search",
  onOpenChange,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const listId = useId();
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  function setSearchOpen(next) {
    setOpen(next);
    onOpenChange?.(next);
  }

  useEffect(() => {
    function onDoc(e) {
      if (!wrapRef.current?.contains(e.target)) setSearchOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setSearchOpen(false);
    }
    document.addEventListener("pointerdown", onDoc, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc, true);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const t = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(t);
    }
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        if (err.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => clearTimeout(t);
  }, [query]);

  function toggle() {
    if (disabled) return;
    setSearchOpen(!open);
  }

  function choose(item) {
    setQuery(item.name);
    setSearchOpen(false);
    onSelect(item.id);
  }

  return (
    <div className={`search${open ? " is-open" : ""}`} ref={wrapRef}>
      <button
        type="button"
        className="search__btn"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "Cerrar búsqueda" : "Buscar"}
        disabled={disabled}
        onClick={toggle}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path
              d="M7 7l10 10M17 7 7 17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <circle
              cx="10.5"
              cy="10.5"
              r="6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M15.5 15.5 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      <div className="search__flyout" id={id} hidden={!open}>
        <label className="search__label" htmlFor={`${id}-input`}>
          Buscar
        </label>
        <div className="search__field">
          <span className="search__icon" aria-hidden>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <circle
                cx="10.5"
                cy="10.5"
                r="6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M15.5 15.5 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            ref={inputRef}
            id={`${id}-input`}
            type="search"
            autoComplete="off"
            placeholder="Calamar, Abinader, una empresa…"
            value={query}
            disabled={disabled}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) {
                e.preventDefault();
                choose(results[0]);
              }
            }}
          />
          {loading && <span className="search__spinner" aria-hidden />}
        </div>
        {results.length > 0 && (
          <ul id={listId} className="search__results" role="listbox">
            {results.map((r) => (
              <li key={r.id} role="option">
                <button type="button" onClick={() => choose(r)}>
                  <span
                    className="search__dot"
                    style={{ background: (colors && colors[r.category]) || "#888" }}
                  />
                  <span className="search__name">{r.name}</span>
                  <span className="search__cat">{r.category}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
