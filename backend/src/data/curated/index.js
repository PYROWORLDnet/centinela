import { THEMES, THEME_COLORS, getTheme } from "./themes.js";
import { TODO_NODES, TODO_EDGES } from "./todo.js";
import { PENSIONES_NODES, PENSIONES_EDGES } from "./pensiones.js";
import { PARTIDOS_NODES, PARTIDOS_EDGES } from "./partidos.js";
import { GASOLINA_NODES, GASOLINA_EDGES } from "./gasolina.js";
import { ELECTRICIDAD_NODES, ELECTRICIDAD_EDGES } from "./electricidad.js";
import { DEUDA_NODES, DEUDA_EDGES } from "./deuda.js";
import { FAMILIAS_NODES, FAMILIAS_EDGES } from "./familias.js";
import { MEDIOS_NODES, MEDIOS_EDGES } from "./medios.js";
import { BANCA_NODES, BANCA_EDGES } from "./banca.js";
import { ADUANA_NODES, ADUANA_EDGES } from "./aduana.js";
import { CONSTRUCCION_NODES, CONSTRUCCION_EDGES } from "./construccion.js";
import { MIGRACION_NODES, MIGRACION_EDGES } from "./migracion.js";
import { MINERIA_NODES, MINERIA_EDGES } from "./mineria.js";
import { TODO_TOUR } from "./todoTour.js";
import { getPensionesTour } from "./pensionesTour.js";
import { PARTIDOS_TOUR } from "./partidosTour.js";
import { GASOLINA_TOUR } from "./gasolinaTour.js";
import { ELECTRICIDAD_TOUR } from "./electricidadTour.js";
import { DEUDA_TOUR } from "./deudaTour.js";
import { FAMILIAS_TOUR } from "./familiasTour.js";
import { MEDIOS_TOUR } from "./mediosTour.js";
import { BANCA_TOUR } from "./bancaTour.js";
import { ADUANA_TOUR } from "./aduanaTour.js";
import { CONSTRUCCION_TOUR } from "./construccionTour.js";
import { MIGRACION_TOUR } from "./migracionTour.js";
import { MINERIA_TOUR } from "./mineriaTour.js";
import { CUPULA_ID, CUPULA_NODE, queryHitsCupula } from "./cupula.js";

const DATASETS = {
  todo: { nodes: TODO_NODES, edges: TODO_EDGES },
  pensiones: { nodes: PENSIONES_NODES, edges: PENSIONES_EDGES },
  partidos: { nodes: PARTIDOS_NODES, edges: PARTIDOS_EDGES },
  gasolina: { nodes: GASOLINA_NODES, edges: GASOLINA_EDGES },
  electricidad: { nodes: ELECTRICIDAD_NODES, edges: ELECTRICIDAD_EDGES },
  deuda: { nodes: DEUDA_NODES, edges: DEUDA_EDGES },
  familias: { nodes: FAMILIAS_NODES, edges: FAMILIAS_EDGES },
  medios: { nodes: MEDIOS_NODES, edges: MEDIOS_EDGES },
  banca: { nodes: BANCA_NODES, edges: BANCA_EDGES },
  aduana: { nodes: ADUANA_NODES, edges: ADUANA_EDGES },
  construccion: { nodes: CONSTRUCCION_NODES, edges: CONSTRUCCION_EDGES },
  migracion: { nodes: MIGRACION_NODES, edges: MIGRACION_EDGES },
  mineria: { nodes: MINERIA_NODES, edges: MINERIA_EDGES },
};

