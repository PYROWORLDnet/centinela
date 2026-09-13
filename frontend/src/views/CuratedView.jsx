import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CuratedGalaxy from "../components/CuratedGalaxy";
import NodePanel from "../components/NodePanel";
import SearchBar from "../components/SearchBar";
import StoryTour from "../components/StoryTour";
import { useCuratedExplorer } from "../lib/useCurated";
import { useJson } from "../lib/useGraph";

const THEME_NAV = [
  { id: "pensiones", label: "Pensiones", path: "/pensiones" },
  { id: "partidos", label: "Partidos", path: "/partidos" },
  { id: "gasolina", label: "Gasolina", path: "/gasolina" },
  { id: "deuda", label: "Deuda", path: "/deuda" },
  { id: "medios", label: "Medios", path: "/medios" },
  { id: "familias", label: "Familias", path: "/familias" },
  { id: "todos", label: "Todos", path: "/todos" },
];

const HUB_STATUS = {
  pensiones: "CNSS · tripartismo",
  partidos: "JCE · 80 / 12 / 8",
  gasolina: "MICM · juego cerrado",
};

export default function CuratedView({ themeId = "pensiones", navigate }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [tourMode, setTourMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourDone, setTourDone] = useState(false);
  const [exploring, setExploring] = useState(false);
  const [pill, setPill] = useState("all");
  const galaxyRef = useRef(null);
  const hubInitRef = useRef(false);

  useEffect(() => {
    setTourMode(false);
    setStepIndex(0);
    setTourDone(false);
    setExploring(false);
    setPill("all");
    hubInitRef.current = false;
  }, [themeId]);

  const { galaxy, error, themes, focusId, detail, neighbors, colors, canGoBack, select, goBack } =
    useCuratedExplorer(themeId, pill);

  const themeMeta = useMemo(
    () => themes.find((t) => t.id === themeId) || THEME_NAV.find((t) => t.id === themeId),
    [themes, themeId],
  );
  const pills = themeMeta?.pills || [];
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

  // Entrada: foco en Fondos de Pensiones + 4 AFP
  useEffect(() => {
    if (!ready || !inHub || !entry?.hubId || hubInitRef.current) return;
    hubInitRef.current = true;
    select(entry.hubId, { push: false });
  }, [ready, inHub, entry?.hubId, select]);

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
    setPill("all");
    select(entry.hubId, { push: false });
  }, [entry?.hubId, select]);

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
    if (item.id === "todos") {
      navigate("/todos");
      return;
    }
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
      }${inHub ? " is-hub" : ""}`}
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
            onSelect={(id) => {
              if (tourMode) exitTour();
              setExploring(true);
              select(id);
            }}
            disabled={!galaxy || !ready}
            colors={colors}
            onOpenChange={setSearchOpen}
            searchUrl={`/api/curated/search?theme=${encodeURIComponent(themeId)}&q=`}
            placeholder={
              themeId === "partidos"
                ? "JCE, PRM, Ley 33-18…"
                : themeId === "gasolina"
                  ? "Refidomsa, Rizek, Tropigas…"
                  : "AFP Popular, Hacienda, SIPEN…"
            }
          />
        </div>

        <nav className="chrome-themes" aria-label="Temas">
          <div className="pills pills--themes">
            {THEME_NAV.map((t) => (
              <button
                key={t.id}
                type="button"
                className={t.id !== "todos" && themeId === t.id ? "is-active" : undefined}
                onClick={() => goTheme(t)}
              >
                <span className="pill-full">{t.label}</span>
                <span className="pill-short">{t.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {ready &&
          (themeId === "partidos" || themeId === "gasolina") &&
          pills.length > 0 &&
          !inHub &&
          !inStory &&
          !tourDone && (
          <nav className="chrome-pills" aria-label="Filtros del tema">
            <div className="pills">
              {pills.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={pill === p.id ? "is-active" : undefined}
                  onClick={() => {
                    setExploring(true);
                    setPill(p.id);
                  }}
                >
                  <span className="pill-full">{p.label}</span>
                  <span className="pill-short">{p.label}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
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
        <div className="status__left">
          {galaxy?.meta?.ready && (
            <>
              <span>{themeMeta?.label || themeId}</span>
              {inStory ? (
                <span>
                  Recorrido · {stepIndex + 1}/{tour.steps.length}
                </span>
              ) : inHub ? (
                <span>{HUB_STATUS[themeId] || themeMeta?.label}</span>
              ) : (
                <>
                  <span>{galaxy.meta.nodeCount} nodos</span>
                  <span>{galaxy.meta.linkCount} vínculos</span>
                </>
              )}
              <span>fuentes verificables</span>
            </>
          )}
        </div>
        <p className="wordmark wordmark--footer">Centinela</p>
      </footer>
    </div>
  );
}
