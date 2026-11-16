import { Header, Titulo, Donut, COLORES, enCien, Fuente, Verificaciones } from "../components/ui.jsx";
import { millones, monto, pct, variacion, fecha } from "../lib/formato.js";
import { Movimiento } from "./Contratos.jsx";

export default function Inicio({ datos }) {
  const { balance: b, periodo, gastos, cumplimiento: c, contratos, fuentes } = datos;
  const deficit = b.resultadoFinanciero.ejecutado;
  const vIng = variacion(b.ingresos.ejecutado, b.ingresos.anterior);
  const vGas = variacion(b.gastos.ejecutado, b.gastos.anterior);
  const cien = enCien(gastos.categorias.map((x) => x.devengado));
  const usado = c.ejecutado / c.presupuestoVigente;

  // Metas: las 3 con más dinero entre las instituciones que reportan, para que se vea lo grande.
  const metas = c.metas
    .flatMap((m) => m.productos.map((p) => ({ ...p, institucion: m.institucion })))
    .filter((p) => p.devengado > 0)
    .sort((a, b) => b.devengado - a.devengado)
    .slice(0, 4);

  return (
    <div className="wrap">
      <Header chip={`Datos a ${periodo.etiqueta.split("–")[1]}`} />
      <Titulo pre="Tu cuenta con el Estado">¿Cómo van tus cuartos?</Titulo>

      <div className="bal">
        <small>Balance {periodo.etiqueta}</small>
        <div className={`n${deficit >= 0 ? " pos" : ""}`}>{millones(deficit)}</div>
        <small>{deficit < 0 ? "Déficit: gastaron más de lo que entró" : "Superávit: entró más de lo que gastaron"}</small>
        <div className="row">
          <div>
            <span>↓ Entró</span>
            <b>{millones(b.ingresos.ejecutado)}</b>
            {vIng != null && <em className={vIng < 0 ? "r" : ""}>{vIng >= 0 ? "+" : "−"}{pct(Math.abs(vIng), 1)} vs {periodo.anio - 1}</em>}
          </div>
          <div>
            <span>↑ Salió</span>
            <b>{millones(b.gastos.ejecutado)}</b>
            {vGas != null && <em className="r">{vGas >= 0 ? "+" : "−"}{pct(Math.abs(vGas), 1)} vs {periodo.anio - 1}</em>}
          </div>
        </div>
        <div className="note">
          Para cubrir el hueco y pagar deuda vieja, <b>consiguieron {millones(b.prestamos.ejecutado)} en financiamiento</b>{" "}
          (préstamos, bonos y otras fuentes) y pagaron {millones(b.amortizaciones.ejecutado)} de deuda anterior.
        </div>
      </div>

      <div className="strip">
        <div>
          <b>{millones(b.porDia.gasto)}</b>
          <span>gasta el Gobierno cada día</span>
        </div>
        <div className="r">
          <b>{millones(b.porDia.intereses)}</b>
          <span>se van cada día solo en intereses de la deuda</span>
        </div>
      </div>

      <div className="panel">
        <h2>
          ¿Para qué se usó? <a href="/gastos">Ver todo</a>
        </h2>
        <div className="sub">De cada RD$100 gastados</div>
        <div className="donut">
          <Donut partes={gastos.categorias.map((x) => ({ valor: x.devengado, color: COLORES[x.id] }))} />
          <div className="leg">
            {gastos.categorias.map((x, i) => (
              <div key={x.id}>
                <i style={{ background: COLORES[x.id] }} />
                <span>{x.nombre}</span>
                <span className="v">{cien[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>¿Están cumpliendo?</h2>
        <div className="sub">Lo que se aprobó gastar vs lo que va</div>
        <div className="bar">
          <div className="l">
            <span>Presupuesto usado</span>
            <span>{pct(usado)}</span>
          </div>
          <div className="t">
            <div style={{ width: `${100 * usado}%` }} />
            <i style={{ left: `${100 * c.avanceDelAnio}%` }} />
          </div>
          <p>
            Han pasado {periodo.mesHasta} de 12 meses ({pct(c.avanceDelAnio)}). La raya negra marca dónde deberían ir.
          </p>
        </div>
        <div className="sub" style={{ marginTop: 10 }}>Metas de los programas con más dinero</div>
        {metas.map((m) => (
          <div className="meta" key={m.institucion + m.producto}>
            <b className={m.cumplimiento >= 0.95 ? "" : m.cumplimiento >= 0.7 ? "w" : "r"}>{pct(m.cumplimiento)}</b>
            <span>
              {m.producto} <span style={{ color: "var(--muted)" }}>— {m.institucion}</span>
            </span>
          </div>
        ))}
        <a href="/gastos#metas" style={{ fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
          Ver todas las metas →
        </a>
      </div>

      <div className="panel">
        <h2>
          Últimos contratos <a href="/contratos">Ver todos</a>
        </h2>
        <div className="sub">
          De más de RD$1 millón, registrados en el portal de Compras Públicas hasta el {fecha(contratos.fechaMasReciente)}
        </div>
        {contratos.recientes.filter((x) => x.monto >= 1e6).slice(0, 4).map((x) => (
          <Movimiento key={x.id} c={x} />
        ))}
      </div>

      <a className="cta" href="/tu-parte">
        <div>
          <b>¿Cuánto pusiste tú?</b>
          <p>Pon tu sueldo y mira a dónde fue tu dinero</p>
        </div>
        <span>→</span>
      </a>

      <Verificaciones datos={datos} />
      <Fuente fuente={fuentes.ejecucion} tablas={[b.tablas.resumen, gastos.tablas.funcional]} />
      <p className="src">
        Montos en millones de pesos (M). Los gastos son "devengados": el Estado ya recibió el bien o servicio y
        reconoció la deuda, aunque quizás no lo haya pagado todavía. Ejemplo: {monto(1_500_000)} = un millón quinientos
        mil pesos.
      </p>
    </div>
  );
}
