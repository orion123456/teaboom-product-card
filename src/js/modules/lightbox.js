const SWIPE_THRESHOLD = 50;

/**
 * Полноэкранный просмотр на нативном <dialog>: фокус внутри окна, Esc
 * и возврат фокуса на кнопку-открывашку браузер обеспечивает сам.
 * @param {HTMLDialogElement | null} dialog
 * @param {{ slides: HTMLElement[], onChange?: (index: number) => void }} options
 */
export function initLightbox(dialog, { slides, onChange }) {
  if (!dialog || !slides.length) {
    return null;
  }

  const stage = dialog.querySelector('[data-lightbox-stage]');
  const counter = dialog.querySelector('[data-lightbox-counter]');
  const prevButton = dialog.querySelector('[data-lightbox-prev]');
  const nextButton = dialog.querySelector('[data-lightbox-next]');
  const closeButton = dialog.querySelector('[data-lightbox-close]');

  const hasMany = slides.length > 1;
  let index = 0;
  let pointerStartX = null;
  let isSwiping = false;

  prevButton.hidden = !hasMany;
  nextButton.hidden = !hasMany;
  counter.hidden = !hasMany;

  // Клонируем <picture> слайда, чтобы не дублировать пути к картинкам в JS
  function render() {
    const picture = slides[index].cloneNode(true);
    picture.hidden = false;
    picture.className = 'lightbox__picture';
    picture.removeAttribute('data-gallery-slide');

    const image = picture.querySelector('img');
    // Не растягиваем фото больше его реальной ширины, иначе srcset отдаст его увеличенным
    const sizes = `min(100vw, ${image.getAttribute('width')}px)`;

    picture.querySelectorAll('source, img').forEach((element) => {
      element.setAttribute('sizes', sizes);
    });

    image.className = 'lightbox__image';
    image.loading = 'eager';
    image.draggable = false;
    image.removeAttribute('fetchpriority');

    stage.replaceChildren(picture);
    counter.textContent = `${index + 1} / ${slides.length}`;
  }

  function go(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    render();
    onChange?.(index);
  }

  function open(startIndex = 0) {
    index = startIndex;
    render();
    dialog.showModal();
  }

  prevButton.addEventListener('click', () => go(index - 1));
  nextButton.addEventListener('click', () => go(index + 1));
  closeButton.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (event) => {
    if (!hasMany) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      go(index - 1);
    } else if (event.key === 'ArrowRight') {
      go(index + 1);
    }
  });

  // Клик по пустому месту вокруг фото закрывает окно
  dialog.addEventListener('click', (event) => {
    // После свайпа браузер присылает click — он не должен закрывать окно
    if (isSwiping) {
      isSwiping = false;
      return;
    }

    if (event.target === dialog || event.target === stage) {
      dialog.close();
    }
  });

  stage.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
    isSwiping = false;
  });

  stage.addEventListener('pointerup', (event) => {
    if (pointerStartX === null || !hasMany) {
      return;
    }

    const deltaX = event.clientX - pointerStartX;
    pointerStartX = null;

    isSwiping = Math.abs(deltaX) >= SWIPE_THRESHOLD;

    if (isSwiping) {
      go(deltaX < 0 ? index + 1 : index - 1);
    }
  });

  stage.addEventListener('pointercancel', () => {
    pointerStartX = null;
  });

  return { open };
}
