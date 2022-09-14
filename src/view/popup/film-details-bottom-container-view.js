import * as utils from '../view-utils.js';
import AbstractView from '../../framework/view/abstract-view.js';

const createFilmDetailsBottomContainerTemplate = (commentsQuantity) => `

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsQuantity}</span></h3>

      </section>
    </div>`;

export default class FilmDetailsBottomContainerView extends AbstractView {
  #commentsQuantity = null;

  constructor(commentsQuantity) {
    super();
    this.#commentsQuantity = commentsQuantity;
  }

  get template() {
    return createFilmDetailsBottomContainerTemplate(this.#commentsQuantity);
  }
}
