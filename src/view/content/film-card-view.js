import * as utils from '../view-utils.js';

import { createElement } from '../../render.js';

const createFilmCardTemplate = ({comments, filmInfo: movie, userDetails}) => `
        <article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${utils.getTitle(movie)}</h3>
            <p class="film-card__rating">${utils.getRating(movie)}</p>
            <p class="film-card__info">
              <span class="film-card__year">${utils.getYearOfTDate(utils.getReleaseDateOrNull(movie))}</span>
              <span class="film-card__duration">${utils.humanizeMinutes(utils.getRuntime(movie))}</span>
              ${utils.getGenres(movie)}
            </p>
            <img src="${utils.getPosterURI(movie)}" alt="" class="film-card__poster">
            <p class="film-card__description">${utils.getShortDescription(movie)}</p>
            <span class="film-card__comments">${utils.getCommentsQuantity(comments)} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist${utils.getFlagIfActive(userDetails.watchlist)}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched${utils.getFlagIfActive(userDetails.alreadyWatched)}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite${utils.getFlagIfActive(userDetails.favorite)}" type="button">Mark as favorite</button>
          </div>
        </article>`;

export default class FilmCardView {
  #movie = null;
  #element = null;

  constructor(movie) {
    this.#movie = movie;
  }

  get template() {
    return createFilmCardTemplate(this.#movie);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get movie() {
    return this.#movie;
  }

  removeElement() {
    this.#element = null;
  }
}
