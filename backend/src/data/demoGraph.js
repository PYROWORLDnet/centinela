/**
 * Grafo: casos reales citables + malla demo para densidad visual.
 */
import { REAL_LINKS, REAL_NODES } from "./publicSeed.js";

const SOURCE = {
  demo: {
    label: "Datos de demostración Centinela",
    url: "https://github.com/PYROWORLDnet/centinela",
  },
  dgcp: {
    label: "DGCP — Contrataciones Públicas",
    url: "https://www.dgcp.gob.do",
  },
  sigef: {
    label: "SIGEF / Transparencia Fiscal",
    url: "https://www.hacienda.gob.do",
  },
  camara: {
    label: "Cámara de Cuentas",
    url: "https://www.camaradecuentas.gob.do",
  },
};

const nodes = [
  ...REAL_NODES,
  {
    id: "caso-horizonte",
    name: "Operación Horizonte",
    category: "caso",
    summary: "Caso demo: red de contratos, empresas pantalla y funcionarios.",
    period: "2018–2023",
    hub: true,
  },
  {
    id: "p-ramirez",
    name: "Luis Ramírez Soto",
    category: "persona",
    role: "Exdirector de proyectos",
    party: "Independiente",
    period: "2016–2022",
    salary: 285000,
    netWorth: 42000000,
    netWorthDelta: 186,
    hub: true,
  },
  {
    id: "p-mejia",
    name: "Carmen Mejía Vargas",
    category: "persona",
    role: "Diputada",
    party: "PRM",
    period: "2020–2024",
    salary: 250000,
    netWorth: 18500000,
    netWorthDelta: 42,
    hub: true,
  },
  {
    id: "p-castillo",
    name: "Héctor Castillo Peña",
    category: "persona",
    role: "Empresario / accionista",
    period: "—",
    netWorth: 95000000,
    netWorthDelta: 12,
    hub: true,
  },
  {
    id: "p-nunez",
    name: "Ana Núñez Cabrera",
    category: "persona",
    role: "Senadora",
    party: "FP",
    period: "2016–2024",
    salary: 275000,
    netWorth: 22100000,
    netWorthDelta: -8,
  },
  {
    id: "e-constructora-norte",
    name: "Constructora Norte del Cibao SRL",
    category: "empresa",
    rnc: "1-01-XXXXX-1",
    hub: true,
  },
  {
    id: "e-inversores-caribe",
    name: "Inversores del Caribe SA",
    category: "empresa",
    rnc: "1-30-XXXXX-2",
    hub: true,
  },
  {
    id: "e-servicios-atlantico",
    name: "Servicios Atlántico RD",
    category: "empresa",
    rnc: "1-31-XXXXX-3",
  },
  {
    id: "e-techgov",
    name: "TechGov Solutions",
    category: "empresa",
    rnc: "1-01-YYYYY-4",
  },
  {
    id: "e-holding-horizonte",
    name: "Holding Horizonte Internacional",
    category: "empresa",
    rnc: "Offshore / demo",
    hub: true,
  },
  {
    id: "i-mopc",
    name: "MOPC",
    category: "institucion",
    fullName: "Ministerio de Obras Públicas y Comunicaciones",
    hub: true,
  },
  {
    id: "i-digepep",
    name: "DIGEPEP",
    category: "institucion",
    fullName: "Dirección General de Programas Especiales de la Presidencia",
    hub: true,
  },
  {
    id: "i-dgcp",
    name: "DGCP",
    category: "institucion",
    fullName: "Dirección General de Contrataciones Públicas",
    hub: true,
  },
  {
    id: "i-camara-cuentas",
    name: "Cámara de Cuentas",
    category: "institucion",
  },
  {
    id: "c-puente-este",
    name: "Contrato Puente Este",
    category: "contrato",
    amount: 1850000000,
    year: 2019,
    code: "MOPC-LPN-2019-084",
  },
  {
    id: "c-hospitales",
    name: "Contrato Red Hospitalaria",
    category: "contrato",
    amount: 920000000,
    year: 2020,
    code: "DIGEPEP-SI-2020-012",
  },
  {
    id: "c-software",
    name: "Contrato Plataforma Digital",
    category: "contrato",
    amount: 145000000,
    year: 2021,
    code: "DGCP-CD-2021-331",
  },
  {
    id: "c-publicidad",
    name: "Contrato Campaña Institucional",
    category: "contrato",
    amount: 68000000,
    year: 2022,
    code: "SIGEF-PUB-2022-019",
  },
  {
    id: "l-bid-vial",
    name: "Préstamo BID Corredor Vial",
    category: "prestamo",
    amount: 250000000,
    year: 2018,
    lender: "BID",
  },
  {
    id: "l-bm-salud",
    name: "Préstamo BM Salud Pública",
    category: "prestamo",
    amount: 120000000,
    year: 2019,
    lender: "Banco Mundial",
  },
];

