# Centinela

Plataforma de transparencia gubernamental RD — grafo navegable de personas, empresas, contratos e instituciones.

Ver [PRODUCT.md](./PRODUCT.md) para la especificación completa.

## Stack (fase demo)

- **backend** — Express + grafo demo en memoria
- **frontend** — Vite + React + `react-force-graph-2d` (vista galaxia estilo Obsidian)

## Desarrollo

```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
```

Abre http://localhost:5173

Prueba buscar: **Horizonte**, **Ramírez**, **Constructora Norte**.
