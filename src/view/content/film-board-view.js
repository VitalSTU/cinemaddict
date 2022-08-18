import { createElement } from '../../render.js';

const createFilmBoardTemplate = () => `<section class="films">
</section>`;

export default class FilmBoardView {
  getTemplate() {
    return createFilmBoardTemplate();
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
