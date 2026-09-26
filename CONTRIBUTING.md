# Cómo contribuir a Centinela

Gracias por querer sumar un tema, un nodo o una conexión. Este repo es abierto para **proponer**. El control de calidad se queda en los maintainers: nadie hace push a `main` y nada entra sin Pull Request aprobado.

Al participar aceptas el [Código de Conducta](./CODE_OF_CONDUCT.md).

## Regla de oro

**Sin fuente verificable, no entra.**

- Cada nodo y cada edge necesita una fuente pública (portal oficial, ley, sentencia, auditoría o periodismo que cite el documento).
- Si un monto no se puede verificar, el edge se deja **sin cifra**. No se inventa ni se redondea “de memoria”.
- No fragmentar el grafo: reutiliza IDs de nodos que ya existen (`shared.js` y temas vecinos). Un mismo actor no debe aparecer con dos IDs.

---

## 1. Reportar un issue

Abre un issue en el repositorio oficial cuando:

- Encontraste un dato con fuente mala, vencida o mal citada.
- Un nodo o un edge está suelto / duplicado.
- Hay un bug de UI, API o del recorrido con voz.
- Quieres discutir un tema **antes** de escribir el código.

Incluye:

- Qué esperabas y qué pasó.
- URL o ruta (`/electricidad`, `/todo`, …).
- Fuente si el issue es de datos.

No pegues credenciales, dumps ni datos personales que no sean ya públicos y necesarios para el mapa.

---

## 2. Proponer un tema nuevo

1. Abre un issue titulado `Tema: [nombre]` **o** ve directo al PR si ya tienes el material.
2. Redacta el tema siguiendo [docs/TEMPLATE_TEMA.md](./docs/TEMPLATE_TEMA.md): hub, 9 pasos, epílogo, tablas de nodos y edges, cruces con otros temas, voz.
3. Implementa el tema en código (ver más abajo) en una rama `tema-[slug]`.
4. Abre el Pull Request contra `main` del repo oficial.

Un tema no es una lista de acusaciones. El epílogo resume el **mecanismo** (cómo se mueve el dinero o el poder), no “el villano”.

### Archivos que debe tocar un tema nuevo

```
backend/src/data/curated/<slug>.js       # nodos + edges + fuentes
backend/src/data/curated/<slug>Tour.js   # 9 pasos + epílogo (esto es la voz)
backend/src/data/curated/themes.js       # { id, label, ready: true, pills: [] }
backend/src/data/curated/index.js        # import, DATASETS y TOURS
```

Mira `electricidad.js` + `electricidadTour.js` como referencia viva.

**Voz:** sí. Todo tema nuevo debe tener tour con `line` / `detail` en cada paso, igual que los demás. El cliente lee esos textos (OpenAI TTS si el maintainer configuró la clave; si no, el navegador).

---

## 3. Añadir nodos y edges a un tema existente

1. Rama descriptiva: `edge-rizek-crecer`, `nodo-fonper`, …
2. Edita el `*.js` del tema. Si el nodo es canónico (Estado, una casa, un banco que ya sale en varios mapas), agrégalo o reutilízalo desde `shared.js`.
3. Cada nodo: `id`, `name`, `kind`, `role`, `summary`, `source` (`{ label, url }`).
4. Cada edge: `source`, `target`, `type`, `sourceRef`. `amount` solo con fuente que lo respalde.
5. Si el recorrido cambia, actualiza el `*Tour.js` (sigue siendo 9 pasos).
6. En el PR, llena la tabla de nodos/edges del [template](./docs/TEMPLATE_TEMA.md) aunque el cambio sea chico.

IDs estables, en minúsculas, con prefijo de tipo cuando exista convención (`p-`, `e-`, `i-`, `c-`).

---

## 4. Flujo fork + Pull Request

1. **Fork.** Copia el repositorio a tu cuenta de GitHub.
2. **Branch.** Crea una rama con nombre descriptivo (`tema-electricidad`, `fix-fuente-dgcp`).
3. **Añade el trabajo** siguiendo [docs/TEMPLATE_TEMA.md](./docs/TEMPLATE_TEMA.md) y las convenciones de esta guía.
4. **Commit.** Mensajes claros y concisos (qué cambió y por qué). Un commit por idea está bien; no subas secretos ni dumps.
5. **Pull Request.** Ábrelo contra `main` de `PYROWORLDnet/centinela`. Resume el mecanismo, lista las fuentes nuevas y di si el grafo queda conectado a temas vecinos.
6. **Revisión.** Los maintainers comentan y piden cambios. Responde en el hilo; no abras un segundo PR paralelo para lo mismo.
7. **Aprobación.** Si cumple los criterios (datos con fuente, formato correcto, sin fragmentar el grafo), se fusiona.
8. **Rechazo.** Si no cumple, se cierra el PR sin fusionar. Puedes reabrir cuando haya fuentes o el formato esté completo.

Nadie, ni el autor original del fork, puede saltarse este flujo para escribir en `main`.

---

## 5. Criterios de revisión (por eso se cierra un PR)

Se fusiona si:

- Cada hecho nuevo tiene fuente URL pública.
- Los montos o están citados o el edge va sin cifra.
- El tema tiene hub, 9 pasos, epílogo de mecanismo y voz.
- Los IDs no duplican actores que ya existen.
- Hay al menos una conexión explícita con otro tema cuando el actor ya vive en otro mapa.
- No se incluyen credenciales, `.env`, dumps ni datos de producción.

Se cierra sin fusionar si:

- Falta fuente verificable.
- El texto acusa sin documento.
- El grafo queda como isla (mismo actor, otro ID).
- El tour no tiene 9 pasos o no tiene voz.
- El cambio toca secretos, la base de producción o scripts de ingesta sin necesidad.

---

## 6. Protección de la rama `main` (GitHub)

Esto se configura en GitHub (Settings → Branches → Branch protection rule → `main`), no en el código. El repo oficial debe tener:

| Regla | Valor |
|---|---|
| Require a pull request before merging | Activado. Nadie hace push directo a `main`. |
| Require approvals | Al menos 1 aprobación de un maintainer. |
| Dismiss stale pull request approvals | Activado. Si el PR cambia después de aprobado, la aprobación se descarta. |
| Require status checks to pass | Activado cuando existan checks automáticos. El PR no se fusiona en rojo. |

Los contribuyentes no cambian estas reglas. Si un check aparece en el PR, tiene que pasar.

---

## 7. Entorno local y lo que no debes correr

Para ver el mapa: [README.md](./README.md) (backend + frontend, sin Postgres).

No ejecutes en un fork público:

- `npm run refresh:diario` / `backend/src/scripts/refreshDiario.js`
- `ingest*` / `download*` que escriben en Postgres o en `backend/data/`

Esos jobs son del maintainer. Usan `DATABASE_URL` / `PGPASSWORD` del `.env` privado. El directorio `backend/data/` está en `.gitignore` a propósito.

El frontend solo llama `/api`. No pongas `DATABASE_URL` ni claves en `frontend/` ni en variables `VITE_*`.

---

## 8. Licencias al contribuir

El código que envíes entra bajo [MIT](./LICENSE). Los datos curados (nodos, edges, fuentes, tours) entran bajo [ODbL 1.0](./DATA_LICENSE). Si no puedes ofrecer eso, no envíes el PR.
