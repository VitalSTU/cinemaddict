import FilmCardView from '../view/content/film-card-view.js';
import PopupPresenter from './popup-presenter.js';
import CommentsModel from '../model/comments-model.js';

import { render, remove } from '../framework/render.js';

export default class MoviePresenter {
  #movie = null;
  #movieComponent = null;
  #existedPopupComponent = null;

  constructor() {}

  #initialiseData = () => {
  };

  #onFilmCardClick = ({movie}) => {
    this.#removeOldPopupComponent();
    this.#renderNewPopupComponent(movie);
  };

  #removeOldPopupComponent = () => {
    if (this.#existedPopupComponent) {
      remove(this.#existedPopupComponent);
    }
  };

  #renderNewPopupComponent = (movie) => {
    const popupPresenter = new PopupPresenter();
    const commentsModel = new CommentsModel();

    this.#existedPopupComponent = popupPresenter.init(movie, commentsModel);
  };

  init = (movie, parentElement) => {
    this.#initialiseData();
    this.#movie = movie;

    this.#movieComponent = new FilmCardView(movie);
    this.#movieComponent.setClickHandler( () => this.#onFilmCardClick(this.#movieComponent) );
    render(this.#movieComponent, parentElement);
  };
}
