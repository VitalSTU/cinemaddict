import FilmCardView from '../view/content/film-card-view.js';

import { render, remove, replace } from '../framework/render.js';
import { getNow } from '../utils.js';

export default class MoviePresenter {
  #movie = null;

  #movieComponent = null;
  #parentElement = null;

  #popupPresenter = null;

  #changeData = null;

  constructor(popupPresenter, parentElement, changeData) {
    this.#popupPresenter = popupPresenter;
    this.#parentElement = parentElement;
    this.#changeData = changeData;
  }

  #initialiseData = (movie) => {
    this.#movie = movie;
  };

  #renderNewPopupComponent = (movie) => {
    this.#popupPresenter.init(movie);
  };

  #setEventHandlers = () => {
    this.#movieComponent.setClickHandler( () => this.#onFilmCardClick(this.#movieComponent) );
    this.#movieComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#movieComponent.setHistoryClickHandler(this.#onHistoryClick);
    this.#movieComponent.setFavoriteClickHandler(this.#onFavoriteClick);
  };

  #onFilmCardClick = ({movie}) => {
    this.#renderNewPopupComponent(movie);
  };

  #onWatchlistClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
  };

  #onHistoryClick = () => {
    const alreadyWatched = this.#movie.userDetails.alreadyWatched;

    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails,
      alreadyWatched: !alreadyWatched,
      watchingDate: alreadyWatched ? '' : getNow(),
    }});
  };

  #onFavoriteClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
  };

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
}
