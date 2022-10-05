import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

import * as viewUtils from '../view-utils.js';
import * as mainUtils from '../../utils.js';

import { BLANK_MOVIE } from '../../const.js';

const createFilmCardTemplate = ({comments, filmInfo: movie, userDetails}, isDisabled) => `
        <article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${viewUtils.getTitle(movie)}</h3>
            <p class="film-card__rating">${viewUtils.getRating(movie)}</p>
            <p class="film-card__info">
              <span class="film-card__year">${viewUtils.getYearOfTDate(viewUtils.getReleaseDateOrNull(movie))}</span>
              <span class="film-card__duration">${viewUtils.humanizeMinutes(viewUtils.getRuntime(movie))}</span>
              ${viewUtils.getGenres(movie)}
            </p>
            <img src="${viewUtils.getPosterURI(movie)}" alt="" class="film-card__poster">
            <p class="film-card__description">${viewUtils.getShortDescription(movie)}</p>
            <span class="film-card__comments">${viewUtils.getCommentsQuantity(comments)} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist${viewUtils.getFlagIfActive(userDetails.watchlist)}" type="button"${isDisabled ? ' disabled' : ''}>Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched${viewUtils.getFlagIfActive(userDetails.alreadyWatched)}" type="button"${isDisabled ? ' disabled' : ''}>Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite${viewUtils.getFlagIfActive(userDetails.favorite)}" type="button"${isDisabled ? ' disabled' : ''}>Mark as favorite</button>
          </div>
        </article>`;

export default class FilmCardView extends AbstractStatefulView {

  constructor(movie = BLANK_MOVIE) {
    super();
    this._state = FilmCardView.parseMovieToState(movie);
  }

  get template() {
    return createFilmCardTemplate(this._state.movie, this._state.isDisabled);
  }

  get movie() {
    return FilmCardView.parseStateToMovie(this._state);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#cardClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setHistoryClickHandler = (callback) => {
    this._callback.historyClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#historyClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  _restoreHandlers = () => {
    this.setClickHandler(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setHistoryClickHandler(this._callback.historyClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  #cardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #historyClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.historyClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  static parseStateToMovie = ({movie}) => mainUtils.duplicateMovie(movie);

  static parseMovieToState = (movie) => ({
    movie: mainUtils.duplicateMovie(movie),
    isDisabled: false,
  });
}
