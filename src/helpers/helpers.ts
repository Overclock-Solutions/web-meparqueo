/**
 * Formatea un valor numérico como una moneda.
 * @param {number} value - El valor numérico a formatear.
 * @returns {string} El valor formateado como moneda.
 */
export function currency(value: number): string {
  return aMoneda.format(value);
}

/**
 * Instancia de Intl.NumberFormat para formatear valores como moneda.
 * @type {Intl.NumberFormat}
 */
const aMoneda: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});
