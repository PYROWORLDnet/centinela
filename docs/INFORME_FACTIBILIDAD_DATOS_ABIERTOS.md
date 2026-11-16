# Informe de factibilidad técnica: Ingresos → Asignación → Contratos

**Proyecto:** Centinela
**Fecha:** 16 de noviembre de 2026
**Alcance:** unir en un solo backend los datos abiertos de DGII (ingresos), DIGEPRES (presupuesto) y DGCP (contrataciones) y mostrar el flujo entre ellos en "tiempo real".

> **Nota de verificación.** Este informe se basa en las especificaciones que nos dieron y en el código que Centinela ya tiene (`backend/src/scripts/ingestDgcp.js`, `ingestRncDgii.js`, `refreshDiario.js`, `db/schema.sql`). Desde el entorno donde se escribió no se pudo llegar a `datosabiertos.dgcp.gob.do` ni a `backoffice.datos.gob.do`: la red los bloqueó. Lo marcado como **[VERIFICAR]** hay que confirmarlo con llamadas reales en la Fase 0.

---

## 1. Conclusión

**Sí es factible**, con dos matices que cambian cómo se diseña y cómo se comunica:

1. **El flujo no se puede seguir peso por peso.** Lo que la DGII recauda entra a la Cuenta Única del Tesoro y se mezcla con otros ingresos: no tributarios, donaciones y **deuda**. Por eso no se puede decir "este impuesto pagó este contrato". Lo que sí se puede mostrar es una **cadena de agregados**:
   - Recaudación nacional (DGII)
   - Fondo general / Tesoro
   - Presupuesto por institución (DIGEPRES)
   - Contratado por institución y proveedor (DGCP)

   Uniones posibles entre fuentes:
   - **DGII ↔ DIGEPRES:** solo a nivel de totales nacionales y por período.
   - **DIGEPRES ↔ DGCP:** a nivel de **institución**, a través de una tabla de equivalencias que hay que construir a mano.
2. **"Tiempo real" quiere decir "lo más fresco que publica cada fuente".**

   | Fuente | Frecuencia | Atraso esperado en la plataforma |
   |---|---|---|
   | DGCP | 4 cortes al día | ≤ ~7 h |
   | DIGEPRES | Mensual o anual (XLSX) **[VERIFICAR]** | Días o semanas |
   | DGII | Mensual (CSV) **[VERIFICAR]** | Días o semanas |

   Consultar la API en cada visita no hace más fresco el dato: solo gasta el límite de tasa.

El stack actual de Centinela alcanza: Node/Express, Postgres para la ingesta del maintainer, React + Vite y un cron diario. No hace falta tecnología nueva. Lo que hace falta es un **modelo de datos de hechos** (montos por período) además del grafo de nodos y vínculos que ya existe.

---

## 2. Qué trae cada fuente y cómo se une

| | DGII — Recaudación efectiva 2017-2025 | DIGEPRES — Ejecución presupuestaria 2018-2025 | DGCP — API v1 (OCDS) |
|---|---|---|---|
| Acceso | CKAN `package_show` → recurso CSV | CKAN `package_show` → recurso XLSX | REST JSON, paginado (`limit` ≤ 1000) |
| Detalle | Impuesto × período (agregado nacional) | Institución × clasificador (objeto/función) × período | Proceso / contrato / proveedor |
| Llave natural | Código o nombre del impuesto + mes | Capítulo-subcapítulo-unidad ejecutora **[VERIFICAR]** | `ocid`, código de proceso, código de contrato, código de unidad de compra, RNC del proveedor |
| Montos | Recaudado (DOP) | Aprobado, vigente, comprometido, devengado y pagado **[VERIFICAR columnas]** | Estimado, adjudicado y contratado, en varias monedas |
| Frescura | Mensual | Mensual o anual | 4 veces al día |

**Unir las tres en un solo backend es viable**, pero no con una sola llave. Cada unión es distinta:

| Unión | Llave | Dificultad |
|---|---|---|
| DGII → total de ingresos | Período (año-mes) | Baja |
| Total de ingresos → DIGEPRES | Período + total nacional | Baja (cuadre contable) |
| DIGEPRES ↔ DGCP | **Institución**: no hay código común | **Alta**: tabla de equivalencias |
| DGCP ↔ empresas, personas (lo que ya tiene Centinela) | RNC del proveedor | Baja (ya existe en `ingestDgcp.js`) |

---

## 3. Estrategia de normalización

### 3.1 Instituciones: el problema central

DIGEPRES usa el clasificador institucional del presupuesto. La DGCP usa `CODIGO_UNIDAD_COMPRA`; hoy `ingestDgcp.js` crea nodos `institucion` con esa llave. Una institución puede tener varias unidades de compra, y hay unidades de compra (ayuntamientos, algunas empresas públicas) que **no están** en el presupuesto del Gobierno Central.

