import { getCuratedNode, searchCurated } from "../data/curated/index.js";

/**
 * Herramienta para Claude (function calling).
 * Solo lee el grafo curado — no inventa nodos demo.
 */
export async function buscarConexiones({ q, hops = 1 }) {
  const hits = searchCurated(q);
  if (!hits.length) {
    return { q, found: false, source: "curated", results: [], graph: { nodes: [], links: [] } };
  }

  const focus = getCuratedNode(hits[0].id);
  const nodes = new Map();
  const links = [];

  function addNode(n) {
    if (!n?.id || nodes.has(n.id)) return;
    nodes.set(n.id, {
      id: n.id,
      name: n.name,
      category: n.category || n.kind,
      role: n.role,
      summary: n.summary,
    });
  }

  if (focus) {
    addNode(focus);
    const depth = Math.min(2, Math.max(1, Number(hops) || 1));
    for (const c of focus.connections || []) {
      if (!c.node) continue;
      addNode(c.node);
      links.push({
        source: c.direction === "out" ? focus.id : c.node.id,
        target: c.direction === "out" ? c.node.id : focus.id,
        type: c.type,
        note: c.note,
      });
      if (depth > 1) {
        const other = getCuratedNode(c.node.id);
        for (const c2 of other?.connections || []) {
          if (!c2.node || c2.node.id === focus.id) continue;
          addNode(c2.node);
          links.push({
            source: c2.direction === "out" ? other.id : c2.node.id,
            target: c2.direction === "out" ? c2.node.id : other.id,
            type: c2.type,
            note: c2.note,
          });
        }
      }
    }
  }

  return {
    q,
    found: true,
    source: "curated",
    results: hits,
    focus,
    graph: { nodes: [...nodes.values()], links },
  };
}
