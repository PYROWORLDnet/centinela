import { useCallback, useEffect, useMemo, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { wrapCanvasLabel } from "../lib/wrapLabel";

/**
 * Grafo pequeño y legible: pocos nodos, etiquetas siempre visibles.
 * Se usa en las vistas de caso / expediente.
 */
export default function FocusGraph({
  data,
  palette,
  seedIds,
  selectedId,
  onSelectNode,
  linkColor = "rgba(140, 170, 200, 0.35)",
  weighted = false,
}) {
  const fgRef = useRef(null);

  const seed = useMemo(() => new Set(seedIds || []), [seedIds]);

  const graphData = useMemo(() => {
    if (!data) return { nodes: [], links: [] };
    return {
      nodes: data.nodes.map((n) => ({ ...n })),
      links: data.links.map((l) => ({ ...l })),
    };
  }, [data]);

  const paintNode = useCallback(
    (node, ctx, globalScale) => {
      const isSeed = seed.has(node.id);
      const isSelected = node.id === selectedId;
      const px = isSeed ? 6.5 : 4;
      const r = (isSelected ? px * 1.35 : px) / globalScale;
      const color = palette[node.category] || "#8aa";

      if (isSelected || isSeed) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.1, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = isSelected ? 0.2 : 0.1;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (isSelected) {
        ctx.lineWidth = 1.4 / globalScale;
        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.stroke();
      }

      const fontSize = 11 / globalScale;
      ctx.font = `${isSeed ? 600 : 500} ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = isSeed ? "rgba(240,244,250,0.95)" : "rgba(200,210,225,0.7)";
      const lines = wrapCanvasLabel(ctx, node.name, 160 / globalScale, isSelected ? 4 : 3);
      const lineH = fontSize * 1.2;
      const top = node.y + r + 3 / globalScale;
      for (let i = 0; i < lines.length; i += 1) {
        ctx.fillText(lines[i], node.x, top + i * lineH);
      }
    },
    [palette, seed, selectedId],
  );

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force("charge")?.strength(-320);
    fg.d3Force("link")?.distance(90);
  }, [graphData]);

  useEffect(() => {
    const t = setTimeout(() => fgRef.current?.zoomToFit(600, 90), 600);
    return () => clearTimeout(t);
  }, [graphData]);

  return (
    <div className="focusgraph">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="rgba(0,0,0,0)"
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node, color, ctx, globalScale) => {
          const r = 9 / globalScale;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        linkColor={() => linkColor}
        linkWidth={(l) => (weighted ? 0.5 + (l.weight || 0.2) * 3 : 0.8)}
        linkLabel={(l) => l.type?.replaceAll("_", " ")}
        cooldownTicks={120}
        onNodeClick={(n) => onSelectNode?.(n.id)}
        onBackgroundClick={() => onSelectNode?.(null)}
      />
    </div>
  );
}
