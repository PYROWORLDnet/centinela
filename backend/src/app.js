import express from "express";
import cors from "cors";
import { buscarConexiones } from "./tools/buscarConexiones.js";
import {
  listThemes,
  getCuratedGraph,
  getCuratedNode,
  getCuratedTour,
  searchCurated,
} from "./data/curated/index.js";
import { FILM_LINES, listTtsVoices, synthesizeSpeech } from "./tts.js";
import { getEpisode, listEpisodes } from "./data/episodes/index.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "32kb" }));

  app.get("/", (_req, res) => {
    res.type("html").send(`<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Centinela API</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #141414; color: #eceff4;
      max-width: 36rem; margin: 4rem auto; padding: 0 1.25rem; line-height: 1.5; }
    a { color: #5ecfc4; }
    code { background: #222; padding: 0.1rem 0.35rem; }
    .ok { color: #5ecfc4; }
  </style>
</head>
<body>
  <p class="ok">● Centinela backend OK</p>
  <h1>Esto no es la app visual</h1>
  <p>Este puerto (<code>:4000</code>) solo sirve datos JSON del mapa curado.</p>
  <p>La interfaz la abres aquí:</p>
  <p><a href="http://localhost:5173">http://localhost:5173</a></p>
  <p>Endpoints: <a href="/api/curated/themes">/api/curated/themes</a> · <a href="/health">/health</a></p>
</body>
</html>`);
  });

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "centinela-backend" });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "centinela-backend" });
  });

  app.get("/api/curated/themes", (_req, res) => {
    res.json({ themes: listThemes(), defaultTheme: "todo" });
  });

  app.get("/api/tts/voices", (_req, res) => {
    res.json(listTtsVoices());
  });

  app.get("/api/tts/film-lines", (_req, res) => {
    res.json(FILM_LINES);
  });

  app.get("/api/episodes", (_req, res) => {
    res.json(listEpisodes());
  });

  app.get("/api/episodes/:id", (req, res) => {
    const ep = getEpisode(req.params.id);
    if (!ep) return res.status(404).json({ error: "Episodio no encontrado" });
    res.json(ep);
  });

  app.post("/api/tts", async (req, res) => {
    try {
      const text = String(req.body?.text || "");
      const { audio } = await synthesizeSpeech(text, listTtsVoices().defaultVoice);
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "private, max-age=3600");
      res.send(audio);
    } catch (err) {
      const status = err.status && Number.isInteger(err.status) ? err.status : 500;
      res.status(status).json({ error: err.message || "Error de voz" });
    }
  });

  /** Audio + tiempos por palabra (ElevenLabs) para subtítulos del modo película. */
  app.post("/api/tts/timed", async (req, res) => {
    try {
      const text = String(req.body?.text || "");
      const voice = String(req.body?.voice || "");
      const { audio, words } = await synthesizeSpeech(text, voice, { film: true });
      res.setHeader("Cache-Control", "private, max-age=3600");
      res.json({ audio: audio.toString("base64"), mime: "audio/mpeg", words });
    } catch (err) {
      const status = err.status && Number.isInteger(err.status) ? err.status : 500;
      res.status(status).json({ error: err.message || "Error de voz" });
    }
  });

  app.get("/api/curated/:theme/tour", (req, res) => {
    const tour = getCuratedTour(req.params.theme);
    if (!tour) {
      res.status(404).json({ error: "Sin recorrido para este tema" });
      return;
    }
    res.json(tour);
  });

  app.get("/api/curated/search", (req, res) => {
    const q = String(req.query.q || "");
    const theme = req.query.theme ? String(req.query.theme) : null;
    res.json({ results: searchCurated(q, theme) });
  });

  app.get("/api/curated/nodes/:id", (req, res) => {
    const node = getCuratedNode(req.params.id);
    if (!node) {
      res.status(404).json({ error: "Nodo curado no encontrado" });
      return;
    }
    res.json(node);
  });

  app.get("/api/curated/:theme/graph", (req, res) => {
    const pill = String(req.query.pill || "all");
    const g = getCuratedGraph(req.params.theme, pill);
    if (!g) {
      res.status(404).json({ error: "Tema no encontrado" });
      return;
    }
    res.json(g);
  });

  app.post("/api/tools/buscar_conexiones", async (req, res) => {
    const q = String(req.body?.q || req.body?.nombre || "");
    const hops = Number(req.body?.hops || 1);
    res.json(await buscarConexiones({ q, hops }));
  });

  app.get("/api/nodes/:id", (req, res) => {
    const curated = getCuratedNode(req.params.id);
    if (!curated) {
      res.status(404).json({ error: "Nodo no encontrado" });
      return;
    }
    res.json(curated);
  });

  app.get("/api/search", (req, res) => {
    const q = String(req.query.q || "");
    res.json({ results: searchCurated(q) });
  });

  return app;
}
