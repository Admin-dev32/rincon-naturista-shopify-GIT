class RNFHeroSlider {
  constructor(root) {
    this.root = root;
    this.track = root.querySelector('[data-rnf-track]');
    this.slides = Array.from(root.querySelectorAll('[data-rnf-slide]'));
    this.dots = Array.from(root.querySelectorAll('[data-rnf-dot]'));
    this.prevButton = root.querySelector('[data-rnf-prev]');
    this.nextButton = root.querySelector('[data-rnf-next]');
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.currentIndex = 0;
    this.autoplayEnabled = root.dataset.autoplay === 'true';
    this.autoplaySeconds = Number(root.dataset.autoplaySeconds || 6);
    this.autoplayTimer = null;
    this.pauseTimer = null;

    if (!this.track || this.slides.length === 0) return;

    this.setup();
    this.bindEvents();
    this.goTo(0, false);
  }

  setup() {
    this.root.setAttribute('tabindex', '0');
    this.root.setAttribute('aria-live', 'polite');
    if (this.isReducedMotion) {
      this.root.dataset.reducedMotion = 'true';
    }
  }

  bindEvents() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.pauseAutoplay();
        this.prev();
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.pauseAutoplay();
        this.next();
      });
    }

    this.dots.forEach((dot) => {
      dot.addEventListener('click', (event) => {
        const index = Number(event.currentTarget.dataset.slideIndex);
        this.pauseAutoplay();
        this.goTo(index, true);
      });
    });

    this.root.addEventListener('mouseenter', () => this.stopAutoplay());
    this.root.addEventListener('mouseleave', () => this.startAutoplay());

    this.root.addEventListener('focusin', () => this.stopAutoplay());
    this.root.addEventListener('focusout', () => this.startAutoplay());

    this.root.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.pauseAutoplay();
        this.next();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.pauseAutoplay();
        this.prev();
      }
    });

    this.startAutoplay();
  }

  goTo(index, userInitiated = false) {
    const total = this.slides.length;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    this.currentIndex = index;
    const offset = index * -100;
    if (this.track) {
      this.track.style.transform = `translateX(${offset}%)`;
    }

    this.slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
      slide.setAttribute('aria-hidden', slideIndex === index ? 'false' : 'true');
    });

    this.dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (userInitiated) {
      this.pauseAutoplay();
    }
  }

  next() {
    this.goTo(this.currentIndex + 1, true);
  }

  prev() {
    this.goTo(this.currentIndex - 1, true);
  }

  startAutoplay() {
    if (!this.autoplayEnabled || this.isReducedMotion) return;
    this.stopAutoplay();
    this.autoplayTimer = window.setInterval(() => {
      this.goTo(this.currentIndex + 1, false);
    }, this.autoplaySeconds * 1000);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      window.clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  pauseAutoplay() {
    this.stopAutoplay();
    if (!this.autoplayEnabled || this.isReducedMotion) return;
    if (this.pauseTimer) {
      window.clearTimeout(this.pauseTimer);
    }
    this.pauseTimer = window.setTimeout(() => {
      this.startAutoplay();
    }, 8000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-rnf-slider]').forEach((slider) => {
    if (!slider.dataset.autoplay) {
      slider.dataset.autoplay = 'false';
    }
    if (!slider.dataset.autoplaySeconds) {
      slider.dataset.autoplaySeconds = '6';
    }
    new RNFHeroSlider(slider);
  });
});
