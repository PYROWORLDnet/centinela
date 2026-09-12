-- Grafo de transparencia: nodos, vínculos y fuentes citables.

CREATE TABLE IF NOT EXISTS nodes (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  aliases       TEXT[] NOT NULL DEFAULT '{}',
  category      TEXT NOT NULL,
  role          TEXT,
  party         TEXT,
  period        TEXT,
  rnc           TEXT,
  salary        BIGINT,
  net_worth     BIGINT,
  net_worth_delta NUMERIC,
  amount        BIGINT,
  code          TEXT,
  summary       TEXT,
  extra         JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS edges (
  id          BIGSERIAL PRIMARY KEY,
  source_id   TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  target_id   TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  weight      NUMERIC,
  note        TEXT,
  UNIQUE (source_id, target_id, type)
);

CREATE TABLE IF NOT EXISTS sources (
  id          BIGSERIAL PRIMARY KEY,
  node_id     TEXT REFERENCES nodes(id) ON DELETE CASCADE,
  edge_id     BIGINT REFERENCES edges(id) ON DELETE CASCADE,
  kind        TEXT NOT NULL DEFAULT 'official',
  label       TEXT NOT NULL,
  url         TEXT NOT NULL,
  note        TEXT
);

CREATE INDEX IF NOT EXISTS nodes_name_lower_idx ON nodes (lower(name));
CREATE INDEX IF NOT EXISTS nodes_rnc_idx ON nodes (rnc);
CREATE INDEX IF NOT EXISTS nodes_category_idx ON nodes (category);
CREATE INDEX IF NOT EXISTS edges_source_idx ON edges (source_id);
CREATE INDEX IF NOT EXISTS edges_target_idx ON edges (target_id);
