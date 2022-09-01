import AbstractView from '../../framework/view/abstract-view.js';

const createFilmDetailsMainContainerTemplate = () => `
<section class="film-details">
  <div class="film-details__inner">
  </div>
</section>`;

export default class FilmDetailsMainContainerView extends AbstractView {

  constructor() {}

  get template() {
    return createFilmDetailsMainContainerTemplate();
  }
}