const TOURS = {
  todo: TODO_TOUR,
  pensiones: getPensionesTour(),
  partidos: PARTIDOS_TOUR,
  gasolina: GASOLINA_TOUR,
  electricidad: ELECTRICIDAD_TOUR,
  deuda: DEUDA_TOUR,
  familias: FAMILIAS_TOUR,
  medios: MEDIOS_TOUR,
  banca: BANCA_TOUR,
  aduana: ADUANA_TOUR,
  construccion: CONSTRUCCION_TOUR,
  migracion: MIGRACION_TOUR,
  mineria: MINERIA_TOUR,
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

function allNodeIndex() {
  const map = new Map();
  for (const [tid, ds] of Object.entries(DATASETS)) {
    for (const n of ds.nodes) {
      if (!map.has(n.id)) {
        map.set(n.id, { ...n, themes: [...(n.themes || []), tid] });
      } else {
        const prev = map.get(n.id);
        const themes = Array.from(new Set([...(prev.themes || []), ...(n.themes || []), tid]));
        const richer =
          (n.summary || "").length >= (prev.summary || "").length ? { ...prev, ...n, themes } : { ...n, ...prev, themes };
        map.set(n.id, richer);
      }
    }
  }
  if (!map.has(CUPULA_ID)) {
    map.set(CUPULA_ID, { ...CUPULA_NODE });
  }
  return map;
}

function allEdges() {
  const out = [];
  const seen = new Set();
  for (const [tid, ds] of Object.entries(DATASETS)) {
    for (const e of ds.edges) {
      const key = `${e.source}|${e.type}|${e.target}|${e.note || ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ ...e, theme: tid });
    }
  }
  return out;
}

export function listThemes() {
  return THEMES.map((t) => ({
    id: t.id,
    label: t.label,
    ready: t.ready,
    pills: t.pills,
  }));
}

/**
 * Grafo del tema + 1 hop desde otras capas (una sola red; el tema es la ruta de entrada).
 * Tema "todo": red completa — el roadmap visual de todo Centinela.
 */
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

  const nodeIndex = allNodeIndex();
  const edges = allEdges();

  const seed = new Set(ds.nodes.map((n) => n.id));
  const keep = new Set(seed);

  if (themeId === "todo") {
    // Plano completo: todas las capas
    for (const id of nodeIndex.keys()) keep.add(id);
  } else {
    // 1 hop cross-theme: vecinos de nodos del tema en toda la red.
    // La Cúpula no se expande aquí: si lo hiciera, arrastraría todas las casas a cada tema.
    const expandCupula = themeId === "familias";
    for (const e of edges) {
      const touchesCupula = e.source === CUPULA_ID || e.target === CUPULA_ID;
      if (touchesCupula && !expandCupula) continue;
      if (seed.has(e.source) || seed.has(e.target)) {
        keep.add(e.source);
        keep.add(e.target);
      }
    }
  }
  keep.add(CUPULA_ID);

  let nodes = [...keep]
    .map((id) => nodeIndex.get(id))
    .filter(Boolean)
    .map((n) => mapNode(n, 1));

  if (pill && pill !== "all") {
    const filtered = nodes.filter((n) => n.kind === pill);
    const keepPill = new Set(filtered.map((n) => n.id));
    for (const e of edges) {
      if (keepPill.has(e.source) || keepPill.has(e.target)) {
        keepPill.add(e.source);
        keepPill.add(e.target);
      }
    }
    nodes = [...keepPill]
      .map((id) => nodeIndex.get(id))
      .filter(Boolean)
      .map((n) => mapNode(n, 1));
  }

  const keepFinal = new Set(nodes.map((n) => n.id));
  const deg = degreeMap(edges.filter((e) => keepFinal.has(e.source) && keepFinal.has(e.target)));
  nodes = nodes.map((n) => ({ ...n, degree: deg.get(n.id) || 1 }));

  const links = edges
    .filter((e) => keepFinal.has(e.source) && keepFinal.has(e.target))
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

/** Panel: fusiona el mismo id a través de temas (ej. Roryk → Crecer + PATSA + cacao). */
export function getCuratedNode(id) {
  let self = null;
  const themesHit = [];
  const connections = [];
  const seen = new Set();
  const nodeIndex = allNodeIndex();

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

      const other = nodeIndex.get(otherId) || ds.nodes.find((n) => n.id === otherId);
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

function nodeMatchesQuery(n, query) {
  if (!n) return false;
  if (n.name && n.name.toLowerCase().includes(query)) return true;
  if (n.role && n.role.toLowerCase().includes(query)) return true;
  if (n.summary && n.summary.toLowerCase().includes(query)) return true;
  if (Array.isArray(n.aliases) && n.aliases.some((a) => String(a).toLowerCase().includes(query))) {
    return true;
  }
  return false;
}

export function searchCurated(q, themeId = null) {
  const query = String(q || "").trim().toLowerCase();
  if (!query) return [];
  const out = [];
  const seen = new Set();
  // Búsqueda global por defecto (themeId se ignora salvo filtro explícito raro)
  for (const [tid, ds] of Object.entries(DATASETS)) {
    if (themeId && tid !== themeId) continue;
    for (const n of ds.nodes) {
      if (seen.has(n.id)) continue;
      if (nodeMatchesQuery(n, query)) {
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

  // La Cúpula no es un tema: sale al buscar cualquiera de las casas que agrupa.
  if (!seen.has(CUPULA_ID) && (queryHitsCupula(query) || nodeMatchesQuery(CUPULA_NODE, query))) {
    out.unshift({
      id: CUPULA_NODE.id,
      name: CUPULA_NODE.name,
      category: CUPULA_NODE.kind,
      role: CUPULA_NODE.role,
      theme: "familias",
    });
  } else if (seen.has(CUPULA_ID) && queryHitsCupula(query)) {
    const idx = out.findIndex((r) => r.id === CUPULA_ID);
    if (idx > 0) {
      const [hit] = out.splice(idx, 1);
      out.unshift(hit);
    }
  }

  return out.slice(0, 12);
}

export { THEME_COLORS };
