import { useEffect } from "react";
import CuratedView from "./views/CuratedView";
import ChromeLayoutLab from "./views/ChromeLayoutLab";
import { themeFromPath, usePathname } from "./lib/useCurated";

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

  return <CuratedView themeId={theme || "todo"} navigate={navigate} />;
}
