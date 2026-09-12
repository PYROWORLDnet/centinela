/** Parte un nombre largo en líneas que caben en el viewport del grafo. */
export function wrapCanvasLabel(ctx, text, maxWidth, maxLines = 3) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const lines = [];
  let i = 0;
  while (i < words.length && lines.length < maxLines) {
    let line = words[i];
    i += 1;
    while (i < words.length) {
      const trial = `${line} ${words[i]}`;
      if (ctx.measureText(trial).width > maxWidth) break;
      line = trial;
      i += 1;
    }
    const last = lines.length === maxLines - 1 && i < words.length;
    if (last) {
      while (line.length > 1 && ctx.measureText(`${line}…`).width > maxWidth) {
        line = line.slice(0, -1).trimEnd();
      }
      line = `${line}…`;
    }
    lines.push(line);
  }
  return lines;
}
