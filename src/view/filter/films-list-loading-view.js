import { createElement } from '../../render';

const createFilmsListLoadingTemplate = () => `    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>`;

export default class FilmsListLoadingView {
  getTemplate() {
    return createFilmsListLoadingTemplate();
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
