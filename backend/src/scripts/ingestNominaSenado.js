/**
 * Ingiere nómina oficial del Senado (XLSX públicos 2025–2026+).
 * Personas → recibio_salario_de / miembro_de / preside → i-senado.
 * Historial mensual en extra.nominaHistorial; salario = último periodo.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";
import { loadEnv } from "../db/loadEnv.js";
import { dbClient, flushEdges, flushNodes, money, slug } from "../db/upsert.js";

loadEnv();

const DATA = resolve(dirname(fileURLToPath(import.meta.url)), "../../data");
const INSTITUTION = "i-senado";
const SOURCE = {
  label: "Senado de la República — Nómina",
  url: "https://www.senadord.gob.do/transparencia/recursos-humanos/nomina-de-empleados/",
};
const YEARS = new Set(
  (process.env.YEARS || "2025,2026")
    .split(",")
    .map((y) => y.trim())
    .filter(Boolean),
);

const KNOWN_IDS = {
  "RICARDO DE LOS SANTOS POLANCO": "p-ricardo-de-los-santos",
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
  for (let i = 0; i < Math.min(20, rows.length); i++) {
    const cells = (rows[i] || []).map((c) => String(c || "").toUpperCase());
    const hasCargo = cells.some((c) => c.includes("CARGO"));
    const hasName = cells.some((c) => c.includes("NOMBRE"));
    const hasSueldo = cells.some((c) => c.includes("SUELDO") || c.includes("INGRESO"));
    if (hasCargo && hasName && hasSueldo) return i;
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

function parsePeriod(rows, fileYm) {
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const text = String(rows[i]?.[0] || "");
    const m = text.match(/mes\s+de\s+([A-ZÁÉÍÓÚÑ]+)\s+del?\s+(\d{4})/i);
    if (m) {
      const month = m[1].toLowerCase();
      const year = m[2];
      const ym = MONTH_NUM[month] ? `${year}-${MONTH_NUM[month]}` : fileYm;
      return { label: `${month} ${year}`, ym };
    }
  }
  return { label: fileYm, ym: fileYm };
}

function isLegislator(cargo) {
  const c = String(cargo || "").toUpperCase().trim();
  if (/SENADOR\(A\)/.test(c)) return true;
  if (/^SENADOR(A)?(\s|$)/.test(c)) return true;
  if (/^PRESIDENTE(\s|$)/.test(c)) return true;
  if (/^VICE[\s-]?PRESIDENTE/.test(c)) return true;
  return false;
}

function edgeTypeFor(cargo) {
  const c = String(cargo || "").toUpperCase().trim();
  if (/^PRESIDENTE(\s|$)/.test(c)) return "preside";
  if (/SENADOR\(A\)/.test(c) || /^SENADOR(A)?(\s|$)/.test(c) || /^VICE[\s-]?PRESIDENTE/.test(c)) {
    return "miembro_de";
  }
  return null;
}

function resolveFiles() {
  const manifestPath = resolve(DATA, "nomina-senado-manifest.json");
  let files = [];
  if (existsSync(manifestPath)) {
    const meta = JSON.parse(readFileSync(manifestPath, "utf8"));
    files = (meta.files || [])
      .filter((f) => f.dest && (!YEARS.size || YEARS.has(String(f.year))))
      .map((f) => ({ path: resolve(DATA, f.dest), ym: f.ym, year: f.year, month: f.month }))
      .filter((f) => existsSync(f.path));
  }
  if (!files.length) {
    files = readdirSync(DATA)
      .filter((n) => /^nomina-senado-\d{4}-\d{2}\.xlsx$/.test(n))
      .map((n) => {
        const m = n.match(/nomina-senado-(\d{4})-(\d{2})/);
        return {
          path: resolve(DATA, n),
          ym: `${m[1]}-${m[2]}`,
          year: m[1],
          month: m[2],
        };
      })
      .filter((f) => !YEARS.size || YEARS.has(f.year));
  }
  files.sort((a, b) => String(a.ym).localeCompare(String(b.ym)));
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

function personId(norm, codigo, index) {
  if (KNOWN_IDS[norm]) return KNOWN_IDS[norm];
  if (index.has(norm)) return index.get(norm);
  const code = String(codigo || "").replace(/\D/g, "");
  if (code) return `sn-${code}`;
  return `sn-${slug(norm).toLowerCase()}`;
}

async function main() {
  const files = resolveFiles();
  if (!files.length) {
    throw new Error("No hay XLSX. Corre: YEARS=2025,2026 npm run download:nomina-senado");
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
      "Senado de la República",
      ["Senado", "Senado RD"],
      "Cámara Alta del Congreso Nacional.",
      JSON.stringify({ source: SOURCE }),
    ],
  );

  const index = await loadPersonaIndex(db);
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
    const iCode = colIndex(header, "CODIGO");
    const iNombre = colIndex(header, "NOMBRE");
    const iApellidos = colIndex(header, "APELLIDO");
    const iDept = colIndex(header, "DEPARTAMENTO");
    const iCargo = colIndex(header, "CARGO");
    const iMensual = colIndex(header, "SUELDO MENSUAL");
    const iBruto = colIndex(header, "SUELDO BRUTO", "TOTAL INGRESOS");
    const iNeto = colIndex(header, "SUELDO NETO", "NETO");
    if (iNombre < 0 || iCargo < 0) {
      console.warn("columnas inválidas", file.path);
      continue;
    }

    const period = parsePeriod(rows, file.ym);
    const ym = period.ym || file.ym;

    for (const row of rows.slice(headerIdx + 1)) {
      const first = row?.[iNombre];
      const last = iApellidos >= 0 ? row?.[iApellidos] : "";
      if (!first) continue;
      const rawName = `${first} ${last || ""}`.replace(/\s+/g, " ").trim();
      if (!rawName || /total/i.test(rawName)) continue;

      const name = titleCaseName(rawName);
      const norm = normalizeName(rawName);
      if (!norm) continue;

      const codigo = iCode >= 0 ? row[iCode] : null;
      const cargo = String(row[iCargo] || "").replace(/\s+/g, " ").trim();
      const dept = String(row[iDept] ?? "").replace(/\s+/g, " ").trim() || null;
      const bruto = money(row[iBruto] ?? row[iMensual]);
      const neto = money(row[iNeto]);
      const legislator = isLegislator(cargo);
      const id = personId(norm, codigo, index);
      index.set(norm, id);

      let person = people.get(id);
      if (!person) {
        person = {
          id,
          name,
          aliases: new Set([name, rawName]),
          codigo: codigo ? String(codigo).trim() : null,
          historial: new Map(),
          legislatorCargos: [],
        };
        people.set(id, person);
      } else {
        person.aliases.add(name);
        person.aliases.add(rawName);
      }

      person.historial.set(ym, {
        ym,
        periodo: period.label,
        departamento: dept,
        cargo,
        ingresoBruto: bruto,
        ingresoNeto: neto,
        codigo: codigo ? String(codigo).trim() : null,
      });
      if (legislator) person.legislatorCargos.push({ ym, cargo });
      rowCount += 1;
    }
    console.log("parsed", file.path.split("/").pop(), { ym });
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

    let role = titleCaseName(latest?.cargo) || (wasLegislator ? "Senador/a" : "Empleado/a Senado");
    if (wasLegislator) {
      const c = String(legislatorLatest?.cargo || "").toUpperCase();
      role = /^PRESIDENTE(\s|$)/.test(c) ? "Presidente del Senado" : "Senador/a";
    }
    if (person.id === "p-ricardo-de-los-santos") role = "Presidente del Senado";

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
        ? `Legislador/a en nómina oficial del Senado${range ? ` (${range})` : ""}.`
        : `Empleado/a en nómina oficial del Senado${range ? ` (${range})` : ""}.`,
      extra: {
        source: SOURCE,
        nomina: {
          institucion: "senado",
          periodo: latest?.periodo || latest?.ym,
          ym: latest?.ym,
          departamento: latest?.departamento,
          cargo: latest?.cargo,
          ingresoBruto: latest?.ingresoBruto,
          ingresoNeto: latest?.ingresoNeto,
          codigoEmpleado: person.codigo || latest?.codigo || null,
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

    const membership = edgeTypeFor(legislatorLatest?.cargo || "");
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

  let n = 0;
  for (let i = 0; i < nodes.length; i += 400) n += await flushNodes(db, nodes.slice(i, i + 400));
  let e = 0;
  for (let i = 0; i < edges.length; i += 800) e += await flushEdges(db, edges.slice(i, i + 800));

  await db.query(
    `DELETE FROM edges e
     USING nodes n
     WHERE e.source_id = n.id
       AND e.target_id = $1
       AND e.type IN ('miembro_de', 'preside')
       AND n.extra->'nomina'->>'institucion' = 'senado'
       AND NOT (
         EXISTS (
           SELECT 1
           FROM jsonb_array_elements(COALESCE(n.extra->'nominaHistorial', '[]'::jsonb)) h
           WHERE upper(trim(h->>'cargo')) ~ '^(SENADOR|SENADORA|PRESIDENTE|VICE[[:space:]-]?PRESIDENTE)'
              OR upper(h->>'cargo') LIKE '%SENADOR(A)%'
         )
       )`,
    [INSTITUTION],
  );

  const { rows: counts } = await db.query(
    `SELECT
       COUNT(*) FILTER (WHERE extra->'nomina'->>'institucion' = 'senado') AS personas,
       COUNT(*) FILTER (
         WHERE extra->'nomina'->>'institucion' = 'senado'
           AND EXISTS (
             SELECT 1 FROM jsonb_array_elements(COALESCE(extra->'nominaHistorial', '[]'::jsonb)) h
             WHERE upper(trim(h->>'cargo')) ~ '^(SENADOR|SENADORA|PRESIDENTE|VICE[[:space:]-]?PRESIDENTE)'
                OR upper(h->>'cargo') LIKE '%SENADOR(A)%'
           )
       ) AS legisladores,
       MIN(extra->'nomina'->>'desde') AS desde,
       MAX(extra->'nomina'->>'hasta') AS hasta,
       ROUND(AVG((extra->'nomina'->>'meses')::numeric), 1) AS meses_promedio
     FROM nodes`,
  );

  const { rows: presidente } = await db.query(
    `SELECT id, name, role, salary,
            extra->'nomina'->>'desde' AS desde,
            extra->'nomina'->>'hasta' AS hasta,
            extra->'nomina'->>'meses' AS meses
     FROM nodes WHERE id = 'p-ricardo-de-los-santos'`,
  );

  console.log({
    files: files.length,
    months: [...new Set(files.map((f) => f.ym))].sort(),
    rowCount,
    nodes: n,
    edges: e,
    legisladores: seenLegislators.size,
    empleados: seenStaff.size,
    db: counts[0],
    presidente: presidente[0],
  });

  await db.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
