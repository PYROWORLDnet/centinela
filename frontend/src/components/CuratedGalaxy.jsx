import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { forceCollide } from "d3-force";
import { wrapCanvasLabel } from "../lib/wrapLabel";

const LINK_DIM = "rgba(70, 78, 96, 0.08)";
const LINK_SOFT = "rgba(160, 175, 210, 0.28)";
const LINK_HOT = "rgba(240, 220, 160, 0.72)";

function nodeRadius(node, globalScale) {
  const w = node.weight || 40;
  const amtBoost = node.amount ? Math.min(1.4, 1 + Math.log10(Math.max(node.amount, 1)) / 14) : 1;
  const px = Math.min(14, 3.2 + (w / 100) * 9) * amtBoost;
  return px / globalScale;
}

/** Tamaño de fuente estable en pantalla (no explota al hacer zoom out). */
function labelFontPx(globalScale, targetPx = 10) {
  return Math.min(12, Math.max(7, targetPx / globalScale));
}

/** Texto del grafo — estilo A (suave). */
const GRAPH_LABEL = {
  hub: 9,
  focus: 8.5,
  sat: 8,
  weightHub: 500,
  weight: 400,
  color: "rgba(190, 198, 210, 0.88)",
  maxWHub: 100,
  maxWSat: 78,
};

