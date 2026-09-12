import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useJson(url, { skip = false } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skip || !url) return;
    let cancelled = false;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Error cargando ${url}`);
        return r.json();
      })
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [url, skip]);

  return { data, error };
}

/** Grafo completo + selección de nodo con historial para volver atrás. */
export function useGraphExplorer() {
  const { data: galaxy, error } = useJson("/api/graph");
  const [focusId, setFocusId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [lens, setLens] = useState(null);
  const [trail, setTrail] = useState([]);
  const focusRef = useRef(null);
  focusRef.current = focusId;

  const graph = focusId && lens?.nodes?.length ? lens : galaxy;

  const neighbors = useMemo(() => {
    if (!graph || !focusId) return null;
    const set = new Set([focusId]);
    for (const l of graph.links || []) {
      const s = typeof l.source === "object" ? l.source.id : l.source;
      const t = typeof l.target === "object" ? l.target.id : l.target;
      if (s === focusId) set.add(t);
      if (t === focusId) set.add(s);
    }
    return set;
  }, [graph, focusId]);

  const select = useCallback(async (id, { push = true } = {}) => {
    if (!id) {
      setFocusId(null);
      setDetail(null);
      setLens(null);
      setTrail([]);
      return;
    }
    if (push && focusRef.current && focusRef.current !== id) {
      setTrail((t) => [...t, focusRef.current]);
    }
    setFocusId(id);
    try {
      const [nodeRes, subRes] = await Promise.all([
        fetch(`/api/nodes/${encodeURIComponent(id)}`),
        fetch(`/api/subgraph?ids=${encodeURIComponent(id)}&hops=2&max=48`),
      ]);
      if (nodeRes.ok) setDetail(await nodeRes.json());
      else setDetail(null);
      if (subRes.ok) {
        const sub = await subRes.json();
        setLens(sub.nodes?.length ? sub : null);
      } else {
        setLens(null);
      }
    } catch {
      setDetail(null);
      setLens(null);
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
    graph,
    error,
    focusId,
    detail,
    neighbors,
    trail,
    canGoBack: trail.length > 0,
    select,
    goBack,
  };
}