Propuesta:

```
dim_institucion (id canónico, nombre_oficial, rnc, tipo, sector, ambito)
institucion_alias (fuente, codigo_fuente, nombre_fuente,
                   institucion_id, metodo, confianza, verificado_por, verificado_en)
```

- **Paso 1. Unión por RNC** cuando la fuente lo traiga. Hay que verificar si el comprador en OCDS (`parties[role=buyer].identifier`) trae el RNC de la institución **[VERIFICAR]**. Si lo trae, cubre gran parte de los casos con poco esfuerzo.
- **Paso 2. Unión por nombre normalizado:** sin tildes, en minúsculas, sin "Ministerio de", "Dirección General de" ni siglas. Se acepta automáticamente solo con similitud alta (por ejemplo, trigramas ≥ 0,9 con `pg_trgm`). Todo lo demás va a una cola de revisión.
- **Paso 3. Revisión humana.** Cada equivalencia queda con `verificado_por`. Va en el mismo espíritu de "sin fuente verificable, no entra": cada equivalencia queda documentada y se puede corregir.
- Las unidades de compra sin pareja en DIGEPRES se marcan `ambito = 'fuera_presupuesto_central'`. No se fuerzan.

### 3.2 Montos

- **Guardar siempre el monto original y su moneda**, y además un `monto_dop` calculado con la tasa del Banco Central del día de referencia (fecha de adjudicación o de firma). Hay que guardar también la tasa usada.
- **No mezclar etapas.** Adjudicado (DGCP) no es lo mismo que devengado o pagado (DIGEPRES). La comparación honesta es esta:
  - **DIGEPRES:** devengado en bienes, servicios y obras (objeto de gasto 2.x y la parte de 2.6 / 2.7 que corresponda) **[VERIFICAR clasificador]**.
  - **DGCP:** contratado en el mismo año.

  Los pagos a proveedores que salen de SIGEF no están en estas tres fuentes.
- **Contratos de varios años.** Asignar el monto completo al año de adjudicación y marcarlo como plurianual. No repartirlo inventando un cronograma.
- **Unidades y cifras.** Validar en cada carga si el XLSX de DIGEPRES viene en pesos o en millones, y cuadrar los totales contra el reporte oficial publicado.

### 3.3 Fechas

- **DGCP.** Las fechas traen sufijo `Z` pero en realidad están en hora local (UTC-4). Hay que quitar la `Z` e interpretarlas como `America/Santo_Domingo`, que siempre es -04:00 porque no hay horario de verano. Se guardan como `timestamptz`. Conviene una prueba unitaria que fije este comportamiento: es el error más fácil de reintroducir.
- `enddate` **no incluye** el último día. Una ventana `[2026-11-01, 2026-11-02)` es un solo día. Usar intervalos semiabiertos en todo el código.
- El período común para unir fuentes es **año-mes**. El año fiscal dominicano coincide con el año calendario.

### 3.4 Identificadores de contratos

- La llave primaria en DGCP es `ocid` + código de contrato. Hay que conservar el JSON crudo en `raw_dgcp (ocid, release_id, payload jsonb, recibido_en)` para poder reprocesar sin volver a descargar.
- **Insertar o actualizar** (upsert) por llave natural. Las publicaciones OCDS cambian: enmiendas, cancelaciones. Gana la publicación más reciente según `date` del release.

---

## 4. Latencia y límite de tasa de la DGCP

**Principio:** el usuario nunca consulta a la DGCP directamente. Un recolector propio copia los datos a Postgres y la plataforma sirve desde ahí.

1. **Calendario.** Correr el recolector unos 30-45 min después de cada corte (00:00, 07:00, 14:00 y 21:00, hora de RD), es decir, cuatro veces al día. Hoy `refreshDiario.js` corre una vez al día. Hay que separar un job `syncDgcp` con su propio calendario.
2. **Carga incremental por ventana de fechas**, no por páginas desde el inicio:
   - Pedir `[último_sync − 48 h, ahora)`. El solapamiento atrapa ediciones tardías y el corrimiento de la zona horaria.
   - Si una ventana pasa de unas pocas páginas, partirla en ventanas más chicas (por día o por hora). Así cada consulta devuelve pocos resultados y el **desorden dentro de la página** deja de importar.
3. **Paginación inestable.** Como `/procesos` no viene ordenado y los datos cambian entre páginas, puede haber registros saltados o duplicados. Para evitarlo:
   - Quitar duplicados por llave natural.
   - Comparar el total que anuncia la API con los registros únicos recibidos.
   - Si no cuadra, volver a barrer esa ventana.
