import { CATEGORY_COLOR, formatMoney } from "../lib/categories";

function isDemoLink(c) {
  if (c.demo) return true;
  const label = c.sourceRef?.label || "";
  return /demostraci[oó]n/i.test(label);
}

export default function NodePanel({ node, onClose, onBack, canGoBack, onFocusConnection, colors }) {
  if (!node) return null;

  const palette = colors || CATEGORY_COLOR;
  const initial = node.name?.charAt(0)?.toUpperCase() || "?";
  const color = palette[node.category] || "#888";
  const connections = node.connections || [];
  const sourced = connections.filter((c) => !isDemoLink(c));
  const demo = connections.filter((c) => isDemoLink(c));

  return (
    <aside className="panel" aria-label={`Ficha de ${node.name}`}>
      <header className="panel__head">
        <div className="panel__avatar" style={{ borderColor: color, color }}>
          {initial}
        </div>
        <div className="panel__titles">
          <p className="panel__cat">{node.category}</p>
          <h2>{node.name}</h2>
          {node.role && <p className="panel__role">{node.role}</p>}
        </div>
        <button type="button" className="panel__close" onClick={onClose} aria-label="Cerrar ficha">
          ×
        </button>
      </header>

      <dl className="panel__meta">
        {node.party && (
          <>
            <dt>Partido</dt>
            <dd>{node.party}</dd>
          </>
        )}
        {node.period && (
          <>
            <dt>Período</dt>
            <dd>{node.period}</dd>
          </>
        )}
        {node.salary != null && (
          <>
            <dt>Salario</dt>
            <dd>{formatMoney(node.salary)}</dd>
          </>
        )}
        {node.netWorth != null && (
          <>
            <dt>Patrimonio</dt>
            <dd>
              {formatMoney(node.netWorth)}
              {node.netWorthDelta != null && (
                <span className={node.netWorthDelta >= 0 ? "up" : "down"}>
                  {" "}
                  {node.netWorthDelta >= 0 ? "+" : ""}
                  {node.netWorthDelta}%
                </span>
              )}
            </dd>
          </>
        )}
        {node.amount != null && (
          <>
            <dt>Monto</dt>
            <dd>
              {formatMoney(
                node.amount,
                node.extra?.moneda || (node.category === "prestamo" ? "USD" : "DOP"),
              )}
            </dd>
          </>
        )}
        {node.code && (
          <>
            <dt>Código</dt>
            <dd className="mono">{node.code}</dd>
          </>
        )}
        {node.summary && (
          <>
            <dt>Resumen</dt>
            <dd>{node.summary}</dd>
          </>
        )}
        {node.extra?.source?.url && (
          <>
            <dt>Fuente</dt>
            <dd>
              <a className="panel__source" href={node.extra.source.url} target="_blank" rel="noreferrer">
                {node.extra.source.label || "Documento oficial"}
              </a>
            </dd>
          </>
        )}
        {node.fullName && (
          <>
            <dt>Nombre completo</dt>
            <dd>{node.fullName}</dd>
          </>
        )}
      </dl>

      <section className="panel__links">
        <h3>Vinculaciones</h3>
        {sourced.length === 0 && demo.length === 0 && (
          <p className="panel__empty-links">Sin vínculos documentados todavía.</p>
        )}
        <ul>
          {sourced.map((c) => (
            <LinkRow key={`s-${c.type}-${c.node?.id}`} c={c} palette={palette} onFocus={onFocusConnection} />
          ))}
        </ul>
        {demo.length > 0 && (
          <>
            <h3 className="panel__links-demo">Solo demostración — no es evidencia</h3>
            <ul>
              {demo.map((c) => (
                <LinkRow
                  key={`d-${c.type}-${c.node?.id}`}
                  c={c}
                  palette={palette}
                  onFocus={onFocusConnection}
                  demo
                />
              ))}
            </ul>
          </>
        )}
      </section>

      {canGoBack && (
        <footer className="panel__foot">
          <button type="button" className="panel__back" onClick={onBack}>
            ← Volver
          </button>
        </footer>
      )}
    </aside>
  );
}

function LinkRow({ c, palette, onFocus, demo = false }) {
  return (
    <li className={demo ? "is-demo" : undefined}>
      <button type="button" onClick={() => onFocus(c.node.id)}>
        <span
          className="search__dot"
          style={{ background: palette[c.node?.category] || "#888" }}
        />
        <span className="panel__link-body">
          <strong>{c.node?.name}</strong>
          <em>{c.type.replaceAll("_", " ")}</em>
        </span>
      </button>
      {c.sourceRef && (
        <a
          className="panel__source"
          href={c.sourceRef.url}
          target="_blank"
          rel="noreferrer"
        >
          Fuente: {c.sourceRef.label}
        </a>
      )}
    </li>
  );
}
