/**
 * Job diario: baja TODAS las fuentes oficiales y actualiza Postgres.
 * Diseñado para un cron de Railway (una vez al día, luego sale).
 *
 * Fuentes: préstamos, DGCP (+ proveedores/RM), nómina Cámara, nómina Senado, DJP.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadEnv } from "../db/loadEnv.js";

loadEnv();

const root = path.dirname(fileURLToPath(new URL(".", import.meta.url)));

function run(file, env = {}) {
  return new Promise((resolve, reject) => {
    console.log("→", file, Object.keys(env).length ? env : "");
    const child = spawn(process.execPath, [path.join(root, file)], {
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${file} exited ${code}`));
    });
  });
}

const started = new Date().toISOString();
console.log("centinela refresh diario", started);

const steps = [
  ["downloadPrestamos.js"],
  ["ingestPrestamos.js"],
  ["downloadDgcp.js"],
  ["ingestDgcp.js"],
  ["ingestProveedores.js"],
  ["ingestMercantil.js"],
  ["downloadNominaCamara.js", { YEARS: "2025,2026" }],
  ["ingestNominaCamara.js", { YEARS: "2025,2026" }],
  ["downloadNominaSenado.js", { YEARS: "2025,2026" }],
  ["ingestNominaSenado.js", { YEARS: "2025,2026" }],
  // Catálogo completo; PDFs solo de declaraciones nuevas.
  ["downloadDjp.js", { REUSE_CATALOG: "0", DJP_INCREMENTAL: "1", PDF_CONCURRENCY: "10" }],
  ["ingestDjp.js"],
];

for (const [file, env] of steps) {
  await run(file, env || {});
}

console.log("centinela refresh diario OK", { started, finished: new Date().toISOString() });
