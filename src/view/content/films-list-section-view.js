import { createElement } from '../../render.js';

const createFilmsListSectionTemplate = (isListExtra, isVisibleTitle) =>
  `    <section class="films-list${isListExtra ? ' films-list--extra' : ''}">
    <h2 class="films-list__title${isVisibleTitle ? '' : ' visually-hidden'}">Title text</h2>
  </section>`;

export default class FilmsListSectionView {
  getTemplate() {
    return createFilmsListSectionTemplate();
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
