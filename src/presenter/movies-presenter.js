import NavigationView from '../view/main/navigation-view.js';
import SortView from '../view/main/sort-view.js';
import FilmsMainSectionView from '../view/content/films-main-section-view.js';
import FilmsListEmptyView from '../view/content/films-list-empty-view.js';
import FilmsListAllUpcomingView from '../view/content/films-list-all-upcoming-view.js';
import FilmsListTopRatedView from '../view/content/films-list-top-rated-view';
import FilmsListMostCommentedView from '../view/content/films-list-most-commented-view';
import FilmsListContainerView from '../view/content/films-list-container-view.js';
import FilmCardView from '../view/content/film-card-view.js';
import ShowMoreButtonView from '../view/content/show-more-button-view.js';
import PopupPresenter from '../presenter/popup-presenter.js';
import CommentsModel from '../model/comments-model.js';

import { MovieFilterType } from '../const.js';
import { render, remove } from '../framework/render.js';
import { generateFilter } from '../mock/filter.js';

const FIRST_FILM_CARD_NUMBER = 0;
const FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP = 5;
const FILM_EXTRA_TEST_CARDS_QUANTITY = 2;

export default class MoviesPresenter {
  #sortView = new SortView();
  #filmsMainSectionComponent = new FilmsMainSectionView();
  #filmsListEmptyComponent = new FilmsListEmptyView(MovieFilterType.ALL);

  #filmsListAllUpcomingView = new FilmsListAllUpcomingView();
  #filmsListContainerAllView = new FilmsListContainerView();
  #showMoreButtonAllView = new ShowMoreButtonView();

  #filmsListTopRatedView = new FilmsListTopRatedView();
  #filmsListContainerTopRatedView = new FilmsListContainerView();

  #filmsListMostCommentedView = new FilmsListMostCommentedView();
  #filmsListContainerMostCommentedView = new FilmsListContainerView();

  #renderedMovieCardsQuantity = FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP;

  #navigationView = null;
  #contentContainer = null;
  #popupContainer = null;
  #existedPopupComponent = null;
  #movies = null;

  #initialiseData = (contentContainer, moviesModel, popupContainer) => {
    this.#contentContainer = contentContainer;
    this.#movies = [...moviesModel.movies];
    this.#popupContainer = popupContainer;
    this.#contentContainer.innerHTML = '';
    this.#navigationView = new NavigationView(generateFilter(this.#movies));
  };

  #onShowMoreButtonClick = () => {
    this.#renderFilmsListPortion(this.#filmsListContainerAllView, this.#movies,
      this.#renderedMovieCardsQuantity, this.#renderedMovieCardsQuantity + FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP);

    this.#renderedMovieCardsQuantity += FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP;

    if (this.#renderedMovieCardsQuantity >= this.#movies.length) {
      remove(this.#showMoreButtonAllView);
    }
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

    this.#existedPopupComponent = popupPresenter.init(movie, commentsModel, this.#popupContainer);
  };

  #renderNavigationComponent = () => {
    render(this.#navigationView, this.#contentContainer);
  };

  #renderFilmsListEmptyComponent = () => {
    render(this.#filmsListEmptyComponent, this.#contentContainer);
  };

  #renderSortComponent = () => {
    render(this.#sortView, this.#contentContainer);
  };

  #renderFilmsMainSectionComponent = () => {
    render(this.#filmsMainSectionComponent, this.#contentContainer);
  };

  #renderFilmsMainComponent = (component) => {
    render(component, this.#filmsMainSectionComponent.element);
  };

  #renderFilmsContainerComponent = (container, parentComponent) => {
    render(container, parentComponent.element);
  };

  #renderFilmCard = (elementToRender, {element: parentElement}) => {
    elementToRender.setClickHandler( () => this.#onFilmCardClick(elementToRender) );
    render(elementToRender, parentElement);
  };

  #renderFilmsListPortion = (parentComponent, allMovies, first, quantity) => {
    allMovies
      .slice(first, quantity)
      .forEach((movie) => {
        const movieView = new FilmCardView(movie);
        this.#renderFilmCard(movieView, parentComponent);
      });
  };

  #renderFilmsComponent = (filmsMainComponent, filmsContainerComponent, movies, first, quantity) => {
    this.#renderFilmsMainComponent(filmsMainComponent);
    this.#renderFilmsContainerComponent(filmsContainerComponent, filmsMainComponent);
    this.#renderFilmsListPortion(filmsContainerComponent, movies, first, quantity);
  };

  #renderShowMoreButtonComponent = () => {
    this.#showMoreButtonAllView.setClickHandler(this.#onShowMoreButtonClick);
    render(this.#showMoreButtonAllView, this.#filmsListAllUpcomingView.element);
  };

  #renderFilmsListAllUpcomingComponent = () => {
    this.#renderFilmsComponent(this.#filmsListAllUpcomingView, this.#filmsListContainerAllView, this.#movies,
      FIRST_FILM_CARD_NUMBER, Math.min(this.#movies.length, FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP - FIRST_FILM_CARD_NUMBER));

    if (this.#movies.length > FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP) {
      this.#renderShowMoreButtonComponent();
    }
  };

  #renderFilmsListTopRatedComponent = () => {
    this.#renderFilmsComponent(this.#filmsListTopRatedView, this.#filmsListContainerTopRatedView, this.#movies,
      FIRST_FILM_CARD_NUMBER, Math.min(this.#movies.length, FILM_EXTRA_TEST_CARDS_QUANTITY - FIRST_FILM_CARD_NUMBER));
  };

  #renderFilmsListMostCommentedComponent = () => {
    this.#renderFilmsComponent(this.#filmsListMostCommentedView, this.#filmsListContainerMostCommentedView, this.#movies,
      FIRST_FILM_CARD_NUMBER, Math.min(this.#movies.length, FILM_EXTRA_TEST_CARDS_QUANTITY - FIRST_FILM_CARD_NUMBER));
  };

  init = (contentContainer, moviesModel, popupContainer) => {
    this.#initialiseData(contentContainer, moviesModel, popupContainer);

    this.#renderNavigationComponent();
    if (this.#movies.length < 1) {
      this.#renderFilmsListEmptyComponent();
    } else {
      this.#renderSortComponent();
      this.#renderFilmsMainSectionComponent();
      this.#renderFilmsListAllUpcomingComponent();
      this.#renderFilmsListTopRatedComponent();
      this.#renderFilmsListMostCommentedComponent();
    }
  };
}