const firstNames = [
  "José", "María", "Pedro", "Laura", "Miguel", "Rosa", "Andrés", "Patricia",
  "Francisco", "Elena", "Rafael", "Sofía", "Manuel", "Isabel", "Carlos", "Lucía",
  "Diego", "Valeria", "Tomás", "Camila", "Julio", "Daniela", "Óscar", "Paola",
];
const lastNames = [
  "García", "Rodríguez", "Martínez", "Fernández", "López", "Pérez", "González",
  "Sánchez", "Ramírez", "Torres", "Díaz", "Vargas", "Jiménez", "Morales", "Cruz",
];
const companyWords = [
  "Caribe", "Quisqueya", "Ozama", "Yaque", "Samaná", "Cibao", "Hispaniola",
  "Atlántico", "Oriental", "Del Sur", "Nacional", "Universal", "Prime", "Delta",
  "Coral", "Palm", "Bahía", "Sierra",
];
const companyTypes = [
  "SRL", "SA", "EIRL", "Constructora", "Inversiones", "Servicios", "Tech", "Logística",
];

function pick(arr, i) {
  return arr[i % arr.length];
}

/** Deterministic pseudo-random 0..1 */
function rnd(i, salt = 1) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const hubs = [
  "i-camara-diputados",
  "i-senado",
  "i-dgcp",
  "i-mopc",
  "i-digepep",
  "i-camara-cuentas",
  "caso-horizonte",
  "e-holding-horizonte",
  "e-constructora-norte",
  "p-castillo",
  "p-ramirez",
];

/** Personas/instituciones reales: NUNCA reciben aristas inventadas del mesh demo. */
const PROTECTED_IDS = new Set(REAL_NODES.map((n) => n.id));

function isProtected(id) {
  return PROTECTED_IDS.has(id);
}

// Dense satellites — Obsidian needs hundreds of points
const batches = [
  { prefix: "dip", category: "persona", hub: "i-camara-diputados", count: 190, link: "miembro_de" },
  { prefix: "sen", category: "persona", hub: "i-senado", count: 110, link: "miembro_de" },
  { prefix: "prov", category: "empresa", hub: "i-dgcp", count: 340, link: "registrada_en" },
  { prefix: "aud", category: "contrato", hub: "i-camara-cuentas", count: 180, link: "auditado_por" },
  { prefix: "obr", category: "contrato", hub: "i-mopc", count: 240, link: "emitido_por" },
  { prefix: "esp", category: "contrato", hub: "i-digepep", count: 170, link: "emitido_por" },
  { prefix: "soc", category: "empresa", hub: "e-holding-horizonte", count: 140, link: "relacionada_con" },
  { prefix: "per", category: "persona", hub: "caso-horizonte", count: 120, link: "mencionada_en" },
];

for (const seed of batches) {
  for (let i = 0; i < seed.count; i++) {
    const id = `${seed.prefix}-${i}`;
    if (seed.category === "persona") {
      nodes.push({
        id,
        name: `${pick(firstNames, i + seed.count)} ${pick(lastNames, i * 3)} ${pick(lastNames, i * 7 + 1)}`,
        category: "persona",
        role: seed.prefix === "dip" ? "Diputado/a" : seed.prefix === "sen" ? "Senador/a" : "Persona",
        party: i % 3 === 0 ? "PRM" : i % 3 === 1 ? "FP" : "PLD",
      });
    } else if (seed.category === "empresa") {
      nodes.push({
        id,
        name: `${pick(companyTypes, i)} ${pick(companyWords, i * 2)} ${pick(companyTypes, i + 3)}`,
        category: "empresa",
      });
    } else {
      nodes.push({
        id,
        name: `Contrato ${seed.prefix.toUpperCase()}-${2014 + (i % 11)}-${100 + i}`,
        category: "contrato",
        amount: 3_000_000 + Math.floor(rnd(i, 2) * 80_000_000),
        year: 2014 + (i % 11),
      });
    }
  }
}

