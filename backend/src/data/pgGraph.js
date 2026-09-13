import { getPool } from "../db/pool.js";
import { REAL_NODES } from "./publicSeed.js";

export function hasDatabase() {
  return Boolean(getPool());
}

const HUB_IDS = REAL_NODES.filter((n) => n.hub).map((n) => n.id);

function normalizePortalUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  // CSV a veces trae //Public → limpia dobles slash sin tocar https://
  return trimmed.replace(/^(https?:\/\/)(.*)$/i, (_, proto, rest) => proto + rest.replace(/\/{2,}/g, "/"));
}

function asSource(extra) {
  if (!extra || typeof extra !== "object") return null;
  const deep = normalizePortalUrl(extra.url);
  const isPortal = deep && /comprasdominicana\.gob\.do/i.test(deep);
  const s = extra.source && typeof extra.source === "object" ? extra.source : null;
  const url = isPortal ? deep : normalizePortalUrl(s?.url);
  const label = isPortal
    ? "Compras Dominicana — ficha del proceso"
    : s?.label || null;
  if (!url || !label) return null;
  if (/github\.com|demostraci[oó]n|centinela$/i.test(`${label} ${url}`)) return null;
  // Dataset genérico de datos.gob.do no muestra el contrato específico.
  if (/datos\.gob\.do\/dataset/i.test(url) && !isPortal) return null;
  return { label, url };
}

function mapNodeRow(row) {
  const extra = row.extra && typeof row.extra === "object" ? row.extra : {};
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    role: row.role,
    rnc: row.rnc,
    summary: row.summary,
    salary: row.salary != null ? Number(row.salary) : null,
    netWorth: row.net_worth != null ? Number(row.net_worth) : null,
    netWorthDelta: row.net_worth_delta != null ? Number(row.net_worth_delta) : null,
    amount: row.amount != null ? Number(row.amount) : null,
    code: row.code || null,
    fecha: extra.fecha || null,
    degree: row.degree != null ? Number(row.degree) : 1,
    extra,
    sourceRef: asSource(extra),
  };
}

export async function searchNodes(query) {
  const pool = getPool();
  const q = query.trim();
  if (!pool || !q) return [];
  const like = `%${q}%`;
  const { rows } = await pool.query(
    `SELECT id, name, category, role, rnc, summary
     FROM nodes
     WHERE name ILIKE $1
        OR coalesce(rnc, '') ILIKE $1
        OR EXISTS (SELECT 1 FROM unnest(aliases) a WHERE a ILIKE $1)
     ORDER BY
       CASE
         WHEN lower(name) = lower($2) THEN 0
         WHEN EXISTS (SELECT 1 FROM unnest(aliases) a WHERE lower(a) = lower($2)) THEN 1
         WHEN category = 'prestamo' THEN 2
         WHEN category IN ('institucion', 'caso') THEN 3
         ELSE 4
       END,
       length(name)
     LIMIT 12`,
    [like, q],
  );
  return rows;
}

/** Cache en memoria: la DB tiene ~1.4M nodos / ~2M edges; no se puede rankear por degree global en cada request. */
let galaxyCache = null;
let galaxyCacheAt = 0;
const GALAXY_TTL_MS = 10 * 60 * 1000;
const GALAXY_CACHE_VER = 2; // bump al cambiar tamaño/densidad
let galaxyCacheVer = 0;

/**
 * Galaxia real liviana: hubs + top por categoría (montos / patrimonio), sin escanear 2M edges.
 * UI equal: panel/browse siguen en /api/category y /api/nodes.
 */
