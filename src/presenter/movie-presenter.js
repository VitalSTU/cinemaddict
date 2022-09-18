import FilmCardView from '../view/content/film-card-view.js';

import { render, remove, replace } from '../framework/render.js';
import { getNow } from '../utils.js';

export default class MoviePresenter {
  #movie = null;

  #movieComponent = null;
  #parentElement = null;

  #popupPresenter = null;
  #popupIsOpened = false;

  #changeData = null;
  #handleMovieOpening = null;

  constructor(popupPresenter, parentElement, changeData, handleMovieOpening) {
    this.#popupPresenter = popupPresenter;
    this.#parentElement = parentElement;
    this.#changeData = changeData;
    this.#handleMovieOpening = handleMovieOpening;
  }

  get popupIsOpened() {
    return this.#popupIsOpened;
  }

  set popupIsOpened(popupIsOpened) {
    this.#popupIsOpened = popupIsOpened;
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

  destroy = () => {
    remove(this.#movieComponent);
  };

  #initialiseData = (movie) => {
    this.#movie = movie;
  };

  #renderNewPopupComponent = (movie) => {
    this.#popupPresenter.init(movie, null, this.#resetOpenedStatusFlag);
    this.#handleMovieOpening();
    this.#popupIsOpened = true;
  };

  #resetOpenedStatusFlag = () => {
    this.#popupIsOpened = false;
  };

  #setEventHandlers = () => {
    this.#movieComponent.setClickHandler( () => this.#filmCardClickHandler(this.#movieComponent) );
    this.#movieComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#movieComponent.setHistoryClickHandler(this.#historyClickHandler);
    this.#movieComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
  };

  #filmCardClickHandler = ({movie}) => {
    this.#renderNewPopupComponent(movie);
  };

  #watchlistClickHandler = () => {
    this.#changeData({
      ...this.#movie,
      userDetails: {
        ...this.#movie.userDetails,
        watchlist: !this.#movie.userDetails.watchlist
      }
    });
  };

  #historyClickHandler = () => {
    const alreadyWatched = this.#movie.userDetails.alreadyWatched;

    this.#changeData({
      ...this.#movie,
      userDetails: {
        ...this.#movie.userDetails,
        alreadyWatched: !alreadyWatched,
        watchingDate: alreadyWatched ? '' : getNow(),
      }
    });
  };

  #favoriteClickHandler = () => {
    this.#changeData({
      ...this.#movie,
      userDetails: {
        ...this.#movie.userDetails,
        favorite: !this.#movie.userDetails.favorite
      }
    });
  };
}