const links = [
  ...REAL_LINKS,
  { source: "p-ramirez", target: "caso-horizonte", type: "implicado_en", sourceRef: SOURCE.demo },
  { source: "p-castillo", target: "caso-horizonte", type: "implicado_en", sourceRef: SOURCE.demo },
  { source: "e-constructora-norte", target: "caso-horizonte", type: "implicada_en", sourceRef: SOURCE.demo },
  { source: "e-holding-horizonte", target: "caso-horizonte", type: "implicada_en", sourceRef: SOURCE.demo },
  { source: "p-ramirez", target: "i-digepep", type: "recibio_salario_de", sourceRef: SOURCE.camara },
  { source: "p-mejia", target: "i-camara-diputados", type: "miembro_de", sourceRef: SOURCE.demo },
  { source: "p-nunez", target: "i-senado", type: "miembro_de", sourceRef: SOURCE.demo },
  { source: "p-castillo", target: "e-constructora-norte", type: "accionista_de", weight: 0.45, sourceRef: SOURCE.demo },
  { source: "p-castillo", target: "e-inversores-caribe", type: "accionista_de", weight: 0.6, sourceRef: SOURCE.demo },
  { source: "p-castillo", target: "e-holding-horizonte", type: "accionista_de", weight: 0.8, sourceRef: SOURCE.demo },
  { source: "p-ramirez", target: "e-servicios-atlantico", type: "accionista_de", weight: 0.3, sourceRef: SOURCE.demo },
  { source: "p-mejia", target: "e-techgov", type: "accionista_de", weight: 0.15, sourceRef: SOURCE.demo },
  { source: "e-holding-horizonte", target: "e-constructora-norte", type: "controla", sourceRef: SOURCE.demo },
  { source: "e-constructora-norte", target: "e-servicios-atlantico", type: "subcontrata_a", sourceRef: SOURCE.demo },
  { source: "e-inversores-caribe", target: "e-techgov", type: "financia", sourceRef: SOURCE.demo },
  { source: "e-constructora-norte", target: "c-puente-este", type: "gano", sourceRef: SOURCE.dgcp },
  { source: "e-servicios-atlantico", target: "c-hospitales", type: "gano", sourceRef: SOURCE.sigef },
  { source: "e-techgov", target: "c-software", type: "gano", sourceRef: SOURCE.dgcp },
  { source: "e-inversores-caribe", target: "c-publicidad", type: "gano", sourceRef: SOURCE.sigef },
  { source: "i-mopc", target: "c-puente-este", type: "emitio", sourceRef: SOURCE.dgcp },
  { source: "i-digepep", target: "c-hospitales", type: "emitio", sourceRef: SOURCE.sigef },
  { source: "i-dgcp", target: "c-software", type: "registro", sourceRef: SOURCE.dgcp },
  { source: "i-digepep", target: "c-publicidad", type: "emitio", sourceRef: SOURCE.sigef },
  { source: "i-mopc", target: "l-bid-vial", type: "recibio", sourceRef: SOURCE.demo },
  { source: "i-digepep", target: "l-bm-salud", type: "recibio", sourceRef: SOURCE.demo },
  { source: "l-bid-vial", target: "c-puente-este", type: "financia", sourceRef: SOURCE.demo },
  { source: "l-bm-salud", target: "c-hospitales", type: "financia", sourceRef: SOURCE.demo },
  { source: "i-camara-cuentas", target: "c-puente-este", type: "audito", sourceRef: SOURCE.camara },
  { source: "i-camara-cuentas", target: "p-ramirez", type: "reviso_patrimonio_de", sourceRef: SOURCE.camara },
  { source: "p-mejia", target: "e-constructora-norte", type: "mencionada_con", sourceRef: SOURCE.demo },
];

// Spoke links to hubs — satélites sintéticos pueden colgarse de un hub real (Cámara).
for (const seed of batches) {
  for (let i = 0; i < seed.count; i++) {
    const id = `${seed.prefix}-${i}`;
    if (isProtected(id)) continue;
    links.push({
      source: id,
      target: seed.hub,
      type: seed.link,
      sourceRef: SOURCE.demo,
      demo: true,
    });
  }
}

// Cross-weave — creates the teal “cloud” in the center
// Nunca tocar nodos reales (Abinader, Pacheco, Calamar…): riesgo de difamación.
const allIds = nodes.map((n) => n.id);
const meshIds = allIds.filter((id) => !isProtected(id));
const meshHubs = hubs.filter((id) => !isProtected(id));
for (let i = 0; i < 900; i++) {
  const a = meshIds[Math.floor(rnd(i, 11) * meshIds.length)];
  const b = meshHubs[Math.floor(rnd(i, 17) * meshHubs.length)] || meshIds[0];
  if (!a || !b || a === b) continue;
  links.push({
    source: a,
    target: b,
    type: "conectado_a",
    sourceRef: SOURCE.demo,
    demo: true,
  });
}

