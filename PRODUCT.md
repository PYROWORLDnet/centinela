# Plataforma de transparencia gubernamental — RD
## Especificación de producto

---

## 1. Qué es esto

Una plataforma sin fines de lucro que conecta datos públicos dominicanos (gasto del Estado, patrimonio de funcionarios, contratos, préstamos, propiedad de empresas) en un solo lugar navegable, para que cualquier ciudadano pueda entender quién está detrás de qué — sin tener que buscar en diez páginas distintas ni saber leer un PDF de licitación.

**Referencia directa que ya existe y hace algo similar:** [Ojo Cívico](https://ojocivico.up.railway.app) — tiene fichas de funcionarios (patrimonio, asistencia al Congreso, banderas rojas) y contrataciones públicas conectadas a SIGEF/DGCP/Cámara de Cuentas. Nuestro diferencial no es "tener el dato" (ellos ya lo tienen bastante bien estructurado) sino:

1. **La capa de propiedad de empresas** (quién es dueño/accionista de qué, vía Registro Mercantil) — esto no lo vimos en Ojo Cívico.
2. **El UI de grafo navegable** en vez de fichas/listas tipo página normal.
3. **Buscador conversacional** (lenguaje natural) en vez de filtros manuales.

---

## 2. Fuentes de datos

| Fuente | Qué da | Formato típico |
|---|---|---|
| DIGEPRES | Presupuesto nacional | PDF/Excel |
| DGCP (Dirección General de Contrataciones Públicas) | Licitaciones, contratos, empresas ganadoras | Portal web, algunos PDF |
| Cámara de Cuentas | Auditorías, declaraciones juradas de patrimonio | PDF |
| Contraloría General | Auditorías internas | PDF |
| JCE (onarec.jce.gob.do) | Registro civil, estadísticas | Portal con datos estructurados |
| SIGEF (vía Transparencia Fiscal) | Contratos, proveedores del Estado, gasto en publicidad, histórico 2014-2025 | Ya estructurado (Ojo Cívico lo usa) |
| Cámara de Diputados / Senado | Asistencia, iniciativas legislativas | Portal propio |
| **Registro Mercantil** | **Quién es dueño/accionista de cada empresa — pendiente de investigar accesibilidad** | Desconocido, por confirmar |
| BID / Banco Mundial | Préstamos internacionales a RD, montos y proyectos | Portal propio, datos estructurados (buena fuente porque no depende de que el gobierno dominicano lo suba bien) |

**Decisión importante tomada en esta conversación:** no hace falta hacer OCR/parsing profundo de cada PDF. Igual que Ojo Cívico, se puede:
- Extraer solo los campos ya estructurados que cada fuente publica (nombre, monto, institución, fecha, código)
- Guardar el PDF original como link de "fuente/evidencia", sin necesidad de digerirlo línea por línea

Esto simplifica mucho el pipeline diario.

---

## 3. Pipeline de datos (corre solo, diario)

1. **Recolección** — cron job que revisa cada fuente por cambios/nuevas publicaciones cada 24h
2. **Extracción** — toma los campos estructurados de cada fuente (no todo el PDF, solo los metadatos clave)
3. **Carga** — inserta en la base de datos como nodos y relaciones:
   - Persona → recibe salario de → Institución
   - Persona → es accionista de → Empresa
   - Empresa → ganó → Contrato
   - Institución → recibió → Préstamo
   - Empresa → subcontrata a → Empresa

Toda esta capa corre separada del frontend, en un servidor propio (cron en algo tipo Railway/DigitalOcean/AWS).

---

## 4. Base de datos

Grafo de nodos y relaciones. Opciones técnicas:
- **Neo4j** (base de datos de grafo nativa) — más natural para este tipo de consultas ("quién conecta con quién")
- **Postgres con tablas de relaciones** — más simple de empezar, funciona bien si el volumen no es gigante al inicio

Recomendación: empezar con Postgres si el equipo ya lo conoce, migrar a Neo4j solo si las consultas de "conexiones a N grados" se vuelven lentas.

---

## 5. Diseño / UI

### 5.1 Pantalla principal — "vista galaxia"
- Todos los nodos de la base de datos representados como puntos, **empacados en una sola forma circular densa** (sin huecos/espacios vacíos entre categorías) — referencia visual: vista de grafo de Obsidian / mapas tipo Kumu / estilo ICIJ-Panama Papers
- Zonas de color por categoría dentro del mismo círculo (diputados, senado, instituciones, comercios/empresas, etc. — colores distintos pero mezclándose en los bordes, no separados en islas)
- Fondo oscuro, estética "sala de investigación" — esto requiere control total de CSS fuera de un entorno de chat/preview; en la app real no hay restricción para lograrlo
- Líneas finas conectando nodos dentro de su categoría, dando sensación de red tejida, no de puntos sueltos

### 5.2 Filtros por categoría
- Botones/pills arriba: "Todos", "Diputados", "Senado", "Instituciones", "Comercios", "Empresas" (ajustar lista final)
- Al tocar una categoría: la vista hace zoom animado hacia esa región del círculo, atenuando (fade) el resto

### 5.3 Buscador (arriba, siempre visible)
- Campo de texto simple: nombre, empresa, caso
- Al encontrar coincidencia: animación de zoom "hacia adentro" centrada en ese nodo específico (estilo cámara acercándose), atenuando todo lo demás
- Esto se resuelve con funciones ya integradas en las librerías de grafo recomendadas (`zoomToFit`, `centerAt` en react-force-graph; método equivalente en Sigma.js) — no hay que programarlo desde cero

### 5.4 Ficha de nodo (al hacer zoom a una persona/entidad específica)
- Foto (avatar/inicial si no hay foto)
- Nombre, cargo, período, partido
- Patrimonio neto declarado + variación % histórica
- Salario
- Grafo de conexiones alrededor: cada conexión (institución, empresa, contrato, préstamo) es un nodo tocable que expande su propia red
- Cada dato debe enlazar a su fuente original (PDF/página oficial) — igual que hace Ojo Cívico, por credibilidad y para evitar problemas legales en casos sensibles (corrupción, etc.)

### 5.5 Buscador conversacional (tipo chat)
- El usuario escribe en lenguaje natural: "¿cómo funciona tal institución, quién está atrás?"
- Se usa la Anthropic API con **tool use / function calling**: Claude no responde de memoria, sino que llama una función propia (ej. `buscar_conexiones(nombre)`) que consulta la base de datos real
- La misma respuesta estructurada (JSON) que usa Claude para redactar el texto también alimenta el grafo visual que aparece debajo — así nunca se desincronizan
- Ejemplo de flujo:
  1. Usuario pregunta
  2. Claude decide llamar la función con el parámetro correcto
  3. El servidor ejecuta la búsqueda en la base de datos propia
  4. Claude redacta la respuesta en texto usando esos datos reales
  5. El frontend dibuja el grafo con el mismo JSON de respuesta

Referencia técnica: `https://docs.claude.com` (Anthropic API, tool use). Modelo sugerido: `claude-sonnet-4-6` o el modelo vigente al momento de construir.

---

## 6. Librerías de grafo recomendadas (código abierto, gratis)

- **react-force-graph** — la más directa para integrar con React; trae zoom, drag, física, todo incluido. Punto de partida recomendado.
- **Sigma.js** — mejor para redes muy grandes (miles de nodos), usada en proyectos de periodismo de datos tipo ICIJ/Panama Papers.
- **Cytoscape.js** — alternativa orientada a análisis.
- **vis-network** — más simple, buena para prototipar rápido.

**Recomendación:** react-force-graph como base, evaluar Sigma.js si el volumen de nodos crece mucho.

---

## 7. Pendiente de investigar antes de construir

1. **Registro Mercantil dominicano (confirmado, 2026-09):** no hay API pública de accionistas. Lo lleva cada Cámara de Comercio; la consulta de dueños es certificación / trámite, no un dump. Lo que sí es abierto y útil:
   - **DGII** — existe la empresa (RNC, estado, actividad), no los dueños.
   - **DGCP / RPE** (datos.gob.do) — proveedores del Estado; en el expediente de cada proveedor suelen ir representantes y, a veces, socios declarados. Esta es la vía principal para “quién está atrás” de empresas que contratan con el Estado.
   - **Sentencias / PGR / periodismo** — casos (Calamar, Odebrecht) y reportes que sí citan certificaciones mercantiles (ej. Sajama → Loteka).
   El diferencial de propiedad se arma cruzando esas tres, no scrapeando el RM.
2. Confirmar qué tan a fondo llega Ojo Cívico (¿ya tienen algo de conexiones societarias que no vimos?).
3. Elegir 1-2 casos de corrupción ya cerrados/documentados (con sentencia o expediente público) para poblar el primer grafo con datos reales y fuentes citables — sirve como demo y valida el modelo de datos.
4. Definir la lista final de categorías para la vista galaxia (¿se agrega "partidos", "préstamos internacionales" como categorías propias?).