4. **Límite de tasa del lado del cliente:**
   - **Límite fijo:** un token bucket de **≤ 50 solicitudes por minuto**, por debajo de las 60 anunciadas. No hay que depender del "tope práctico" de 70-120: ese número sale de cómo reparte el balanceador y puede cambiar sin aviso.
   - **Ante 429 o 5xx:** espera exponencial con jitter, respetar `Retry-After` y un máximo de reintentos. Luego se marca la ventana como fallida y se reintenta en el siguiente corte.
   - **Concurrencia:** un solo trabajador.
5. **Carga histórica:** usar las **descargas masivas OCDS** (ZIP o CSV anuales) que publica la DGCP, no la API. La API queda solo para lo incremental.
6. **Caché del lado público:** endpoints de solo lectura con `Cache-Control` de minutos u horas y `ETag`. Mantiene la regla actual de que la API pública solo lee (`README.md`, sección Seguridad).
7. **Monitoreo:** registrar por corte las solicitudes, los 429, los registros nuevos y los actualizados, y la hora del último corte exitoso. Mostrar en el frontend "Datos de la DGCP actualizados a las HH:MM".

**DIGEPRES y DGII (CKAN):**

- Cada día, consultar `package_show` y comparar `metadata_modified` y `last_modified` de cada recurso, o un hash del archivo. Solo se descarga si cambió.
- Si el recurso tiene `datastore_active = true`, usar `datastore_search` y leer JSON directo, sin XLSX **[VERIFICAR]**. Si no, descargar el XLSX y leerlo con un **mapa de columnas por año**: los encabezados y las filas combinadas suelen cambiar de un año a otro.
- CKAN 2.6.2 es una versión vieja. Hay que asumir la API v3 sin extensiones modernas.

---

## 5. Frontend

El flujo Ingresos → Asignación → Contratos se cuenta en tres vistas que se conectan entre sí:

| Vista | Qué muestra | Componente |
|---|---|---|
| **1. Sankey del año o mes** | Impuestos (DGII) + otros ingresos + financiamiento → **Tesoro** → instituciones o funciones (DIGEPRES, devengado) → contratado por institución (DGCP) | `d3-sankey` en React. Alternativa más rápida: ECharts (`series: sankey`) |
| **2. Serie de tiempo** | Recaudado, presupuestado, devengado y contratado por mes | Recharts o ECharts (líneas o áreas) |
| **3. Detalle de institución** | Contratos → proveedores → dueños y vínculos | **El grafo de fuerzas que ya existe** (`react-force-graph-2d`, `NodePanel`) |

Por qué esta combinación:

- **El Sankey es la forma estándar de mostrar origen → destino con montos.** El nodo **"Tesoro / Fondo general"** hace visible que el dinero se mezcla. Así no se sugiere una trazabilidad que los datos no tienen.
- **El Sankey solo cuadra si se incluyen el financiamiento y otros ingresos además de la DGII.** Centinela ya ingiere préstamos (`ingestPrestamos.js`). Si no se incluyen, el lado de ingresos sale más chico que el de gasto, y eso se puede leer como "plata desaparecida", que sería falso.
- **El grafo ya es el diferencial de Centinela** (`PRODUCT.md` §1). El Sankey es la puerta de entrada y el grafo responde "¿y quién se lo ganó?".
- **Control de tamaño:** mostrar solo las 15-20 instituciones con más monto y agrupar el resto en "Otras", con clic para abrirlas. Un Sankey con más de 300 instituciones no se puede leer.
- **Mensajes en cada tramo:** "devengado ≠ pagado", "adjudicado ≠ ejecutado" y la fecha de actualización de cada fuente.

---

## 6. Arquitectura propuesta

```
            ┌──────────── Recolectores (cron, entorno del maintainer) ────────────┐
DGCP API ──►│ syncDgcp (4×/día, ≤50 req/min, ventanas solapadas)                   │
CKAN ──────►│ syncCkan (diario: package_show → si cambió, descarga y lee)           │
BCRD tasas ►│ syncTasas (diario)                                                    │
            └───────────────┬──────────────────────────────────────────────────────┘
                            ▼
        Postgres: raw_* (JSON/archivo crudo + hash)  →  staging normalizado
                            ▼
        dim_institucion + institucion_alias (equivalencias revisadas a mano)
        fact_recaudacion · fact_presupuesto · fact_contrato · tasa_cambio
                            ▼
        vistas materializadas: flujo_anual, flujo_mensual, institucion_resumen
          └─► proyección a nodes/edges/sources (grafo existente)
                            ▼
        Express (solo lectura, con caché): /api/flujo/:anio, /api/serie,
                            /api/institucion/:id, /api/meta/frescura
                            ▼
        React: Sankey · Serie de tiempo · Grafo de detalle
```

