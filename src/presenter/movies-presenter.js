import FilmsMainSectionView from '../view/content/films-main-section-view.js';
import FilmsListEmptyView from '../view/content/films-list-empty-view.js';
import FilmsListAllUpcomingView from '../view/content/films-list-all-upcoming-view.js';
import FilmsListTopRatedView from '../view/content/films-list-top-rated-view';
import FilmsListMostCommentedView from '../view/content/films-list-most-commented-view';
import FilmsListContainerView from '../view/content/films-list-container-view.js';

import ShowMoreButtonPresenter from './show-more-button-presenter.js';
import NavigationPresenter from './navigation-presenter.js';
import SortPresenter from './sort-presenter.js';
import MoviePresenter from './movie-presenter.js';

import { FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP, MovieFilterType } from '../const.js';
import { render } from '../framework/render.js';
import { generateFilter } from '../mock/filter.js';

const FIRST_FILM_CARD_NUMBER = 0;
const FILM_EXTRA_TEST_CARDS_QUANTITY = 2;

export default class MoviesPresenter {
  #filmsMainSectionComponent = new FilmsMainSectionView();
  #filmsListEmptyComponent = new FilmsListEmptyView(MovieFilterType.ALL);

  #filmsListAllUpcomingComponent = new FilmsListAllUpcomingView();
  #filmsListContainerAllComponent = new FilmsListContainerView();

  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListContainerTopRatedComponent = new FilmsListContainerView();

  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsListContainerMostCommentedComponent = new FilmsListContainerView();

  #contentContainer = null;
  #movies = null;

  #initialiseData = (contentContainer, moviesModel) => {
    this.#contentContainer = contentContainer;
    this.#contentContainer.innerHTML = '';
    this.#movies = [...moviesModel.movies];
  };

  #renderNavigationComponent = () => {
    const navigationPresenter = new NavigationPresenter(this.#contentContainer);
    navigationPresenter.init(generateFilter(this.#movies));
  };

  #renderFilmsListEmptyComponent = () => {
    render(this.#filmsListEmptyComponent, this.#contentContainer);
  };

  #renderSortComponent = () => {
    const sortPresenter = new SortPresenter(this.#contentContainer);
    sortPresenter.init();
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

  #renderFilmCard = (movie, {element: parentElement}) => {
    const moviePresenter = new MoviePresenter();
    moviePresenter.init(movie, parentElement);
  };

  #renderFilmsListPortion = (parentComponent, allMovies, first, quantity) => {
    allMovies
      .slice(first, quantity)
      .forEach((movie) => {
        this.#renderFilmCard(movie, parentComponent);
      });
  };

  #renderFilmsComponent = (filmsMainComponent, filmsContainerComponent, movies, first, quantity) => {
    this.#renderFilmsMainComponent(filmsMainComponent);
    this.#renderFilmsContainerComponent(filmsContainerComponent, filmsMainComponent);
    this.#renderFilmsListPortion(filmsContainerComponent, movies, first, quantity);
  };

  #renderShowMoreButtonComponent = () => {
    const showMoreButtonPresenter = new ShowMoreButtonPresenter();
    showMoreButtonPresenter.init(this.#filmsListAllUpcomingComponent, this.#filmsListContainerAllComponent, this.#movies, this.#renderFilmsListPortion);
  };

  #renderFilmsListAllUpcomingComponent = () => {
    this.#renderFilmsComponent(this.#filmsListAllUpcomingComponent, this.#filmsListContainerAllComponent, this.#movies,
      FIRST_FILM_CARD_NUMBER, Math.min(this.#movies.length, FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP - FIRST_FILM_CARD_NUMBER));

    if (this.#movies.length > FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP) {
      this.#renderShowMoreButtonComponent();
    }
  };

  #renderFilmsListTopRatedComponent = () => {
    this.#renderFilmsComponent(this.#filmsListTopRatedComponent, this.#filmsListContainerTopRatedComponent, this.#movies,
      FIRST_FILM_CARD_NUMBER, Math.min(this.#movies.length, FILM_EXTRA_TEST_CARDS_QUANTITY - FIRST_FILM_CARD_NUMBER));
  };

  #renderFilmsListMostCommentedComponent = () => {
    this.#renderFilmsComponent(this.#filmsListMostCommentedComponent, this.#filmsListContainerMostCommentedComponent, this.#movies,
      FIRST_FILM_CARD_NUMBER, Math.min(this.#movies.length, FILM_EXTRA_TEST_CARDS_QUANTITY - FIRST_FILM_CARD_NUMBER));
  };

  init = (contentContainer, moviesModel) => {
    this.#initialiseData(contentContainer, moviesModel);

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