for (let i = 0; i < 1400; i++) {
  const a = meshIds[Math.floor(rnd(i, 29) * meshIds.length)];
  const b = meshIds[Math.floor(rnd(i, 31) * meshIds.length)];
  if (!a || !b || a === b) continue;
  links.push({
    source: a,
    target: b,
    type: "relacionado_con",
    sourceRef: SOURCE.demo,
    demo: true,
  });
}

const degree = new Map();
for (const link of links) {
  degree.set(link.source, (degree.get(link.source) || 0) + 1);
  degree.set(link.target, (degree.get(link.target) || 0) + 1);
}

for (const node of nodes) {
  node.degree = degree.get(node.id) || 1;
}

export function getGraph() {
  return {
    nodes: nodes.map((n) => ({ ...n })),
    links: links.map((l) => ({ ...l })),
    meta: {
      demo: true,
      label: "Calamar · Loteka · Odebrecht + malla demo",
      nodeCount: nodes.length,
      linkCount: links.length,
    },
  };
}

export function getNode(id) {
  const node = nodes.find((n) => n.id === id);
  if (!node) return null;

  const protectedNode = isProtected(id);
  const connections = links
    .filter((l) => l.source === id || l.target === id)
    // Personas/instituciones reales: solo vínculos con fuente (nunca mesh inventado)
    .filter((l) => {
      if (!protectedNode) return true;
      if (l.demo) return false;
      const label = l.sourceRef?.label || "";
      return !/demostraci[oó]n/i.test(label);
    })
    .map((l) => {
      const otherId = l.source === id ? l.target : l.source;
      const other = nodes.find((n) => n.id === otherId);
      const demo =
        l.demo === true || /demostraci[oó]n/i.test(l.sourceRef?.label || "");
      return {
        type: l.type,
        direction: l.source === id ? "out" : "in",
        sourceRef: l.sourceRef,
        demo,
        node: other,
      };
    })
    .slice(0, 40);

  return {
    ...node,
    verified: protectedNode,
    connections,
  };
}

const SCENARIOS = [
  {
    id: "red-horizonte",
    title: "La red Horizonte",
    blurb:
      "Un exdirector, un empresario y un holding offshore aparecen en el mismo caso y en las mismas empresas.",
    tags: ["Offshore", "Obras públicas"],
    nodeIds: [
      "caso-horizonte",
      "p-castillo",
      "p-ramirez",
      "e-holding-horizonte",
      "e-constructora-norte",
    ],
  },
  {
    id: "puente-este",
    title: "Puente Este: préstamo y contrato",
    blurb:
      "Un préstamo del BID financia una obra que ganó una empresa controlada por un holding del mismo caso.",
    tags: ["BID", "Auditoría"],
    nodeIds: [
      "c-puente-este",
      "e-constructora-norte",
      "i-mopc",
      "l-bid-vial",
      "i-camara-cuentas",
    ],
  },
  {
    id: "salud-prestamos",
    title: "Salud comprada con deuda",
    blurb:
      "Un préstamo del Banco Mundial financia contratos hospitalarios adjudicados a una empresa vinculada.",
    tags: ["Banco Mundial", "Salud"],
    nodeIds: ["c-hospitales", "e-servicios-atlantico", "i-digepep", "l-bm-salud"],
  },
  {
    id: "software-estado",
    title: "El software del Estado",
    blurb:
      "Una diputada figura como accionista de la empresa que ganó la plataforma digital del gobierno.",
    tags: ["Conflicto de interés", "Tecnología"],
    nodeIds: ["c-software", "e-techgov", "p-mejia", "i-dgcp"],
  },
];

export function getScenarios() {
  return SCENARIOS.map((s) => ({
    ...s,
    nodes: s.nodeIds
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean)
      .map((n) => ({ id: n.id, name: n.name, category: n.category })),
  }));
}

