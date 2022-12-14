import FilmCardView from '../view/content/film-card-view.js';

import { render, remove, replace } from '../framework/render.js';
import { getNow } from '../utils.js';
import { UserAction, UpdateType } from '../const.js';

const MOVIE_CHANGE_INITIATOR = 'movieCard';

export default class MoviePresenter {
  #movie = null;

  #movieComponent = null;
  #parentElement = null;

  #popupPresenter = null;

  #changeData = null;
  #handlePopupOpening = null;
  #handlePopupClosing = null;

  constructor(popupPresenter, parentElement, changeData, handlePopupOpening, handlePopupClosing) {
    this.#popupPresenter = popupPresenter;
    this.#parentElement = parentElement;
    this.#changeData = changeData;
    this.#handlePopupOpening = handlePopupOpening;
    this.#handlePopupClosing = handlePopupClosing;
  }

  init = (movie) => {
    this.#initialiseData(movie);

    const prevMovieComponent = this.#movieComponent;

    this.#movieComponent = new FilmCardView(this.#movie);
    this.#setEventHandlers();

    if (prevMovieComponent === null) {
      render(this.#movieComponent, this.#parentElement);
      return;
    }

    if (this.#parentElement.contains(prevMovieComponent.element)) {
      replace(this.#movieComponent, prevMovieComponent);
    }

    remove(prevMovieComponent);
  };

  initialisePopup = (localData) => {
    this.#popupPresenter.init(this.#movieComponent.movie, localData, this.#handlePopupClosing);
  };

  destroy = () => {
    remove(this.#movieComponent);
  };

  setDisabled = () => {
    this.#movieComponent.updateElement({
      isDisabled: true,
    });
  };

  setAborting = (initiator) => {
    const resetState = () => {
      this.#movieComponent.updateElement({
        isDisabled: false,
      });
    };

    if (initiator === MOVIE_CHANGE_INITIATOR) {
      this.#movieComponent.shake(resetState);
      return;
    }

    resetState();
  };

  #initialiseData = (movie) => {
    this.#movie = movie;
  };

  #renderNewPopupComponent = () => {
    this.initialisePopup();
    this.#handlePopupOpening(this.#movieComponent.movie);
  };

  #setEventHandlers = () => {
    this.#movieComponent.setClickHandler(this.#filmCardClickHandler);
    this.#movieComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#movieComponent.setHistoryClickHandler(this.#historyClickHandler);
    this.#movieComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
  };

  #filmCardClickHandler = () => {
    this.#renderNewPopupComponent();
  };

  #watchlistClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          watchlist: !this.#movie.userDetails.watchlist,
        },
      },
      MOVIE_CHANGE_INITIATOR
    );
  };

  #historyClickHandler = () => {
    const alreadyWatched = this.#movie.userDetails.alreadyWatched;

    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          alreadyWatched: !alreadyWatched,
          watchingDate: alreadyWatched ? '' : getNow(),
        },
      },
      MOVIE_CHANGE_INITIATOR
    );
  };

  #favoriteClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          favorite: !this.#movie.userDetails.favorite,
        },
      },
      MOVIE_CHANGE_INITIATOR
    );
  };
}
