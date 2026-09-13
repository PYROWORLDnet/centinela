import { useEffect, useState } from "react";
import FocusGraph from "../components/FocusGraph";
import SearchBar from "../components/SearchBar";
import { formatMoney } from "../lib/categories";
import { useJson } from "../lib/useGraph";

const COLORS = {
  caso: "#e8c26a",
  persona: "#d98f6a",
  empresa: "#7fa8a0",
  institucion: "#9aa8bd",
  contrato: "#c78b6a",
  prestamo: "#a89a7c",
};

const LEGEND = [
  { id: "persona", label: "Personas" },
  { id: "empresa", label: "Empresas" },
  { id: "institucion", label: "Instituciones" },
  { id: "contrato", label: "Contratos" },
  { id: "prestamo", label: "Préstamos" },
  { id: "caso", label: "Casos" },
];

/** C — Expediente (estilo Investigation Room): pistas automáticas + evidencia citada. */
export default function DossierView() {
  const { data: leadsData } = useJson("/api/leads");
  const [activeLead, setActiveLead] = useState(null);
  const [sub, setSub] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);

  const leads = leadsData?.leads || [];

  useEffect(() => {
    if (!activeLead) return;
    let cancelled = false;
    setSub(null);
    fetch(`/api/subgraph?ids=${encodeURIComponent(activeLead.nodeIds.join(","))}&hops=1&max=18`)
      .then((r) => r.json())
      .then((d) => !cancelled && setSub(d));
    return () => {
      cancelled = true;
    };
  }, [activeLead]);

  useEffect(() => {
    if (leads.length && !activeLead) setActiveLead(leads[0]);
  }, [leads, activeLead]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/nodes/${encodeURIComponent(selectedId)}`)
      .then((r) => r.json())
      .then((d) => !cancelled && setDetail(d));
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  return (
    <div className="view view--dossier">
      <header className="dos__head">
        <div className="dos__title">
          <h1>Centinela</h1>
          <p>Expediente público · República Dominicana</p>
        </div>
        <SearchBar onSelect={setSelectedId} colors={COLORS} />
      </header>

      <div className="dos__body">
        <section className="dos__leads" aria-label="Pistas">
          <h2>Dónde mirar</h2>
          <p className="dos__disclaimer">
            Patrones detectados automáticamente en datos públicos. Señalan dónde mirar, no una
            conclusión. Toda persona es inocente hasta que un tribunal diga lo contrario.
          </p>
          <ul>
            {leads.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  className={activeLead?.id === l.id ? "is-active" : undefined}
                  onClick={() => {
                    setActiveLead(l);
                    setSelectedId(null);
                  }}
                >
                  <span className="dos__lead-kind">{l.kind}</span>
                  <span className="dos__lead-text">{l.text}</span>
                  {l.amount != null && (
                    <span className="dos__lead-amount">{formatMoney(l.amount)}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="dos__board" aria-label="Red de la pista">
          <div className="dos__board-head">
            <h2>{activeLead?.kind || "Red"}</h2>
            <ul className="dos__legend">
              {LEGEND.map((l) => (
                <li key={l.id}>
                  <i style={{ background: COLORS[l.id] }} />
                  {l.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="dos__canvas">
            {!sub && <div className="banner">Trazando la red…</div>}
            {sub && (
              <FocusGraph
                data={sub}
                palette={COLORS}
                seedIds={activeLead?.nodeIds}
                selectedId={selectedId}
                onSelectNode={setSelectedId}
                linkColor="rgba(220, 190, 150, 0.28)"
                weighted
              />
            )}
          </div>
        </section>

        <aside className="dos__evidence" aria-label="Evidencia">
          <h2>Evidencia</h2>
          {!detail && activeLead && (
            <div className="dos__ev-empty">
              <p>{activeLead.text}</p>
              {activeLead.sourceRef && !/github\.com|demostraci/i.test(`${activeLead.sourceRef.label} ${activeLead.sourceRef.url}`) && (
                <a href={activeLead.sourceRef.url} target="_blank" rel="noreferrer">
                  {activeLead.sourceRef.label}
                </a>
              )}
              <p className="dos__ev-tip">Toca un nodo del tablero para abrir su ficha.</p>
            </div>
          )}
          {detail && (
            <div className="dos__ev-card">
              <p className="dos__ev-kind">{detail.category}</p>
              <h3>{detail.name}</h3>
              {detail.role && <p className="dos__ev-role">{detail.role}</p>}
              <dl>
                {detail.party && (
                  <>
                    <dt>Partido</dt>
                    <dd>{detail.party}</dd>
                  </>
                )}
                {detail.period && (
                  <>
                    <dt>Período</dt>
                    <dd>{detail.period}</dd>
                  </>
                )}
                {detail.salary != null && (
                  <>
                    <dt>Salario</dt>
                    <dd>{formatMoney(detail.salary)}</dd>
                  </>
                )}
                {detail.netWorth != null && (
                  <>
                    <dt>Patrimonio</dt>
                    <dd>
                      {formatMoney(detail.netWorth)}
                      {detail.netWorthDelta != null && (
                        <em className={detail.netWorthDelta >= 0 ? "up" : "down"}>
                          {" "}
                          {detail.netWorthDelta >= 0 ? "+" : ""}
                          {detail.netWorthDelta}%
                        </em>
                      )}
                    </dd>
                  </>
                )}
                {detail.amount != null && (
                  <>
                    <dt>Monto</dt>
                    <dd>{formatMoney(detail.amount)}</dd>
                  </>
                )}
                {detail.code && (
                  <>
                    <dt>Código</dt>
                    <dd className="mono">{detail.code}</dd>
                  </>
                )}
              </dl>

              <h4>Vinculaciones citadas</h4>
              <ul className="dos__ev-links">
                {detail.connections?.slice(0, 12).map((c) => (
                  <li key={`${c.type}-${c.node?.id}`}>
                    <button type="button" onClick={() => setSelectedId(c.node.id)}>
                      <strong>{c.node?.name}</strong>
                      <em>{c.type.replaceAll("_", " ")}</em>
                    </button>
                    {c.sourceRef && (
                      <a href={c.sourceRef.url} target="_blank" rel="noreferrer">
                        {c.sourceRef.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
