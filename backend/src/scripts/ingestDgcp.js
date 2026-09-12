/**
 * Carga adjudicaciones, procesos, inhabilitados y nómina DGCP.
 * Une empresa (RPE) → ganó → contrato → proceso → institución.
 */
import { createReadStream } from "node:fs";
import { parse } from "csv-parse";
import pg from "pg";

const DATA = new URL("../../data/", import.meta.url);

function client() {
  return new pg.Client({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || process.env.POSTGRES_DB,
    ssl: { rejectUnauthorized: false },
  });
}

function slug(value) {
  return String(value || "")
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function money(value) {
  if (value == null || value === "" || value === "N/A") return null;
  const n = Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n);
  if (!Number.isSafeInteger(rounded) || rounded < 0) return null;
  return rounded;
}

function companyId(doc, rpe) {
  const digits = String(doc || "").replace(/\D/g, "");
  if (digits) return `rpe-${digits}`;
  const code = slug(rpe);
  return code ? `rpe-${code}` : null;
}

async function eachRow(file, onRow) {
  const parser = createReadStream(new URL(file, DATA)).pipe(
    parse({ columns: true, bom: true, skip_empty_lines: true, relax_quotes: true, relax_column_count: true }),
  );
  for await (const row of parser) await onRow(row);
}

async function flushNodes(db, batch) {
  const unique = [...new Map(batch.map((n) => [n.id, n])).values()];
  if (!unique.length) return 0;
  const values = [];
  const params = [];
  let i = 1;
  for (const n of unique) {
    values.push(
      `($${i++}, $${i++}, $${i++}::text[], $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}::jsonb)`,
    );
    params.push(
      n.id,
      n.name,
      n.aliases || [],
      n.category,
      n.role || null,
      n.rnc || null,
      n.amount ?? null,
      n.summary || null,
      JSON.stringify(n.extra || {}),
    );
  }
  await db.query(
    `INSERT INTO nodes (id, name, aliases, category, role, rnc, amount, summary, extra)
     VALUES ${values.join(",")}
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       aliases = EXCLUDED.aliases,
       role = COALESCE(EXCLUDED.role, nodes.role),
       rnc = COALESCE(EXCLUDED.rnc, nodes.rnc),
       amount = COALESCE(EXCLUDED.amount, nodes.amount),
       summary = COALESCE(EXCLUDED.summary, nodes.summary),
       extra = nodes.extra || EXCLUDED.extra`,
    params,
  );
  return unique.length;
}

