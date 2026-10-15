const formatters = new Map();

function getFormatter(fractionDigits) {
  if (!formatters.has(fractionDigits)) {
    formatters.set(
      fractionDigits,
      new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }),
    );
  }

  return formatters.get(fractionDigits);
}

/**
 * Копейки показываются, только если они есть: 326,40 ₽, но 1 432 ₽.
 * @param {number} value
 * @returns {string}
 */
export function formatPrice(value) {
  const fractionDigits = Number.isInteger(value) ? 0 : 2;

  return getFormatter(fractionDigits).format(value);
}
