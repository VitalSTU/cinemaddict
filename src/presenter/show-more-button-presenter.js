import ShowMoreButtonView from '../view/content/show-more-button-view.js';

import { FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP } from '../const.js';
import { render, remove } from '../framework/render.js';

export default class showMoreButtonPresenter {
  #showMoreButtonComponent = new ShowMoreButtonView();
  #renderedMovieCardsQuantity = FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP;

  #showMoreButtonContainer = null;
  #filmsListContainer = null;
  #movies = null;
  #renderFilmsListPortion = null;
  #moviesPresenter = null;

  constructor(moviesPresenter) {
    this.#moviesPresenter = moviesPresenter;
  }

  #initialiseData = (buttonContainer, moviesContainer, moviesModel, renderFilmsListPortion) => {
    this.#showMoreButtonContainer = buttonContainer;
    this.#filmsListContainer = moviesContainer;
    this.#movies = moviesModel;
    this.#renderFilmsListPortion = renderFilmsListPortion;
  };

  #onShowMoreButtonClick = () => {
    this.#renderFilmsListPortion(this.#filmsListContainer, this.#movies,
      this.#renderedMovieCardsQuantity, this.#renderedMovieCardsQuantity + FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP);

    this.#renderedMovieCardsQuantity += FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP;

    if (this.#renderedMovieCardsQuantity >= this.#movies.length) {
      this.#moviesPresenter.destroyShowMoreButtonComponent();
    }
  };

  init = (buttonContainer, moviesContainer, moviesModel, renderFilmsListPortion) => {
    this.#initialiseData(buttonContainer, moviesContainer, moviesModel, renderFilmsListPortion);

    this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
    render(this.#showMoreButtonComponent, this.#showMoreButtonContainer.element);
  };

  destroy = () => {
    remove(this.#showMoreButtonComponent);
  };
}
