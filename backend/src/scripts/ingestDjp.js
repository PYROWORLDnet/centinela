/**
 * Ingiere DJP (Cámara de Cuentas) desde data/djp-declaraciones.json (+ djp-patrimonios.json).
 * Persona ← presento_djp → i-camara-cuentas; Persona ← sirve_en → institución.
 * net_worth = último patrimonio neto declarado con monto.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../db/loadEnv.js";
import { dbClient, flushEdges, flushNodes, slug } from "../db/upsert.js";

loadEnv();

const DATA = resolve(dirname(fileURLToPath(import.meta.url)), "../../data");
const SOURCE = {
  label: "Cámara de Cuentas — Consulta DJP",
  url: "https://consultadjp.camaradecuentas.gob.do/",
};
const CCRD = "i-camara-cuentas";

const KNOWN_PEOPLE = {
  "ALFREDO PACHECO OSORIA": "p-alfredo-pacheco",
  "LUIS RODOLFO ABINADER CORONA": "p-luis-abinader",
  "LUIS ABINADER CORONA": "p-luis-abinader",
  "RICARDO DE LOS SANTOS POLANCO": "p-ricardo-de-los-santos",
};

const KNOWN_INST = [
  { match: /CAMARA DE DIPUTADOS|CÁMARA DE DIPUTADOS/, id: "i-camara-diputados", name: "Cámara de Diputados" },
  { match: /^SENADO|SENADO DE LA REPUBLICA|SENADO DE LA REPÚBLICA/, id: "i-senado", name: "Senado de la República" },
  { match: /PRESIDENCIA DE LA REPUBLICA|PRESIDENCIA DE LA REPÚBLICA|^PRESIDENCIA$/, id: "i-presidencia", name: "Presidencia de la República" },
  { match: /CONGRESO NACIONAL/, id: "i-congreso", name: "Congreso Nacional" },
  { match: /CAMARA DE CUENTAS|CÁMARA DE CUENTAS/, id: "i-camara-cuentas", name: "Cámara de Cuentas" },
];

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function titleCaseName(value) {
  const lower = String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return lower.replace(/(^|[\s'-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
}

function institutionId(entidad) {
  const raw = String(entidad || "").trim();
  if (!raw) return null;
  const norm = normalizeName(raw);
  if (!norm) return null;
  for (const k of KNOWN_INST) {
    if (k.match.test(norm) || k.match.test(raw)) return { id: k.id, name: k.name, known: true };
  }
  const s = slug(norm).toLowerCase();
  if (!s) return null;
  return { id: `inst-djp-${s}`, name: titleCaseName(raw) || "Institución", known: false };
}

async function loadPersonaIndex(db) {
  const { rows } = await db.query(`SELECT id, name, aliases FROM nodes WHERE category = 'persona'`);
  const byNorm = new Map();
  for (const row of rows) {
    for (const key of [row.name, ...(row.aliases || [])].map(normalizeName).filter(Boolean)) {
      if (!byNorm.has(key)) byNorm.set(key, row.id);
    }
  }
  return byNorm;
}

function personId(norm, index) {
  if (KNOWN_PEOPLE[norm]) return KNOWN_PEOPLE[norm];
  if (index.has(norm)) return index.get(norm);
  return `djp-${slug(norm).toLowerCase()}`;
}

function pctDelta(from, to) {
  if (from == null || to == null || from === 0) return null;
  return Math.round(((to - from) / Math.abs(from)) * 1000) / 10;
}

async function main() {
  const catalogPath = resolve(DATA, "djp-declaraciones.json");
  const patrimonioPath = resolve(DATA, "djp-patrimonios.json");
  if (!existsSync(catalogPath)) {
    throw new Error("Falta djp-declaraciones.json. Corre: npm run download:djp");
  }

  const rows = JSON.parse(readFileSync(catalogPath, "utf8"));
  const patrimonioByDecl = new Map();
  if (existsSync(patrimonioPath)) {
    for (const p of JSON.parse(readFileSync(patrimonioPath, "utf8"))) {
      patrimonioByDecl.set(p.declaracion, p);
    }
  }

  const db = dbClient();
  await db.connect();

  await db.query(
    `INSERT INTO nodes (id, name, aliases, category, summary, extra)
     VALUES ($1, $2, $3::text[], 'institucion', $4, $5::jsonb)
     ON CONFLICT (id) DO UPDATE SET
       aliases = EXCLUDED.aliases,
       summary = COALESCE(nodes.summary, EXCLUDED.summary),
       extra = nodes.extra || EXCLUDED.extra`,
    [
      CCRD,
      "Cámara de Cuentas de la República Dominicana",
      ["Cámara de Cuentas", "CCRD", "Cámara de Cuentas RD"],
      "Órgano de control externo; administra el sistema de Declaraciones Juradas de Patrimonio.",
      JSON.stringify({ source: SOURCE }),
    ],
  );

  const index = await loadPersonaIndex(db);
  const people = new Map();
  const institutions = new Map();

  for (const row of rows) {
    if (!row.nombre) continue;
    const norm = normalizeName(row.nombre);
    if (!norm) continue;
    const id = personId(norm, index);
    index.set(norm, id);

    const money = patrimonioByDecl.get(row.declaracion) || {};
    const inst = institutionId(row.entidad);
    if (inst) institutions.set(inst.id, inst);

    let person = people.get(id);
    if (!person) {
      person = {
        id,
        name: titleCaseName(row.nombre),
        aliases: new Set([titleCaseName(row.nombre), row.nombre]),
        decls: [],
        instIds: new Set(),
      };
      people.set(id, person);
    } else {
      person.aliases.add(titleCaseName(row.nombre));
      person.aliases.add(row.nombre);
    }

    person.decls.push({
      declaracion: row.declaracion,
      codigo: `DJP-${String(row.declaracion).padStart(6, "0")}`,
      entidad: row.entidad,
      funcion: row.funcion,
      fechaDesignacion: row.fechaDesignacion,
      fechaRecibido: row.fechaRecibido,
      verDJP: row.verDJP,
      verPatrimonio: row.verPatrimonio,
      patrimonioNeto: money.patrimonioNeto ?? null,
      totalActivos: money.totalActivos ?? null,
      totalPasivos: money.totalPasivos ?? null,
      institucionId: inst?.id || null,
    });
    if (inst?.id) person.instIds.add(inst.id);
  }

  const nodes = [];
  const edges = [];

  for (const inst of institutions.values()) {
    nodes.push({
      id: inst.id,
      name: inst.name,
      aliases: [inst.name],
      category: "institucion",
      summary: inst.known ? undefined : `Institución citada en declaraciones DJP.`,
      extra: { source: SOURCE, djp: true },
    });
  }

  for (const person of people.values()) {
    const decls = person.decls.sort((a, b) =>
      String(a.fechaRecibido || "").localeCompare(String(b.fechaRecibido || "")) ||
      a.declaracion - b.declaracion,
    );
    const withMoney = decls.filter((d) => d.patrimonioNeto != null);
    const latestMoney = withMoney.at(-1);
    const firstMoney = withMoney[0];
    const latest = decls.at(-1);
    const delta = pctDelta(firstMoney?.patrimonioNeto, latestMoney?.patrimonioNeto);

    let role = latest?.funcion || null;
    if (person.id === "p-alfredo-pacheco") role = "Presidente de la Cámara de Diputados";
    if (person.id === "p-luis-abinader") role = "Presidente de la República";
    if (person.id === "p-ricardo-de-los-santos") role = "Presidente del Senado";

    nodes.push({
      id: person.id,
      name: person.name,
      aliases: [...person.aliases],
      category: "persona",
      role,
      netWorth: latestMoney?.patrimonioNeto ?? null,
      netWorthDelta: withMoney.length >= 2 ? delta : null,
      summary: latestMoney
        ? `Declaración jurada de patrimonio ante la Cámara de Cuentas. Último patrimonio neto RD$ ${latestMoney.patrimonioNeto.toLocaleString("es-DO")} (${latestMoney.codigo}).`
        : `Declarante en el sistema DJP de la Cámara de Cuentas (${decls.length} declaración/es).`,
      extra: {
        source: SOURCE,
        djp: {
          declaraciones: decls.length,
          ultima: latest?.codigo || null,
          patrimonioNeto: latestMoney?.patrimonioNeto ?? null,
          totalActivos: latestMoney?.totalActivos ?? null,
          totalPasivos: latestMoney?.totalPasivos ?? null,
          entidad: latest?.entidad || null,
          funcion: latest?.funcion || null,
        },
        djpHistorial: decls,
      },
    });

    edges.push({
      source: person.id,
      target: CCRD,
      type: "presento_djp",
      note: latest?.codigo || null,
    });

    for (const instId of person.instIds) {
      if (instId === CCRD) continue;
      edges.push({
        source: person.id,
        target: instId,
        type: "sirve_en",
        note: decls.find((d) => d.institucionId === instId)?.funcion || null,
      });
    }
  }

  let n = 0;
  for (let i = 0; i < nodes.length; i += 400) n += await flushNodes(db, nodes.slice(i, i + 400));
  let e = 0;
  for (let i = 0; i < edges.length; i += 800) e += await flushEdges(db, edges.slice(i, i + 800));

  const { rows: stats } = await db.query(
    `SELECT
       COUNT(*) FILTER (WHERE extra ? 'djp') AS personas_djp,
       COUNT(*) FILTER (WHERE net_worth IS NOT NULL AND extra ? 'djp') AS con_patrimonio,
       ROUND(AVG(net_worth) FILTER (WHERE net_worth IS NOT NULL AND extra ? 'djp')) AS patrimonio_promedio
     FROM nodes
     WHERE category = 'persona'`,
  );

  const { rows: sample } = await db.query(
    `SELECT id, name, role, net_worth, net_worth_delta,
            extra->'djp'->>'ultima' AS ultima,
            extra->'djp'->>'declaraciones' AS decls
     FROM nodes
     WHERE id IN ('p-alfredo-pacheco', 'p-luis-abinader', 'p-ricardo-de-los-santos')
        OR (extra ? 'djp' AND net_worth IS NOT NULL)
     ORDER BY CASE WHEN id LIKE 'p-%' THEN 0 ELSE 1 END, net_worth DESC NULLS LAST
     LIMIT 8`,
  );

  console.log({
    catalog: rows.length,
    patrimoniosParsed: patrimonioByDecl.size,
    nodes: n,
    edges: e,
    people: people.size,
    institutions: institutions.size,
    db: stats[0],
    sample,
  });

  await db.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
