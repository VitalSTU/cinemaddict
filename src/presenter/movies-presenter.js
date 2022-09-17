import FilmsMainSectionView from '../view/content/films-main-section-view.js';
import FilmsListEmptyView from '../view/content/films-list-empty-view.js';
import FilmsListAllUpcomingView from '../view/content/films-list-all-upcoming-view.js';
import FilmsListTopRatedView from '../view/content/films-list-top-rated-view';
import FilmsListMostCommentedView from '../view/content/films-list-most-commented-view';
import FilmsListContainerView from '../view/content/films-list-container-view.js';
import SortView from '../view/main/sort-view.js';

import CommentsModel from '../model/comments-model.js';

import ShowMoreButtonPresenter from './show-more-button-presenter.js';
import NavigationPresenter from './navigation-presenter.js';
import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';

import { FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP, MovieFilterType, SortType } from '../const.js';
import { render } from '../framework/render.js';
import { generateFilter } from '../mock/filter.js';
import { updateItem, sortMovieByDateDown, sortMovieByRatingDown, sortMovieByCommentsQuantityDown } from '../utils.js';

const FIRST_FILM_CARD_NUMBER = 0;
const FILM_EXTRA_TEST_CARDS_QUANTITY = 2;

export default class MoviesPresenter {
  #contentContainerElement = null;

  #sortComponent = new SortView();

  #filmsMainSectionComponent = new FilmsMainSectionView();
  #filmsListEmptyComponent = new FilmsListEmptyView(MovieFilterType.ALL);

  #filmsListAllUpcomingComponent = new FilmsListAllUpcomingView();
  #filmsListContainerAllComponent = new FilmsListContainerView();

  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListContainerTopRatedComponent = new FilmsListContainerView();

  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsListContainerMostCommentedComponent = new FilmsListContainerView();

  #movieMainPresenters = new Map();
  #popupPresenter = null;
  #showMoreButtonPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #moviesOriginal = null;
  #moviesTopRated = null;
  #moviesTopCommented = null;
  #movies = null;

  #initialiseData = (contentContainer, moviesModel) => {
    this.#contentContainerElement = contentContainer;
    this.#contentContainerElement.innerHTML = '';
    this.#moviesOriginal = [...moviesModel.movies];
    this.#movies = [...moviesModel.movies];
    this.#moviesTopRated = [...this.#movies];
    this.#moviesTopCommented = [...this.#movies];

    this.#moviesTopRated.sort(sortMovieByRatingDown);
    this.#moviesTopRated = this.#moviesTopRated.slice(FIRST_FILM_CARD_NUMBER, FILM_EXTRA_TEST_CARDS_QUANTITY);
    this.#moviesTopCommented.sort(sortMovieByCommentsQuantityDown);
    this.#moviesTopCommented = this.#moviesTopCommented.slice(FIRST_FILM_CARD_NUMBER, FILM_EXTRA_TEST_CARDS_QUANTITY);

    const commentsModel = new CommentsModel();
    this.#popupPresenter = new PopupPresenter(this.#handleMovieChange, commentsModel);
  };

  #renderNavigationComponent = () => {
    const navigationPresenter = new NavigationPresenter(this.#contentContainerElement);
    navigationPresenter.init(generateFilter(this.#movies));
  };

  #renderFilmsListEmptyComponent = () => {
    render(this.#filmsListEmptyComponent, this.#contentContainerElement);
  };

  #renderSortComponent = () => {
    render(this.#sortComponent, this.#contentContainerElement);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderFilmsMainSectionComponent = () => {
    render(this.#filmsMainSectionComponent, this.#contentContainerElement);
  };

  #renderFilmCard = (movie, {element: parentElement}) => {
    const moviePresenter = new MoviePresenter(this.#popupPresenter, parentElement, this.#handleMovieChange);
    const presenters = !(this.#movieMainPresenters.has(movie.id)) ? [] : this.#movieMainPresenters.get(movie.id);

    moviePresenter.init(movie);
    this.#movieMainPresenters.set(movie.id, [...presenters, moviePresenter]);
  };

  #renderFilmsListPortion = (parentComponent, allMovies, first, quantity) => {
    allMovies
      .slice(first, quantity)
      .forEach((movie) => {
        this.#renderFilmCard(movie, parentComponent);
      });
  };

  #renderFilmsComponent = (filmsMainComponent, filmsContainerComponent, movies, first, quantity) => {
    render(filmsMainComponent, this.#filmsMainSectionComponent.element);
    render(filmsContainerComponent, filmsMainComponent.element);
    this.#renderFilmsListPortion(filmsContainerComponent, movies, first, quantity);
  };

  #renderShowMoreButtonComponent = () => {
    this.#showMoreButtonPresenter = new ShowMoreButtonPresenter(this);
    this.#showMoreButtonPresenter.init(this.#filmsListAllUpcomingComponent,
      this.#filmsListContainerAllComponent, this.#movies, this.#renderFilmsListPortion);
  };

  #renderFilmsListAllUpcomingComponent = () => {
    this.#renderFilmsComponent(this.#filmsListAllUpcomingComponent, this.#filmsListContainerAllComponent, this.#movies,
      FIRST_FILM_CARD_NUMBER, Math.min(this.#movies.length, FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP - FIRST_FILM_CARD_NUMBER));

    if (this.#movies.length > FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP) {
      this.#renderShowMoreButtonComponent();
    }
  };

  #renderFilmsListTopRatedComponent = () => {
    this.#renderFilmsComponent(this.#filmsListTopRatedComponent, this.#filmsListContainerTopRatedComponent, this.#moviesTopRated,
      FIRST_FILM_CARD_NUMBER, Math.min(this.#movies.length, FILM_EXTRA_TEST_CARDS_QUANTITY - FIRST_FILM_CARD_NUMBER));
  };

  #renderFilmsListMostCommentedComponent = () => {
    this.#renderFilmsComponent(this.#filmsListMostCommentedComponent, this.#filmsListContainerMostCommentedComponent, this.#moviesTopCommented,
      FIRST_FILM_CARD_NUMBER, Math.min(this.#movies.length, FILM_EXTRA_TEST_CARDS_QUANTITY - FIRST_FILM_CARD_NUMBER));
  };

  #clearMovieList = () => {
    this.#movieMainPresenters.forEach((presenters) => {
      presenters.forEach((presenter) => {
        presenter.destroy();
      });
    });
    this.#movieMainPresenters.clear();
    this.destroyShowMoreButtonComponent();
  };

  #sortMovies = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#movies.sort(sortMovieByDateDown);
        break;
      case SortType.RATING:
        this.#movies.sort(sortMovieByRatingDown);
        break;
      default:
        this.#movies = [...this.#moviesOriginal];
    }

    this.#currentSortType = sortType;
  };

  #handleMovieChange = (updatedMovie, localData) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    this.#moviesOriginal = updateItem(this.#moviesOriginal, updatedMovie);
    this.#movieMainPresenters.get(updatedMovie.id).forEach((presenter) => {
      presenter.init(updatedMovie);
    });
    if (localData) {
      this.#popupPresenter.init(updatedMovie, localData);
    } else {
      this.#popupPresenter.init(updatedMovie);
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#clearMovieList();
    this.#renderFilmsListAllUpcomingComponent();
    this.#renderFilmsListTopRatedComponent();
    this.#renderFilmsListMostCommentedComponent();
  };

  destroyShowMoreButtonComponent = () => {
    this.#showMoreButtonPresenter.destroy();
    this.#showMoreButtonPresenter = null;
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
