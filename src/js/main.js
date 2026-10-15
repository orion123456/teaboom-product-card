import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '../scss/main.scss';

import { initVariantPicker } from './modules/variant-picker.js';
import { initAddToCart } from './modules/add-to-cart.js';

document.querySelectorAll('[data-purchase]').forEach((form) => {
  initVariantPicker(form);
  initAddToCart(form);
});
