/**
 * Job diario: baja fuentes oficiales y actualiza Postgres.
 * Diseñado para un cron de Railway (una vez al día, luego sale).
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(new URL(".", import.meta.url)));

function run(file) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, file)], {
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${file} exited ${code}`));
    });
  });
}

console.log("centinela refresh diario", new Date().toISOString());
await run("downloadPrestamos.js");
await run("ingestPrestamos.js");
await run("downloadDgcp.js");
await run("ingestDgcp.js");
console.log("centinela refresh diario OK", new Date().toISOString());
