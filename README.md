# Centinela

Mapa curado de transparencia en República Dominicana — temas, nodos y recorridos con fuentes.

Ver [PRODUCT.md](./PRODUCT.md) para la especificación completa.

## Stack

- **backend** — Express + datos curados (`backend/src/data/curated`)
- **frontend** — Vite + React + `react-force-graph-2d`

## Desarrollo

```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
```

Abre http://localhost:5173

Empieza en **Guía** (`/todo`) o **El Núcleo** (`/nucleo`). Busca p. ej. Rizek, Cúpula, SeNaSa.
