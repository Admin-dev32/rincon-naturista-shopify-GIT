class RNFHotspots {
  constructor(section) {
    this.section = section;
    this.hotspots = Array.from(section.querySelectorAll('[data-rnf-hotspot]'));
    this.panels = Array.from(section.querySelectorAll('[data-rnf-panel]'));
    this.dots = Array.from(section.querySelectorAll('[data-rnf-dot]'));
    this.defaultIndex = Number(section.dataset.defaultIndex || 1);

    if (this.hotspots.length === 0 || this.panels.length === 0) return;

    this.activate(this.defaultIndex);
    this.bindEvents();
  }

  bindEvents() {
    this.hotspots.forEach((button) => {
      button.addEventListener('click', () => this.activate(Number(button.dataset.index)));
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.activate(Number(button.dataset.index));
        }
      });
    });

    this.dots.forEach((dot) => {
      dot.addEventListener('click', () => this.activate(Number(dot.dataset.index)));
    });
  }

  activate(index) {
    this.hotspots.forEach((button) => {
      const isActive = Number(button.dataset.index) === index;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    this.panels.forEach((panel) => {
      const isActive = Number(panel.dataset.index) === index;
      panel.classList.toggle('is-active', isActive);
      panel.toggleAttribute('hidden', !isActive);
    });

    this.dots.forEach((dot) => {
      const isActive = Number(dot.dataset.index) === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-rnf-hotspots]').forEach((section) => {
    new RNFHotspots(section);
  });
});
