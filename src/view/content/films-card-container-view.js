import { createElement } from '../../render.js';

const createFilmsCardContainerTemplate = () => `      <div class="films-list__container">
      </div>`;

export default class FilmsCardContainerView {
  getTemplate() {
    return createFilmsCardContainerTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