Todo con fuente: cada fila de `fact_*` guarda la URL del recurso o la consulta de origen y la fecha de descarga, igual que la tabla `sources` de hoy.

---

## 7. Pasos de integración

| Fase | Entregable | Criterio de "listo" |
|---|---|---|
| **0. Verificar el acceso** | Script que llama a cada fuente y guarda respuestas de muestra | Confirmadas las rutas de DGCP, si OCDS trae el RNC del comprador, los formatos y `datastore_active` de DIGEPRES y DGII, y si piden User-Agent de navegador (el script actual ya manda uno) |
| **1. Ingesta cruda** | `syncDgcp`, `syncCkan` y tablas `raw_*` | Se puede correr dos veces sin cambiar nada; carga histórica de DGCP desde el ZIP OCDS |
| **2. Normalización** | Fechas, monedas, tasas BCRD y un mapa de columnas de DIGEPRES por año | Pruebas unitarias de la zona horaria, de `enddate` y de la conversión de moneda; totales anuales cuadran contra los reportes oficiales (±0,5 %) |
| **3. Instituciones** | `dim_institucion`, `institucion_alias` y cola de revisión | ≥ 90 % del **monto** contratado (no del número de instituciones) unido a una institución de DIGEPRES o marcado como fuera del presupuesto central |
| **4. Modelo y API** | Vistas materializadas y endpoints de solo lectura | Respuesta < 300 ms desde caché; `/api/meta/frescura` dice cuándo se actualizó cada fuente |
| **5. Frontend** | Sankey, serie de tiempo y enlace al grafo | Recorrido completo: impuesto → institución → contrato → proveedor → dueños |
| **6. Operación** | Alertas por corte fallido o descuadre y tabla de equivalencias pública | Una semana corriendo sin intervención |

---

## 8. Riesgos técnicos

| # | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| 1 | **No hay llave común DIGEPRES ↔ DGCP** | Alto: sin esto no hay flujo por institución | Tabla de equivalencias con RNC → nombre → revisión humana; medir cobertura por monto |
| 2 | **Se lee el Sankey como trazabilidad peso a peso** | Alto (reputación) | Nodo "Tesoro" explícito, incluir deuda y otros ingresos, textos de advertencia |
| 3 | Adjudicado ≠ devengado ≠ pagado; contratos de varios años | Alto: comparaciones engañosas | Etiquetar la etapa de cada monto; no restar cosas de etapas distintas; marcar los plurianuales |
| 4 | Fechas de DGCP con `Z` falsa | Medio: registros que caen en el día equivocado, sobre todo después de las 20:00 | Leerlas en hora de RD y fijarlo con una prueba |
| 5 | Paginación sin orden y datos que cambian entre páginas | Medio: registros perdidos | Ventanas chicas, quitar duplicados, cuadrar contra el total, volver a barrer |
| 6 | Límite de tasa por nodo del balanceador, sin garantía | Medio | ≤ 50 req/min, espera exponencial, un solo trabajador, histórico por descarga masiva |
| 7 | DIGEPRES solo en XLSX; columnas cambian por año | Medio | Mapa de columnas versionado y validación de totales en cada carga |
| 8 | DGII solo da agregados nacionales | Bajo o medio: limita el detalle del primer tramo | Asumirlo en el diseño; no se pueden hacer "ingresos por institución" |
| 9 | Fuentes cubren cosas distintas (ayuntamientos, descentralizadas, empresas públicas) | Medio | Campo `ambito`; no forzar uniones |
| 10 | CKAN 2.6.2 viejo, portal `backoffice` inestable, posible bloqueo de clientes que no son navegador | Medio | Reintentos, espejo local del último archivo bueno, User-Agent y Referer como ya hace `downloadDgcp.js` |
| 11 | Correcciones de datos pasados por parte de la fuente | Bajo o medio | Guardar el crudo con hash y fecha; reprocesar; registrar los cambios |
| 12 | Los datasets vienen hasta 2025; 2026 puede tardar en publicarse | Medio para el "tiempo real" | Mostrar el atraso de cada fuente; para el año en curso solo hay DGCP al día |
| 13 | Licencias de los datos de origen | Bajo | Revisar las condiciones de uso de cada dataset en CKAN y citarlas en la app |

---

## 9. Qué falta para empezar

1. **Permitir en la red del entorno de desarrollo** `datosabiertos.dgcp.gob.do`, `backoffice.datos.gob.do` y `datos.gob.do` para correr la Fase 0.
2. Decidir el **alcance institucional** de la primera versión. La recomendación es empezar con el Gobierno Central, que es lo que mejor cubre DIGEPRES, y dejar ayuntamientos y empresas públicas para después.
3. Elegir la librería del Sankey. Recomendación: **ECharts** para salir rápido; `d3-sankey` si se quiere control total del diseño.
