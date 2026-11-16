/**
 * Reglas fijas que no vienen en los informes: escala de ISR, TSS e ITBIS.
 * Cada valor tiene su fuente. Revisar cada enero (la Ley 30-26 cambia la escala del ISR desde 2027).
 */
export const REGLAS = {
  anio: 2026,
  isr: {
    fuente: "DGII — Escala de retención asalariados 2026",
    url: "https://dgii.gov.do/cicloContribuyente/obligacionesTributarias/principalesImpuestos/Paginas/impuestoSobreRenta.aspx",
    // Escala anual: [desde, hasta, cuotaFija, tasa sobre el excedente de "desde"]
    tramos: [
      [0, 416220.01, 0, 0],
      [416220.01, 624329.01, 0, 0.15],
      [624329.01, 867123.01, 31216, 0.2],
      [867123.01, Infinity, 79776, 0.25],
    ],
  },
  tss: {
    fuente: "Ley 87-01 y TSS: AFP 2.87% y SFS 3.04% a cargo del trabajador; topes de 20 y 10 salarios mínimos cotizables (RD$23,223 desde feb. 2026)",
    url: "https://www.tss.gob.do/",
    afp: { tasa: 0.0287, topeMensual: 464460 },
    sfs: { tasa: 0.0304, topeMensual: 232230 },
  },
  itbis: {
    fuente: "Código Tributario, art. 341: tasa general de ITBIS 18%",
    url: "https://dgii.gov.do/",
    tasa: 0.18,
  },
};

/** ISR mensual a partir del sueldo bruto mensual (retención de asalariados). */
export function calcularISR(brutoMensual, reglas = REGLAS) {
  const afp = Math.min(brutoMensual, reglas.tss.afp.topeMensual) * reglas.tss.afp.tasa;
  const sfs = Math.min(brutoMensual, reglas.tss.sfs.topeMensual) * reglas.tss.sfs.tasa;
  const anual = (brutoMensual - afp - sfs) * 12;
  const tramo = reglas.isr.tramos.find(([d, h]) => anual >= d && anual < h) || reglas.isr.tramos.at(-1);
  const isrAnual = tramo[3] === 0 ? 0 : tramo[2] + (anual - tramo[0]) * tramo[3];
  return { isr: isrAnual / 12, afp, sfs };
}
