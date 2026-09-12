import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { forceCollide } from "d3-force";
import { wrapCanvasLabel } from "../lib/wrapLabel";

/** Palette fiel a Obsidian Graph view */
const OBSIDIAN = {
  hub: "#fff59d",
  mid: "#6ee7d8",
  outer: "#c5b4e3",
  link: "rgba(94, 220, 200, 0.42)",
  linkHot: "rgba(180, 255, 235, 0.85)",
  linkDim: "rgba(80, 100, 110, 0.04)",
  label: "rgba(236, 240, 245, 0.95)",
};

function nodeColor(node) {
  const deg = node.degree || 0;
  if (deg > 20) return OBSIDIAN.hub;
  if (deg <= 2) return OBSIDIAN.outer;
  return OBSIDIAN.mid;
}

/** Centra la nube en el medio del viewport y acerca sin desplazar. */
function centerGalaxy(fg, nodes, wrapEl, ms = 0) {
  if (!fg || !nodes?.length) return false;
  let cx = 0;
  let cy = 0;
  let n = 0;
  let maxR = 1;
  for (const node of nodes) {
    if (node.x == null || node.y == null) continue;
    cx += node.x;
    cy += node.y;
    n += 1;
  }
  if (!n) return false;
  cx /= n;
  cy /= n;
  for (const node of nodes) {
    if (node.x == null || node.y == null) continue;
    maxR = Math.max(maxR, Math.hypot(node.x - cx, node.y - cy));
  }

  const w = wrapEl?.clientWidth || window.innerWidth;
  const h = wrapEl?.clientHeight || window.innerHeight;
  const zoom = Math.min(6.5, Math.max(1.8, (Math.min(w, h) * 0.39) / maxR));
  fg.centerAt(cx, cy, ms);
  fg.zoom(zoom, ms);
  return true;
}

