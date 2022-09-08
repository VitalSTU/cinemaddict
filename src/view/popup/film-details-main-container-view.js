import AbstractView from '../../framework/view/abstract-view.js';

const createFilmDetailsMainContainerTemplate = () => `
<section class="film-details">
  <div class="film-details__inner">
  </div>
</section>`;

export default class FilmDetailsMainContainerView extends AbstractView {
  #popupContainerElement = document.querySelector('body');

  constructor() {
    super();
  }

  get template() {
    return createFilmDetailsMainContainerTemplate();
  }

  get popupContainerElement() {
    return this.#popupContainerElement;
  }
}
