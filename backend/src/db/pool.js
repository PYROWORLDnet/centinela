import pg from "pg";

let pool = null;

export function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!pool) {
    const clean = url.replace(/[?&]sslmode=[^&]*/g, "").replace(/\?$/, "");
    const local = /localhost|127\.0\.0\.1/.test(clean);
    pool = new pg.Pool({
      connectionString: clean,
      ssl: local ? false : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}
