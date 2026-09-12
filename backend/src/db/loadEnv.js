import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** Carga .env del backend sin dependencia extra. No pisa vars ya definidas. */
export function loadEnv() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
  const path = resolve(root, ".env");
  if (!existsSync(path)) return false;
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] == null || process.env[key] === "") {
      process.env[key] = val;
    }
  }
  return true;
}