export async function getGraph(maxNodes = 700) {
  const pool = getPool();
  if (!pool) return null;

  if (
    galaxyCache &&
    galaxyCacheVer === GALAXY_CACHE_VER &&
    Date.now() - galaxyCacheAt < GALAXY_TTL_MS
  ) {
    return galaxyCache;
  }

  const { rows: picked } = await pool.query(
    `SELECT id FROM (
       (SELECT id FROM nodes WHERE category = 'prestamo'
         ORDER BY amount DESC NULLS LAST LIMIT 90)
       UNION ALL
       (SELECT id FROM nodes
         WHERE category = 'persona' AND (net_worth IS NOT NULL OR salary IS NOT NULL)
         ORDER BY COALESCE(net_worth, 0) DESC, COALESCE(salary, 0) DESC LIMIT 140)
       UNION ALL
       (SELECT id FROM nodes WHERE category = 'institucion'
         ORDER BY name LIMIT 60)
       UNION ALL
       (SELECT id FROM nodes WHERE category = 'empresa' AND rnc IS NOT NULL
         ORDER BY name LIMIT 120)
       UNION ALL
       (SELECT id FROM nodes WHERE category = 'contrato'
         ORDER BY COALESCE(extra->>'fecha', '') DESC NULLS LAST,
                  amount DESC NULLS LAST LIMIT 80)
       UNION ALL
       (SELECT id FROM nodes WHERE category = 'caso' LIMIT 20)
       UNION ALL
       (SELECT unnest($1::text[]))
     ) u`,
    [HUB_IDS],
  );

  let keep = [...new Set(picked.map((r) => r.id))];
  if (keep.length > maxNodes) keep = keep.slice(0, maxNodes);
  if (!keep.length) {
    return {
      nodes: [],
      links: [],
      meta: { demo: false, label: "Sin datos", nodeCount: 0, linkCount: 0 },
    };
  }

  const [{ rows: nodeRows }, { rows: degRows }, { rows: linkRows }] = await Promise.all([
    pool.query(
      `SELECT id, name, category, role, rnc, summary, extra,
              salary, net_worth, net_worth_delta, amount, code
       FROM nodes WHERE id = ANY($1)`,
      [keep],
    ),
    pool.query(
      `SELECT id, COUNT(*)::int AS degree FROM (
         SELECT source_id AS id FROM edges WHERE source_id = ANY($1)
         UNION ALL
         SELECT target_id AS id FROM edges WHERE target_id = ANY($1)
       ) e GROUP BY id`,
      [keep],
    ),
    pool.query(
      `SELECT source_id AS source, target_id AS target, type, note
       FROM edges
       WHERE source_id = ANY($1) AND target_id = ANY($1)
       LIMIT 2500`,
      [keep],
    ),
  ]);

  const degree = new Map(degRows.map((r) => [r.id, Number(r.degree)]));
  const nodes = nodeRows.map((row) =>
    mapNodeRow({ ...row, degree: degree.get(row.id) || 1 }),
  );

  const graph = {
    nodes,
    links: linkRows,
    meta: {
      demo: false,
      label: "Datos oficiales",
      nodeCount: nodes.length,
      linkCount: linkRows.length,
    },
  };
  galaxyCache = graph;
  galaxyCacheAt = Date.now();
  galaxyCacheVer = GALAXY_CACHE_VER;
  return graph;
}

export async function getNode(id) {
  const pool = getPool();
  if (!pool) return null;
  const { rows } = await pool.query(`SELECT * FROM nodes WHERE id = $1`, [id]);
  const row = rows[0];
  if (!row) return null;

  const { rows: links } = await pool.query(
    `SELECT e.type, e.note,
            CASE WHEN e.source_id = $1 THEN e.target_id ELSE e.source_id END AS other_id,
            CASE WHEN e.source_id = $1 THEN 'out' ELSE 'in' END AS direction
     FROM edges e
     WHERE e.source_id = $1 OR e.target_id = $1
     ORDER BY e.id DESC
     LIMIT 40`,
    [id],
  );
  const otherIds = links.map((l) => l.other_id);
  const others = otherIds.length
    ? (
        await pool.query(
          `SELECT id, name, category, role, extra FROM nodes WHERE id = ANY($1)`,
          [otherIds],
        )
      ).rows
    : [];
  const byId = new Map(others.map((n) => [n.id, n]));
  const self = mapNodeRow(row);

  // Adjudicaciones: si no tienen URL propia, usa la ficha del proceso vinculado.
  if (!asSource(self.extra)) {
    const codigo = self.extra?.codigoProceso;
    let portal = null;
    if (codigo) {
      const procId = `proc-${String(codigo)
        .trim()
        .replace(/[^A-Za-z0-9._-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 96)}`;
      const { rows: procs } = await pool.query(
        `SELECT extra FROM nodes
         WHERE id = $1
            OR (id LIKE 'proc-%' AND extra->>'codigoProceso' = $2)
         LIMIT 1`,
        [procId, codigo],
      );
      portal = procs[0]?.extra;
    }
    if (!portal) {
      const linkedProc = others.find(
        (n) =>
          String(n.id || "").startsWith("proc-") &&
          n.extra?.url &&
          /comprasdominicana/i.test(n.extra.url),
      );
      portal = linkedProc?.extra;
    }
    if (portal?.url && /comprasdominicana/i.test(portal.url)) {
      self.extra = { ...self.extra, url: portal.url };
      self.sourceRef = asSource(self.extra);
    }
  }

  const selfSource = self.sourceRef;

  return {
    ...self,
    connections: links.map((l) => {
      const other = byId.get(l.other_id) || { id: l.other_id };
      const otherExtra = other.extra && typeof other.extra === "object" ? other.extra : {};
      const sourceRef = asSource(otherExtra) || selfSource;
      return {
        type: l.type,
        direction: l.direction,
        note: l.note,
        sourceRef,
        demo: false,
        node: {
          id: other.id,
          name: other.name,
          category: other.category,
          role: other.role,
        },
      };
    }),
  };
}

