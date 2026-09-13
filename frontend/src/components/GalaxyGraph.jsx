import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { forceCollide } from "d3-force";
import { wrapCanvasLabel } from "../lib/wrapLabel";

/** Galaxia lejana — densa, tipo Obsidian */
const OBSIDIAN = {
  hub: "#fff59d",
  mid: "#6ee7d8",
  outer: "#c5b4e3",
  warm: "#e8a87c",
  link: "rgba(120, 140, 200, 0.22)",
  label: "rgba(236, 240, 245, 0.92)",
};

function galaxyNodeColor(node) {
  const deg = node.degree || 0;
  if (deg > 18) return OBSIDIAN.hub;
  if (deg > 8) return OBSIDIAN.warm;
  if (deg <= 2) return OBSIDIAN.outer;
  return OBSIDIAN.mid;
}

/** Disco denso: casi todo el radio lleno, poco aire al borde. */
function layoutGalaxy(nodes) {
  const n = Math.max(nodes.length, 1);
  return nodes.map((node, i) => {
    const a = (i * 2.399963) % (Math.PI * 2);
    // Exponente bajo → más masa hacia afuera (anillo + núcleo lleno, menos huecos)
    const r = Math.pow((i + 1) / n, 0.55) * 155;
    const jitter = ((i * 17) % 7) - 3;
    return {
      ...node,
      x: Math.cos(a) * (r + jitter),
      y: Math.sin(a) * (r + jitter),
    };
  });
}

function centerGalaxy(fg, nodes, wrapEl, ms = 0) {
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
  // Más fill = menos vacío alrededor
  const zoom = Math.min(3.6, Math.max(1.2, (Math.min(w, h) * 0.42) / maxR));
  fg.centerAt(cx, cy, ms);
  fg.zoom(zoom, ms);
  return true;
}

const GalaxyGraph = forwardRef(function GalaxyGraph(
  { graph, category, onSelectNode },
  ref,
) {
  const fgRef = useRef(null);
  const wrapRef = useRef(null);
  const fitted = useRef(false);
  const zoomRef = useRef(2);

  const data = useMemo(() => {
    if (!graph) return { nodes: [], links: [] };
    return {
      nodes: layoutGalaxy(graph.nodes),
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
        const next = Math.min(12, Math.max(0.5, current * (dir > 0 ? 1.35 : 1 / 1.35)));
        zoomRef.current = next;
        fg.zoom(next, ms);
      },
    }),
    [],
  );

  const paintNode = useCallback(
    (node, ctx, globalScale) => {
      const catOk = category === "all" || node.category === category;
      const deg = node.degree || 1;
      const px = Math.min(4.2, 1.4 + Math.sqrt(deg) * 0.28);
      const r = px / globalScale;
      const color = galaxyNodeColor(node);

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = catOk ? color : "rgba(90,100,120,0.2)";
      ctx.globalAlpha = catOk ? 0.95 : 0.2;
      ctx.fill();
      ctx.globalAlpha = 1;

      // glow suave en hubs
      if (catOk && deg > 12) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.12;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (globalScale > 3.2 && catOk && deg > 16) {
        const fontSize = 9 / globalScale;
        ctx.font = `500 ${fontSize}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = OBSIDIAN.label;
        const lines = wrapCanvasLabel(ctx, node.name, 120 / globalScale, 2);
        const top = node.y + r + 2 / globalScale;
        for (let i = 0; i < lines.length; i += 1) {
          ctx.fillText(lines[i], node.x, top + i * fontSize * 1.15);
        }
      }
    },
    [category],
  );

  const linkColor = useCallback(
    (link) => {
      if (category === "all") return OBSIDIAN.link;
      const s = link.source?.id || link.source;
      const t = link.target?.id || link.target;
      const sn = data.nodes.find((n) => n.id === s);
      const tn = data.nodes.find((n) => n.id === t);
      if (sn?.category === category || tn?.category === category) {
        return "rgba(140, 170, 220, 0.35)";
      }
      return "rgba(60, 70, 90, 0.06)";
    },
    [category, data.nodes],
  );

  const fitHome = useCallback(
    (ms = 0) => {
      const fg = fgRef.current;
      if (!fg || category !== "all") return;
      if (centerGalaxy(fg, data.nodes, wrapRef.current, ms)) fitted.current = true;
    },
    [data.nodes, category],
  );

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    // Poca repulsión + centro fuerte = nube compacta, pocos huecos
    fg.d3Force("charge")?.strength(-3.5);
    fg.d3Force("link")?.distance(6)?.strength(0.95);
    fg.d3Force("center")?.strength(1.35);
    fg.d3Force("collide", forceCollide(1.05).strength(0.55));

    fitted.current = false;
    let tries = 0;
    let timer;
    const tick = () => {
      if (category !== "all") return;
      if (centerGalaxy(fg, data.nodes, wrapRef.current, 0) || tries++ > 24) {
        fitted.current = true;
        return;
      }
      timer = window.setTimeout(tick, 40);
    };
    timer = window.setTimeout(tick, 20);
    return () => window.clearTimeout(timer);
  }, [data, category]);

  useEffect(() => {
    if (!fgRef.current) return;
    if (category === "all") {
      if (fitted.current) {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        fitHome(prefersReduced ? 0 : 380);
      }
      return;
    }
    const cluster = data.nodes.filter((n) => n.category === category && n.x != null);
    if (!cluster.length) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    centerGalaxy(fgRef.current, cluster, wrapRef.current, prefersReduced ? 0 : 550);
  }, [category, data.nodes, fitHome]);

  return (
    <div className="galaxy" ref={wrapRef}>
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        backgroundColor="rgba(0,0,0,0)"
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node, color, ctx, globalScale) => {
          const r = Math.max(3.5, 1.8 + Math.sqrt(node.degree || 1) * 0.35) / globalScale;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        linkColor={linkColor}
        linkWidth={0.18}
        linkDirectionalParticles={0}
        warmupTicks={80}
        cooldownTicks={50}
        d3AlphaDecay={0.04}
        d3VelocityDecay={0.5}
        onZoom={({ k }) => {
          if (Number.isFinite(k)) zoomRef.current = k;
        }}
        onEngineStop={() => {
          if (category === "all") fitHome(0);
        }}
        onNodeClick={(node) => onSelectNode(node.id)}
        onBackgroundClick={() => onSelectNode(null)}
        enableNodeDrag={false}
      />
    </div>
  );
});

export default GalaxyGraph;
