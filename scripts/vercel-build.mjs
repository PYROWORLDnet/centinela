#!/usr/bin/env node
/**
 * Emit Vercel Build Output API v3:
 *  - static SPA from frontend/dist
 *  - bundled Express API at /api
 *
 * Avoids SPA rewrites swallowing /api/* as index.html.
 */
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const out = path.join(root, ".vercel", "output");
const require = createRequire(import.meta.url);

function run(cmd, args, cwd = root) {
  const res = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: false });
  if (res.status !== 0) {
    throw new Error(`Command failed (${res.status}): ${cmd} ${args.join(" ")}`);
  }
}

function ensureEsbuild() {
  try {
    return require.resolve("esbuild");
  } catch {
    console.log("Installing esbuild…");
    run("npm", ["install", "--no-save", "esbuild@0.25.0"], root);
    return require.resolve("esbuild");
  }
}

rmSync(out, { recursive: true, force: true });
mkdirSync(path.join(out, "static"), { recursive: true });
mkdirSync(path.join(out, "functions", "api.func"), { recursive: true });

console.log("→ install frontend + backend deps");
run("npm", ["install", "--prefix", "frontend"]);
run("npm", ["install", "--prefix", "backend"]);

console.log("→ build frontend");
run("npm", ["run", "build", "--prefix", "frontend"]);

const dist = path.join(root, "frontend", "dist");
if (!existsSync(dist)) throw new Error("frontend/dist missing after build");
cpSync(dist, path.join(out, "static"), { recursive: true });

console.log("→ bundle API serverless function (ESM)");
ensureEsbuild();
const esmEntry = path.join(root, "api", "vercel-handler.mjs");
writeFileSync(
  esmEntry,
  `
import { loadEnv } from "../backend/src/db/loadEnv.js";
loadEnv();
import { createApp } from "../backend/src/app.js";
export default createApp();
`.trimStart(),
);

run(
  "npx",
  [
    "esbuild",
    esmEntry,
    "--bundle",
    "--platform=node",
    "--format=esm",
    "--outfile=" + path.join(out, "functions", "api.func", "index.js"),
    "--packages=bundle",
    "--external:pg-native",
    "--banner:js=import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);",
  ],
  root,
);

writeFileSync(
  path.join(out, "functions", "api.func", ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.js",
      launcherType: "Nodejs",
      shouldAddHelpers: true,
      supportsResponseStreaming: false,
      maxDuration: 30,
    },
    null,
    2,
  ),
);

writeFileSync(
  path.join(out, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "^/api(?:/.*)?$", dest: "/api" },
        { src: "^/health$", dest: "/api" },
        { src: "^/(.*)$", dest: "/index.html" },
      ],
    },
    null,
    2,
  ),
);

console.log("✓ Vercel output ready at .vercel/output");
