import { useEffect } from "react";
import CuratedView from "./views/CuratedView";
import ObsidianView from "./views/ObsidianView";
import ChromeLayoutLab from "./views/ChromeLayoutLab";
import { themeFromPath, usePathname } from "./lib/useCurated";

export default function App() {
  const { path, navigate } = usePathname();
  const theme = themeFromPath(path);
  const isArchive = theme === null;
  const isLayouts = (path || "").replace(/\/+$/, "") === "/layouts";

  useEffect(() => {
    const clean = (path || "/").replace(/\/+$/, "") || "/";
    if (clean === "/") navigate("/todo", { replace: true });
    if (clean === "/todos") navigate("/todo", { replace: true });
  }, [path, navigate]);

  if (isLayouts) {
    return <ChromeLayoutLab onBack={() => navigate("/todo")} />;
  }

  if (isArchive) {
    return <ObsidianView onBackToCurated={() => navigate("/todo")} />;
  }

  return <CuratedView themeId={theme || "todo"} navigate={navigate} />;
}
