import { getPool } from "../db/pool.js";

export function hasDatabase() {
  return Boolean(getPool());
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

export async function getNode(id) {
  const pool = getPool();
  if (!pool) return null;
  const { rows } = await pool.query(`SELECT * FROM nodes WHERE id = $1`, [id]);
  const node = rows[0];
  if (!node) return null;

  const { rows: links } = await pool.query(
    `SELECT e.type, e.note,
            CASE WHEN e.source_id = $1 THEN e.target_id ELSE e.source_id END AS other_id,
            CASE WHEN e.source_id = $1 THEN 'out' ELSE 'in' END AS direction
     FROM edges e
     WHERE e.source_id = $1 OR e.target_id = $1
     LIMIT 40`,
    [id],
  );
  const otherIds = links.map((l) => l.other_id);
  const others = otherIds.length
    ? (
        await pool.query(
          `SELECT id, name, category, role FROM nodes WHERE id = ANY($1)`,
          [otherIds],
        )
      ).rows
    : [];
  const byId = new Map(others.map((n) => [n.id, n]));
  return {
    ...node,
    salary: node.salary != null ? Number(node.salary) : null,
    netWorth: node.net_worth != null ? Number(node.net_worth) : null,
    netWorthDelta: node.net_worth_delta != null ? Number(node.net_worth_delta) : null,
    amount: node.amount != null ? Number(node.amount) : null,
    connections: links.map((l) => ({
      type: l.type,
      direction: l.direction,
      note: l.note,
      node: byId.get(l.other_id) || { id: l.other_id },
    })),
  };
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
      `SELECT id, name, category, role, rnc, summary FROM nodes WHERE id = ANY($1)`,
      [keep],
    )
  ).rows;
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
