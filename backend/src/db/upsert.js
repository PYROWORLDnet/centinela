import pg from "pg";

export function dbClient() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const clean = url.replace(/[?&]sslmode=[^&]*/g, "").replace(/\?$/, "");
    const local = /localhost|127\.0\.0\.1/.test(clean);
    return new pg.Client({
      connectionString: clean,
      ssl: local ? false : { rejectUnauthorized: false },
    });
  }
  return new pg.Client({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || process.env.POSTGRES_DB,
    ssl: { rejectUnauthorized: false },
  });
}

export function slug(value) {
  return String(value || "")
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

export function money(value) {
  if (value == null || value === "" || value === "N/A") return null;
  const n = Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n);
  if (!Number.isSafeInteger(rounded) || rounded < 0) return null;
  return rounded;
}

export async function flushNodes(db, batch) {
  const unique = [...new Map(batch.map((n) => [n.id, n])).values()];
  if (!unique.length) return 0;
  const values = [];
  const params = [];
  let i = 1;
  for (const n of unique) {
    values.push(
      `($${i++}, $${i++}, $${i++}::text[], $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}::jsonb)`,
    );
    params.push(
      n.id,
      n.name,
      n.aliases || [],
      n.category,
      n.role || null,
      n.rnc || null,
      n.salary ?? null,
      n.netWorth ?? n.net_worth ?? null,
      n.netWorthDelta ?? n.net_worth_delta ?? null,
      n.amount ?? null,
      n.summary || null,
      JSON.stringify(n.extra || {}),
    );
  }
  await db.query(
    `INSERT INTO nodes (id, name, aliases, category, role, rnc, salary, net_worth, net_worth_delta, amount, summary, extra)
     VALUES ${values.join(",")}
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       aliases = EXCLUDED.aliases,
       role = COALESCE(EXCLUDED.role, nodes.role),
       rnc = COALESCE(EXCLUDED.rnc, nodes.rnc),
       salary = COALESCE(EXCLUDED.salary, nodes.salary),
       net_worth = COALESCE(EXCLUDED.net_worth, nodes.net_worth),
       net_worth_delta = COALESCE(EXCLUDED.net_worth_delta, nodes.net_worth_delta),
       amount = COALESCE(EXCLUDED.amount, nodes.amount),
       summary = COALESCE(EXCLUDED.summary, nodes.summary),
       extra = nodes.extra || EXCLUDED.extra`,
    params,
  );
  return unique.length;
}

export async function flushEdges(db, batch) {
  const unique = [
    ...new Map(batch.map((e) => [`${e.source}|${e.target}|${e.type}`, e])).values(),
  ];
  if (!unique.length) return 0;
  const values = [];
  const params = [];
  let i = 1;
  for (const e of unique) {
    values.push(`($${i++}, $${i++}, $${i++}, $${i++})`);
    params.push(e.source, e.target, e.type, e.note || null);
  }
  await db.query(
    `INSERT INTO edges (source_id, target_id, type, note)
     VALUES ${values.join(",")}
     ON CONFLICT (source_id, target_id, type) DO NOTHING`,
    params,
  );
  return unique.length;
}
