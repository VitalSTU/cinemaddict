import { createElement } from '../../render';

const createFilmDetailsCommentsContainerTemplate = () => `

        <ul class="film-details__comments-list">
        </ul>`;

export default class FilmDetailsCommentsContainerView {
  #element = null;

  get template() {
    return createFilmDetailsCommentsContainerTemplate();
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
