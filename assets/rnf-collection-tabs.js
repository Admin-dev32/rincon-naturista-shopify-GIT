class RNFCollectionTabs {
  constructor(root) {
    this.root = root;
    this.tabs = Array.from(root.querySelectorAll('[data-rnf-tab]'));
    this.panels = Array.from(root.querySelectorAll('[data-rnf-panel]'));
    this.tablist = root.querySelector('[data-rnf-tabs]');
    this.activeIndex = this.tabs.findIndex((tab) => tab.classList.contains('is-active'));
    this.isDragging = false;
    this.dragStartX = 0;
    this.scrollStartX = 0;

    if (!this.tablist || this.tabs.length === 0) return;

    this.bindEvents();
    if (this.activeIndex < 0) {
      this.activateTab(this.tabs[0]);
    }
  }

  bindEvents() {
    this.tabs.forEach((tab) => {
      tab.addEventListener('click', () => this.activateTab(tab));
      tab.addEventListener('keydown', (event) => this.onKeydown(event, tab));
    });

    if (this.tablist.hasAttribute('data-rnf-swipe-tabs')) {
      this.tablist.addEventListener('mousedown', (event) => this.onDragStart(event));
      this.tablist.addEventListener('mousemove', (event) => this.onDragMove(event));
      this.tablist.addEventListener('mouseup', () => this.onDragEnd());
      this.tablist.addEventListener('mouseleave', () => this.onDragEnd());
      this.tablist.addEventListener('touchstart', (event) => this.onDragStart(event), { passive: true });
      this.tablist.addEventListener('touchmove', (event) => this.onDragMove(event), { passive: false });
      this.tablist.addEventListener('touchend', () => this.onDragEnd());
    }
  }

  onKeydown(event, tab) {
    const currentIndex = this.tabs.indexOf(tab);
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % this.tabs.length;
      this.tabs[nextIndex].focus();
      this.activateTab(this.tabs[nextIndex]);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
      this.tabs[prevIndex].focus();
      this.activateTab(this.tabs[prevIndex]);
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.activateTab(tab);
    }
  }

  activateTab(tab) {
    const index = Number(tab.dataset.rnfTabIndex);
    this.tabs.forEach((button) => {
      const isActive = button === tab;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) {
        button.focus({ preventScroll: true });
      }
    });

    this.panels.forEach((panel) => {
      const panelIndex = Number(panel.dataset.rnfPanelIndex);
      const isActive = panelIndex === index;
      panel.classList.toggle('is-active', isActive);
      panel.toggleAttribute('hidden', !isActive);
    });
  }

  onDragStart(event) {
    this.isDragging = true;
    this.dragStartX = event.touches ? event.touches[0].clientX : event.clientX;
    this.scrollStartX = this.tablist.scrollLeft;
    this.tablist.classList.add('is-dragging');
  }

  onDragMove(event) {
    if (!this.isDragging) return;
    const currentX = event.touches ? event.touches[0].clientX : event.clientX;
    const delta = currentX - this.dragStartX;
    this.tablist.scrollLeft = this.scrollStartX - delta;
    if (event.cancelable) event.preventDefault();
  }

  onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.tablist.classList.remove('is-dragging');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-rnf-collection-tabs]').forEach((section) => {
    new RNFCollectionTabs(section);
  });
});
