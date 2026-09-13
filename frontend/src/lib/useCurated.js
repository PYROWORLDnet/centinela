import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useJson } from "./useGraph";

const DEFAULT_COLORS = {
  afp: "#f0c14a",
  banco: "#3d7cff",
  financiador: "#3d7cff",
  familia: "#e8364f",
  partido: "#3ecf8e",
  estado: "#9aa3b2",
  medio: "#a78bfa",
  persona: "#f5f7fa",
  fondo: "#e8d48b",
  empresa: "#5ecfc4",
  empleador: "#e8a87c",
  trabajador: "#7ec8e3",
};

export function usePathname() {
  const [path, setPath] = useState(() => window.location.pathname || "/");

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || "/");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    const next = to.startsWith("/") ? to : `/${to}`;
    if (replace) window.history.replaceState({}, "", next);
    else window.history.pushState({}, "", next);
    setPath(next);
  }, []);

  return { path, navigate };
}

/** Parse theme from path: / → todo, /todo → todo, /archivo|/masivo → null (archive). */
export function themeFromPath(path) {
  const clean = (path || "/").replace(/\/+$/, "") || "/";
  if (clean === "/archivo" || clean === "/masivo") return null;
  if (clean === "/layouts") return "todo"; // lab no es tema; App lo intercepta
  if (clean === "/todos") return "todo";
  if (clean === "/" || clean === "") return "todo";
  const seg = clean.slice(1).split("/")[0];
  return seg || "todo";
}

export function useCuratedExplorer(themeId, pill = "all") {
  const graphUrl =
    themeId &&
    `/api/curated/${encodeURIComponent(themeId)}/graph?pill=${encodeURIComponent(pill)}`;
  const { data: galaxy, error } = useJson(graphUrl, { skip: !themeId });
  const { data: themesPayload } = useJson("/api/curated/themes");

  const [focusId, setFocusId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [trail, setTrail] = useState([]);
  const focusRef = useRef(null);
  focusRef.current = focusId;

  // Reset focus when theme or pill changes
  useEffect(() => {
    setFocusId(null);
    setDetail(null);
    setTrail([]);
  }, [themeId, pill]);

  const colors = galaxy?.meta?.colors || DEFAULT_COLORS;

  const neighbors = useMemo(() => {
    if (!galaxy || !focusId) return null;
    const set = new Set([focusId]);
    for (const l of galaxy.links || []) {
      const s = typeof l.source === "object" ? l.source.id : l.source;
      const t = typeof l.target === "object" ? l.target.id : l.target;
      if (s === focusId) set.add(t);
      if (t === focusId) set.add(s);
    }
    return set;
  }, [galaxy, focusId]);

  const select = useCallback(async (id, { push = true } = {}) => {
    if (!id) {
      setFocusId(null);
      setDetail(null);
      setTrail([]);
      return;
    }
    if (push && focusRef.current && focusRef.current !== id) {
      setTrail((t) => [...t, focusRef.current]);
    }
    setFocusId(id);
    try {
      const res = await fetch(`/api/curated/nodes/${encodeURIComponent(id)}`);
      if (res.ok) setDetail(await res.json());
      else setDetail(null);
    } catch {
      setDetail(null);
    }
  }, []);

  const goBack = useCallback(() => {
    setTrail((t) => {
      if (!t.length) {
        queueMicrotask(() => select(null, { push: false }));
        return [];
      }
      const prev = t[t.length - 1];
      queueMicrotask(() => select(prev, { push: false }));
      return t.slice(0, -1);
    });
  }, [select]);

  return {
    galaxy,
    error,
    themes: themesPayload?.themes || [],
    focusId,
    detail,
    neighbors,
    colors,
    canGoBack: trail.length > 0,
    select,
    goBack,
  };
}
