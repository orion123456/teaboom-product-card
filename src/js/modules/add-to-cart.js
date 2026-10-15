const ADDED_CLASS = 'is-added';
const RESET_DELAY = 2500;

/**
 * Имитация добавления в корзину: реальной корзины нет, показываем только обратную связь.
 * @param {HTMLFormElement} form
 */
export function initAddToCart(form) {
  const button = form.querySelector('[data-add-to-cart]');
  const label = form.querySelector('[data-add-to-cart-label]');
  const status = form.querySelector('[data-cart-status]');

  if (!button || !label) {
    return;
  }

  const defaultLabel = label.textContent;
  let resetTimer;

  function reset() {
    clearTimeout(resetTimer);
    button.classList.remove(ADDED_CLASS);
    label.textContent = defaultLabel;
  }

  function announce(message) {
    if (!status) {
      return;
    }

    // Очищаем, чтобы скринридер повторил сообщение при повторном нажатии
    status.textContent = '';
    requestAnimationFrame(() => {
      status.textContent = message;
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const variant = form.querySelector('[data-variant-input]:checked');
    const productName = [form.dataset.productName, variant?.dataset.label].filter(Boolean).join(', ');

    clearTimeout(resetTimer);
    button.classList.add(ADDED_CLASS);
    label.textContent = 'Добавлено';
    announce(`${productName} — добавлено в корзину`);

    resetTimer = setTimeout(reset, RESET_DELAY);
  });

  form.addEventListener('change', reset);
}