function drawNodeLabel(ctx, node, { x, y, fontSize, weight, maxWidth, maxLines, fill }) {
  ctx.font = `${weight} ${fontSize}px Manrope, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = fill || "rgba(245,247,250,0.96)";
  const lines = wrapCanvasLabel(ctx, node.name, maxWidth, maxLines);
  const lineH = fontSize * 1.18;
  for (let i = 0; i < lines.length; i += 1) {
    ctx.fillText(lines[i], x, y + i * lineH);
  }
}

function layoutCurated(nodes) {
  const n = Math.max(nodes.length, 1);
  return nodes.map((node, i) => {
    const a = (i * 2.399963) % (Math.PI * 2);
    const r = Math.pow((i + 1) / n, 0.48) * 95;
    const jitter = ((i * 13) % 9) - 4;
    return {
      ...node,
      x: Math.cos(a) * (r + jitter),
      y: Math.sin(a) * (r + jitter),
    };
  });
}

/** Hub al centro, satélites en anillo (ej. Fondos + 4 AFP). */
function layoutHub(nodes, hubId, satelliteIds, radius = 88) {
  const byId = new Map(nodes.map((n) => [n.id, { ...n }]));
  const hub = byId.get(hubId);
  if (!hub) return layoutCurated(nodes);

  hub.x = 0;
  hub.y = 0;

  const sats = satelliteIds.map((id) => byId.get(id)).filter(Boolean);
  sats.forEach((node, i) => {
    const a = (i / Math.max(sats.length, 1)) * Math.PI * 2 - Math.PI / 2;
    node.x = Math.cos(a) * radius;
    node.y = Math.sin(a) * radius;
  });

  let outer = 0;
  for (const node of byId.values()) {
    if (node.id === hubId || satelliteIds.includes(node.id)) continue;
    const a = (outer * 2.399963) % (Math.PI * 2);
    const r = 128 + (outer % 4) * 14;
    node.x = Math.cos(a) * r;
    node.y = Math.sin(a) * r;
    outer += 1;
  }

  return [...byId.values()];
}

function centerOn(fg, nodes, wrapEl, ms = 0, fill = 0.38) {
  if (!fg || !nodes?.length) return false;
  let cx = 0;
  let cy = 0;
  let count = 0;
  let maxR = 1;
  for (const node of nodes) {
    if (node.x == null || node.y == null) continue;
    cx += node.x;
    cy += node.y;
    count += 1;
  }
  if (!count) return false;
  cx /= count;
  cy /= count;
  for (const node of nodes) {
    if (node.x == null || node.y == null) continue;
    maxR = Math.max(maxR, Math.hypot(node.x - cx, node.y - cy));
  }
  const w = wrapEl?.clientWidth || window.innerWidth;
  const h = wrapEl?.clientHeight || window.innerHeight;
  const zoom = Math.min(4.2, Math.max(1.1, (Math.min(w, h) * fill) / maxR));
  fg.centerAt(cx, cy, ms);
  fg.zoom(zoom, ms);
  return true;
}

const CuratedGalaxy = forwardRef(function CuratedGalaxy(
  {
    graph,
    colors,
    focusId,
    neighborIds,
    highlightIds,
    hubLayout = null,
    storyMode = false,
    onSelectNode,
  },
  ref,
) {
  const fgRef = useRef(null);
  const wrapRef = useRef(null);
  const zoomRef = useRef(2);
  const fitted = useRef(false);

  const data = useMemo(() => {
    if (!graph) return { nodes: [], links: [] };
    const nodes = hubLayout
      ? layoutHub(graph.nodes, hubLayout.hubId, hubLayout.satelliteIds)
      : layoutCurated(graph.nodes);
    return {
      nodes,
      links: (graph.links || []).map((l) => ({ ...l })),
    };
  }, [graph, hubLayout]);

  const neighborSet = useMemo(() => {
    if (!neighborIds) return null;
    return neighborIds instanceof Set ? neighborIds : new Set(neighborIds);
  }, [neighborIds]);

  const highlightSet = useMemo(() => {
    if (!highlightIds?.length) return null;
    return new Set(highlightIds);
  }, [highlightIds]);

  const storyActive = storyMode && Boolean(highlightSet?.size);

  useImperativeHandle(
    ref,
    () => ({
      zoomBy(dir) {
        const fg = fgRef.current;
        if (!fg) return;
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const ms = prefersReduced ? 0 : 180;
        const current = Number.isFinite(zoomRef.current) && zoomRef.current > 0 ? zoomRef.current : 2;
        const next = Math.min(12, Math.max(0.55, current * (dir > 0 ? 1.35 : 1 / 1.35)));
        zoomRef.current = next;
        fg.zoom(next, ms);
      },
    }),
    [],
  );

  const paintNode = useCallback(
    (node, ctx, globalScale) => {
      const isHub = hubLayout && node.id === hubLayout.hubId;
      const hubScale = isHub ? 1.45 : 1;
      const r = nodeRadius(node, globalScale) * hubScale;
      const color = colors[node.kind || node.category] || "#9aa3b2";
      const ts = GRAPH_LABEL;

      if (storyActive) {
        const lit = highlightSet.has(node.id);
        const isPanel = node.id === focusId;
        if (lit) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * (isHub ? 3.4 : isPanel ? 3.1 : 2.4), 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = isHub || isPanel ? 0.22 : 0.14;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, lit ? r * (isHub ? 1.2 : 1.15) : r * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = lit ? 1 : 0.08;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (lit) {
          const target = isHub ? ts.hub : isPanel ? ts.focus : ts.sat;
          const fontSize = labelFontPx(globalScale, target);
          const maxWidth = isHub ? ts.maxWHub : ts.maxWSat;
          const maxLines = isHub ? 2 : 1;
          let lx = node.x;
          let ly = node.y;
          if (hubLayout) {
            if (isHub) {
              ly = node.y + r + 8 / globalScale;
            } else {
              const dist = Math.hypot(node.x, node.y) || 1;
              const push = r + 14 / globalScale;
              lx = node.x + (node.x / dist) * push * 0.62;
              ly = node.y + (node.y / dist) * push * 0.62;
            }
          } else {
            ly = node.y + r * 1.15 + 5 / globalScale;
          }
          drawNodeLabel(ctx, node, {
            x: lx,
            y: ly,
            fontSize,
            weight: isHub || isPanel ? ts.weightHub : ts.weight,
            maxWidth,
            maxLines,
            fill: ts.color,
          });
        }
        return;
      }

      const focused = Boolean(focusId);
      const isFocus = node.id === focusId;
      const isNeighbor = neighborSet?.has(node.id);
      const dim = focused && !isFocus && !isNeighbor;

      if (isFocus) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.18;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = dim ? 0.14 : isFocus ? 1 : isNeighbor ? 0.95 : 0.88;
      ctx.fill();
      ctx.globalAlpha = 1;

      const showLabel = !dim && (isFocus || isNeighbor || globalScale > 2.2 || (node.weight || 0) >= 85);
      if (showLabel) {
        const fontSize = labelFontPx(globalScale, isFocus ? ts.focus : ts.sat);
        drawNodeLabel(ctx, node, {
          x: node.x,
          y: node.y + r + 4 / globalScale,
          fontSize,
          weight: isFocus ? ts.weightHub : ts.weight,
          maxWidth: isFocus ? ts.maxWHub : ts.maxWSat,
          maxLines: isFocus ? 2 : 1,
          fill: ts.color,
        });
      }
    },
    [colors, focusId, neighborSet, highlightSet, storyActive, hubLayout],
  );

  const linkColor = useCallback(
    (link) => {
      const s = link.source?.id || link.source;
      const t = link.target?.id || link.target;
      if (storyActive) {
        if (highlightSet.has(s) && highlightSet.has(t)) return LINK_HOT;
        if (highlightSet.has(s) || highlightSet.has(t)) return "rgba(240, 220, 160, 0.35)";
        return LINK_DIM;
      }
      if (!focusId) return LINK_SOFT;
      if (s === focusId || t === focusId) return LINK_HOT;
      return LINK_DIM;
    },
    [focusId, highlightSet, storyActive],
  );

  const linkWidth = useCallback(
    (link) => {
      const s = link.source?.id || link.source;
      const t = link.target?.id || link.target;
      if (storyActive) {
        if (highlightSet.has(s) && highlightSet.has(t)) return 2;
        if (highlightSet.has(s) || highlightSet.has(t)) return 0.9;
        return 0.15;
      }
      if (!focusId) return 0.55;
      if (s === focusId || t === focusId) return 1.6;
      return 0.2;
    },
    [focusId, highlightSet, storyActive],
  );

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force("charge")?.strength(-28);
    fg.d3Force("link")?.distance(42)?.strength(0.55);
    fg.d3Force("center")?.strength(0.35);
    fg.d3Force("collide", forceCollide((n) => 6 + (n.weight || 40) / 18).strength(0.7));

    fitted.current = false;
    let tries = 0;
    let timer;
    const tick = () => {
      if (centerOn(fg, data.nodes, wrapRef.current, 0) || tries++ > 28) {
        fitted.current = true;
        return;
      }
      timer = window.setTimeout(tick, 40);
    };
    timer = window.setTimeout(tick, 30);
    return () => window.clearTimeout(timer);
  }, [data]);

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg || !data.nodes.length) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = prefersReduced ? 0 : 480;

    if (storyActive) {
      const cluster = data.nodes.filter((n) => highlightSet.has(n.id) && n.x != null);
      if (cluster.length) {
        const fill = hubLayout ? 0.5 : cluster.length === 1 ? 0.22 : 0.42;
        centerOn(fg, cluster, wrapRef.current, ms, fill);
      }
      return;
    }

    if (!focusId) {
      centerOn(fg, data.nodes, wrapRef.current, ms, 0.38);
      return;
    }
    const focusNode = data.nodes.find((n) => n.id === focusId);
    if (!focusNode || focusNode.x == null) return;
    const cluster = data.nodes.filter((n) => neighborSet?.has(n.id) && n.x != null);
    if (cluster.length > 1) {
      centerOn(fg, cluster, wrapRef.current, ms, 0.48);
    } else {
      fg.centerAt(focusNode.x, focusNode.y, ms);
      fg.zoom(3.2, ms);
    }
  }, [focusId, neighborSet, highlightSet, storyActive, hubLayout, data.nodes]);

  return (
    <div className={`galaxy galaxy--curated${storyActive ? " is-story" : ""}`} ref={wrapRef}>
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        backgroundColor="rgba(0,0,0,0)"
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node, color, ctx, globalScale) => {
          const r = Math.max(nodeRadius(node, globalScale) * 1.35, 4 / globalScale);
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkDirectionalParticles={storyActive || focusId ? 2 : 0}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleSpeed={0.004}
        linkDirectionalParticleColor={() => "rgba(240,193,74,0.85)"}
        warmupTicks={60}
        cooldownTicks={90}
        d3AlphaDecay={0.028}
        d3VelocityDecay={0.42}
        onZoom={({ k }) => {
          if (Number.isFinite(k)) zoomRef.current = k;
        }}
        onEngineStop={() => {
          if (!focusId && !storyActive && !fitted.current) {
            centerOn(fgRef.current, data.nodes, wrapRef.current, 0);
            fitted.current = true;
          }
        }}
        onNodeClick={(node) => {
          if (storyActive) {
            if (highlightSet.has(node.id)) onSelectNode(node.id);
            return;
          }
          onSelectNode(node.id);
        }}
        onBackgroundClick={() => {
          onSelectNode(null);
        }}
        enableNodeDrag={false}
      />
    </div>
  );
});

export default CuratedGalaxy;
