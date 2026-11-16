import { useState } from "react";
import { Header, Titulo, Fuente } from "../components/ui.jsx";
import { millones, monto, numero, pct, fecha } from "../lib/formato.js";

const ALERTAS = {
  excepcion: "por excepción",
  un_solo_oferente: "1 solo oferente",
};

export function Movimiento({ c }) {
  const alerta = c.alertas[0];
  const Tag = c.enlace ? "a" : "div";
  return (
    <Tag className="mov" {...(c.enlace ? { href: c.enlace, target: "_blank", rel: "noreferrer" } : {})}>
      <div className={`ic${alerta ? " r" : ""}`}>{alerta ? "!" : c.institucion.charAt(0).toUpperCase()}</div>
      <div className="tx">
        <b>{c.proveedor}</b>
        <span>Le compró: {c.institucion}</span>
        <span>
          {c.titulo.charAt(0) + c.titulo.slice(1).toLowerCase()} · {fecha(c.fecha)}
        </span>
      </div>
      <div className="amt">
        {monto(c.monto)}
        {alerta && <small>{ALERTAS[alerta]}</small>}
      </div>
    </Tag>
  );
}

export default function Contratos({ datos }) {
  const k = datos.contratos;
  const [filtro, setFiltro] = useState("recientes");
  const lista = {
    recientes: k.recientes,
    alertas: k.mayoresConAlerta,
    mayores: k.mayores,
  }[filtro];
  const competitivoUno = k.competencia.procesosCompetitivos ? k.competencia.conUnSoloOferente / k.competencia.procesosCompetitivos : 0;

  return (
    <div className="wrap">
      <Header chip={`Hasta ${fecha(k.fechaMasReciente)}`} />
      <Titulo pre="Compras del Estado">¿A quién le compran?</Titulo>

      <div className="bal">
        <small>Contratos firmados en {k.anio}</small>
        <div className="n pos">{millones(k.montoActivo)}</div>
        <small>{numero(k.contratosActivos)} contratos vigentes de {numero(k.procesos)} procesos de compra</small>
      </div>

      <div className="kpis">
        <div className="kpi flag">
          <b>{numero(k.excepcion.contratos)}</b>
          <p>contratos "por excepción", sin concurso normal: {millones(k.excepcion.monto)}</p>
        </div>
        <div className="kpi flag">
          <b>{pct(competitivoUno)}</b>
          <p>
            de los concursos abiertos tuvo un solo oferente ({numero(k.competencia.conUnSoloOferente)} de{" "}
            {numero(k.competencia.procesosCompetitivos)})
          </p>
        </div>
      </div>

      <div className="seg">
        <button className={filtro === "recientes" ? "on" : ""} onClick={() => setFiltro("recientes")}>
          Más recientes
        </button>
        <button className={filtro === "alertas" ? "on" : ""} onClick={() => setFiltro("alertas")}>
          Con alerta
        </button>
        <button className={filtro === "mayores" ? "on" : ""} onClick={() => setFiltro("mayores")}>
          Más grandes
        </button>
      </div>

      <div className="panel">
        <h2>
          {{ recientes: "Últimos contratos", alertas: "Contratos más grandes con alerta", mayores: "Contratos más grandes del año" }[filtro]}
        </h2>
        <div className="sub">Toca uno para abrir su ficha oficial en el portal de Compras Públicas.</div>
        {lista.slice(0, 25).map((c) => (
          <Movimiento key={c.id + c.ocid} c={c} />
        ))}
      </div>

      <div className="panel">
        <h2>Proveedores que más han cobrado</h2>
        <div className="sub">Suma de sus contratos vigentes en {k.anio}</div>
        {k.topProveedores.slice(0, 10).map((p, i) => (
          <div className="meta" key={p.nombre}>
            <b>{i + 1}</b>
            <span style={{ flex: 1 }}>
              {p.nombre}
              <span style={{ color: "var(--muted)" }}> · {numero(p.contratos)} contratos</span>
            </span>
            <span style={{ fontFamily: "var(--mono)", fontWeight: 700 }}>{millones(p.monto)}</span>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>Instituciones que más contratan</h2>
        {k.topInstituciones.slice(0, 10).map((p, i) => (
          <div className="meta" key={p.nombre}>
            <b>{i + 1}</b>
            <span style={{ flex: 1 }}>{p.nombre}</span>
            <span style={{ fontFamily: "var(--mono)", fontWeight: 700 }}>{millones(p.monto)}</span>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>¿Qué significan las alertas?</h2>
        <div className="meta">
          <b className="w">!</b>
          <span>
            <b style={{ font: "inherit", fontWeight: 700, color: "var(--ink)" }}>Por excepción:</b> la ley permite
            comprar sin concurso normal en casos especiales (urgencia, proveedor único, etc.). Es legal, pero merece
            mirarse de cerca.
          </span>
        </div>
        <div className="meta">
          <b className="w">!</b>
          <span>
            <b style={{ font: "inherit", fontWeight: 700, color: "var(--ink)" }}>1 solo oferente:</b> un concurso
            abierto (licitación, comparación de precios o subasta) donde solo se presentó una empresa.
          </span>
        </div>
        <div className="sub" style={{ marginTop: 8, marginBottom: 0 }}>
          Una alerta no es una acusación: es una señal para revisar.
        </div>
      </div>

      {k.inconsistentes.contratos > 0 && (
        <div className="warn">
          <b>Montos con posible error en el portal oficial:</b> {k.inconsistentes.contratos} contratos tienen un monto
          registrado más de 10 veces mayor que el estimado de su propio proceso (por ejemplo,{" "}
          {k.inconsistentes.lista[0] && (
            <>
              {k.inconsistentes.lista[0].institucion}: {millones(k.inconsistentes.lista[0].monto)} registrado vs{" "}
              {millones(k.inconsistentes.lista[0].estimado)} estimado
            </>
          )}
          ). No los sumamos a los totales hasta que la DGCP los corrija.
        </div>
      )}

      <Fuente
        fuente={datos.fuentes.contratos}
        extra={`Moneda: solo contratos en pesos dominicanos (${k.contratosOtrasMonedas} en otras monedas no incluidos).`}
      />
    </div>
  );
}
