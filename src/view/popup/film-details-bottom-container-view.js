import * as utils from '../view-utils.js';

import { createElement } from '../../render';

const createFilmDetailsBottomContainerTemplate = (comments) => `

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${utils.getCommentsQuantity(comments)}</span></h3>

      </section>
    </div>`;

export default class FilmDetailsBottomContainerView {

  constructor(comments) {
    this.comments = comments;
  }

  getTemplate() {
    return createFilmDetailsBottomContainerTemplate(this.comments);
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
