import { createElement } from '../../render.js';

const createFilmsMainSectionTemplate = () => `
  <section class="films">
  </section>`;

export default class FilmsMainSectionView {
  #element = null;

  get template() {
    return createFilmsMainSectionTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
