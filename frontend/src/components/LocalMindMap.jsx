import { useEffect, useMemo, useRef, useState } from "react";

const NODE_W = 176;
const NODE_H = 56;
const H_GAP = 22;
const V_GAP = 86;
const PAD = 32;

function linkEnds(link) {
  const s = typeof link.source === "object" ? link.source.id : link.source;
  const t = typeof link.target === "object" ? link.target.id : link.target;
  return [s, t];
}

function buildTree(nodes, links, rootId) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  if (!byId.has(rootId)) return null;

  const adj = new Map(nodes.map((n) => [n.id, []]));
  for (const l of links) {
    const [s, t] = linkEnds(l);
    if (!adj.has(s) || !adj.has(t)) continue;
    adj.get(s).push({ id: t, type: l.type });
    adj.get(t).push({ id: s, type: l.type });
  }

  // Preferir vecinos del foco primero; limitar grado para que quepa en pantalla.
  const focusNbs = adj.get(rootId) || [];
  focusNbs.sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const capped = new Set([rootId, ...focusNbs.slice(0, 14).map((n) => n.id)]);

  const parent = new Map([[rootId, null]]);
  const edgeType = new Map();
  const order = [rootId];

  for (let i = 0; i < order.length; i += 1) {
    const cur = order[i];
    let nbs = adj.get(cur) || [];
    if (cur === rootId) nbs = focusNbs.slice(0, 14);
    else nbs = nbs.filter((n) => capped.has(n.id) || order.length < 22).slice(0, 4);

    for (const nb of nbs) {
      if (parent.has(nb.id)) continue;
      if (cur !== rootId && !capped.has(nb.id) && order.length >= 22) continue;
      parent.set(nb.id, cur);
      edgeType.set(nb.id, nb.type || "");
      capped.add(nb.id);
      order.push(nb.id);
    }
  }

  function makeNode(id) {
    return {
      id,
      data: byId.get(id),
      edgeType: edgeType.get(id) || null,
      children: order.filter((x) => parent.get(x) === id).map(makeNode),
    };
  }
  return makeNode(rootId);
}

function measure(node) {
  if (!node.children.length) {
    node._w = NODE_W;
    return NODE_W;
  }
  let sum = 0;
  for (const c of node.children) sum += measure(c);
  sum += H_GAP * (node.children.length - 1);
  node._w = Math.max(NODE_W, sum);
  return node._w;
}

function place(node, left, depth, positions, edgeList) {
  const x = left + node._w / 2;
  const y = PAD + NODE_H / 2 + depth * (NODE_H + V_GAP);
  positions.set(node.id, {
    x,
    y,
    depth,
    data: node.data,
    edgeType: node.edgeType,
  });

  if (!node.children.length) return;

  const kidsWidth =
    node.children.reduce((s, c) => s + c._w, 0) + H_GAP * Math.max(0, node.children.length - 1);
  let cursor = left + (node._w - kidsWidth) / 2;

  for (const c of node.children) {
    place(c, cursor, depth + 1, positions, edgeList);
    edgeList.push({ from: node.id, to: c.id, type: c.edgeType });
    cursor += c._w + H_GAP;
  }
}

function bezierPath(x1, y1, x2, y2) {
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

export default function LocalMindMap({ graph, focusId, palette, onSelectNode, onExit }) {
  const [hoverId, setHoverId] = useState(null);
  const scrollerRef = useRef(null);

  const layout = useMemo(() => {
    if (!graph?.nodes?.length || !focusId) return null;
    const tree = buildTree(graph.nodes, graph.links || [], focusId);
    if (!tree) return null;

    measure(tree);
    const positions = new Map();
    const edgeList = [];
    place(tree, PAD, 0, positions, edgeList);

    // Normalizar: bbox real de las tarjetas (no solo centros).
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of positions.values()) {
      minX = Math.min(minX, p.x - NODE_W / 2);
      minY = Math.min(minY, p.y - NODE_H / 2);
      maxX = Math.max(maxX, p.x + NODE_W / 2);
      maxY = Math.max(maxY, p.y + NODE_H / 2);
    }
    const shiftX = PAD - minX;
    const shiftY = PAD - minY;
    for (const p of positions.values()) {
      p.x += shiftX;
      p.y += shiftY;
    }

    const curves = edgeList.map((e) => {
      const a = positions.get(e.from);
      const b = positions.get(e.to);
      return {
        from: e.from,
        to: e.to,
        type: e.type,
        d: bezierPath(a.x, a.y + NODE_H / 2, b.x, b.y - NODE_H / 2),
      };
    });

    const width = maxX - minX + PAD * 2;
    const height = maxY - minY + PAD * 2;

    return {
      positions: [...positions.entries()].map(([id, p]) => ({ id, ...p })),
      curves,
      width,
      height,
      rootX: positions.get(focusId)?.x ?? width / 2,
    };
  }, [graph, focusId]);

  // Centrar el foco en el viewport al abrir.
  useEffect(() => {
    if (!layout || !scrollerRef.current) return;
    const el = scrollerRef.current;
    const targetX = layout.rootX - el.clientWidth / 2;
    const targetY = 0;
    el.scrollTo({
      left: Math.max(0, targetX),
      top: targetY,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [layout]);

  if (!layout) {
    return (
      <div className="mindmap mindmap--empty">
        <p>Sin vecinos documentados todavía.</p>
        <button type="button" onClick={onExit}>
          Volver a la galaxia
        </button>
      </div>
    );
  }

  const hot = hoverId || focusId;

  return (
    <div
      className="mindmap"
      ref={scrollerRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) onExit?.();
      }}
    >
      <div
        className="mindmap__canvas"
        style={{ width: layout.width, height: layout.height }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onExit?.();
        }}
      >
        <svg className="mindmap__edges" width={layout.width} height={layout.height} aria-hidden>
          {layout.curves.map((c) => {
            const lit = c.from === hot || c.to === hot;
            return <path key={`${c.from}-${c.to}`} d={c.d} className={lit ? "is-hot" : undefined} />;
          })}
        </svg>

        {layout.positions.map((p, i) => {
          const isRoot = p.id === focusId;
          const isHot = p.id === hot || isRoot;
          const color = palette?.[p.data?.category] || "#5ecfc4";
          return (
            <button
              key={p.id}
              type="button"
              className={`mindmap__node${isRoot ? " is-root" : ""}${isHot ? " is-hot" : ""}`}
              style={{
                left: p.x - NODE_W / 2,
                top: p.y - NODE_H / 2,
                width: NODE_W,
                height: NODE_H,
                "--accent": color,
                animationDelay: `${Math.min(i, 12) * 24}ms`,
              }}
              onMouseEnter={() => setHoverId(p.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode?.(p.id);
              }}
            >
              <span className="mindmap__dot" style={{ background: color }} />
              <span className="mindmap__text">
                <strong>{p.data?.name || p.id}</strong>
                {(p.edgeType || p.data?.category) && (
                  <em>{(p.edgeType || p.data.category || "").replaceAll("_", " ")}</em>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
