/**
 * Descargas de fuentes oficiales con caché local en backend/data/ (gitignored).
 * Cada archivo descargado queda guardado tal cual, con su hash, como evidencia.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";

export const CACHE_DIR = new URL("../../data/fuentes/", import.meta.url).pathname;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

export async function fetchWithRetry(url, { tries = 4, headers = {}, timeoutMs = 120_000 } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "*/*", ...headers },
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.status === 403 && (res.headers.get("server") || "").includes("cloudflare")) {
        throw Object.assign(new Error(`Cloudflare bloqueó ${url}`), { cloudflare: true });
      }
      if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
      return res;
    } catch (err) {
      lastErr = err;
      if (err.cloudflare) break;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
  throw lastErr;
}

export async function getJson(url) {
  const res = await fetchWithRetry(url, { headers: { Accept: "application/json" } });
  return res.json();
}

/** Descarga a caché (si no existe ya) y devuelve { file, sha256, bytes, url, descargado }. */
export async function download(url, nombre, { refresh = false } = {}) {
  await mkdir(CACHE_DIR, { recursive: true });
  const file = path.join(CACHE_DIR, nombre);
  let buf;
  let descargado;
  const existe = await stat(file).catch(() => null);
  if (existe && !refresh) {
    buf = await readFile(file);
    descargado = existe.mtime.toISOString();
  } else {
    const res = await fetchWithRetry(url, { timeoutMs: 600_000 });
    buf = Buffer.from(await res.arrayBuffer());
    await writeFile(file, buf);
    descargado = new Date().toISOString();
  }
  return {
    file,
    url,
    bytes: buf.length,
    sha256: createHash("sha256").update(buf).digest("hex"),
    descargado,
  };
}
