import { CATEGORY_COLOR, formatMoney } from "../lib/categories";

function isBadSource(ref) {
  if (!ref?.url) return true;
  const blob = `${ref.label || ""} ${ref.url}`;
  return /github\.com|demostraci[oó]n\s+centinela|datos de demostraci[oó]n/i.test(blob);
}

function isDemoLink(c) {
  if (c.demo) return true;
  return isBadSource(c.sourceRef);
}

export default function NodePanel({
  node,
  browse,
  browseLabel,
  browseYears,
  browseYear,
  onBrowseYear,
  onClose,
  onBack,
  canGoBack,
  onFocusConnection,
  onPickBrowse,
  onStartTour,
  colors,
}) {
  const palette = colors || CATEGORY_COLOR;

  // Lista por categoría (ej. clic en Préstamos / Contratos)
  if (!node && (browse?.length || browseYears?.length)) {
    return (
      <aside className="panel" aria-label={browseLabel || "Explorar"}>
        <header className="panel__head">
          <div className="panel__titles">
            <p className="panel__cat">Explorar</p>
            <h2>{browseLabel || "Categoría"}</h2>
            <p className="panel__role">
              {browseYears?.length
                ? "Más recientes primero · filtra por año si quieres histórico"
                : "Elige un nodo para ver la ficha"}
            </p>
          </div>
          <button type="button" className="panel__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>
        {browseYears?.length > 0 && (
          <div className="panel__years" role="group" aria-label="Filtrar por año">
            <button
              type="button"
              className={!browseYear ? "is-active" : undefined}
              onClick={() => onBrowseYear?.(null)}
            >
              Todos
            </button>
            {browseYears.slice(0, 8).map((y) => (
              <button
                key={y.year}
                type="button"
                className={browseYear === y.year ? "is-active" : undefined}
                onClick={() => onBrowseYear?.(y.year)}
              >
                {y.year}
              </button>
            ))}
          </div>
        )}
        <section className="panel__links">
          {!browse?.length && (
            <p className="panel__empty-links">No hay contratos para ese año en la muestra.</p>
          )}
          <ul>
            {(browse || []).map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => onPickBrowse?.(item.id)}>
                  <span
                    className="search__dot"
                    style={{ background: palette[item.category] || "#888" }}
                  />
                  <span className="panel__link-body">
                    <strong>{item.name}</strong>
                    <em>
                      {[
                        item.fecha || null,
                        item.role,
                        item.amount != null ? formatMoney(item.amount, item.currency || "DOP") : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || item.category}
                    </em>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    );
  }

  if (!node) return null;

  const initial = node.name?.charAt(0)?.toUpperCase() || "?";
  const color = palette[node.category] || "#888";
  const connections = node.connections || [];
  const sourced = connections.filter((c) => !isDemoLink(c));
  const source = !isBadSource(node.sourceRef || node.extra?.source)
    ? node.sourceRef || node.extra?.source
    : null;
  const currency = node.extra?.moneda || (node.category === "prestamo" ? "USD" : "DOP");

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
            <dt>Periodo</dt>
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
            <dd>{formatMoney(node.amount, currency)}</dd>
          </>
        )}
        {(node.fecha || node.extra?.fecha) && (
          <>
            <dt>Fecha</dt>
            <dd>{node.fecha || node.extra?.fecha}</dd>
          </>
        )}
        {node.rnc && (
          <>
            <dt>RNC</dt>
            <dd className="mono">{node.rnc}</dd>
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
        {(node.mechanism || node.extra?.mechanism) && (
          <>
            <dt>Mecanismo</dt>
            <dd className="panel__mechanism">{node.mechanism || node.extra?.mechanism}</dd>
          </>
        )}
        {source?.url && (
          <>
            <dt>Fuente</dt>
            <dd>
              <a className="panel__source" href={source.url} target="_blank" rel="noreferrer">
                {source.label || "Documento oficial"}
              </a>
            </dd>
          </>
        )}
      </dl>

      <section className="panel__links">
        <h3>Vinculaciones</h3>
        {sourced.length === 0 && (
          <p className="panel__empty-links">Sin vínculos documentados todavía.</p>
        )}
        <ul>
          {sourced.map((c) => (
            <LinkRow key={`s-${c.type}-${c.node?.id}`} c={c} palette={palette} onFocus={onFocusConnection} />
          ))}
        </ul>
      </section>

      {onStartTour && (
        <footer className="panel__foot">
          <button type="button" className="panel__tour-cta" onClick={onStartTour}>
            Ver el mecanismo →
          </button>
        </footer>
      )}

      {canGoBack && !onStartTour && (
        <footer className="panel__foot">
          <button type="button" className="panel__back" onClick={onBack}>
            ← Volver
          </button>
        </footer>
      )}
    </aside>
  );
}

function LinkRow({ c, palette, onFocus }) {
  const src = c.sourceRef && !isBadSource(c.sourceRef) ? c.sourceRef : null;
  const meta = [
    c.type?.replaceAll("_", " "),
    c.amount != null ? formatMoney(c.amount, c.currency || "DOP") : null,
    c.note || null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <li>
      <button type="button" onClick={() => onFocus(c.node.id)}>
        <span
          className="search__dot"
          style={{ background: palette[c.node?.category] || "#888" }}
        />
        <span className="panel__link-body">
          <strong>{c.node?.name}</strong>
          <em>{meta}</em>
        </span>
      </button>
      {src && (
        <a className="panel__source" href={src.url} target="_blank" rel="noreferrer">
          Fuente: {src.label}
        </a>
      )}
    </li>
  );
}
