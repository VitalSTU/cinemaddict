import { createElement } from '../../render';

const createFilmsListLoadingTemplate = () => `
    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>`;

export default class FilmsListLoadingView {
  #element = null;

  get template() {
    return createFilmsListLoadingTemplate();
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
