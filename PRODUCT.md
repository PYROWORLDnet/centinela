# Centinela — Tu cuenta con el Estado
## Especificación de producto (v2, noviembre 2026)

---

## 1. Qué es

Una app web, pensada para el celular, donde cualquier dominicano ve en un minuto:

- **Cuánto entró** al Estado y quién lo cobró (DGII, Aduanas, Tesorería), más lo que se tomó prestado.
- **En qué se gastó**: para qué (educación, salud, deuda…), en qué tipo de gasto (sueldos, compras, obras…) y qué institución lo gastó.
- **Si hay déficit** y cuánto se va en intereses de la deuda.
- **A quién le compran**: contratos del portal de Compras Públicas, con alertas (compras por excepción, concursos con un solo oferente).
- **Qué se hizo en su provincia**: inversión pública por provincia y por tipo, comparada con el año anterior.
- **Su parte**: con su sueldo y sus compras, cuánto pagó de impuestos y cómo se repartió.

El contexto: desde el 15 de noviembre de 2026 la facturación electrónica (Ley 32-23) es obligatoria también para micro y pequeños negocios. La queja de la gente es "me controlan cada peso, pero yo no sé en qué gastan lo que pago". Centinela responde eso.

## 2. Principio número uno: números reales o nada

Lo más vulnerable de un proyecto así es la incongruencia. Por eso:

1. **Todos los números salen tal cual de archivos oficiales.** Nada se transcribe a mano.
2. **Cada número tiene fuente** (institución, documento, tabla y fecha de descarga) visible en la app.
3. **Verificación automática antes de publicar.** Ejemplos: ingresos − gastos = resultado; la suma de funciones = gasto total = suma de instituciones; la suma de provincias = total de cada región; lo que reporta la DGII en su dataset = lo que reporta Hacienda para la DGII. Si una sola verificación falla, no se publica nada nuevo.
4. **Errores de la fuente se señalan, no se esconden ni se suman.** Ejemplo real: un contrato registrado por RD$44,350 millones cuyo propio proceso estimaba RD$44.35 millones. Se excluye de totales y se muestra aparte.
5. **Las alertas no son acusaciones.** "Por excepción" y "un solo oferente" son señales para revisar, y la app lo dice.
6. **Si algo es estimado, se marca** (por ejemplo, el ITBIS de la calculadora).

## 3. Fuentes

| Fuente | Qué da | Formato | Frecuencia | Acceso desde la nube |
|---|---|---|---|---|
| Hacienda y Economía / DIGEPRES — Informe de Ejecución Presupuestaria (Excel "Cuadros y gráficos") | Ingresos, gastos, déficit, financiamiento, gasto por función / tipo / institución, servicio de deuda, inversión por provincia, metas físicas | XLSX | Mensual / trimestral acumulado | ✅ |
| DGII — Recaudación Efectiva (datos.gob.do) | Impuestos por tipo y por mes desde 2017 | CSV | Mensual | ✅ |
| DGCP — procesos y contratos en OCDS, vía Open Contracting Data Registry | Contratos, proveedores, instituciones, método de compra, número de oferentes | JSONL | Mensual (copia) | ✅ |
| DGCP — API oficial | Lo mismo, al día | JSON | 4 veces al día | ❌ Cloudflare. Ver [docs/COLECTOR_DGCP.md](./docs/COLECTOR_DGCP.md) |
| MAP — Nómina pública general | Empleados públicos por institución, cargo y sueldo | JSON | Mensual | ✅ (aún no usado en la app) |
| DGII / TSS — reglas de ISR, TSS e ITBIS | Escala de ISR 2026, tasas y topes de TSS, ITBIS 18% | Texto oficial | Anual | Fijo en `backend/src/finanzas/reglas.js` |

## 4. Cómo se actualiza

- `backend/src/scripts/actualizarFinanzas.js` busca el informe más reciente de DIGEPRES, el dataset de la DGII y los contratos; descarga, lee las tablas **por su título**, verifica y escribe `backend/src/data/finanzas/datos.json`.
- Una tarea de GitHub Actions lo corre cada día a las 7:17 a. m. (RD). Si los datos cambiaron y todo cuadra, hace commit y Vercel publica.
- Los archivos originales se guardan con su hash SHA-256 en `backend/data/fuentes/` (no se suben al repo).

## 5. Pantallas

1. **Inicio** — balance (entró, salió, déficit, financiamiento), gasto e intereses por día, "de cada RD$100", cumplimiento del presupuesto y metas, últimos contratos, botón a "Tu parte", verificaciones.
2. **Entradas** — quién cobró, qué impuestos cobra la DGII, recaudación mensual.
3. **Gastos** — ¿para qué?, ¿en qué tipo?, ¿quién gastó?, deuda, metas físicas.
4. **Contratos** — total del año, compras por excepción, concursos con un solo oferente, listas (recientes / con alerta / más grandes) con enlace a la ficha oficial, top proveedores e instituciones, montos inconsistentes de la fuente.
5. **Provincia** — inversión del año, presupuesto y avance, por tipo, cambios grandes vs el año anterior, ranking de las 32 provincias.
6. **Tu parte** — calculadora de ISR (escala oficial 2026) + ITBIS estimado, reparto según el gasto real, compartir por WhatsApp e imagen para Stories.

## 6. Pendiente

1. Colector local de la API DGCP (contratos al día) — en curso.
2. Contratos por provincia (cruzando institución compradora con su ubicación).
3. Nómina pública (MAP): totales por institución y sueldos de altos funcionarios, sin exponer a empleados de a pie.
4. "¿Quién está detrás de esta empresa?" para los proveedores grandes (Registro de Proveedores del Estado, DGII, sentencias y periodismo con fuente).
5. Modo "negocio / colmado" en la calculadora.
6. Pedir a la DGCP acceso para el servidor a su API (o lista blanca de IP).
