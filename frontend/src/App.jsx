import { useEffect } from "react";
import CuratedView from "./views/CuratedView";
import ObsidianView from "./views/ObsidianView";
import { themeFromPath, usePathname } from "./lib/useCurated";

export default function App() {
  const { path, navigate } = usePathname();
  const theme = themeFromPath(path);
  const isArchive = theme === null;

  useEffect(() => {
    const clean = (path || "/").replace(/\/+$/, "") || "/";
    if (clean === "/") navigate("/pensiones", { replace: true });
  }, [path, navigate]);

  if (isArchive) {
    return <ObsidianView onBackToCurated={() => navigate("/pensiones")} />;
  }

  return <CuratedView themeId={theme || "pensiones"} navigate={navigate} />;
}
