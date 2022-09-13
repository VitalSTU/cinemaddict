import * as viewUtils from '../view-utils.js';
import * as mainUtils from '../../utils.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const BLANK_MOVIE = {
  id: null,
  comments: null,
  filmInfo: {
    title: null,
    alternativeTitle: null,
    totalRating: null,
    poster: null,
    ageRating: null,
    director: null,
    writers: null,
    actors: null,
    release: {
      date: null,
      releaseCountry: null,
    },
    runtime: null,
    genre: null,
    description: null,
  },
  userDetails: {
    watchlist: false,
    alreadyWatched: false,
    watchingDate: null,
    favorite: false,
  }
};

const createFilmDetailsTopContainerTemplate = ({filmInfo: movie, userDetails}) => `
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${viewUtils.getPosterURI(movie)}" alt="">

          <p class="film-details__age">${viewUtils.getAgeRating(movie)}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${viewUtils.getTitle(movie)}</h3>
              <p class="film-details__title-original">Original: ${viewUtils.getAlternativeTitle(movie)}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${viewUtils.getRating(movie)}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${viewUtils.getDirector(movie)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${viewUtils.getWriters(movie)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${viewUtils.getActors(movie)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${viewUtils.getFullTDate(viewUtils.getReleaseDateOrNull(movie))}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${viewUtils.humanizeMinutes(viewUtils.getRuntime(movie))}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${viewUtils.getReleaseCountry(movie)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">${viewUtils.getGenres(movie)}</td>
            </tr>
          </table>

          <p class="film-details__film-description">${viewUtils.getFullDescription(movie)}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button${viewUtils.getPopupFlagIfActive(userDetails.watchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button${viewUtils.getPopupFlagIfActive(userDetails.alreadyWatched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button${viewUtils.getPopupFlagIfActive(userDetails.favorite)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`;

export default class FilmDetailsTopContainerView extends AbstractStatefulView {
  _state = null;
  #closeButton = null;
  #watchlistButton = null;
  #watchedButton = null;
  #favoriteButton = null;

  constructor(movie = BLANK_MOVIE) {
    super();
    this._state = FilmDetailsTopContainerView.parseMovieToState(movie);
    this.#closeButton = this.element.querySelector('.film-details__close-btn');
    this.#watchlistButton = this.element.querySelector('.film-details__control-button--watchlist');
    this.#watchedButton = this.element.querySelector('.film-details__control-button--watched');
    this.#favoriteButton = this.element.querySelector('.film-details__control-button--favorite');

    // this.#closeButton.addEventListener('click', this.#closeButtonHandler);
    this.#watchlistButton.addEventListener('click', this.#watchlistToggleHandler);
    this.#watchedButton.addEventListener('click', this.#watchedToggleHandler);
    this.#favoriteButton.addEventListener('click', this.#favoriteToggleHandler);
  }

  get template() {
    return createFilmDetailsTopContainerTemplate(this._state);
  }

  get closeButton() {
    return this.#closeButton;
  }

  #watchlistToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      userDetails: {...this._state.userDetails, watchlist: !this._state.userDetails.watchlist},
    });
  };

  #watchedToggleHandler = (evt) => {
    evt.preventDefault();
    const update = {
      userDetails: {...this._state.userDetails, alreadyWatched: !this._state.userDetails.alreadyWatched},
    };
    update.userDetails.watchingDate = FilmDetailsTopContainerView.updateMovieUserDetailsDate(update);
    this.updateElement(update);
  };

  #favoriteToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      userDetails: {...this._state.userDetails, favorite: !this._state.userDetails.favorite},
    });
  };

  setCloseBtnClickHandler = (callback) => {
    this._callback.click = callback;
    this.closeButton.addEventListener('click', this.#onCloseBtnClick);
    document.addEventListener('keydown', this.#onKeydown);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.#watchlistButton.addEventListener('click', this.#onWatchlistClick);
  };

  setHistoryClickHandler = (callback) => {
    this._callback.historyClick = callback;
    this.#watchedButton.addEventListener('click', this.#onHistoryClick);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.#favoriteButton.addEventListener('click', this.#onFavoriteClick);
  };

  _restoreHandlers = () => {
    this.setCloseBtnClickHandler(this._callback.click);
  };

  #clearListeners = () => {
    this.closeButton.removeEventListener('click', this.#onCloseBtnClick);
    document.removeEventListener('keydown', this.#onKeydown);
    this.#watchlistButton.removeEventListener('click', this.#onWatchlistClick);
    this.#watchedButton.removeEventListener('click', this.#onHistoryClick);
    this.#favoriteButton.removeEventListener('click', this.#onFavoriteClick);
  };

  #onCloseBtnClick = (evt) => {
    evt.preventDefault();
    this.#clearListeners();
    this._callback.click();
  };

  #onKeydown = (evt) => {
    if (evt.key === 'Escape') {
      this.#clearListeners();
      this._callback.click();
    }
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #onHistoryClick = (evt) => {
    evt.preventDefault();
    this._callback.historyClick();
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  static updateMovieUserDetailsDate = (movie) => {
    let watchingDate = movie.userDetails.watchingDate;

    if (!movie.userDetails.alreadyWatched) {
      watchingDate = null;
    } else if (!watchingDate) {
      watchingDate = mainUtils.getNow();
    }

    return watchingDate;
  };

  static parseMovieToState = (movie) => ({...movie,
    filmInfo: {...movie.filmInfo, release: {...movie.filmInfo.release}},
    userDetails: {...movie.userDetails},
  });

  static parseStateToTask = (state) => {
    const movie = {...state,
      filmInfo: {...state.filmInfo, release: {...state.filmInfo.release}},
      userDetails: {...state.userDetails},
    };
    movie.userDetails.watchingDate = FilmDetailsTopContainerView.updateMovieUserDetailsDate(movie);

    return movie;
  };
}
