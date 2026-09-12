import { useCallback, useEffect, useState } from "react";
import FocusGraph from "../components/FocusGraph";
import { formatMoney } from "../lib/categories";
import { useJson } from "../lib/useGraph";

const COLORS = {
  caso: "#ff7a5c",
  persona: "#ffd166",
  empresa: "#8ecae6",
  institucion: "#c9d6df",
  contrato: "#f4978e",
  prestamo: "#b8b8ff",
};

const CATEGORY_LABEL = {
  caso: "Caso",
  persona: "Persona",
  empresa: "Empresa",
  institucion: "Institución",
  contrato: "Contrato",
  prestamo: "Préstamo",
};

/** B — Escenarios (estilo ICIJ): la portada arma los casos, el grafo se abre al elegir uno. */
export default function ScenariosView() {
  const { data, error } = useJson("/api/scenarios");
  const [active, setActive] = useState(null);
  const [sub, setSub] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);

  const open = useCallback(async (scenario) => {
    setActive(scenario);
    setSub(null);
    setSelectedId(null);
    setDetail(null);
    const ids = scenario.nodeIds.join(",");
    const res = await fetch(`/api/subgraph?ids=${encodeURIComponent(ids)}&hops=1&max=22`);
    setSub(await res.json());
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/nodes/${encodeURIComponent(selectedId)}`)
      .then((r) => r.json())
      .then((d) => !cancelled && setDetail(d))
      .catch(() => !cancelled && setDetail(null));
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const scenarios = data?.scenarios || [];

  return (
    <div className="view view--scenarios">
      {!active && (
        <div className="scen">
          <header className="scen__head">
            <p className="scen__eyebrow">Centinela · República Dominicana</p>
            <h1>
              Elige un hilo.
              <br />
              Nosotros dibujamos la red.
            </h1>
            <p className="scen__sub">
              Cada caso se arma con datos públicos: contratos, préstamos, patrimonio declarado y
              propiedad de empresas. Toca uno para ver quién está conectado con quién.
            </p>
          </header>

          {error && <p className="scen__error">{error}</p>}

          <div className="scen__grid">
            {scenarios.map((s, i) => (
              <button key={s.id} type="button" className="scencard" onClick={() => open(s)}>
                <span className="scencard__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="scencard__title">{s.title}</span>
                <span className="scencard__blurb">{s.blurb}</span>
                <span className="scencard__who">
                  {s.nodes.slice(0, 4).map((n) => (
                    <em key={n.id} style={{ borderColor: COLORS[n.category] }}>
                      {n.name}
                    </em>
                  ))}
                </span>
                <span className="scencard__tags">
                  {s.tags.map((t) => (
                    <i key={t}>{t}</i>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {active && (
        <div className="scen-detail">
          <header className="scen-detail__bar">
            <button type="button" className="scen-detail__back" onClick={() => setActive(null)}>
              ← Todos los hilos
            </button>
            <div>
              <h2>{active.title}</h2>
              <p>{active.blurb}</p>
            </div>
          </header>

          <div className="scen-detail__body">
            <div className="scen-detail__graph">
              {!sub && <div className="banner">Armando la red…</div>}
              {sub && (
                <FocusGraph
                  data={sub}
                  palette={COLORS}
                  seedIds={active.nodeIds}
                  selectedId={selectedId}
                  onSelectNode={setSelectedId}
                  linkColor="rgba(255, 190, 150, 0.3)"
                  weighted
                />
              )}
            </div>

            <aside className="scen-detail__side">
              {!detail && (
                <div className="scen-detail__hint">
                  <h3>Cómo leer esto</h3>
                  <p>
                    Los nodos grandes son los protagonistas del hilo. Los pequeños salieron al
                    expandir un salto de conexiones.
                  </p>
                  <p>Toca cualquiera para ver su ficha y la fuente de cada dato.</p>
                </div>
              )}
              {detail && (
                <>
                  <p className="scen-detail__kind">{CATEGORY_LABEL[detail.category]}</p>
                  <h3>{detail.name}</h3>
                  {detail.role && <p className="scen-detail__role">{detail.role}</p>}
                  <dl>
                    {detail.amount != null && (
                      <>
                        <dt>Monto</dt>
                        <dd>{formatMoney(detail.amount)}</dd>
                      </>
                    )}
                    {detail.netWorth != null && (
                      <>
                        <dt>Patrimonio</dt>
                        <dd>
                          {formatMoney(detail.netWorth)}
                          {detail.netWorthDelta != null && ` (${detail.netWorthDelta > 0 ? "+" : ""}${detail.netWorthDelta}%)`}
                        </dd>
                      </>
                    )}
                    {detail.code && (
                      <>
                        <dt>Código</dt>
                        <dd className="mono">{detail.code}</dd>
                      </>
                    )}
                  </dl>
                  <h4>Vinculaciones</h4>
                  <ul className="scen-detail__links">
                    {detail.connections?.slice(0, 14).map((c) => (
                      <li key={`${c.type}-${c.node?.id}`}>
                        <button type="button" onClick={() => setSelectedId(c.node.id)}>
                          <strong>{c.node?.name}</strong>
                          <em>{c.type.replaceAll("_", " ")}</em>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
