import { createElement } from '../../render';

const createFilmDetailsCommentsContainerTemplate = () => `

        <ul class="film-details__comments-list">
        </ul>`;

export default class FilmDetailsCommentsContainerView {

  getTemplate() {
    return createFilmDetailsCommentsContainerTemplate();
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