/** Subgrafo alrededor de un conjunto de ids, expandido `hops` saltos. */
export function getSubgraph(ids, hops = 1, maxNodes = 90) {
  const seed = new Set(ids.filter((id) => nodes.some((n) => n.id === id)));
  if (!seed.size) return { nodes: [], links: [] };

  // Personas/instituciones reales: solo seguir aristas con fuente (no malla demo).
  const strict = [...seed].some((id) => isProtected(id));
  const cap = strict ? Math.min(maxNodes, 16) : maxNodes;

  const usable = (l) => {
    if (!strict) return true;
    if (l.demo) return false;
    return !/demostraci[oó]n/i.test(l.sourceRef?.label || "");
  };

  let frontier = new Set(seed);
  for (let h = 0; h < hops; h++) {
    const next = [];
    for (const l of links) {
      if (!usable(l)) continue;
      if (frontier.has(l.source) && !seed.has(l.target)) next.push(l.target);
      if (frontier.has(l.target) && !seed.has(l.source)) next.push(l.source);
    }
    const unique = [...new Set(next)];
    unique.sort((a, b) => {
      const na = nodes.find((n) => n.id === a);
      const nb = nodes.find((n) => n.id === b);
      const score = (n) =>
        (n?.hub ? 40 : 0) +
        (isProtected(n?.id) ? 80 : 0) +
        (n?.degree || 0) +
        (n?.role || n?.code || n?.amount ? 10 : 0);
      return score(nb) - score(na);
    });
    for (const id of unique) {
      if (seed.size >= cap) break;
      seed.add(id);
    }
    frontier = new Set(unique);
  }

  const keep = seed;
  const subNodes = nodes.filter((n) => keep.has(n.id)).map((n) => ({ ...n }));
  const seen = new Set();
  const subLinks = [];
  for (const l of links) {
    if (!usable(l)) continue;
    if (!keep.has(l.source) || !keep.has(l.target)) continue;
    const key = `${l.source}|${l.target}|${l.type}`;
    if (seen.has(key)) continue;
    seen.add(key);
    subLinks.push({ ...l });
  }

  return { nodes: subNodes, links: subLinks };
}

/** Patrones automáticos: dónde mirar, no conclusiones. */
export function getLeads() {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const leads = [];

  const shareholdings = links.filter((l) => l.type === "accionista_de");
  for (const sh of shareholdings) {
    const wins = links.filter((l) => l.source === sh.target && l.type === "gano");
    for (const w of wins) {
      const person = byId.get(sh.source);
      const company = byId.get(sh.target);
      const contract = byId.get(w.target);
      if (!person || !company || !contract) continue;
      leads.push({
        id: `${sh.source}-${w.target}`,
        kind: "Accionista con contrato del Estado",
        text: `${person.name} figura como accionista de ${company.name}, que ganó ${contract.name}.`,
        amount: contract.amount ?? null,
        nodeIds: [person.id, company.id, contract.id],
        sourceRef: w.sourceRef,
      });
    }
  }

  const loanFunded = links.filter((l) => l.type === "financia");
  for (const lf of loanFunded) {
    const loan = byId.get(lf.source);
    const contract = byId.get(lf.target);
    if (!loan || !contract || loan.category !== "prestamo") continue;
    leads.push({
      id: `loan-${loan.id}-${contract.id}`,
      kind: "Obra pagada con deuda externa",
      text: `${contract.name} aparece financiado por ${loan.name} (${loan.lender}).`,
      amount: contract.amount ?? null,
      nodeIds: [loan.id, contract.id],
      sourceRef: lf.sourceRef,
    });
  }

  const jumps = nodes
    .filter((n) => n.netWorthDelta != null && n.netWorthDelta > 50)
    .map((n) => ({
      id: `wealth-${n.id}`,
      kind: "Salto patrimonial declarado",
      text: `${n.name} declaró un aumento de patrimonio de ${n.netWorthDelta}% en el período.`,
      amount: n.netWorth ?? null,
      nodeIds: [n.id],
      sourceRef: {
        label: "Cámara de Cuentas",
        url: "https://www.camaradecuentas.gob.do",
      },
    }));

  return [...jumps, ...leads].slice(0, 12);
}

export function searchNodes(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return nodes
    .filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q) ||
        (n.aliases || []).some((a) => a.toLowerCase().includes(q)) ||
        (n.role && n.role.toLowerCase().includes(q)) ||
        (n.fullName && n.fullName.toLowerCase().includes(q)) ||
        (n.code && n.code.toLowerCase().includes(q)),
    )
    .slice(0, 12)
    .map((n) => ({
      id: n.id,
      name: n.name,
      category: n.category,
      role: n.role,
      degree: n.degree,
    }));
}
