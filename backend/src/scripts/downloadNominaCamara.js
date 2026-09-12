/**
 * Descarga nómina oficial Cámara de Diputados (WP File Download).
 * Por defecto: años 2025 y 2026 completos (todos los meses con XLSX).
 * Uso: node src/scripts/downloadNominaCamara.js
 *      YEARS=2025,2026 node src/scripts/downloadNominaCamara.js
 *      YEARS=latest node ...  → solo el mes más reciente
 */
import { createWriteStream, existsSync } from "node:fs";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";

const DIR = new URL("../../data/", import.meta.url);
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const AJAX =
  "https://www.camaradediputados.gob.do/wp-admin/admin-ajax.php?juwpfisadmin=false&action=wpfd";
const ROOT_CAT = 385;

const MONTH_ORDER = {
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  setiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
};

async function wpfd(task, id) {
  const url = `${AJAX}&task=${task}&id=${id}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Referer: "https://www.camaradediputados.gob.do/" },
  });
  if (!res.ok) throw new Error(`${task} ${id}: ${res.status}`);
  return res.json();
}

function classifyFile(file) {
  const title = `${file.post_title || ""} ${file.post_name || ""}`.toLowerCase();
  if (file.ext !== "xlsx") return null;
  if (/libre|nombramiento|remocion|remoción/.test(title)) return "libre";
  if (/diputado|empleado|carrera|nomina|nómina/.test(title)) return "diputados";
  return null;
}

function monthFromTitle(file) {
  const text = `${file.post_title || ""} ${file.post_name || ""}`.toLowerCase();
  for (const [name, num] of Object.entries(MONTH_ORDER)) {
    if (text.includes(name)) return { slug: name, num };
  }
  return null;
}

async function downloadFile(file, dest) {
  const url =
    file.linkdownload ||
    `${AJAX}&task=file.download&wpfd_category_id=${file.catid}&wpfd_file_id=${file.ID}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Referer: "https://www.camaradediputados.gob.do/" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`download ${file.ID}: ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function saveIfNeeded(file, destName, metaFiles) {
  const dest = path.join(DIR.pathname, destName);
  if (existsSync(dest)) {
    const st = await stat(dest);
    if (st.size > 1000) {
      metaFiles.push({ kind: classifyFile(file), dest: destName, id: file.ID, title: file.post_title, skipped: true });
      console.log("skip", destName);
      return;
    }
  }
  await downloadFile(file, dest);
  metaFiles.push({ kind: classifyFile(file), dest: destName, id: file.ID, title: file.post_title });
  console.log("ok", destName);
}

function parseYearsArg() {
  const raw = (process.env.YEARS || "2025,2026").trim().toLowerCase();
  if (raw === "latest") return "latest";
  return raw
    .split(",")
    .map((y) => y.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

async function collectMonthTargets(yearCat) {
  const yearData = await wpfd("categories.display", yearCat.term_id);
  const months = yearData.categories || [];
  const targets = [];

  if (months.length) {
    for (const month of months) {
      const filesData = await wpfd("files.display", month.term_id);
      const slug = String(month.name || "mes").toLowerCase().replace(/\s+/g, "-");
      const num = MONTH_ORDER[slug] || 0;
      targets.push({
        year: String(yearCat.name),
        monthSlug: slug,
        monthNum: num,
        files: filesData.files || [],
      });
    }
    return targets;
  }

  // Años viejos: XLSX sueltos en la carpeta del año
  const filesData = await wpfd("files.display", yearCat.term_id);
  const byMonth = new Map();
  for (const file of filesData.files || []) {
    if (!classifyFile(file)) continue;
    const m = monthFromTitle(file);
    if (!m) continue;
    const key = m.num;
    if (!byMonth.has(key)) {
      byMonth.set(key, {
        year: String(yearCat.name),
        monthSlug: m.slug,
        monthNum: m.num,
        files: [],
      });
    }
    byMonth.get(key).files.push(file);
  }
  return [...byMonth.values()];
}

async function main() {
  await mkdir(DIR, { recursive: true });
  const yearsArg = parseYearsArg();
  const root = await wpfd("categories.display", ROOT_CAT);
  const yearCats = root.categories || [];

  let selectedYears;
  if (yearsArg === "latest") {
    selectedYears = [
      [...yearCats].sort((a, b) => Number(b.name) - Number(a.name))[0],
    ].filter(Boolean);
  } else {
    const want = new Set(yearsArg.map(String));
    selectedYears = yearCats.filter((y) => want.has(String(y.name)));
  }
  if (!selectedYears.length) throw new Error("No hay carpetas de año pedidas en Nómina");

  const meta = {
    years: selectedYears.map((y) => String(y.name)),
    source: "https://www.camaradediputados.gob.do/",
    downloadedAt: new Date().toISOString(),
    files: [],
  };

  for (const yearCat of selectedYears.sort((a, b) => Number(a.name) - Number(b.name))) {
    let targets = await collectMonthTargets(yearCat);
    targets.sort((a, b) => a.monthNum - b.monthNum);

    if (yearsArg === "latest") {
      targets = targets.slice(-1);
    }

    for (const t of targets) {
      const monthNum = String(t.monthNum || 0).padStart(2, "0");
      for (const file of t.files) {
        const kind = classifyFile(file);
        if (!kind) continue;
        // Inferir mes desde título si la carpeta no tipifica bien
        const fromTitle = monthFromTitle(file);
        const slug = t.monthSlug || fromTitle?.slug || "mes";
        const num = t.monthNum || fromTitle?.num || 0;
        const ym = `${t.year}-${String(num).padStart(2, "0")}`;
        const destName = `nomina-camara-${ym}-${kind}.xlsx`;
        await saveIfNeeded(file, destName, meta.files);
        const last = meta.files[meta.files.length - 1];
        if (last) {
          last.year = t.year;
          last.month = slug;
          last.ym = ym;
          last.kind = kind;
        }
      }
    }
  }

  if (!meta.files.length) throw new Error("No se encontraron XLSX de nómina");

  await writeFile(
    path.join(DIR.pathname, "nomina-camara-manifest.json"),
    JSON.stringify(meta, null, 2),
  );
  // Compat con ingest anterior
  const latest = [...meta.files].filter((f) => f.ym).sort((a, b) => a.ym.localeCompare(b.ym)).at(-1);
  if (latest) {
    await writeFile(
      path.join(DIR.pathname, "nomina-camara-latest.json"),
      JSON.stringify(
        {
          year: latest.year,
          month: latest.month,
          source: meta.source,
          downloadedAt: meta.downloadedAt,
          files: meta.files.filter((f) => f.ym === latest.ym),
        },
        null,
        2,
      ),
    );
  }

  const yms = [...new Set(meta.files.map((f) => f.ym).filter(Boolean))].sort();
  console.log({ years: meta.years, months: yms.length, files: meta.files.length, range: `${yms[0]}…${yms.at(-1)}` });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
