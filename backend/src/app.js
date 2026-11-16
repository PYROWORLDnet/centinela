import express from "express";
import cors from "cors";
import datos from "./data/finanzas/datos.json" with { type: "json" };

/**
 * API pública de solo lectura. Los datos vienen de backend/src/data/finanzas/datos.json,
 * que genera src/scripts/actualizarFinanzas.js a partir de las fuentes oficiales
 * (solo se publica si pasan todas las verificaciones).
 */
export function createApp() {
  const app = express();

  app.use(cors());
  app.disable("x-powered-by");

  const cache = (res) => res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400");

  app.get("/", (_req, res) => {
    res.type("html").send(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Centinela API</title>
<style>body{font-family:system-ui,sans-serif;max-width:36rem;margin:4rem auto;padding:0 1.25rem;line-height:1.5}</style></head>
<body><h1>Centinela API</h1><p>Datos públicos del Estado dominicano, con fuente.</p>
<p>Período publicado: <b>${datos.periodo.etiqueta}</b></p>
<p><a href="/api/finanzas">/api/finanzas</a> · <a href="/api/finanzas/fuentes">/api/finanzas/fuentes</a> · <a href="/health">/health</a></p>
<p>La app está en <a href="http://localhost:5173">http://localhost:5173</a>.</p></body></html>`);
  });

  const health = (_req, res) => res.json({ ok: true, service: "centinela-backend", periodo: datos.periodo.etiqueta, generado: datos.generado });
  app.get("/health", health);
  app.get("/api/health", health);

  app.get("/api/finanzas", (_req, res) => {
    cache(res);
    res.json(datos);
  });

  app.get("/api/finanzas/fuentes", (_req, res) => {
    cache(res);
    res.json({ generado: datos.generado, periodo: datos.periodo, fuentes: datos.fuentes, verificaciones: datos.verificaciones });
  });

  app.use("/api", (_req, res) => res.status(404).json({ error: "No encontrado" }));

  return app;
}
