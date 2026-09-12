/**
 * Ingiere nómina oficial Cámara de Diputados (todos los XLSX locales 2025–2026+).
 * Una persona = un nodo; salario/cargo = último periodo; historial mensual en extra.nominaHistorial.
 * Edges: recibio_salario_de; miembro_de / preside si alguna nómina los marca como legisladores.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";
import { loadEnv } from "../db/loadEnv.js";
import { dbClient, flushEdges, flushNodes, money, slug } from "../db/upsert.js";

loadEnv();

const DATA = resolve(dirname(fileURLToPath(import.meta.url)), "../../data");
const INSTITUTION = "i-camara-diputados";
const SOURCE = {
  label: "Cámara de Diputados — Nómina",
  url: "https://www.camaradediputados.gob.do/",
};
const YEARS = new Set(
  (process.env.YEARS || "2025,2026")
    .split(",")
    .map((y) => y.trim())
    .filter(Boolean),
);

const KNOWN_IDS = {
  "ALFREDO PACHECO OSORIA": "p-alfredo-pacheco",
};

const MONTH_NUM = {
  enero: "01",
  febrero: "02",
  marzo: "03",
  abril: "04",
  mayo: "05",
  junio: "06",
  julio: "07",
  agosto: "08",
  septiembre: "09",
  setiembre: "09",
  octubre: "10",
  noviembre: "11",
  diciembre: "12",
};

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

function findHeaderRow(rows) {
  for (let i = 0; i < Math.min(12, rows.length); i++) {
    const cells = (rows[i] || []).map((c) => String(c || "").toUpperCase());
    const hasCargo = cells.some((c) => c.includes("CARGO"));
    const hasDept = cells.some((c) => c.includes("PROVINCIA") || c.includes("DEPARTAMENTO"));
    const hasNames = cells.some((c) => c.includes("NOMBRES"));
    // Algunos XLSX (nov/dic 2025) rompen la celda de nombres y ponen un número.
    if (hasCargo && (hasNames || hasDept)) return i;
  }
  return -1;
}

function colIndex(header, ...needles) {
  const upper = header.map((c) => String(c || "").toUpperCase().trim());
  for (const needle of needles) {
    const i = upper.findIndex((c) => c.includes(needle));
    if (i >= 0) return i;
  }
  return -1;
}

function parsePeriodLabel(rows) {
  for (let i = 0; i < Math.min(6, rows.length); i++) {
    const text = String(rows[i]?.[0] || "");
    const m = text.match(/MES\s+([A-ZÁÉÍÓÚÑ]+)\s+(\d{4})/i);
    if (m) return { label: `${m[1].toLowerCase()} ${m[2]}`, month: m[1].toLowerCase(), year: m[2] };
  }
  return null;
}

function ymFromFile(filePath, period) {
  const base = filePath.split("/").pop() || "";
  const m = base.match(/nomina-camara-(\d{4})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}`;
  if (period?.year && period?.month && MONTH_NUM[period.month]) {
    return `${period.year}-${MONTH_NUM[period.month]}`;
  }
  return null;
}

function isLegislator(cargo) {
  const c = String(cargo || "").toUpperCase().trim();
  return /^(DIPUTADO|PRESIDENTE|VICE[\s-]?PRESIDENTE)/.test(c);
}

function edgeTypeFor(cargo) {
  const c = String(cargo || "").toUpperCase().trim();
  if (/^PRESIDENTE/.test(c) && !/^VICE/.test(c)) return "preside";
  if (/^(DIPUTADO|VICE[\s-]?PRESIDENTE)/.test(c)) return "miembro_de";
  return null;
}

function resolveFiles() {
  const manifestPath = resolve(DATA, "nomina-camara-manifest.json");
  let files = [];

  if (existsSync(manifestPath)) {
    const meta = JSON.parse(readFileSync(manifestPath, "utf8"));
    files = (meta.files || [])
      .filter((f) => f.dest && (!YEARS.size || YEARS.has(String(f.year))))
      .map((f) => ({
        kind: f.kind,
        path: resolve(DATA, f.dest),
        ym: f.ym,
        year: f.year,
        month: f.month,
      }))
      .filter((f) => existsSync(f.path));
  }

  if (!files.length) {
    files = readdirSync(DATA)
      .filter((n) => /^nomina-camara-\d{4}-\d{2}-(diputados|libre)\.xlsx$/.test(n))
      .map((n) => {
        const m = n.match(/nomina-camara-(\d{4})-(\d{2})-(diputados|libre)/);
        return {
          kind: m[3],
          path: resolve(DATA, n),
          ym: `${m[1]}-${m[2]}`,
          year: m[1],
          month: m[2],
        };
      })
      .filter((f) => !YEARS.size || YEARS.has(f.year));
  }

  files.sort(
    (a, b) =>
      String(a.ym).localeCompare(String(b.ym)) ||
      // carrera al final del mes para que pise libre si hay solape
      (a.kind === "diputados" ? 1 : 0) - (b.kind === "diputados" ? 1 : 0),
  );
  return files;
}

function readSheetRows(filePath) {
  const wb = XLSX.read(readFileSync(filePath), { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
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
  if (KNOWN_IDS[norm]) return KNOWN_IDS[norm];
  if (index.has(norm)) return index.get(norm);
  return `cd-${slug(norm).toLowerCase()}`;
}

async function main() {
  const files = resolveFiles();
  if (!files.length) {
    throw new Error("No hay XLSX. Corre: YEARS=2025,2026 npm run download:nomina-camara");
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
      INSTITUTION,
      "Cámara de Diputados",
      ["Cámara de Diputados", "Diputados"],
      "Cámara Baja del Congreso Nacional.",
      JSON.stringify({ source: SOURCE }),
    ],
  );

  const index = await loadPersonaIndex(db);
  /** @type {Map<string, any>} */
  const people = new Map();
  let rowCount = 0;

  for (const file of files) {
    const rows = readSheetRows(file.path);
    const headerIdx = findHeaderRow(rows);
    if (headerIdx < 0) {
      console.warn("sin encabezado", file.path);
      continue;
    }
    const header = rows[headerIdx];
    let iName = colIndex(header, "NOMBRES");
    const iDept = colIndex(header, "PROVINCIA", "DEPARTAMENTO");
    const iCargo = colIndex(header, "CARGO");
    const iBruto = colIndex(header, "INGRESO BRUTO", "BRUTO");
    const iNeto = colIndex(header, "INGRESO NETO", "NETO");
    // Header roto: primera columna sigue siendo el nombre.
    if (iName < 0 && iCargo > 0) iName = 0;
    if (iName < 0 || iCargo < 0) {
      console.warn("columnas inválidas", file.path);
      continue;
    }

    const parsed = parsePeriodLabel(rows);
    const ym = file.ym || ymFromFile(file.path, parsed);
    if (!ym) {
      console.warn("sin periodo", file.path);
      continue;
    }
    const periodLabel = parsed?.label || ym;
    const roster = file.kind === "libre" ? "libre" : "carrera";

    for (const row of rows.slice(headerIdx + 1)) {
      const rawName = row?.[iName];
      if (!rawName || String(rawName).toUpperCase().includes("TOTAL")) continue;
      const name = titleCaseName(rawName);
      const norm = normalizeName(rawName);
      if (!norm) continue;

      const cargo = String(row[iCargo] || "").replace(/\s+/g, " ").trim();
      const dept = String(row[iDept] ?? "").replace(/\s+/g, " ").trim() || null;
      const bruto = money(row[iBruto]);
      const neto = money(row[iNeto]);
      const legislator = roster === "carrera" && isLegislator(cargo);
      const id = personId(norm, index);
      index.set(norm, id);

      let person = people.get(id);
      if (!person) {
        person = {
          id,
          name,
          aliases: new Set([name, String(rawName).replace(/\s+/g, " ").trim()]),
          historial: new Map(),
          legislatorCargos: [],
        };
        people.set(id, person);
      } else {
        person.aliases.add(name);
        person.aliases.add(String(rawName).replace(/\s+/g, " ").trim());
      }

      const histKey = ym;
      person.historial.set(histKey, {
        ym,
        periodo: periodLabel,
        roster,
        departamento: dept,
        cargo,
        ingresoBruto: bruto,
        ingresoNeto: neto,
      });
      if (legislator) person.legislatorCargos.push({ ym, cargo });
      rowCount += 1;
    }
    console.log("parsed", file.path.split("/").pop(), { ym, roster });
  }

  const nodes = [];
  const edges = [];
  const seenLegislators = new Set();
  const seenStaff = new Set();

  for (const person of people.values()) {
    const hist = [...person.historial.values()].sort((a, b) => a.ym.localeCompare(b.ym));
    const latest = hist.at(-1);
    const legislatorLatest = [...person.legislatorCargos].sort((a, b) => a.ym.localeCompare(b.ym)).at(-1);
    const wasLegislator = Boolean(legislatorLatest);

    let role = titleCaseName(latest?.cargo) || (wasLegislator ? "Diputado/a" : "Empleado/a Cámara de Diputados");
    if (person.id === "p-alfredo-pacheco") role = "Presidente de la Cámara de Diputados";

    const firstYm = hist[0]?.ym;
    const lastYm = latest?.ym;
    const range =
      firstYm && lastYm && firstYm !== lastYm ? `${firstYm} → ${lastYm}` : lastYm || null;

    nodes.push({
      id: person.id,
      name: person.name,
      aliases: [...person.aliases],
      category: "persona",
      role,
      salary: latest?.ingresoBruto ?? null,
      summary: wasLegislator
        ? `Legislador/a en nómina oficial de la Cámara de Diputados${range ? ` (${range})` : ""}.`
        : `Empleado/a en nómina oficial de la Cámara de Diputados${range ? ` (${range})` : ""}.`,
      extra: {
        source: SOURCE,
        nomina: {
          institucion: "camara-diputados",
          periodo: latest?.periodo || latest?.ym,
          ym: latest?.ym,
          roster: latest?.roster,
          departamento: latest?.departamento,
          cargo: latest?.cargo,
          ingresoBruto: latest?.ingresoBruto,
          ingresoNeto: latest?.ingresoNeto,
          desde: firstYm,
          hasta: lastYm,
          meses: hist.length,
        },
        nominaHistorial: hist,
      },
    });

    edges.push({
      source: person.id,
      target: INSTITUTION,
      type: "recibio_salario_de",
      note:
        latest?.ingresoBruto != null
          ? `Último bruto RD$ ${latest.ingresoBruto.toLocaleString("es-DO")} (${latest.ym})`
          : null,
    });

    const membership = edgeTypeFor(legislatorLatest?.cargo || latest?.cargo);
    if (wasLegislator && membership) {
      edges.push({
        source: person.id,
        target: INSTITUTION,
        type: membership,
        note: legislatorLatest?.cargo || null,
      });
      seenLegislators.add(person.id);
    } else {
      seenStaff.add(person.id);
    }
  }

  // Flush en lotes para no reventar params
  let n = 0;
  const nodeArr = nodes;
  for (let i = 0; i < nodeArr.length; i += 400) {
    n += await flushNodes(db, nodeArr.slice(i, i + 400));
  }
  let e = 0;
  for (let i = 0; i < edges.length; i += 800) {
    e += await flushEdges(db, edges.slice(i, i + 800));
  }

  await db.query(
    `DELETE FROM edges e
     USING nodes n
     WHERE e.source_id = n.id
       AND e.target_id = $1
       AND e.type IN ('miembro_de', 'preside')
       AND n.extra->'nomina'->>'institucion' = 'camara-diputados'
       AND NOT (
         EXISTS (
           SELECT 1
           FROM jsonb_array_elements(COALESCE(n.extra->'nominaHistorial', '[]'::jsonb)) h
           WHERE upper(trim(h->>'cargo')) ~ '^(DIPUTADO|PRESIDENTE|VICE[[:space:]-]?PRESIDENTE)'
         )
       )`,
    [INSTITUTION],
  );

  const { rows: counts } = await db.query(
    `SELECT
       COUNT(*) FILTER (WHERE extra->'nomina'->>'institucion' = 'camara-diputados') AS personas,
       COUNT(*) FILTER (
         WHERE extra->'nomina'->>'institucion' = 'camara-diputados'
           AND EXISTS (
             SELECT 1 FROM jsonb_array_elements(COALESCE(extra->'nominaHistorial', '[]'::jsonb)) h
             WHERE upper(trim(h->>'cargo')) ~ '^(DIPUTADO|PRESIDENTE|VICE[[:space:]-]?PRESIDENTE)'
           )
       ) AS legisladores,
       MIN(extra->'nomina'->>'desde') AS desde,
       MAX(extra->'nomina'->>'hasta') AS hasta,
       ROUND(AVG((extra->'nomina'->>'meses')::numeric), 1) AS meses_promedio
     FROM nodes`,
  );

  const { rows: pacheco } = await db.query(
    `SELECT id, name, role, salary,
            extra->'nomina'->>'desde' AS desde,
            extra->'nomina'->>'hasta' AS hasta,
            extra->'nomina'->>'meses' AS meses
     FROM nodes WHERE id = 'p-alfredo-pacheco'`,
  );

  const yms = [...new Set(files.map((f) => f.ym))].sort();
  console.log({
    files: files.length,
    months: yms,
    rowCount,
    nodes: n,
    edges: e,
    legisladores: seenLegislators.size,
    empleados: seenStaff.size,
    db: counts[0],
    pacheco: pacheco[0],
  });

  await db.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
