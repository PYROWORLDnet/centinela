import { useEffect, useState } from "react";
import { Header, Titulo, Barra, COLORES, Fuente } from "../components/ui.jsx";
import { millones, pct, variacion } from "../lib/formato.js";

const SEGMENTOS = [
  ["para", "¿Para qué?"],
  ["tipo", "¿En qué tipo?"],
  ["inst", "¿Quién gastó?"],
  ["deuda", "Deuda"],
  ["metas", "Metas"],
];

function Var({ actual, anterior }) {
  const v = variacion(actual, anterior);
  if (v == null || !isFinite(v)) return null;
  return (
    <span style={{ color: v >= 0 ? "var(--green)" : "var(--red)", fontWeight: 700 }}>
      {v >= 0 ? "▲" : "▼"} {pct(Math.abs(v), 1)}
    </span>
  );
}

export default function Gastos({ datos }) {
  const g = datos.gastos;
  const p = datos.periodo;
  const [seg, setSeg] = useState(window.location.hash === "#metas" ? "metas" : "para");
  const [inst, setInst] = useState(15);
  useEffect(() => {
    if (window.location.hash === "#metas") setSeg("metas");
  }, []);
  const maxCat = Math.max(...g.categorias.map((c) => c.devengado));
  const maxTipo = Math.max(...g.tipos.map((c) => c.devengado));
  const instituciones = [...g.instituciones].sort((a, b) => b.devengado - a.devengado);
  const maxInst = instituciones[0]?.devengado || 1;
  const d = g.deuda;

  return (
    <div className="wrap">
      <Header chip={p.etiqueta} />
      <Titulo pre="Gastos del Gobierno Central">¿En qué se fue el dinero?</Titulo>

      <div className="bal">
        <small>Gastado en {p.etiqueta}</small>
        <div className="n pos">{millones(g.total)}</div>
        <small>
          De {millones(datos.cumplimiento.presupuestoVigente)} aprobados para todo {p.anio} ·{" "}
          {pct(g.total / datos.cumplimiento.presupuestoVigente)} usado
        </small>
      </div>

      <div className="seg">
        {SEGMENTOS.map(([k, l]) => (
          <button key={k} className={seg === k ? "on" : ""} onClick={() => setSeg(k)}>
            {l}
          </button>
        ))}
      </div>

      {seg === "para" && (
        <div className="panel">
          <h2>¿Para qué se usó?</h2>
          <div className="sub">
            Agrupamos las funciones oficiales del presupuesto en categorías fáciles. Toca "ver detalle" para ver los
            nombres oficiales. Comparado con {p.etiqueta.replace(String(p.anio), String(p.anio - 1))}.
          </div>
          {g.categorias.map((c) => (
            <Barra
              key={c.id}
              label={
                <>
                  <i style={{ display: "inline-block", width: 9, height: 9, borderRadius: 3, background: COLORES[c.id], marginRight: 6 }} />
                  {c.nombre}
                </>
              }
              valor={millones(c.devengado)}
              fraccion={c.devengado / maxCat}
              rojo={c.id === "deuda"}
              nota={
                <>
                  {pct(c.devengado / g.total, 1)} del gasto · <Var actual={c.devengado} anterior={c.anterior} /> vs año pasado
                  {c.detalle && <> · {c.detalle}</>}
                </>
              }
            >
              {c.oficiales.map((o) => (
                <div key={o.codigo}>
                  <span>
                    {o.codigo} {o.nombre}
                  </span>
                  <span>{millones(o.devengado)}</span>
                </div>
              ))}
            </Barra>
          ))}
          <p className="src" style={{ textAlign: "left" }}>
            Nota: "Pago de deuda pública" según la clasificación por función ({millones(g.categorias.find((c) => c.id === "deuda")?.devengado || 0)})
            es mayor que los intereses según el tipo de gasto ({millones(datos.balance.intereses.ejecutado)}). Las dos cifras
            salen del mismo informe oficial; la primera incluye otros cargos que Hacienda registra en la función deuda.
          </p>
        </div>
      )}

      {seg === "tipo" && (
        <div className="panel">
          <h2>¿En qué tipo de gasto?</h2>
          <div className="sub">La misma plata, vista por tipo: sueldos, compras, intereses, obras…</div>
          {g.tipos
            .filter((t) => t.devengado > 0)
            .map((t) => (
              <Barra
                key={t.id}
                label={t.nombre}
                valor={millones(t.devengado)}
                fraccion={t.devengado / maxTipo}
                rojo={t.id === "intereses"}
                nota={
                  <>
                    {pct(t.devengado / g.total, 1)} del gasto · <Var actual={t.devengado} anterior={t.anterior} /> vs año pasado
                    {t.detalle && <> · {t.detalle}</>}
                  </>
                }
              />
            ))}
        </div>
      )}

      {seg === "inst" && (
        <div className="panel">
          <h2>¿Quién gastó?</h2>
          <div className="sub">
            Ministerios y entidades del Gobierno Central. La barra muestra cuánto han usado de su presupuesto del año; la
            raya negra, cuánto del año ha pasado.
          </div>
          {instituciones.slice(0, inst).map((i) => (
            <Barra
              key={i.codigo}
              label={i.nombre}
              valor={millones(i.devengado)}
              fraccion={i.vigente ? i.devengado / i.vigente : i.devengado / maxInst}
              linea={datos.cumplimiento.avanceDelAnio}
              nota={
                <>
                  {i.vigente ? <>Usado {pct(i.devengado / i.vigente)} de {millones(i.vigente)}</> : "Sin presupuesto vigente"} ·{" "}
                  <Var actual={i.devengado} anterior={i.anterior} /> vs año pasado
                </>
              }
            />
          ))}
          {inst < instituciones.length && (
            <button className="mas" style={{ color: "var(--green)", fontWeight: 700, fontSize: 13 }} onClick={() => setInst(instituciones.length)}>
              Ver las {instituciones.length} instituciones
            </button>
          )}
        </div>
      )}

      {seg === "deuda" && d && (
        <div className="panel">
          <h2>Pago de la deuda</h2>
          <div className="sub">Lo que se pagó de deuda en {p.etiqueta}: intereses (el costo) y amortización (devolver lo prestado)</div>
          {[
            ["Intereses deuda externa", d.externo?.intereses],
            ["Intereses deuda interna", d.interno?.intereses],
            ["Amortización externa", d.externo?.amortizacion],
            ["Amortización interna", d.interno?.amortizacion],
            ["Comisiones", { devengado: (d.externo?.comisiones?.devengado || 0) + (d.interno?.comisiones?.devengado || 0) }],
          ]
            .filter(([, v]) => v)
            .map(([l, v]) => (
              <Barra key={l} label={l} valor={millones(v.devengado)} fraccion={v.devengado / d.total.devengado} rojo={/Intereses/.test(l)} />
            ))}
          <div className="meta" style={{ marginTop: 6 }}>
            <b>Total</b>
            <span style={{ flex: 1 }}>Servicio de la deuda</span>
            <span style={{ fontFamily: "var(--mono)", fontWeight: 700 }}>{millones(d.total.devengado)}</span>
          </div>
          <div className="meta">
            <b className="r">{pct(datos.balance.intereses.ejecutado / datos.balance.ingresos.ejecutado)}</b>
            <span>de todo lo que entró al Estado se fue en intereses</span>
          </div>
        </div>
      )}

      {seg === "metas" && (
        <>
          <div className="sub" style={{ margin: "0 4px 10px" }}>
            Metas físicas que reportan las propias instituciones: lo programado vs lo logrado en {p.etiqueta}.
          </div>
          {datos.cumplimiento.metas.map((m) => (
            <div className="panel" key={m.tabla}>
              <h2>{m.institucion}</h2>
              {m.productos.map((x, i) => (
                <div className="meta" key={i}>
                  <b className={x.cumplimiento >= 0.95 ? "" : x.cumplimiento >= 0.7 ? "w" : "r"}>{pct(x.cumplimiento)}</b>
                  <span>
                    {x.producto}
                    <span style={{ color: "var(--muted)" }}>
                      {" "}
                      — {x.logrado.toLocaleString("es-DO")} de {x.meta.toLocaleString("es-DO")} {x.unidad ? x.unidad.toLowerCase() : ""}
                      {x.devengado > 0 && <> · {millones(x.devengado)}</>}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      <Fuente
        fuente={datos.fuentes.ejecucion}
        tablas={[g.tablas.funcional, g.tablas.economica, g.tablas.institucional, g.tablas.deuda]}
      />
    </div>
  );
}
