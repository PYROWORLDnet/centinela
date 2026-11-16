import { Header, Titulo, Barra, Fuente } from "../components/ui.jsx";
import { millones, pct, variacion } from "../lib/formato.js";

const ENTIDADES = {
  DGII: "DGII — impuestos internos",
  DGA: "Aduanas — impuestos a lo que se importa",
  TN: "Tesorería — otros ingresos",
};
const MES = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function Entradas({ datos }) {
  const { ingresos: ing, balance: b, periodo: p } = datos;
  const total = b.ingresos.ejecutado;
  const entidades = ing.entidades;
  const otros = total - entidades.reduce((a, e) => a + e.recaudado, 0);
  const dg = ing.dgii;
  const maxC = Math.max(...dg.conceptos.map((c) => c.acumulado));
  const ult12 = dg.serie.slice(-12);
  const maxS = Math.max(...ult12.map((s) => s.total));
  const vDgii = variacion(dg.acumulado, dg.acumuladoAnterior);

  return (
    <div className="wrap">
      <Header chip={p.etiqueta} />
      <Titulo pre="Ingresos del Gobierno Central">¿De dónde sale el dinero?</Titulo>

      <div className="bal">
        <small>Entró en {p.etiqueta}</small>
        <div className="n pos">{millones(total)}</div>
        <small>
          {(() => {
            const v = variacion(total, b.ingresos.anterior);
            return `${pct(Math.abs(v), 1)} ${v >= 0 ? "más" : "menos"} que el mismo período de ${p.anio - 1}.`;
          })()}{" "}
          Además entraron{" "}
          {millones(b.prestamos.ejecutado)} en préstamos y otras fuentes de financiamiento.
        </small>
      </div>

      <div className="panel">
        <h2>¿Quién lo cobró?</h2>
        {entidades.map((e) => (
          <Barra
            key={e.sigla}
            label={ENTIDADES[e.sigla] || e.sigla}
            valor={millones(e.recaudado)}
            fraccion={e.recaudado / total}
            nota={
              <>
                {pct(e.recaudado / total, 1)} del total · estimado para el período: {millones(e.estimado)} (
                {e.recaudado >= e.estimado ? "cobró más" : "cobró menos"} de lo previsto)
              </>
            }
          />
        ))}
        {otros > 0 && <Barra label="Otros (donaciones, ingresos de capital, etc.)" valor={millones(otros)} fraccion={otros / total} />}
      </div>

      <div className="panel">
        <h2>¿Qué impuestos cobra la DGII?</h2>
        <div className="sub">
          Enero–{dg.ultimoMes.etiqueta}: {millones(dg.acumulado)}
          {vDgii != null && <> ({vDgii >= 0 ? "+" : ""}{pct(vDgii, 1)} vs {dg.ultimoMes.anio - 1})</>}
        </div>
        {dg.conceptos
          .filter((c) => c.acumulado > 0)
          .map((c) => (
            <Barra
              key={c.concepto}
              label={c.nombre}
              valor={millones(c.acumulado)}
              fraccion={c.acumulado / maxC}
              nota={`${pct(c.acumulado / dg.acumulado, 1)} de lo que cobra la DGII`}
            />
          ))}
      </div>

      <div className="panel">
        <h2>Lo que cobra la DGII cada mes</h2>
        <div className="sub">Últimos 12 meses, en millones de pesos</div>
        <div className="mini">
          {ult12.map((s, i) => (
            <div
              key={s.periodo}
              className={i === ult12.length - 1 ? "cur" : ""}
              style={{ height: `${(100 * s.total) / maxS}%` }}
              title={`${s.periodo}: ${millones(s.total)}`}
            />
          ))}
        </div>
        <div className="mini-l">
          {ult12.map((s) => (
            <span key={s.periodo}>{MES[Number(s.periodo.slice(5)) - 1]}</span>
          ))}
        </div>
        <div className="meta" style={{ marginTop: 10 }}>
          <b>{millones(ult12.at(-1).total)}</b>
          <span>cobró la DGII en {dg.ultimoMes.etiqueta}</span>
        </div>
      </div>

      <Fuente fuente={datos.fuentes.ejecucion} tablas={[ing.tablas.entidades, ing.tablas.economica]} />
      <Fuente fuente={datos.fuentes.recaudacion} />
    </div>
  );
}
