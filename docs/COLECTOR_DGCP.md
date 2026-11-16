# Colector de contratos DGCP (en una computadora con internet de casa)

## Por qué existe

La API de la DGCP (`datosabiertos.dgcp.gob.do`) y sus archivos (`www.dgcp.gob.do`) están detrás de
Cloudflare, que bloquea a los servidores en la nube (GitHub, Vercel, sesiones de Claude en la nube).
Desde una conexión normal de casa funcionan.

Mientras tanto, la app usa la copia mensual que publica el **Open Contracting Data Registry**
(`data.open-contracting.org/en/publication/22`), que viene de la misma API. Es oficial y confiable,
pero llega con unas semanas de atraso. El colector local trae los contratos al día.

## Cómo encaja

1. El colector deja los procesos de 2026 en formato OCDS (una línea JSON por proceso, comprimido) en
   `backend/data/fuentes/dgcp-2026.jsonl.gz`.
2. `npm run actualizar --prefix backend` usa ese archivo si es más nuevo que la copia del registro,
   corre todas las verificaciones y regenera `backend/src/data/finanzas/datos.json`.
3. Se hace commit y push de `datos.json`. La actualización automática diaria de GitHub **nunca**
   reemplaza contratos más nuevos por una copia más vieja.

## Qué pedirle a Claude Code en tu computadora (chat nuevo)

Abre Claude Code en la carpeta del repo `centinela` y pega esto:

> Lee `docs/COLECTOR_DGCP.md` y `backend/src/finanzas/contratos.js`. Quiero que escribas
> `backend/src/scripts/colectarDgcp.js` para bajar los procesos de compra de 2026 desde la API
> oficial de la DGCP (`https://datosabiertos.dgcp.gob.do/api-dgcp/v1`, documentación en
> `https://datosabiertos.dgcp.gob.do/docs/index.html`). Primero lee la documentación y prueba los
> endpoints con pocas solicitudes. Reglas: máximo 50 solicitudes por minuto; fechas que llegan con
> sufijo Z son hora de RD (UTC-4); `enddate` no incluye el último día; `limit` máximo 1000; los
> resultados de `/procesos` no vienen ordenados, así que pide ventanas de fechas chicas y elimina
> duplicados. El archivo de salida debe tener el mismo formato OCDS que usa `contratos.js`
> (`ocid`, `tender`, `awards`, `contracts`, `parties`, `buyer`) en
> `backend/data/fuentes/dgcp-2026.jsonl.gz`. Después corre `npm run actualizar --prefix backend`,
> enséñame qué cambió y, si todas las verificaciones pasan, haz commit de `datos.json` y del script.

## Cada cuánto correrlo

Una vez al día es suficiente (la DGCP actualiza 4 veces al día). Se puede programar con el
Programador de tareas de Windows o `cron` en Mac/Linux, con la computadora encendida.
