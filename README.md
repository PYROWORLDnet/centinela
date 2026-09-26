# Centinela

Mapa curado de transparencia en República Dominicana: temas, nodos y recorridos con fuente.

**Sitio:** [centinela.do](https://centinela.do)

Cualquier persona puede proponer un tema nuevo o una conexión. Nadie escribe directo en el repositorio oficial: todo entra por Pull Request y solo los [maintainers](./MAINTAINERS.md) aprueban.

Lee [CONTRIBUTING.md](./CONTRIBUTING.md) antes de abrir un issue o un PR.

## Qué es

Centinela conecta datos públicos dominicanos (gasto, contratos, instituciones, empresas, préstamos) en un grafo navegable. El diferencial no es “tener el dato”: es ver **quién conecta con quién**, con fuente en cada nodo y cada edge.

Especificación de producto: [PRODUCT.md](./PRODUCT.md).

## Licencias

| Qué | Licencia | Archivo |
|---|---|---|
| Código | MIT | [LICENSE](./LICENSE) |
| Datos curados (nodos, edges, fuentes, tours) | ODbL 1.0 | [DATA_LICENSE](./DATA_LICENSE) |

## Stack

- **backend** — Express. El mapa público sale de `backend/src/data/curated` (JavaScript), no de la base de producción.
- **frontend** — Vite + React + `react-force-graph-2d`. Solo habla con el backend por `/api`.
- **Postgres** — opcional y **solo para scripts de ingesta del maintainer**. No forma parte del flujo local de un contribuyente.

## Cómo correrlo en local

No necesitas base de datos ni claves de API para ver el mapa.

```bash
# Terminal 1
cd backend
cp .env.example .env   # deja OPENAI_API_KEY vacío si no quieres TTS de OpenAI
npm install
npm run dev

# Terminal 2
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173

Empieza en **Guía** (`/todo`) o **El Núcleo** (`/nucleo`). Busca p. ej. Rizek, Cúpula, SeNaSa.

Variables: [`.env.example`](./.env.example) (placeholders). Copia `backend/.env.example` → `backend/.env`. El archivo `.env` real no se sube.

## Qué no está en este repositorio

- La base de datos de producción. Solo el maintainer la toca.
- Dumps (`.sql` de producción, `.csv` crudos, `.json` con datos reales de ingesta).
- Claves de API, tokens o cadenas de conexión.

Para probar localmente usa el grafo curado que ya va en el código. Si hace falta un dump anonimizado de Postgres, lo publica el maintainer por fuera de este repo. `backend/src/db/schema.sql` y `backend/src/db/seed-public.sql` son esquema y semilla pública de ejemplo, no la base de producción.

Los scripts `backend/src/scripts/refreshDiario.js` e `ingest*` corren **solo en el entorno del maintainer**, con variables de entorno privadas.

## Seguridad

- El frontend nunca recibe `DATABASE_URL` ni credenciales.
- La API pública es de lectura (temas, grafo, búsqueda, voz). No hay endpoints para crear, editar o borrar el grafo.
- Reporta una vulnerabilidad en privado a **info@nodoia.app**. No abras un issue público con secretos.

## Contribuir

1. Haz fork.
2. Crea una rama (`tema-electricidad`, `edge-deuda-banca`, …).
3. Sigue [docs/TEMPLATE_TEMA.md](./docs/TEMPLATE_TEMA.md) y [CONTRIBUTING.md](./CONTRIBUTING.md).
4. Abre un Pull Request.

**Sin fuente verificable, no entra.** Si un monto no se puede verificar, el edge se deja sin cifra.
