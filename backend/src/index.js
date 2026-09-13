import { loadEnv } from "./db/loadEnv.js";
loadEnv();

import express from "express";
import cors from "cors";
import {
  getGraph,
  getLeads,
  getNode,
  getScenarios,
  getSubgraph,
  searchNodes,
} from "./data/demoGraph.js";
import { buscarConexiones } from "./tools/buscarConexiones.js";
import { getAlerts, resolveAlertNode } from "./data/alerts.js";
import {
  getGraph as pgGraph,
  getNode as pgNode,
  getSubgraph as pgSubgraph,
  hasDatabase,
  listByCategory as pgListByCategory,
  contractYears as pgContractYears,
  searchNodes as pgSearch,
} from "./data/pgGraph.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

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
  <p>Este puerto (<code>:4000</code>) solo sirve datos JSON para el grafo.</p>
  <p>La interfaz la abres aquí:</p>
  <p><a href="http://localhost:5173">http://localhost:5173</a></p>
  <p>Endpoints: <a href="/api/graph">/api/graph</a> · <a href="/health">/health</a></p>
</body>
</html>`);
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "centinela-backend" });
});

app.get("/api/graph", async (_req, res) => {
  if (hasDatabase()) {
    const g = await pgGraph();
    if (g) {
      res.json(g);
      return;
    }
  }
  res.json(getGraph());
});

app.get("/api/category/:category", async (req, res) => {
  const category = String(req.params.category || "");
  const year = req.query.year ? String(req.query.year) : null;
  if (hasDatabase()) {
    const results = await pgListByCategory(category, 40, { year });
    const payload = { results };
    if (category === "contrato") {
      payload.years = await pgContractYears();
    }
    res.json(payload);
    return;
  }
  const all = getGraph().nodes.filter((n) => category === "all" || n.category === category);
  res.json({
    results: all
      .slice()
      .sort((a, b) => (b.degree || 0) - (a.degree || 0))
      .slice(0, 40)
      .map((n) => ({
        id: n.id,
        name: n.name,
        category: n.category,
        role: n.role,
        summary: n.summary,
        amount: n.amount,
        degree: n.degree,
      })),
  });
});

app.get("/api/scenarios", (_req, res) => {
  res.json({ scenarios: getScenarios() });
});

app.get("/api/leads", (_req, res) => {
  res.json({ leads: getLeads() });
});

app.get("/api/subgraph", async (req, res) => {
  const ids = String(req.query.ids || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const hops = Math.min(3, Math.max(0, Number(req.query.hops) || 1));
  const max = Math.min(80, Math.max(8, Number(req.query.max) || 28));
  if (hasDatabase()) {
    res.json(await pgSubgraph(ids, hops, max));
    return;
  }
  res.json(getSubgraph(ids, hops, max));
});

app.get("/api/alerts", async (_req, res) => {
  res.json(await getAlerts());
});

app.get("/api/search", async (req, res) => {
  const q = String(req.query.q || "");
  if (hasDatabase()) {
    res.json({ results: await pgSearch(q) });
    return;
  }
  res.json({ results: searchNodes(q) });
});

app.post("/api/tools/buscar_conexiones", async (req, res) => {
  const q = String(req.body?.q || req.body?.nombre || "");
  const hops = Number(req.body?.hops || 1);
  res.json(await buscarConexiones({ q, hops }));
});

app.get("/api/nodes/:id", async (req, res) => {
  if (hasDatabase()) {
    const node = (await pgNode(req.params.id)) || (await resolveAlertNode(req.params.id));
    if (!node) {
      res.status(404).json({ error: "Nodo no encontrado" });
      return;
    }
    res.json(node);
    return;
  }
  const node = getNode(req.params.id) || (await resolveAlertNode(req.params.id));
  if (!node) {
    res.status(404).json({ error: "Nodo no encontrado" });
    return;
  }
  res.json(node);
});

app.listen(port, () => {
  console.log(`centinela backend listening on :${port}`);
});
