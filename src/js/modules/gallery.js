import { initLightbox } from './lightbox.js';

/**
 * Основное фото + миниатюры. Клик по миниатюре меняет основное фото,
 * клик по основному открывает его на весь экран.
 * @param {HTMLElement} root
 */
export function initGallery(root) {
  const viewer = root.querySelector('[data-gallery-viewer]');
  const slides = [...root.querySelectorAll('[data-gallery-slide]')];
  const thumbs = [...root.querySelectorAll('[data-gallery-thumb]')];

  if (!viewer || !slides.length) {
    return;
  }

  let current = Math.max(
    slides.findIndex((slide) => !slide.hidden),
    0,
  );

  function show(index) {
    current = index;

    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== current;
    });

    thumbs.forEach((thumb, thumbIndex) => {
      if (thumbIndex === current) {
        thumb.setAttribute('aria-current', 'true');
      } else {
        thumb.removeAttribute('aria-current');
      }
    });

    viewer.setAttribute('aria-label', `Открыть фото ${current + 1} из ${slides.length} на весь экран`);
  }

  // Листание в полноэкранном режиме синхронизирует основное фото
  const lightbox = initLightbox(document.querySelector('[data-lightbox]'), {
    slides,
    onChange: show,
  });

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => show(index));
  });

  viewer.addEventListener('click', () => lightbox?.open(current));
}
