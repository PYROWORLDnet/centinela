import { Suspense, lazy, useEffect } from "react";
import CuratedView from "./views/CuratedView";
import ChromeLayoutLab from "./views/ChromeLayoutLab";
import { themeFromPath, usePathname } from "./lib/useCurated";

const FilmView = lazy(() => import("./film/FilmView"));
const EpisodeView = lazy(() => import("./film/episode/EpisodeView"));

export default function App() {
  const { path, navigate } = usePathname();
  const theme = themeFromPath(path);
  const isLayouts = (path || "").replace(/\/+$/, "") === "/layouts";

  useEffect(() => {
    const clean = (path || "/").replace(/\/+$/, "") || "/";
    if (clean === "/" || clean === "/todos") {
      navigate("/todo", { replace: true });
      return;
    }
    // Modo masivo / Obsidian eliminado — no reabrir el archivo demo
    if (clean === "/archivo" || clean === "/masivo") {
      navigate("/todo", { replace: true });
    }
  }, [path, navigate]);

  if (isLayouts) {
    return <ChromeLayoutLab onBack={() => navigate("/todo")} />;
  }

  const episodeMatch = (path || "").match(/^\/episodio(?:\/([^/?#]+))?/);
  if (episodeMatch) {
    return (
      <Suspense fallback={null}>
        <EpisodeView episodeId={episodeMatch[1] || "guia"} />
      </Suspense>
    );
  }

  const filmMatch = (path || "").match(/^\/film(?:\/([^/?#]+))?/);
  if (filmMatch) {
    return (
      <Suspense fallback={null}>
        <FilmView themeId={filmMatch[1] || "pensiones"} navigate={navigate} />
      </Suspense>
    );
  }

  return <CuratedView themeId={theme || "todo"} navigate={navigate} />;
}
