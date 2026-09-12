/**
 * Descarga nómina oficial del Senado (WP File Download).
 * Fuente: https://www.senadord.gob.do/transparencia/recursos-humanos/nomina-de-empleados/
 * Default: YEARS=2025,2026
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
  "https://www.senadord.gob.do/transparencia/wp-admin/admin-ajax.php?juwpfisadmin=false&action=wpfd";
const ROOT_CAT = 220;
const REFERER =
  "https://www.senadord.gob.do/transparencia/recursos-humanos/nomina-de-empleados/";

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
  const res = await fetch(`${AJAX}&task=${task}&id=${id}`, {
    headers: { "User-Agent": UA, Referer: REFERER },
  });
  if (!res.ok) throw new Error(`${task} ${id}: ${res.status}`);
  return res.json();
}

async function downloadFile(file, dest) {
  const url =
    file.linkdownload ||
    `${AJAX}&task=file.download&wpfd_category_id=${file.catid}&wpfd_file_id=${file.ID}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Referer: REFERER },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`download ${file.ID}: ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
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

async function main() {
  await mkdir(DIR, { recursive: true });
  const yearsArg = parseYearsArg();
  const root = await wpfd("categories.display", ROOT_CAT);
  const yearCats = root.categories || [];

  let selected =
    yearsArg === "latest"
      ? [[...yearCats].sort((a, b) => Number(b.name) - Number(a.name))[0]].filter(Boolean)
      : yearCats.filter((y) => new Set(yearsArg.map(String)).has(String(y.name)));
  if (!selected.length) throw new Error("No hay carpetas de año pedidas");

  const meta = {
    years: selected.map((y) => String(y.name)),
    source: REFERER,
    downloadedAt: new Date().toISOString(),
    files: [],
  };

  for (const yearCat of selected.sort((a, b) => Number(a.name) - Number(b.name))) {
    const yearData = await wpfd("categories.display", yearCat.term_id);
    let months = [...(yearData.categories || [])].sort((a, b) => {
      const ma = MONTH_ORDER[String(a.name || "").toLowerCase()] || 0;
      const mb = MONTH_ORDER[String(b.name || "").toLowerCase()] || 0;
      return ma - mb;
    });
    if (yearsArg === "latest") months = months.slice(-1);

    for (const month of months) {
      const slug = String(month.name || "mes").toLowerCase().replace(/\s+/g, "-");
      const num = MONTH_ORDER[slug] || 0;
      const ym = `${yearCat.name}-${String(num).padStart(2, "0")}`;
      const filesData = await wpfd("files.display", month.term_id);
      const xlsx = (filesData.files || []).filter((f) => f.ext === "xlsx" || f.ext === "xls");
      if (!xlsx.length) {
        console.warn("sin xlsx", ym);
        continue;
      }
      // Preferir "Sueldos Fijos" / nómina principal
      const file =
        xlsx.find((f) => /sueldos?\s*fijos|nomina/i.test(f.post_title || "")) || xlsx[0];
      const destName = `nomina-senado-${ym}.xlsx`;
      const dest = path.join(DIR.pathname, destName);
      if (existsSync(dest)) {
        const st = await stat(dest);
        if (st.size > 1000) {
          meta.files.push({
            dest: destName,
            id: file.ID,
            title: file.post_title,
            year: String(yearCat.name),
            month: slug,
            ym,
            skipped: true,
          });
          console.log("skip", destName);
          continue;
        }
      }
      await downloadFile(file, dest);
      meta.files.push({
        dest: destName,
        id: file.ID,
        title: file.post_title,
        year: String(yearCat.name),
        month: slug,
        ym,
      });
      console.log("ok", destName);
    }
  }

  if (!meta.files.length) throw new Error("No se encontraron XLSX de nómina Senado");
  await writeFile(path.join(DIR.pathname, "nomina-senado-manifest.json"), JSON.stringify(meta, null, 2));
  const yms = [...new Set(meta.files.map((f) => f.ym))].sort();
  console.log({ years: meta.years, months: yms.length, files: meta.files.length, range: `${yms[0]}…${yms.at(-1)}` });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
