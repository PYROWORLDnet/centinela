# Cómo contribuir a Centinela

Este repo es abierto para **proponer**. El control de calidad se queda en los maintainers: nadie hace push a `main` y nada entra sin Pull Request aprobado.

Al participar aceptas el [Código de Conducta](./CODE_OF_CONDUCT.md).

## Regla de oro

**Sin fuente oficial verificable, no entra. Y nada se transcribe a mano.**

- Cada número de la app sale de un archivo oficial que el sistema descarga y lee solo.
- Toda fuente nueva necesita verificaciones automáticas (que sus totales cuadren consigo misma y con otras fuentes).
- Si un dato no se puede verificar, no se publica. Si la fuente tiene un error evidente, se señala y no se suma.
- Una alerta (por ejemplo, "compra por excepción") nunca se presenta como acusación.

---

## 1. Reportar un issue

Abre un issue cuando:

- Un número de la app no coincide con la fuente oficial (di cuál, en qué pantalla y el enlace a la fuente).
- Encontraste una fuente oficial que la app debería usar.
- Hay un bug de la app o de la actualización de datos.

No pegues credenciales ni datos personales que no sean ya públicos.

---

## 2. Qué se puede aportar

- **Fuentes nuevas**: un lector en `backend/src/finanzas/` + sus verificaciones en `backend/src/scripts/actualizarFinanzas.js`.
- **Mejores verificaciones**: más cruces entre tablas o entre instituciones.
- **Pantallas y textos**: más claros para alguien que no sabe de presupuesto.
- **Calculadora**: reglas de impuestos con su fuente oficial en `backend/src/finanzas/reglas.js`.

Para una fuente nueva, el PR debe incluir: URL oficial, qué tabla o campo se lee, cómo se detecta si el formato cambió, y qué verificaciones la respaldan.

---

## 3. Flujo fork + Pull Request

1. **Fork** del repositorio.
2. **Rama** con nombre descriptivo (`fuente-nomina-map`, `fix-provincias`).
3. **Corre la actualización** (`npm run actualizar --prefix backend`) y confirma que pasan todas las verificaciones.
4. **Commit** claro (qué cambió y por qué). No subas secretos, dumps ni `backend/data/`.
5. **Pull Request** contra `main` de `PYROWORLDnet/centinela`, con las fuentes y el resultado de las verificaciones.
6. **Revisión** por un maintainer. Se fusiona si cumple; se cierra si no.

---

## 4. Criterios de revisión

Se fusiona si:

- Todo número nuevo viene de una fuente oficial descargada automáticamente.
- Hay verificaciones que fallan si la fuente cambia de formato o no cuadra.
- Los textos no acusan sin documento.
- No hay credenciales, `.env` ni dumps.

Se cierra sin fusionar si falta fuente, si hay datos escritos a mano o si alguna verificación falla.

---

## 5. Protección de la rama `main` (GitHub)

Se configura en GitHub (Settings → Branches → `main`):

| Regla | Valor |
|---|---|
| Require a pull request before merging | Activado. |
| Require approvals | Al menos 1 maintainer. |
| Dismiss stale pull request approvals | Activado. |
| Require status checks to pass | Activado cuando existan checks. |

La tarea automática `actualizar-datos` (GitHub Actions) es la única que hace commit directo, y solo del archivo `backend/src/data/finanzas/datos.json`.

---

## 6. Licencias

El código entra bajo [MIT](./LICENSE). Los datos derivados que publica Centinela entran bajo [ODbL 1.0](./DATA_LICENSE). Los datos de origen pertenecen a las instituciones públicas que los publican.
