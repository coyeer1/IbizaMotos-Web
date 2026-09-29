/**
 * Cuota mensual de referencia que se muestra junto a los precios ("desde $X al mes").
 * Es una SIMULACION con supuestos fijos y visibles: siempre se muestra con la nota
 * de CUOTA_NOTA. Si cambian las tasas, se cambian aqui y en FinancingCalculator.
 */
export const CUOTA_REF = {
  financiera: 'ProgreSER',
  tasaMensual: 1.83, // % mes vencido, igual que en FinancingCalculator
  meses: 60,
  inicialPct: 10,
};

export function cuotaEstimada(precio: number): number {
  if (!precio || precio <= 0) return 0;
  const monto = precio * (1 - CUOTA_REF.inicialPct / 100);
  const r = CUOTA_REF.tasaMensual / 100;
  const n = CUOTA_REF.meses;
  return Math.round((monto * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) / 1000) * 1000;
}

export const CUOTA_NOTA = `Simulación con cuota inicial del ${CUOTA_REF.inicialPct}%, ${CUOTA_REF.meses} meses y tasa ${CUOTA_REF.financiera} de ${CUOTA_REF.tasaMensual}% mensual. No es oferta de crédito: sujeta a estudio de la financiera.`;
