import { useState } from "react";
import { fecha, pct } from "../lib/formato.js";

export const COLORES = {
  deuda: "#e0533d",
  educacion: "#0f7a55",
  proteccion: "#3fa37c",
  salud: "#8cc9b0",
  seguridad: "#5b7f9e",
  energia: "#f2a541",
  administracion: "#a9b6b0",
  transporte: "#2b6cb0",
  economia: "#b48ad8",
  vivienda: "#dfe6e3",
};

export function Header({ chip }) {
  return (
    <header className="top">
      <a className="logo" href="/">
        <i>C</i>Centinela
      </a>
      {chip && <div className="chip">{chip}</div>}
    </header>
  );
}

export function Titulo({ pre, children }) {
  return (
    <div className="hello">
      {pre}
      <h1>{children}</h1>
    </div>
  );
}

/** fraccion: 0..1 del largo de la barra; linea: 0..1 posición de una marca de referencia. */
export function Barra({ label, valor, fraccion = 0, linea, rojo, nota, children }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className={`bar${rojo ? " r" : ""}`}>
      <div className="l">
        <span>{label}</span>
        <span>{valor}</span>
      </div>
      <div className="t">
        <div style={{ width: `${Math.max(0.5, Math.min(100, 100 * fraccion))}%` }} />
        {linea != null && <i style={{ left: `${100 * linea}%` }} />}
      </div>
      {nota && <p>{nota}</p>}
      {children && (
        <>
          <button className="mas" onClick={() => setAbierto(!abierto)}>
            {abierto ? "Ocultar detalle oficial ▴" : "Ver detalle oficial ▾"}
          </button>
          {abierto && <div className="det">{children}</div>}
        </>
      )}
    </div>
  );
}

export function Donut({ partes, centro = "RD$100", sub = "de cada" }) {
  let acc = 0;
  const total = partes.reduce((a, p) => a + p.valor, 0);
  const stops = partes
    .map((p) => {
      const desde = acc;
      acc += (100 * p.valor) / total;
      return `${p.color} ${desde}% ${acc}%`;
    })
    .join(",");
  return (
    <div className="ring" style={{ background: `conic-gradient(${stops})` }}>
      <div>
        {centro}
        <small>{sub}</small>
      </div>
    </div>
  );
}

/** Reparte 100 en enteros que suman exactamente 100 (método del mayor residuo). */
export function enCien(valores) {
  const total = valores.reduce((a, b) => a + b, 0);
  const crudos = valores.map((v) => (100 * v) / total);
  const base = crudos.map(Math.floor);
  let resto = 100 - base.reduce((a, b) => a + b, 0);
  crudos
    .map((c, i) => [c - Math.floor(c), i])
    .sort((a, b) => b[0] - a[0])
    .forEach(([, i]) => {
      if (resto > 0) {
        base[i]++;
        resto--;
      }
    });
  return base;
}

export function Fuente({ fuente, tablas = [], extra }) {
  if (!fuente) return null;
  return (
    <p className="src">
      Fuente:{" "}
      <a href={fuente.url} target="_blank" rel="noreferrer">
        {fuente.institucion}
      </a>
      {tablas.length > 0 && <> — {tablas.join(", ")}</>}
      <br />
      {fuente.documento}
      {fuente.descargado && <> · descargado {fecha(fuente.descargado)}</>}
      {extra && (
        <>
          <br />
          {extra}
        </>
      )}
    </p>
  );
}

export function Verificaciones({ datos }) {
  const [abierto, setAbierto] = useState(false);
  const ok = datos.verificaciones.filter((v) => v.ok).length;
  return (
    <>
      <button className="ok" onClick={() => setAbierto(true)}>
        <b>✓</b>
        <span>
          {ok} de {datos.verificaciones.length} verificaciones cuadran. Toca para ver cómo revisamos cada número.
        </span>
      </button>
      {abierto && (
        <div className="modal" onClick={() => setAbierto(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <h3>
              Cómo verificamos
              <button onClick={() => setAbierto(false)}>✕</button>
            </h3>
            <p>
              Todos los números salen tal cual de archivos oficiales. Antes de publicar, el sistema comprueba que las
              tablas cuadren entre sí. Si una sola verificación falla, no se publica nada nuevo.
            </p>
            <div className="panel">
              {datos.verificaciones.map((v) => (
                <div className="meta" key={v.nombre}>
                  <b className={v.ok ? "" : "r"}>{v.ok ? "✓" : "✗"}</b>
                  <span>
                    {v.nombre}
                    {v.diferencia > 0 && <> (diferencia {pct(v.diferencia, 3)})</>}
                  </span>
                </div>
              ))}
            </div>
            <p>
              Contratos: si un contrato registrado supera 10 veces el monto estimado de su propio proceso, se trata
              como error de digitación del portal y no se suma a los totales; se muestra aparte.
            </p>
            <p>Datos generados el {fecha(datos.generado)}.</p>
          </div>
        </div>
      )}
    </>
  );
}
