import { formatPrice } from '../utils/format-price.js';

const INPUT_SELECTOR = '[data-variant-input]';
const URL_PARAM = 'sku';

/**
 * Данные фасовки берутся из data-атрибутов radio-кнопки,
 * поэтому разметку легко отдавать из Django-шаблона циклом.
 * @param {HTMLInputElement} input
 */
function readVariant(input) {
  const { label, weight, price, oldPrice } = input.dataset;

  return {
    sku: input.value,
    label,
    weight: Number(weight),
    price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : null,
  };
}

function getDiscountPercent(price, oldPrice) {
  return Math.round((1 - price / oldPrice) * 100);
}

/**
 * @param {HTMLElement} root
 */
export function initVariantPicker(root) {
  const inputs = [...root.querySelectorAll(INPUT_SELECTOR)];

  if (!inputs.length) {
    return;
  }

  const elements = {
    sku: root.querySelector('[data-sku]'),
    price: root.querySelector('[data-price-current]'),
    oldPriceWrap: root.querySelector('[data-price-old-wrap]'),
    oldPrice: root.querySelector('[data-price-old]'),
    discount: root.querySelector('[data-price-discount]'),
    unit: root.querySelector('[data-price-unit]'),
  };

  function render(input) {
    const { sku, weight, price, oldPrice } = readVariant(input);
    const hasDiscount = oldPrice !== null && oldPrice > price;

    elements.sku.textContent = sku;

    elements.price.value = String(price);
    elements.price.textContent = formatPrice(price);
    elements.price.classList.toggle('price__current--sale', hasDiscount);

    elements.oldPriceWrap.hidden = !hasDiscount;
    elements.discount.hidden = !hasDiscount;

    if (hasDiscount) {
      elements.oldPrice.textContent = formatPrice(oldPrice);
      elements.discount.textContent = `−${getDiscountPercent(price, oldPrice)}%`;
    }

    // Для крупных фасовок показываем цену за 100 г, чтобы выгода была видна сразу
    const isBulk = weight > 100;
    elements.unit.hidden = !isBulk;
    elements.unit.textContent = isBulk ? `${formatPrice(Math.round((price / weight) * 10000) / 100)} за 100 г` : '';
  }

  function syncUrl(sku) {
    const url = new URL(window.location.href);
    url.searchParams.set(URL_PARAM, sku);
    window.history.replaceState(null, '', url);
  }

  root.addEventListener('change', (event) => {
    const input = event.target.closest(INPUT_SELECTOR);

    if (!input) {
      return;
    }

    render(input);
    syncUrl(input.value);
  });

  // Фасовку можно открыть по ссылке: ?sku=01308
  const skuFromUrl = new URLSearchParams(window.location.search).get(URL_PARAM);
  const initialInput = inputs.find((input) => input.value === skuFromUrl && !input.disabled);

  if (initialInput) {
    initialInput.checked = true;
  }

  render(inputs.find((input) => input.checked) ?? inputs[0]);
}
