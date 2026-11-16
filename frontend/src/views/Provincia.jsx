import { useState } from "react";
import { Header, Titulo, Barra, Fuente } from "../components/ui.jsx";
import { millones, pct, variacion } from "../lib/formato.js";

const FUNCIONES = {
  "1.1": "Administración", "1.2": "Relaciones internacionales", "1.3": "Defensa", "1.4": "Seguridad y justicia",
  "2.1": "Comercio y empleo", "2.2": "Agricultura", "2.3": "Riego", "2.4": "Energía", "2.5": "Minería e industria",
  "2.6": "Carreteras y transporte", "2.7": "Comunicaciones", "2.8": "Banca y seguros", "2.9": "Otros servicios económicos",
  "3.1": "Protección de aire, agua y suelo", "3.2": "Biodiversidad y manejo de desechos", "3.3": "Cambio climático",
  "4.1": "Vivienda, agua y servicios", "4.2": "Hospitales y salud", "4.3": "Deporte y cultura",
  "4.4": "Escuelas y educación", "4.5": "Ayudas sociales", "4.6": "Equidad de género",
};
const nombreF = (f) => FUNCIONES[f.codigo] || f.nombre;
const KEY = "centinela.provincia";

export default function Provincia({ datos }) {
  const { lista, sinProvincia, tabla } = datos.provincias;
  const p = datos.periodo;
  const [codigo, setCodigo] = useState(() => localStorage.getItem(KEY) || "32");
  const prov = lista.find((x) => x.codigo === codigo) || lista[0];
  const elegir = (c) => {
    setCodigo(c);
    localStorage.setItem(KEY, c);
  };
  const ranking = [...lista].sort((a, b) => b.devengado - a.devengado).findIndex((x) => x.codigo === prov.codigo) + 1;
  const v = variacion(prov.devengado, prov.anterior);
  const funciones = prov.funciones.filter((f) => f.devengado > 0);
  const maxF = Math.max(1, ...funciones.map((f) => f.devengado));
  const cambios = prov.funciones
    .filter((f) => f.anterior >= 20e6 && f.devengado >= 0)
    .map((f) => ({ ...f, v: variacion(f.devengado, f.anterior) }))
    .filter((f) => Math.abs(f.v) >= 0.25)
    .sort((a, b) => a.v - b.v);
  const bajas = cambios.filter((f) => f.v < 0).slice(0, 2);
  const subidas = cambios.filter((f) => f.v > 0).slice(-2).reverse();

  return (
    <div className="wrap">
      <Header chip={p.etiqueta} />
      <Titulo pre="Obras e inversión">¿Qué han hecho en mi provincia?</Titulo>

      <label className="field" style={{ background: "#fff" }}>
        <span>📍 Tu provincia</span>
        <select value={prov.codigo} onChange={(e) => elegir(e.target.value)}>
          {lista.map((x) => (
            <option key={x.codigo} value={x.codigo}>
              {x.nombre}
            </option>
          ))}
        </select>
      </label>

      <div className="bal">
        <small>
          Invertido en {prov.nombre} · {p.etiqueta}
        </small>
        <div className="n pos">{millones(prov.devengado)}</div>
        <small>
          {v == null
            ? "Sin inversión registrada el año pasado en el mismo período"
            : `${v >= 0 ? "▲" : "▼"} ${pct(Math.abs(v))} ${v >= 0 ? "más" : "menos"} que en el mismo período de ${p.anio - 1}`}
        </small>
        <div className="row">
          <div>
            <span>Presupuesto del año</span>
            <b>{millones(prov.vigente)}</b>
          </div>
          <div>
            <span>Ya usado</span>
            <b>{prov.vigente ? pct(prov.devengado / prov.vigente) : "—"}</b>
          </div>
        </div>
        <div className="note">
          Puesto <b>{ranking}</b> de {lista.length} provincias en inversión este año.
        </div>
      </div>

      <div className="panel">
        <h2>¿En qué?</h2>
        <div className="sub">Gastado en obras e inversión, por tipo</div>
        {funciones.length === 0 && <div className="sub">No hay inversión registrada en este período.</div>}
        {funciones.map((f) => (
          <Barra
            key={f.codigo}
            label={nombreF(f)}
            valor={millones(f.devengado)}
            fraccion={f.devengado / maxF}
            nota={f.anterior > 0 ? `${p.anio - 1}: ${millones(f.anterior)}` : null}
          />
        ))}
      </div>

      {(bajas.length > 0 || subidas.length > 0) && (
        <div className="panel">
          <h2>Para que lo veas claro</h2>
          {bajas.map((f) => (
            <div className="meta" key={"b" + f.codigo}>
              <b className="w">▼{pct(Math.abs(f.v))}</b>
              <span>
                La inversión en {nombreF(f).toLowerCase()} en {prov.nombre} bajó frente a {p.anio - 1} ({millones(f.anterior)} →{" "}
                {millones(f.devengado)})
              </span>
            </div>
          ))}
          {subidas.map((f) => (
            <div className="meta" key={"s" + f.codigo}>
              <b>▲{pct(f.v)}</b>
              <span>
                La inversión en {nombreF(f).toLowerCase()} subió ({millones(f.anterior)} → {millones(f.devengado)})
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="panel">
        <h2>Todas las provincias</h2>
        <div className="sub">Inversión en {p.etiqueta}. Toca una para verla.</div>
        {[...lista]
          .sort((a, b) => b.devengado - a.devengado)
          .map((x) => (
            <button key={x.codigo} style={{ display: "block", width: "100%", textAlign: "left" }} onClick={() => { elegir(x.codigo); window.scrollTo(0, 0); }}>
              <Barra label={x.nombre} valor={millones(x.devengado)} fraccion={x.devengado / lista.reduce((m, y) => Math.max(m, y.devengado), 1)} />
            </button>
          ))}
        <div className="sub" style={{ marginBottom: 0 }}>
          Además, {millones(sinProvincia)} se invirtieron en proyectos de alcance nacional o de varias provincias.
        </div>
      </div>

      <div className="warn">
        Esto es solo <b>inversión</b> (obras, equipos, construcción). No incluye sueldos de maestros, médicos o policías
        de la provincia, que el Estado no reporta por provincia. Los contratos por provincia vienen pronto.
      </div>
      <Fuente fuente={datos.fuentes.ejecucion} tablas={[tabla]} />
    </div>
  );
}
