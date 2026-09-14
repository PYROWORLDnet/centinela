import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CuratedGalaxy from "../components/CuratedGalaxy";
import NodePanel from "../components/NodePanel";
import SearchBar from "../components/SearchBar";
import StoryTour from "../components/StoryTour";
import { useCuratedExplorer } from "../lib/useCurated";
import { useJson } from "../lib/useGraph";

const THEME_NAV = [
  { id: "nucleo", label: "El Núcleo", path: "/nucleo" },
  { id: "todo", label: "Guía", path: "/todo" },
  { id: "pensiones", label: "Pensiones", path: "/pensiones" },
  { id: "partidos", label: "Partidos", path: "/partidos" },
  { id: "gasolina", label: "Gasolina", path: "/gasolina" },
  { id: "electricidad", label: "Electricidad", path: "/electricidad" },
  { id: "deuda", label: "Deuda", path: "/deuda" },
  { id: "familias", label: "Familias", path: "/familias" },
  { id: "medios", label: "Medios", path: "/medios" },
  { id: "banca", label: "Banca", path: "/banca" },
  { id: "aduana", label: "Aduana", path: "/aduana" },
  { id: "construccion", label: "Construcción", path: "/construccion" },
  { id: "migracion", label: "Migración", path: "/migracion" },
  { id: "mineria", label: "Minería", path: "/mineria" },
  { id: "ong", label: "ONU/ONG", path: "/ong" },
  { id: "adp", label: "ADP", path: "/adp" },
  { id: "salud", label: "Salud", path: "/salud" },
  { id: "agua", label: "Agua", path: "/agua" },
  { id: "azucar", label: "Azúcar", path: "/azucar" },
  { id: "transporte", label: "Transporte", path: "/transporte" },
  { id: "basura", label: "Basura", path: "/basura" },
  { id: "juego", label: "Juego", path: "/juego" },
];

const THEME_NUCLEO = THEME_NAV[0];
const THEME_TODO = THEME_NAV[1];
const THEME_SLIDE = THEME_NAV.slice(2);

