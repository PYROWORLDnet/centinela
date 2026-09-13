import { THEMES, THEME_COLORS, getTheme } from "./themes.js";
import { PENSIONES_NODES, PENSIONES_EDGES } from "./pensiones.js";
import { PARTIDOS_NODES, PARTIDOS_EDGES } from "./partidos.js";
import { GASOLINA_NODES, GASOLINA_EDGES } from "./gasolina.js";
import { getPensionesTour } from "./pensionesTour.js";
import { PARTIDOS_TOUR } from "./partidosTour.js";
import { GASOLINA_TOUR } from "./gasolinaTour.js";

const DATASETS = {
  pensiones: { nodes: PENSIONES_NODES, edges: PENSIONES_EDGES },
  partidos: { nodes: PARTIDOS_NODES, edges: PARTIDOS_EDGES },
  gasolina: { nodes: GASOLINA_NODES, edges: GASOLINA_EDGES },
};

const TOURS = {
  pensiones: getPensionesTour(),
  partidos: PARTIDOS_TOUR,
  gasolina: GASOLINA_TOUR,
};

function degreeMap(edges) {
  const d = new Map();
  for (const e of edges) {
    d.set(e.source, (d.get(e.source) || 0) + 1);
    d.set(e.target, (d.get(e.target) || 0) + 1);
  }
  return d;
}

function mapNode(n, degree = 1) {
  return {
    id: n.id,
    name: n.name,
    category: n.kind,
    kind: n.kind,
    role: n.role || null,
    summary: n.summary || null,
    mechanism: n.mechanism || null,
    amount: n.amount ?? null,
    weight: n.weight ?? 40,
    degree,
    themes: n.themes || [],
    sourceRef: n.source || null,
    extra: {
      source: n.source || null,
      kind: n.kind,
      themes: n.themes || [],
      mechanism: n.mechanism || null,
      curated: true,
    },
  };
}

export function listThemes() {
  return THEMES.map((t) => ({
    id: t.id,
    label: t.label,
    ready: t.ready,
    pills: t.pills,
  }));
}

export function getCuratedGraph(themeId, pill = "all") {
  const theme = getTheme(themeId);
  if (!theme) return null;
  if (!theme.ready) {
    return {
      nodes: [],
      links: [],
      meta: {
        theme: themeId,
        label: theme.label,
        ready: false,
        message: "Tema en preparación",
        nodeCount: 0,
        linkCount: 0,
      },
    };
  }

  const ds = DATASETS[themeId];
  if (!ds) return null;

  const deg = degreeMap(ds.edges);
  let nodes = ds.nodes.map((n) => mapNode(n, deg.get(n.id) || 1));
  if (pill && pill !== "all") {
    nodes = nodes.filter((n) => n.kind === pill);
  }
  const keep = new Set(nodes.map((n) => n.id));
  if (pill && pill !== "all") {
    for (const e of ds.edges) {
      if (keep.has(e.source) || keep.has(e.target)) {
        keep.add(e.source);
        keep.add(e.target);
      }
    }
    nodes = ds.nodes.filter((n) => keep.has(n.id)).map((n) => mapNode(n, deg.get(n.id) || 1));
  }

  const links = ds.edges
    .filter((e) => keep.has(e.source) && keep.has(e.target))
    .map((e) => ({
      source: e.source,
      target: e.target,
      type: e.type,
      note: e.note || null,
      amount: e.amount ?? null,
      sourceRef: e.sourceRef || null,
    }));

  return {
    nodes,
    links,
    meta: {
      theme: themeId,
      label: theme.label,
      ready: true,
      curated: true,
      pill,
      nodeCount: nodes.length,
      linkCount: links.length,
      colors: THEME_COLORS,
    },
  };
}

/** Panel: fusiona el mismo id a través de temas (ej. Roryk → Crecer + PATSA). */
export function getCuratedNode(id) {
  let self = null;
  const themesHit = [];
  const connections = [];
  const seen = new Set();

  for (const [themeId, ds] of Object.entries(DATASETS)) {
    const raw = ds.nodes.find((n) => n.id === id);
    if (!raw) continue;
    themesHit.push(themeId);
    const deg = degreeMap(ds.edges);
    const mapped = mapNode(raw, deg.get(id) || 1);
    if (!self) {
      self = mapped;
    } else {
      const themes = Array.from(new Set([...(self.themes || []), ...(mapped.themes || [])]));
      self = {
        ...self,
        ...mapped,
        themes,
        summary: mapped.summary || self.summary,
        mechanism: mapped.mechanism || self.mechanism,
        role: mapped.role || self.role,
        sourceRef: mapped.sourceRef || self.sourceRef,
        extra: {
          ...self.extra,
          ...mapped.extra,
          themes,
          mechanism: mapped.mechanism || self.mechanism,
        },
      };
    }

    for (const e of ds.edges) {
      let otherId = null;
      let direction = null;
      if (e.source === id) {
        otherId = e.target;
        direction = "out";
      } else if (e.target === id) {
        otherId = e.source;
        direction = "in";
      } else continue;

      const key = `${direction}|${e.type}|${otherId}`;
      if (seen.has(key)) continue;
      seen.add(key);

      let other = ds.nodes.find((n) => n.id === otherId);
      if (!other) {
        for (const otherDs of Object.values(DATASETS)) {
          other = otherDs.nodes.find((n) => n.id === otherId);
          if (other) break;
        }
      }
      if (!other) continue;

      connections.push({
        type: e.type,
        direction,
        note: e.note || null,
        amount: e.amount ?? null,
        sourceRef: e.sourceRef || self.sourceRef,
        demo: false,
        theme: themeId,
        node: {
          id: other.id,
          name: other.name,
          category: other.kind,
          role: other.role,
        },
      });
    }
  }

  if (!self) return null;
  return {
    ...self,
    theme: themesHit[0],
    themes: Array.from(new Set([...(self.themes || []), ...themesHit])),
    connections,
  };
}

export function getCuratedTour(themeId) {
  const tour = TOURS[themeId] || null;
  if (!tour) return null;
  return {
    id: tour.id,
    theme: tour.theme,
    title: tour.title,
    epilogue: tour.epilogue,
    entry: tour.entry || null,
    stepCount: tour.steps.length,
    steps: tour.steps,
  };
}

export function searchCurated(q, themeId = null) {
  const query = String(q || "").trim().toLowerCase();
  if (!query) return [];
  const out = [];
  const seen = new Set();
  for (const [tid, ds] of Object.entries(DATASETS)) {
    if (themeId && tid !== themeId) continue;
    for (const n of ds.nodes) {
      if (seen.has(n.id)) continue;
      if (
        n.name.toLowerCase().includes(query) ||
        (n.role && n.role.toLowerCase().includes(query)) ||
        (n.summary && n.summary.toLowerCase().includes(query))
      ) {
        seen.add(n.id);
        out.push({
          id: n.id,
          name: n.name,
          category: n.kind,
          role: n.role,
          theme: tid,
        });
      }
    }
  }
  return out.slice(0, 12);
}

export { THEME_COLORS };
