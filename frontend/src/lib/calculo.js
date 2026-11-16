/** Misma lógica que backend/src/finanzas/reglas.js, con los parámetros que publica la API. */
export function calcularISR(brutoMensual, reglas) {
  const { afp, sfs } = reglas.tss;
  const cAfp = Math.min(brutoMensual, afp.topeMensual) * afp.tasa;
  const cSfs = Math.min(brutoMensual, sfs.topeMensual) * sfs.tasa;
  const anual = (brutoMensual - cAfp - cSfs) * 12;
  // JSON no guarda Infinity: el último tramo llega con "hasta" = null.
  const tramos = reglas.isr.tramos.map(([d, h, c, t]) => [d, h ?? Infinity, c, t]);
  const tramo = tramos.find(([d, h]) => anual >= d && anual < h) || tramos.at(-1);
  const isrAnual = tramo[3] === 0 ? 0 : tramo[2] + (anual - tramo[0]) * tramo[3];
  return { isr: Math.max(0, isrAnual / 12), afp: cAfp, sfs: cSfs };
}

/** ITBIS que ya viene incluido en un precio final: precio × 18/118. */
export function itbisIncluido(gasto, tasa) {
  return (gasto * tasa) / (1 + tasa);
}

/** Sueldo bruto mensual a partir del cual se empieza a pagar ISR. */
export function umbralISR(reglas) {
  const exento = reglas.isr.tramos[1][0];
  return exento / 12 / (1 - reglas.tss.afp.tasa - reglas.tss.sfs.tasa);
}
