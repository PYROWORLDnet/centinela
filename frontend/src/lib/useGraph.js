import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useJson(url, { skip = false } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skip || !url) return;
    let cancelled = false;
    fetch(url)
      .then(async (r) => {
        const type = r.headers.get("content-type") || "";
        if (!r.ok) throw new Error(`No se pudo cargar datos (${r.status})`);
        if (!type.includes("application/json")) {
          throw new Error("El API no respondió con datos. Revisa el deploy del backend.");
        }
        try {
          return await r.json();
        } catch {
          throw new Error("Respuesta inválida del servidor.");
        }
      })
      .then((d) => !cancelled && setData(d))
      .catch((e) => {
        if (cancelled) return;
        const raw = e?.message || "Error de red";
        const friendly =
          /expected pattern|Unexpected token|not valid JSON|is not valid JSON|Failed to fetch|Load failed/i.test(
            raw,
          )
            ? "No se pudo cargar el mapa. El API no está disponible."
            : raw;
        setError(friendly);
      });
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

  const graph = focusId ? lens : galaxy;

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
        fetch(`/api/subgraph?ids=${encodeURIComponent(id)}&hops=2&max=24`),
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
    galaxy,
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
