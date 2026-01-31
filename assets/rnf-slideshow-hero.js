class RNFSlideshowHero {
  constructor(section) {
    this.section = section;
    this.track = section.querySelector('[data-rnf-track]');
    this.slides = Array.from(section.querySelectorAll('[data-rnf-slide]'));
    this.dots = Array.from(section.querySelectorAll('[data-rnf-dot]'));
    this.prevButton = section.querySelector('[data-rnf-prev]');
    this.nextButton = section.querySelector('[data-rnf-next]');
    this.autoplay = section.dataset.autoplay === 'true';
    this.delay = Number(section.dataset.autoplayDelay || 6000);
    this.fitToImage = section.dataset.fitImage === 'true';
    this.currentIndex = 0;
    this.timer = null;

    if (!this.track || this.slides.length === 0) return;

    this.bindEvents();
    this.updateHeight();
    this.goTo(0, false);
    this.startAutoplay();
  }

  bindEvents() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.stopAutoplay();
        this.prev();
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.stopAutoplay();
        this.next();
      });
    }

    this.dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = Number(dot.dataset.index);
        this.stopAutoplay();
        this.goTo(index, true);
      });
    });

    this.section.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.next();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.prev();
      }
    });

    window.addEventListener('resize', () => this.updateHeight());
    this.section.querySelectorAll('img').forEach((img) => {
      img.addEventListener('load', () => this.updateHeight());
    });
  }

  updateHeight() {
    if (!this.fitToImage) return;
    const activeSlide = this.slides[this.currentIndex] || this.slides[0];
    const img = activeSlide ? activeSlide.querySelector('img') : null;
    if (img && img.complete) {
      const height = img.getBoundingClientRect().height;
      if (height) {
        this.section.style.minHeight = `${height}px`;
      }
    }
  }

  goTo(index, userInitiated) {
    if (index < 0) index = this.slides.length - 1;
    if (index >= this.slides.length) index = 0;
    this.currentIndex = index;
    this.track.style.transform = `translateX(${index * -100}%)`;

    this.slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
    });

    this.dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    this.updateHeight();

    if (userInitiated) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  next() {
    this.goTo(this.currentIndex + 1, true);
  }

  prev() {
    this.goTo(this.currentIndex - 1, true);
  }

  startAutoplay() {
    if (!this.autoplay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.stopAutoplay();
    this.timer = window.setInterval(() => {
      this.goTo(this.currentIndex + 1, false);
    }, this.delay);
  }

  stopAutoplay() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-rnf-slideshow]').forEach((section) => {
    new RNFSlideshowHero(section);
  });
});
