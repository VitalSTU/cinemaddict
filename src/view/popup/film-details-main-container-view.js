import { createElement } from '../../render';

const createFilmDetailsMainContainerTemplate = () => `
<section class="film-details">
  <div class="film-details__inner">
  </div>
</section>`;

export default class FilmDetailsMainContainerView {

  constructor() {}

  getTemplate() {
    return createFilmDetailsMainContainerTemplate();
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