async function flushEdges(db, batch) {
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

async function ingestProcesos(db) {
  const institutions = new Map();
  let nodes = [];
  let edges = [];
  let nCount = 0;
  let eCount = 0;

  const flush = async () => {
    nCount += await flushNodes(db, nodes);
    eCount += await flushEdges(db, edges);
    nodes = [];
    edges = [];
  };

  await eachRow("procesos-dgcp.csv", async (row) => {
    const code = slug(row.CODIGO_PROCESO);
    const uc = slug(row.CODIGO_UNIDAD_COMPRA);
    const unidad = String(row.UNIDAD_COMPRA || "").trim();
    if (!code) return;
    if (uc && unidad && !institutions.has(uc)) {
      institutions.set(uc, unidad);
      nodes.push({
        id: `uc-${uc}`,
        name: unidad,
        aliases: [uc],
        category: "institucion",
        extra: {
          codigoUnidadCompra: uc,
          source: { label: "DGCP — Unidades de compra", url: "https://datos.gob.do/dataset/datos-procesos-publicados" },
        },
      });
    }
    const procId = `proc-${code}`;
    nodes.push({
      id: procId,
      name: String(row.CARATULA || code).slice(0, 280),
      aliases: [row.CODIGO_PROCESO].filter(Boolean),
      category: "contrato",
      role: row.MODALIDAD || null,
      amount: money(row.MONTO_ESTIMADO),
      summary: [row.ESTADO_PROCESO, row.OBJETO_PROCESO, row.UNIDAD_COMPRA].filter(Boolean).join(" · "),
      extra: {
        codigoProceso: row.CODIGO_PROCESO,
        unidadCompra: unidad,
        mipyme: row.DIRIGIDO_MIPYMES,
        url: row.URL,
        source: { label: "DGCP — Procesos SECP 2015–2026", url: "https://datos.gob.do/dataset/datos-procesos-publicados" },
      },
    });
    if (uc) {
      const instId = `uc-${uc}`;
      edges.push({ source: instId, target: procId, type: "emitio" });
    }
    if (nodes.length >= 800) await flush();
  });
  await flush();

  console.log(`procesos nodes≈${nCount} edges≈${eCount} instituciones=${institutions.size}`);
}

async function ingestAdjudicaciones(db) {
  let nodes = [];
  let edges = [];
  let nCount = 0;
  let eCount = 0;
  const flush = async () => {
    nCount += await flushNodes(db, nodes);
    eCount += await flushEdges(db, edges);
    nodes = [];
    edges = [];
  };

  await eachRow("adjudicaciones-dgcp.csv", async (row) => {
    const ctr = slug(row.CODIGO_CONTRATO);
    const proc = slug(row.CODIGO_PROCESO);
    const firm = String(row.RAZON_SOCIAL || "").trim();
    const cid = companyId(row.NUMERO_DOCUMENTO, row.RPE);
    if (!ctr || !firm || !cid) return;
    const contractId = `ctr-${ctr}`;
    nodes.push({
      id: contractId,
      name: `${row.CODIGO_CONTRATO} · ${firm}`.slice(0, 280),
      aliases: [row.CODIGO_CONTRATO, row.CODIGO_PROCESO].filter(Boolean),
      category: "contrato",
      role: row.OBJETO_CONTRATO || null,
      rnc: String(row.NUMERO_DOCUMENTO || "").trim() || null,
      amount: money(row.VALOR_CONTRATADO),
      summary: [row.ESTADO_CONTRATO, row.FECHA_ADJUDICACION, row.MONEDA].filter(Boolean).join(" · "),
      extra: {
        codigoContrato: row.CODIGO_CONTRATO,
        codigoProceso: row.CODIGO_PROCESO,
        moneda: row.MONEDA,
        rpe: row.RPE,
        source: { label: "DGCP — Adjudicaciones SECP 2015–2026", url: "https://datos.gob.do/dataset/adjudicaciones-secp" },
      },
    });
    nodes.push({
      id: cid,
      name: firm,
      aliases: [row.RPE].filter((x) => x && x !== "N/A"),
      category: "empresa",
      rnc: String(row.NUMERO_DOCUMENTO || "").trim() || null,
      extra: { rpe: row.RPE },
    });
    edges.push({
      source: cid,
      target: contractId,
      type: "gano",
      note: row.VALOR_CONTRATADO ? `${row.MONEDA || "DOP"} ${row.VALOR_CONTRATADO}` : null,
    });
    if (proc) {
      nodes.push({
        id: `proc-${proc}`,
        name: String(row.CODIGO_PROCESO),
        aliases: [row.CODIGO_PROCESO],
        category: "contrato",
        extra: { codigoProceso: row.CODIGO_PROCESO },
      });
      edges.push({ source: contractId, target: `proc-${proc}`, type: "parte_de" });
    }
    if (nodes.length >= 800) await flush();
  });
  await flush();
  console.log(`adjudicaciones nodes≈${nCount} edges≈${eCount}`);
}

async function ingestInhabilitados(db) {
  await db.query(`CREATE INDEX IF NOT EXISTS nodes_extra_rpe_idx ON nodes ((extra->>'rpe'))`);
  await db.query(`CREATE TEMP TABLE inh (rpe text PRIMARY KEY, extra jsonb NOT NULL)`);
  const batch = [];
  const flushInh = async () => {
    if (!batch.length) return;
    const unique = [...new Map(batch.map((r) => [r.rpe, r])).values()];
    batch.length = 0;
    const values = [];
    const params = [];
    let i = 1;
    for (const row of unique) {
      values.push(`($${i++}, $${i++}::jsonb)`);
      params.push(row.rpe, row.extra);
    }
    await db.query(
      `INSERT INTO inh (rpe, extra) VALUES ${values.join(",")} ON CONFLICT (rpe) DO UPDATE SET extra = EXCLUDED.extra`,
      params,
    );
    batch.length = 0;
  };
  await eachRow("inhabilitados-dgcp.csv", async (row) => {
    const rpe = String(row.RPE || "").trim();
    if (!rpe) return;
    batch.push({
      rpe,
      extra: JSON.stringify({
        inhabilitado: true,
        motivoInhabilitacion: row.MOTIVO_INHABILITACION,
        fechaInhabilitacion: row.FECHA_INHABILITACION,
        urlCertificacion: row.URL_CERTIFICACION_RPE,
      }),
    });
    if (batch.length >= 400) await flushInh();
  });
  await flushInh();
  const result = await db.query(`
    UPDATE nodes n
    SET extra = n.extra || i.extra,
        summary = CASE
          WHEN coalesce(n.summary, '') LIKE '%Inhabilitado RPE%' THEN n.summary
          ELSE COALESCE(n.summary || ' · ', '') || 'Inhabilitado RPE'
        END
    FROM inh i
    WHERE n.extra->>'rpe' = i.rpe OR i.rpe = ANY(n.aliases)
  `);
  console.log(`inhabilitados updated=${result.rowCount}`);
}

async function ingestNomina(db) {
  const latest = new Map();
  await eachRow("nomina-dgcp.csv", async (row) => {
    const name = String(row.Nombre || "").trim();
    if (!name) return;
    const key = name.toLowerCase();
    const year = Number(row.Año || row.Ano || 0);
    const month = String(row.Mes || "");
    const prev = latest.get(key);
    if (!prev || year > prev.year) {
      latest.set(key, { name, year, month, row });
    }
  });

  await flushNodes(db, [
    {
      id: "i-dgcp",
      name: "Dirección General de Contrataciones Públicas",
      aliases: ["DGCP"],
      category: "institucion",
      extra: { source: { label: "DGCP", url: "https://www.dgcp.gob.do" } },
    },
  ]);

  const nodes = [];
  const edges = [];
  for (const { name, year, month, row } of latest.values()) {
    const id = `nom-dgcp-${slug(name).toLowerCase()}`;
    nodes.push({
      id,
      name,
      aliases: [],
      category: "persona",
      role: row.Función || row.Funcion || null,
      amount: null,
      extra: {
        salario: money(row["Sueldo Bruto"]),
        departamento: row.Departamento,
        condicion: row.Condición || row.Condicion,
        periodo: [month, year].filter(Boolean).join(" "),
        source: { label: "DGCP — Nómina 2022–2026", url: "https://datos.gob.do/dataset/nomina-empleados-dgcp" },
      },
      summary: [row.Función || row.Funcion, row.Departamento].filter(Boolean).join(" · "),
    });
    edges.push({ source: id, target: "i-dgcp", type: "trabaja_en" });
  }
  const n = await flushNodes(db, nodes);
  const e = await flushEdges(db, edges);
  console.log(`nomina people=${n} edges=${e}`);
}

async function ingestMipymes(db) {
  let n = 0;
  let batch = [];
  const flush = async () => {
    if (!batch.length) return;
    n += await flushNodes(db, batch);
    batch = [];
  };
  await eachRow("mipymes-dgcp.csv", async (row) => {
    const code = slug(row["Código de Proceso"] || row.CODIGO_PROCESO);
    if (!code) return;
    batch.push({
      id: `proc-${code}`,
      name: String(row.Descripción || row.Descripcion || code).slice(0, 280),
      aliases: [row["Código de Proceso"]].filter(Boolean),
      category: "contrato",
      role: row.Modalidad || null,
      amount: money(row["Monto Adjudicado Total"] || row["Monto Estimado"]),
      summary: [row["Estado de Proceso"], row["Unidad de Compra"]].filter(Boolean).join(" · "),
      extra: {
        mipyme: true,
        unidadCompra: row["Unidad de Compra"],
        source: { label: "DGCP — Adjudicaciones MiPymes 2024–2026", url: "https://datos.gob.do/dataset/procesos-dirigos-a-mipymes" },
      },
    });
    if (batch.length >= 800) await flush();
  });
  await flush();
  console.log(`mipymes upserted=${n}`);
}

async function main() {
  const only = new Set(
    (process.argv.find((a) => a.startsWith("--only=")) || "")
      .slice(7)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  const run = (name) => !only.size || only.has(name);
  const db = client();
  await db.connect();
  await db.query("SET synchronous_commit = off");
  if (run("procesos")) {
    console.log("ingest procesos…");
    await ingestProcesos(db);
  }
  if (run("adjudicaciones")) {
    console.log("ingest adjudicaciones…");
    await ingestAdjudicaciones(db);
  }
  if (run("mipymes")) {
    console.log("ingest mipymes…");
    await ingestMipymes(db);
  }
  if (run("inhabilitados")) {
    console.log("ingest inhabilitados…");
    await ingestInhabilitados(db);
  }
  if (run("nomina")) {
    console.log("ingest nomina…");
    await ingestNomina(db);
  }
  const { rows } = await db.query(
    `SELECT category, COUNT(*) FROM nodes GROUP BY category ORDER BY 2 DESC`,
  );
  console.log(rows);
  const { rows: e } = await db.query(`SELECT type, COUNT(*) FROM edges GROUP BY type ORDER BY 2 DESC`);
  console.log(e);
  await db.end();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