export default function CuratedView({ themeId = "todo", navigate }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [tourMode, setTourMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourDone, setTourDone] = useState(false);
  const [exploring, setExploring] = useState(false);
  const [pendingSelectId, setPendingSelectId] = useState(null);
  const galaxyRef = useRef(null);
  const hubInitRef = useRef(false);
  const themesRailRef = useRef(null);

  useEffect(() => {
    setTourMode(false);
    setStepIndex(0);
    setTourDone(false);
    if (!pendingSelectId) setExploring(false);
    hubInitRef.current = false;
  }, [themeId]);

  // Mantén el tema activo visible dentro del slider
  useEffect(() => {
    const rail = themesRailRef.current;
    if (!rail) return;
    const btn = rail.querySelector(`[data-theme-id="${themeId}"]`);
    if (btn && typeof btn.scrollIntoView === "function") {
      btn.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
    }
  }, [themeId]);

  const { galaxy, error, focusId, detail, neighbors, colors, canGoBack, select, goBack } =
    useCuratedExplorer(themeId, "all");

  const ready = galaxy?.meta?.ready === true;

  const { data: tour } = useJson(
    ready && themeId ? `/api/curated/${encodeURIComponent(themeId)}/tour` : null,
    { skip: !ready || !themeId },
  );

  const entry = tour?.entry;
  const hasTour = Boolean(tour?.steps?.length && entry?.hubId);
  const inHub = hasTour && !tourMode && !tourDone && !exploring;
  const inStory = Boolean(tourMode && tour && !tourDone);
  const step = inStory ? tour.steps[stepIndex] : null;

  const highlightIds = useMemo(() => {
    if (inStory && step) {
      const ids = [...(step.nodeIds || [])];
      if (step.pathFrom) ids.push(...step.pathFrom);
      return ids;
    }
    if (inHub && entry) {
      return [entry.hubId, ...entry.satelliteIds];
    }
    return null;
  }, [inStory, step, inHub, entry]);

  const spotlight = inStory || inHub;

  // Entrada hub: no pisar un salto desde búsqueda global
  useEffect(() => {
    if (pendingSelectId) return;
    if (!ready || !inHub || !entry?.hubId || hubInitRef.current) return;
    hubInitRef.current = true;
    select(entry.hubId, { push: false });
  }, [ready, inHub, entry?.hubId, select, pendingSelectId]);

  useEffect(() => {
    if (!inStory || !step?.panelId) return;
    select(step.panelId, { push: false });
  }, [inStory, step?.panelId, stepIndex, select]);

  const goToHub = useCallback(() => {
    if (!entry?.hubId) return;
    setExploring(false);
    setTourMode(false);
    setTourDone(false);
    setStepIndex(0);
    select(entry.hubId, { push: false });
  }, [entry?.hubId, select]);

  // Tras saltar de tema por búsqueda global, enfocar el nodo
  useEffect(() => {
    if (!pendingSelectId || !ready || !galaxy) return;
    const exists = galaxy.nodes?.some((n) => n.id === pendingSelectId);
    if (!exists) {
      setPendingSelectId(null);
      return;
    }
    hubInitRef.current = true;
    setExploring(true);
    select(pendingSelectId, { push: false });
    setPendingSelectId(null);
  }, [pendingSelectId, ready, galaxy, select]);

  const exitTour = useCallback(() => {
    goToHub();
  }, [goToHub]);

  const restartTour = useCallback(() => {
    setExploring(false);
    setTourMode(true);
    setTourDone(false);
    setStepIndex(0);
  }, []);

  const goNext = useCallback(() => {
    if (!tour) return;
    if (stepIndex >= tour.steps.length - 1) {
      setTourDone(true);
      select(null, { push: false });
      return;
    }
    setStepIndex((i) => i + 1);
  }, [tour, stepIndex, select]);

  const goPrev = useCallback(() => {
    if (tourDone) {
      setTourDone(false);
      setStepIndex((tour?.steps.length || 1) - 1);
      return;
    }
    setStepIndex((i) => Math.max(0, i - 1));
  }, [tourDone, tour]);

  useEffect(() => {
    if (!tourMode || !tour) return undefined;
    function onKey(e) {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (tourDone) exitTour();
        else goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        exitTour();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tourMode, tour, tourDone, goNext, goPrev, exitTour]);

  function goTheme(item) {
    navigate(item.path);
  }

  function handleSelectNode(id) {
    if (inStory) {
      if (id) select(id, { push: false });
      else select(null, { push: false });
      return;
    }
    if (inHub) {
      if (!id) {
        select(null, { push: false });
        return;
      }
      if (id === entry?.hubId || entry?.satelliteIds?.includes(id)) {
        select(id, { push: false });
        return;
      }
      setExploring(true);
      select(id);
      return;
    }
    select(id);
  }

  const focused = Boolean(focusId) || inStory;

  return (
    <div
      className={`view view--obsidian view--curated${focused ? " is-focused" : ""}${
        inStory || tourDone ? " is-story" : ""
      }${inHub ? " is-hub" : ""}${searchOpen ? " is-searching" : ""}`}
    >
      <main className="stage">
        <div className="universe" aria-hidden />
        {error && <div className="banner">{error}</div>}
        {!galaxy && !error && <div className="banner">Cargando mapa…</div>}
        {galaxy && !ready && (
          <div className="banner banner--soft">
            {galaxy.meta?.message || "Tema en preparación"}
          </div>
        )}
        {galaxy && ready && (
          <CuratedGalaxy
            ref={galaxyRef}
            graph={galaxy}
            colors={colors}
            focusId={focusId}
            neighborIds={spotlight ? null : neighbors}
            highlightIds={highlightIds}
            hubLayout={inHub ? entry : null}
            storyMode={spotlight}
            onSelectNode={handleSelectNode}
          />
        )}
      </main>

      <header className={`chrome chrome--curated${searchOpen ? " is-searching" : ""}`}>
        <div className="chrome-search">
          <SearchBar
            onSelect={(item) => {
              const id = typeof item === "string" ? item : item?.id;
              const targetTheme = typeof item === "object" ? item?.theme : null;
              if (!id) return;
              if (tourMode) exitTour();
              if (targetTheme && targetTheme !== themeId) {
                setExploring(true);
                setPendingSelectId(id);
                navigate(`/${targetTheme}`);
                return;
              }
              setExploring(true);
              select(id);
            }}
            disabled={false}
            colors={colors}
            onOpenChange={setSearchOpen}
            searchUrl="/api/curated/search?q="
            placeholder="Cúpula, Rizek, La Sirena, Fanjul…"
          />
        </div>

        <nav className="chrome-themes" aria-label="Temas">
          <div className="chrome-themes__dock">
            <button
              type="button"
              className={`chrome-themes__todo${themeId === THEME_NUCLEO.id ? " is-active" : ""}`}
              onClick={() => goTheme(THEME_NUCLEO)}
            >
              <span className="pill-full">{THEME_NUCLEO.label}</span>
              <span className="pill-short">Núcleo</span>
            </button>
            <button
              type="button"
              className={`chrome-themes__todo${themeId === THEME_TODO.id ? " is-active" : ""}`}
              onClick={() => goTheme(THEME_TODO)}
            >
              <span className="pill-full">{THEME_TODO.label}</span>
              <span className="pill-short">{THEME_TODO.label}</span>
            </button>
            <div className="pills pills--themes" ref={themesRailRef}>
              {THEME_SLIDE.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  data-theme-id={t.id}
                  className={themeId === t.id ? "is-active" : undefined}
                  onClick={() => goTheme(t)}
                >
                  <span className="pill-full">{t.label}</span>
                  <span className="pill-short">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {inHub && (
        <div className="hub-intro" role="note">
          <button type="button" className="hub-intro__cta" onClick={restartTour}>
            Ver el mecanismo →
          </button>
        </div>
      )}

      {ready && hasTour && exploring && !tourMode && (
        <button type="button" className="story-start" onClick={goToHub}>
          Volver al sistema
        </button>
      )}

      {(inStory || (tourMode && tourDone)) && tour && (
        <StoryTour
          tour={tour}
          stepIndex={stepIndex}
          done={tourDone}
          onPrev={goPrev}
          onNext={goNext}
          onSkip={exitTour}
          onRestart={restartTour}
          onExplore={exitTour}
        />
      )}

      <div className="zoom-toggle" role="group" aria-label="Zoom del mapa">
        <button
          type="button"
          className="zoom-toggle__btn"
          aria-label="Acercar"
          disabled={!galaxy || !ready}
          onClick={() => galaxyRef.current?.zoomBy(1)}
        >
          +
        </button>
        <button
          type="button"
          className="zoom-toggle__btn"
          aria-label="Alejar"
          disabled={!galaxy || !ready}
          onClick={() => galaxyRef.current?.zoomBy(-1)}
        >
          −
        </button>
      </div>

      <NodePanel
        node={detail}
        onClose={() => {
          // Siempre cerrar la ficha al tocar ×
          select(null, { push: false });
        }}
        onBack={inStory || inHub ? undefined : goBack}
        canGoBack={!inStory && !inHub && canGoBack}
        onFocusConnection={(id) => {
          if (inStory) {
            select(id, { push: false });
            return;
          }
          if (inHub && entry?.satelliteIds?.includes(id)) {
            select(id, { push: false });
            return;
          }
          setExploring(true);
          select(id);
        }}
        onStartTour={inHub && focusId === entry?.hubId ? restartTour : undefined}
        colors={colors}
      />

      <footer className="status">
        <p className="wordmark wordmark--footer">Centinela</p>
      </footer>
    </div>
  );
}
