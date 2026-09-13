import { useEffect, useMemo, useRef, useState } from "react";

const NODE_W = 168;
const NODE_H = 54;
const H_GAP = 18;
const V_GAP = 72;
const PAD = 24;
/** Máx. nodos por fila en un mismo nivel — evita una sola línea kilométrica. */
const MAX_PER_ROW = 5;

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

  const focusNbs = (adj.get(rootId) || [])
    .slice()
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const capped = new Set([rootId, ...focusNbs.slice(0, 12).map((n) => n.id)]);

  const parent = new Map([[rootId, null]]);
  const edgeType = new Map();
  const order = [rootId];

  for (let i = 0; i < order.length; i += 1) {
    const cur = order[i];
    let nbs = adj.get(cur) || [];
    if (cur === rootId) nbs = focusNbs.slice(0, 12);
    else nbs = nbs.filter((n) => capped.has(n.id)).slice(0, 3);

    for (const nb of nbs) {
      if (parent.has(nb.id)) continue;
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

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Layout en filas: el foco arriba centrado; hijos en varias filas debajo
 * (no una sola línea horizontal que se sale / se achica).
 */
function layoutRows(tree) {
  const positions = new Map();
  const edges = [];

  const rootX = 0;
  const rootY = 0;
  positions.set(tree.id, {
    x: rootX,
    y: rootY,
    depth: 0,
    data: tree.data,
    edgeType: null,
  });

  const kids = tree.children || [];
  if (!kids.length) {
    return finalize(positions, edges, tree.id);
  }

  const rows = chunk(kids, MAX_PER_ROW);
  let y = rootY + NODE_H + V_GAP;

  rows.forEach((row, rowIdx) => {
    const rowW = row.length * NODE_W + (row.length - 1) * H_GAP;
    let x = -rowW / 2 + NODE_W / 2;
    for (const child of row) {
      positions.set(child.id, {
        x,
        y,
        depth: 1,
        data: child.data,
        edgeType: child.edgeType,
      });
      edges.push({ from: tree.id, to: child.id, type: child.edgeType });

      // Nietos bajo su padre (máx 3), en una subfila
      const grands = child.children || [];
      if (grands.length) {
        const gW = grands.length * (NODE_W * 0.92) + (grands.length - 1) * (H_GAP - 4);
        let gx = x - gW / 2 + (NODE_W * 0.92) / 2;
        const gy = y + NODE_H + V_GAP * 0.85;
        for (const g of grands) {
          positions.set(g.id, {
            x: gx,
            y: gy,
            depth: 2,
            data: g.data,
            edgeType: g.edgeType,
            w: NODE_W * 0.92,
          });
          edges.push({ from: child.id, to: g.id, type: g.edgeType });
          gx += NODE_W * 0.92 + (H_GAP - 4);
        }
      }

      x += NODE_W + H_GAP;
    }
    // Siguiente fila de hijos: debajo de la más baja de esta fila (incluye nietos)
    let rowBottom = y + NODE_H / 2;
    for (const child of row) {
      const p = positions.get(child.id);
      rowBottom = Math.max(rowBottom, p.y + NODE_H / 2);
      for (const g of child.children || []) {
        const gp = positions.get(g.id);
        if (gp) rowBottom = Math.max(rowBottom, gp.y + NODE_H / 2);
      }
    }
    y = rowBottom + V_GAP;
    if (rowIdx < rows.length - 1) {
      // ya actualizado y
    }
  });

  return finalize(positions, edges, tree.id);
}

function finalize(positions, edges, rootId) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of positions.values()) {
    const w = p.w || NODE_W;
    minX = Math.min(minX, p.x - w / 2);
    minY = Math.min(minY, p.y - NODE_H / 2);
    maxX = Math.max(maxX, p.x + w / 2);
    maxY = Math.max(maxY, p.y + NODE_H / 2);
  }

  const shiftX = PAD - minX;
  const shiftY = PAD - minY;
  for (const p of positions.values()) {
    p.x += shiftX;
    p.y += shiftY;
  }

  const curves = edges.map((e) => {
    const a = positions.get(e.from);
    const b = positions.get(e.to);
    const bw = b.w || NODE_W;
    const midY = (a.y + NODE_H / 2 + b.y - NODE_H / 2) / 2;
    return {
      from: e.from,
      to: e.to,
      d: `M ${a.x} ${a.y + NODE_H / 2} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y - NODE_H / 2}`,
      // unused but kept for hot state
      _bw: bw,
    };
  });

  return {
    positions: [...positions.entries()].map(([id, p]) => ({ id, ...p })),
    curves,
    width: maxX - minX + PAD * 2,
    height: maxY - minY + PAD * 2,
    rootId,
  };
}

export default function LocalMindMap({ graph, focusId, palette, onSelectNode, onExit }) {
  const [hoverId, setHoverId] = useState(null);
  const [scale, setScale] = useState(1);
  const frameRef = useRef(null);

  const layout = useMemo(() => {
    if (!graph?.nodes?.length || !focusId) return null;
    const tree = buildTree(graph.nodes, graph.links || [], focusId);
    if (!tree) return null;
    return layoutRows(tree);
  }, [graph, focusId]);

  // Encajar en la zona izquierda (~75%), no bajo el panel.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !layout) return;

    const fit = () => {
      const availW = el.clientWidth;
      const availH = el.clientHeight;
      if (availW < 40 || availH < 40) return;
      const next = Math.min(1, availW / layout.width, availH / layout.height);
      setScale(Math.max(0.55, next * 0.96));
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
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
      ref={frameRef}
      onClick={(e) => {
        if (e.target === e.currentTarget || e.target.classList?.contains("mindmap__fit")) {
          onExit?.();
        }
      }}
    >
      <div className="mindmap__fit">
        <div
          className="mindmap__canvas"
          style={{
            width: layout.width,
            height: layout.height,
            transform: `scale(${scale})`,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onExit?.();
          }}
        >
          <svg className="mindmap__edges" width={layout.width} height={layout.height} aria-hidden>
            {layout.curves.map((c) => (
              <path
                key={`${c.from}-${c.to}`}
                d={c.d}
                className={c.from === hot || c.to === hot ? "is-hot" : undefined}
              />
            ))}
          </svg>

          {layout.positions.map((p, i) => {
            const isRoot = p.id === focusId;
            const isHot = p.id === hot || isRoot;
            const color = palette?.[p.data?.category] || "#5ecfc4";
            const w = p.w || NODE_W;
            return (
              <button
                key={p.id}
                type="button"
                className={`mindmap__node${isRoot ? " is-root" : ""}${isHot ? " is-hot" : ""}`}
                style={{
                  left: p.x - w / 2,
                  top: p.y - NODE_H / 2,
                  width: w,
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
    </div>
  );
}