export async function listByCategory(category, limit = 40, { year } = {}) {
  const pool = getPool();
  if (!pool || !category || category === "all") return [];

  const yearFilter =
    year && /^\d{4}$/.test(String(year)) ? String(year) : null;

  let orderBy = "n.name";
  if (category === "contrato") {
    orderBy = `COALESCE(n.extra->>'fecha', '') DESC NULLS LAST,
               COALESCE(n.amount, 0) DESC,
               n.name`;
  } else if (category === "prestamo") {
    orderBy = "COALESCE(n.amount, 0) DESC, n.name";
  } else if (category === "persona") {
    orderBy = "COALESCE(n.net_worth, 0) DESC, COALESCE(n.salary, 0) DESC, n.name";
  }

  const params = [category, limit];
  let yearSql = "";
  if (yearFilter && category === "contrato") {
    params.push(yearFilter);
    yearSql = ` AND left(COALESCE(n.extra->>'fecha', ''), 4) = $${params.length}`;
  }

  const { rows } = await pool.query(
    `SELECT n.id, n.name, n.category, n.role, n.summary, n.amount, n.salary, n.net_worth,
            n.extra->>'fecha' AS fecha,
            n.extra->>'url' AS url
     FROM nodes n
     WHERE n.category = $1${yearSql}
     ORDER BY ${orderBy}
     LIMIT $2`,
    params,
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    role: r.role,
    summary: r.summary,
    amount: r.amount != null ? Number(r.amount) : null,
    salary: r.salary != null ? Number(r.salary) : null,
    netWorth: r.net_worth != null ? Number(r.net_worth) : null,
    fecha: r.fecha || null,
    degree: 0,
  }));
}

/** Años disponibles para filtrar contratos (más reciente primero). */
export async function contractYears() {
  const pool = getPool();
  if (!pool) return [];
  const { rows } = await pool.query(
    `SELECT left(extra->>'fecha', 4) AS year, COUNT(*)::int AS n
     FROM nodes
     WHERE category = 'contrato'
       AND extra->>'fecha' ~ '^\\d{4}'
     GROUP BY 1
     ORDER BY 1 DESC`,
  );
  return rows.map((r) => ({ year: r.year, count: r.n }));
}

export async function getSubgraph(ids, hops = 1, maxNodes = 36) {
  const pool = getPool();
  if (!pool || !ids.length) return { nodes: [], links: [] };
  const { rows } = await pool.query(
    `WITH RECURSIVE walk AS (
       SELECT unnest($1::text[]) AS id, 0 AS hop
       UNION
       SELECT CASE WHEN e.source_id = w.id THEN e.target_id ELSE e.source_id END, w.hop + 1
       FROM walk w
       JOIN edges e ON e.source_id = w.id OR e.target_id = w.id
       WHERE w.hop < $2
     )
     SELECT id FROM (
       SELECT id, MIN(hop) AS hop FROM walk GROUP BY id
     ) s
     ORDER BY hop, id
     LIMIT $3`,
    [ids, hops, maxNodes],
  );
  const keep = rows.map((r) => r.id);
  if (!keep.length) return { nodes: [], links: [] };
  const nodes = (
    await pool.query(
      `SELECT id, name, category, role, rnc, summary, extra, salary, net_worth, amount
       FROM nodes WHERE id = ANY($1)`,
      [keep],
    )
  ).rows.map((r) => mapNodeRow({ ...r, degree: 1 }));
  const links = (
    await pool.query(
      `SELECT source_id AS source, target_id AS target, type, note
       FROM edges
       WHERE source_id = ANY($1) AND target_id = ANY($1)`,
      [keep],
    )
  ).rows;
  return { nodes, links };
}
