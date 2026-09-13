import { useRef, useState } from "react";
import AlertBell from "../components/AlertBell";
import GalaxyGraph from "../components/GalaxyGraph";
import NodePanel from "../components/NodePanel";
import SearchBar from "../components/SearchBar";
import { CATEGORIES } from "../lib/categories";
import { useGraphExplorer } from "../lib/useGraph";

const COLORS = {
  caso: "#fff59d",
  persona: "#5ecfc4",
  empresa: "#5ecfc4",
  institucion: "#c5b4e3",
  contrato: "#fff59d",
  prestamo: "#c5b4e3",
};

export default function ObsidianView() {
  const { graph, error, focusId, detail, neighbors, canGoBack, select, goBack } = useGraphExplorer();
  const [category, setCategory] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [browse, setBrowse] = useState(null);
  const [browseLabel, setBrowseLabel] = useState("");
  const [browseYears, setBrowseYears] = useState([]);
  const [browseYear, setBrowseYear] = useState(null);
  const galaxyRef = useRef(null);

  async function loadBrowse(catId, year = null) {
    const qs = year ? `?year=${encodeURIComponent(year)}` : "";
    const res = await fetch(`/api/category/${encodeURIComponent(catId)}${qs}`);
    if (!res.ok) throw new Error("category");
    const data = await res.json();
    setBrowse(data.results || []);
    setBrowseYears(data.years || []);
    setBrowseYear(year);
  }

  async function openCategory(cat) {
    setCategory(cat.id);
    if (cat.id === "all") {
      select(null);
      setBrowse(null);
      setBrowseLabel("");
      setBrowseYears([]);
      setBrowseYear(null);
      return;
    }
    select(null);
    setBrowseLabel(cat.label);
    setBrowseYear(null);
    try {
      await loadBrowse(cat.id, null);
    } catch {
      const local = (graph?.nodes || [])
        .filter((n) => n.category === cat.id)
        .sort((a, b) => String(b.fecha || "").localeCompare(String(a.fecha || "")) || (b.degree || 0) - (a.degree || 0))
        .slice(0, 40);
      setBrowse(local);
      setBrowseYears([]);
    }
  }

  return (
    <div className="view view--obsidian">
      <main className="stage">
        {error && <div className="banner">{error}</div>}
        {!graph && !error && <div className="banner">Cargando galaxia…</div>}
        {graph && (
          <GalaxyGraph
            ref={galaxyRef}
            graph={graph}
            focusId={focusId}
            category={category}
            neighborIds={neighbors}
            onSelectNode={(id) => {
              setBrowse(null);
              select(id);
            }}
          />
        )}
      </main>

      <header className={`chrome${searchOpen ? " is-searching" : ""}`}>
        <div className="chrome-search">
          <SearchBar
            onSelect={(id) => {
              setBrowse(null);
              select(id);
            }}
            disabled={!graph}
            colors={COLORS}
            onOpenChange={setSearchOpen}
          />
        </div>

        <nav className="chrome-filters" aria-label="Categorías">
          <div className="pills">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={category === c.id ? "is-active" : undefined}
                title={c.label}
                onClick={() => openCategory(c)}
              >
                <span className="pill-full">{c.label}</span>
                <span className="pill-short">{c.short || c.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="chrome-glocke">
          <AlertBell
            onOpenAlert={(alert) => {
              setBrowse(null);
              select(alert.nodeId);
            }}
          />
        </div>
      </header>

      <div className="zoom-toggle" role="group" aria-label="Zoom del mapa">
        <button
          type="button"
          className="zoom-toggle__btn"
          aria-label="Acercar"
          disabled={!graph}
          onClick={() => galaxyRef.current?.zoomBy(1)}
        >
          +
        </button>
        <button
          type="button"
          className="zoom-toggle__btn"
          aria-label="Alejar"
          disabled={!graph}
          onClick={() => galaxyRef.current?.zoomBy(-1)}
        >
          −
        </button>
      </div>

      <NodePanel
        node={detail}
        browse={!detail ? browse : null}
        browseLabel={browseLabel}
        browseYears={category === "contrato" ? browseYears : []}
        browseYear={browseYear}
        onBrowseYear={(year) => {
          loadBrowse("contrato", year).catch(() => {});
        }}
        onClose={() => {
          select(null);
          setBrowse(null);
          setBrowseYears([]);
          setBrowseYear(null);
        }}
        onBack={goBack}
        canGoBack={canGoBack}
        onFocusConnection={select}
        onPickBrowse={(id) => {
          setBrowse(null);
          select(id);
        }}
        colors={COLORS}
      />

      <footer className="status">
        <div className="status__left">
          {graph?.meta && (
            <>
              <span>{graph.meta.nodeCount} nodos</span>
              <span>{graph.meta.linkCount} vínculos</span>
              {graph.meta.demo === false && <span>fuentes oficiales</span>}
            </>
          )}
        </div>
        <p className="wordmark wordmark--footer">Centinela</p>
      </footer>
    </div>
  );
}
