import {
  getNode as memNode,
  getSubgraph as memSubgraph,
  searchNodes as memSearch,
} from "../data/demoGraph.js";
import {
  getNode as pgNode,
  getSubgraph as pgSubgraph,
  hasDatabase,
  searchNodes as pgSearch,
} from "../data/pgGraph.js";

/**
 * Herramienta para Claude (function calling).
 * No inventa: solo lee la base / grafo propio.
 */
export async function buscarConexiones({ q, hops = 1 }) {
  const usePg = hasDatabase();
  const hits = usePg ? await pgSearch(q) : memSearch(q);
  if (!hits.length) {
    return { q, found: false, source: usePg ? "postgres" : "memory", results: [], graph: { nodes: [], links: [] } };
  }
  const ids = hits.slice(0, 5).map((h) => h.id);
  const graph = usePg
    ? await pgSubgraph(ids, hops, 36)
    : memSubgraph(ids, hops, 36);
  const focus = usePg ? await pgNode(hits[0].id) : memNode(hits[0].id);
  return {
    q,
    found: true,
    source: usePg ? "postgres" : "memory",
    results: hits,
    focus,
    graph,
  };
}
