export const THEMES = [
  {
    id: "nebula",
    name: "Nebula",
    tagline: "Como Obsidian, más limpio",
    colors: {
      caso: "#fff59d",
      persona: "#5ecfc4",
      empresa: "#7ec8c0",
      institucion: "#c5b4e3",
      contrato: "#f0e6a8",
      prestamo: "#a8b8d8",
    },
    link: "rgba(78, 182, 172, 0.22)",
    linkHot: "rgba(94, 207, 196, 0.65)",
    linkDim: "rgba(120, 140, 160, 0.05)",
    nodeDim: "rgba(140, 150, 170, 0.16)",
    label: "rgba(236, 240, 245, 0.95)",
  },
  {
    id: "dossier",
    name: "Dossier",
    tagline: "Sala de investigación",
    colors: {
      caso: "#e2b14a",
      persona: "#d4a574",
      empresa: "#6b9e8a",
      institucion: "#8a9bb5",
      contrato: "#c47a5a",
      prestamo: "#b8a078",
    },
    link: "rgba(180, 150, 100, 0.2)",
    linkHot: "rgba(226, 177, 74, 0.7)",
    linkDim: "rgba(100, 90, 70, 0.06)",
    nodeDim: "rgba(130, 120, 100, 0.18)",
    label: "rgba(245, 236, 220, 0.95)",
  },
  {
    id: "signal",
    name: "Signal",
    tagline: "HUD moderno / comando",
    colors: {
      caso: "#ffc857",
      persona: "#4cc9f0",
      empresa: "#00f5d4",
      institucion: "#7b8cff",
      contrato: "#ff6b6b",
      prestamo: "#b8c0ff",
    },
    link: "rgba(76, 201, 240, 0.18)",
    linkHot: "rgba(0, 245, 212, 0.7)",
    linkDim: "rgba(80, 100, 140, 0.05)",
    nodeDim: "rgba(100, 120, 160, 0.14)",
    label: "rgba(220, 235, 255, 0.95)",
  },
];

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}