const GalaxyGraph = forwardRef(function GalaxyGraph(
  { graph, focusId, category, onSelectNode, neighborIds },
  ref,
) {
  const fgRef = useRef(null);
  const wrapRef = useRef(null);
  const fitted = useRef(false);
  const zoomRef = useRef(2);

  const data = useMemo(() => {
    if (!graph) return { nodes: [], links: [] };
    const seeded = graph.nodes.map((n, i) => {
      const a = (i * 2.399963) % (Math.PI * 2);
      const r = Math.sqrt((i + 1) / graph.nodes.length) * 170;
      return {
        ...n,
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
      };
    });
    return {
      nodes: seeded,
      links: graph.links.map((l) => ({ ...l })),
    };
  }, [graph]);

  useImperativeHandle(
    ref,
    () => ({
      zoomBy(dir) {
        const fg = fgRef.current;
        if (!fg) return;
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const ms = prefersReduced ? 0 : 180;
        const current = Number.isFinite(zoomRef.current) && zoomRef.current > 0 ? zoomRef.current : 2;
        const next = Math.min(12, Math.max(0.4, current * (dir > 0 ? 1.4 : 1 / 1.4)));
        zoomRef.current = next;
        fg.zoom(next, ms);
      },
    }),
    [],
  );

  const paintNode = useCallback(
    (node, ctx, globalScale) => {
      const isFocus = focusId && node.id === focusId;
      const inNeighborhood =
        !focusId ||
        node.id === focusId ||
        (neighborIds && neighborIds.has(node.id));
      const catOk = category === "all" || node.category === category;
      const active = catOk && inNeighborhood;

      const deg = node.degree || 1;
      const px = Math.min(5.5, 2.1 + Math.sqrt(deg) * 0.34);
      const r = (isFocus ? px * 1.7 : px) / globalScale;
      const color = nodeColor(node);

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = active ? color : "rgba(120,130,140,0.14)";
      ctx.globalAlpha = active ? 1 : 0.18;
      ctx.fill();
      ctx.globalAlpha = 1;

      const showLabel = isFocus || (globalScale > 2.4 && active && deg > 14);
      if (showLabel) {
        const fontSize = (isFocus ? 12 : 10) / globalScale;
        ctx.font = `${isFocus ? 600 : 500} ${fontSize}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = OBSIDIAN.label;
        const maxWidth = (isFocus ? 200 : 140) / globalScale;
        const lines = wrapCanvasLabel(ctx, node.name, maxWidth, isFocus ? 4 : 2);
        const lineH = fontSize * 1.2;
        const top = node.y + r + 2 / globalScale;
        for (let i = 0; i < lines.length; i += 1) {
          ctx.fillText(lines[i], node.x, top + i * lineH);
        }
      }
    },
    [focusId, neighborIds, category],
  );

  const linkColor = useCallback(
    (link) => {
      const s = link.source?.id || link.source;
      const t = link.target?.id || link.target;
      if (focusId) {
        const hot =
          s === focusId ||
          t === focusId ||
          (neighborIds?.has(s) && neighborIds?.has(t));
        return hot ? OBSIDIAN.linkHot : OBSIDIAN.linkDim;
      }
      if (category !== "all") {
        const sn = data.nodes.find((n) => n.id === s);
        const tn = data.nodes.find((n) => n.id === t);
        if (sn?.category === category || tn?.category === category) return OBSIDIAN.link;
        return OBSIDIAN.linkDim;
      }
      return OBSIDIAN.link;
    },
    [focusId, neighborIds, category, data.nodes],
  );

  const goToFocus = useCallback(() => {
    const fg = fgRef.current;
    if (!focusId || !fg) return false;
    const node = data.nodes.find((n) => n.id === focusId);
    if (!node || node.x == null || node.y == null) return false;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = prefersReduced ? 0 : 650;
    const panelShift = Math.min(160, window.innerWidth * 0.12);
    const zoom = data.nodes.length <= 8 ? 4.8 : data.nodes.length <= 60 ? 5.2 : 6.5;
    zoomRef.current = zoom;
    fg.centerAt(node.x + panelShift / zoom, node.y, ms);
    fg.zoom(zoom, ms);
    return true;
  }, [focusId, data.nodes]);

  const fitHome = useCallback(
    (ms = 0) => {
      const fg = fgRef.current;
      if (!fg || focusId || category !== "all") return;
      if (centerGalaxy(fg, data.nodes, wrapRef.current, ms)) {
        fitted.current = true;
      }
    },
    [data.nodes, focusId, category],
  );

  useEffect(() => {
    if (!focusId) return;
    let tries = 0;
    const tick = () => {
      if (goToFocus() || tries++ > 12) return;
      timer = window.setTimeout(tick, 140);
    };
    let timer = window.setTimeout(tick, 40);
    return () => window.clearTimeout(timer);
  }, [focusId, data.nodes, goToFocus]);

  useEffect(() => {
    if (focusId || !fgRef.current) return;
    if (category === "all") {
      if (fitted.current) {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        fitHome(prefersReduced ? 0 : 420);
      }
      return;
    }
    const cluster = data.nodes.filter((n) => n.category === category && n.x != null);
    if (!cluster.length) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    centerGalaxy(fgRef.current, cluster, wrapRef.current, prefersReduced ? 0 : 650);
  }, [category, focusId, data.nodes, fitHome]);

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force("charge")?.strength(-7);
    fg.d3Force("link")?.distance(9)?.strength(0.85);
    fg.d3Force("center")?.strength(1.15);
    fg.d3Force("collide", forceCollide(1.55).strength(0.85));

    fitted.current = false;
    let tries = 0;
    const tick = () => {
      if (focusId || category !== "all") return;
      if (centerGalaxy(fg, data.nodes, wrapRef.current, 0) || tries++ > 20) {
        fitted.current = true;
        return;
      }
      timer = window.setTimeout(tick, 50);
    };
    let timer = window.setTimeout(tick, 30);
    return () => window.clearTimeout(timer);
  }, [data, focusId, category]);

  return (
    <div className="galaxy" ref={wrapRef}>
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        backgroundColor="#1e1e1e"
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node, color, ctx, globalScale) => {
          const r = Math.max(4, 2.4 + Math.sqrt(node.degree || 1) * 0.4) / globalScale;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        linkColor={linkColor}
        linkWidth={(link) => {
          const s = link.source?.id || link.source;
          const t = link.target?.id || link.target;
          if (focusId && (s === focusId || t === focusId)) return 0.9;
          return 0.22;
        }}
        linkDirectionalParticles={0}
        warmupTicks={60}
        cooldownTicks={40}
        d3AlphaDecay={0.05}
        d3VelocityDecay={0.45}
        onZoom={({ k }) => {
          if (Number.isFinite(k)) zoomRef.current = k;
        }}
        onEngineStop={() => {
          if (focusId) {
            goToFocus();
            return;
          }
          if (category === "all") {
            fitHome(0);
          }
        }}
        onNodeClick={(node) => onSelectNode(node.id)}
        onBackgroundClick={() => onSelectNode(null)}
        enableNodeDrag={true}
      />
    </div>
  );
});

export default GalaxyGraph;
