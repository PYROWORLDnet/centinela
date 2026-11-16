# Centinela

**Tu cuenta con el Estado.** Cuánto entra al Estado dominicano, en qué se gasta, a quién le compran y qué se hizo en tu provincia. Datos oficiales, explicados simple.

**Sitio:** [centinela.do](https://centinela.do)

Cada número sale tal cual de un archivo oficial (Hacienda/DIGEPRES, DGII, DGCP), tiene su fuente visible y pasa verificaciones automáticas antes de publicarse. Si algo no cuadra, no se publica.

- Especificación de producto: [PRODUCT.md](./PRODUCT.md)
- Cómo contribuir: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Contratos al día desde la API de la DGCP: [docs/COLECTOR_DGCP.md](./docs/COLECTOR_DGCP.md)
- Informe de factibilidad técnica: [docs/INFORME_FACTIBILIDAD_DATOS_ABIERTOS.md](./docs/INFORME_FACTIBILIDAD_DATOS_ABIERTOS.md)

## Pantallas

| Ruta | Qué muestra |
|---|---|
| `/` | Balance (entró, salió, déficit), gasto e intereses por día, de cada RD$100, cumplimiento, últimos contratos |
| `/entradas` | Quién cobró (DGII, Aduanas, Tesorería) y qué impuestos |
| `/gastos` | Para qué, tipo de gasto, instituciones, deuda y metas físicas |
| `/contratos` | Contratos del año, alertas, proveedores e instituciones |
| `/provincia` | Inversión pública en cada una de las 32 provincias |
| `/tu-parte` | Calculadora: cuánto pagaste y cómo se repartió |

## Cómo funciona

```
Fuentes oficiales ──► backend/src/scripts/actualizarFinanzas.js ──► backend/src/data/finanzas/datos.json ──► API /api/finanzas ──► app
 (Excel, CSV, OCDS)     lee tablas por título · verifica · guarda hash         (solo si todo cuadra)          (Express)       (React)
```

- `backend/src/finanzas/` — un lector por fuente (`digepres.js`, `dgii.js`, `contratos.js`) y las reglas de impuestos (`reglas.js`).
- `.github/workflows/actualizar-datos.yml` — corre la actualización cada día y hace commit si hay datos nuevos.
- Los archivos originales descargados quedan en `backend/data/fuentes/` (no se suben al repo).

## Correrlo en local

No necesitas base de datos ni claves.

```bash
# Terminal 1
cd backend
npm install
npm run dev            # API en http://localhost:4000

# Terminal 2
cd frontend
npm install
npm run dev            # App en http://localhost:5173
```

Para volver a bajar los datos oficiales y regenerar `datos.json`:

```bash
cd backend
npm run actualizar          # usa lo descargado si ya existe
npm run actualizar:refresh  # vuelve a descargar todo
```

## Licencias

| Qué | Licencia | Archivo |
|---|---|---|
| Código | MIT | [LICENSE](./LICENSE) |
| Datos derivados que publica Centinela | ODbL 1.0 | [DATA_LICENSE](./DATA_LICENSE) |

## Seguridad

- La API pública es de solo lectura. No hay endpoints para escribir.
- No hay claves en el repo. Reporta una vulnerabilidad en privado a **info@nodoia.app**.
