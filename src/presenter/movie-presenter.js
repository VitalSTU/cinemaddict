import FilmCardView from '../view/content/film-card-view.js';
import CommentsModel from '../model/comments-model.js';

import { render, remove } from '../framework/render.js';

export default class MoviePresenter {
  #movie = null;
  #movieComponent = null;
  #popupPresenter = null;

  constructor(popupPresenter) {
    this.#popupPresenter = popupPresenter;
  }

  #initialiseData = (movie) => {
    this.#movie = movie;
  };

  #onFilmCardClick = ({movie}) => {
    this.#renderNewPopupComponent(movie);
  };

  #renderNewPopupComponent = (movie) => {
    const commentsModel = new CommentsModel();
    this.#popupPresenter.init(movie, commentsModel);
  };

  init = (movie, parentElement) => {
    this.#initialiseData(movie);

    this.#movieComponent = new FilmCardView(this.#movie);
    this.#movieComponent.setClickHandler( () => this.#onFilmCardClick(this.#movieComponent) );
    render(this.#movieComponent, parentElement);
  };
}
