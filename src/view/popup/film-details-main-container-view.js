import { createElement } from '../../render';

const createFilmDetailsMainContainerTemplate = () => `
<section class="film-details">
  <div class="film-details__inner">
  </div>
</section>`;

export default class FilmDetailsMainContainerView {
  #element = null;

  constructor() {}

  get template() {
    return createFilmDetailsMainContainerTemplate();
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
