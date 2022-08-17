import { createElement } from '../../render';

const createFilmsListEmptyTemplate = () => `<section class="films-list">
  <h2 class="films-list__title"></h2>
</section>`;

export default class FilmsListEmptyView {
  getTemplate() {
    return createFilmsListEmptyTemplate();
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
