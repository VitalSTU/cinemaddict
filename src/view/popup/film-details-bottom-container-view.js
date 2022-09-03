import * as utils from '../view-utils.js';
import AbstractView from '../../framework/view/abstract-view.js';

const createFilmDetailsBottomContainerTemplate = (comments) => `

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${utils.getCommentsQuantity(comments)}</span></h3>

      </section>
    </div>`;

export default class FilmDetailsBottomContainerView extends AbstractView {
  #comments = null;

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createFilmDetailsBottomContainerTemplate(this.#comments);
  }
}
