import FilmsMainSectionView from '../view/content/films-main-section-view.js';
import FilmsListEmptyView from '../view/content/films-list-empty-view.js';
import FilmsListAllUpcomingView from '../view/content/films-list-all-upcoming-view.js';
import FilmsListTopRatedView from '../view/content/films-list-top-rated-view';
import FilmsListMostCommentedView from '../view/content/films-list-most-commented-view';
import FilmsListContainerView from '../view/content/films-list-container-view.js';
import SortView from '../view/main/sort-view.js';
import ShowMoreButtonView from '../view/content/show-more-button-view.js';

import NavigationPresenter from './navigation-presenter.js';
import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';

import { FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP, MovieFilterType, SortType, UpdateType, UserAction } from '../const.js';
import { render, remove } from '../framework/render.js';
import { generateFilter } from '../mock/filter.js';
import { sortMovieByDateDown, sortMovieByRatingDown, sortMovieByCommentsQuantityDown } from '../utils.js';

const FILM_EXTRA_TEST_CARDS_QUANTITY = 2;

export default class MoviesPresenter {
  #contentContainerElement = null;

  #sortComponent = null;
  #filmsMainSectionComponent = new FilmsMainSectionView();
  #filmsListEmptyComponent = new FilmsListEmptyView(MovieFilterType.ALL);
  #filmsListAllUpcomingComponent = new FilmsListAllUpcomingView();
  #filmsListContainerAllComponent = new FilmsListContainerView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListContainerTopRatedComponent = new FilmsListContainerView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsListContainerMostCommentedComponent = new FilmsListContainerView();
  #showMoreButtonComponent = null;

  #renderedMovieCardsQuantity = FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP;

  #movieMainPresenters = new Map();
  #popupPresenter = null;
  #navigationPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #moviesModel = null;
  #commentsModel = null;

  get movies() {
    return this.#getSortedMovies(this.#currentSortType);
  }

  init = (contentContainer, moviesModel, commentsModel) => {
    this.#initialiseData(contentContainer, moviesModel, commentsModel);
    this.#renderBoard();
  };

  #initialiseData = (contentContainer, moviesModel, commentsModel) => {
    this.#contentContainerElement = contentContainer;
    this.#contentContainerElement.innerHTML = '';
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#popupPresenter = new PopupPresenter(this.#handleViewAction, this.#commentsModel);

    this.#moviesModel.addObserver(this.#handleModelEvent);
  };

  #getSortedMovies = (sortType = this.#currentSortType) => {
    switch (sortType) {
      case SortType.DATE:
        return [...this.#moviesModel.movies].sort(sortMovieByDateDown);
      case SortType.RATING:
        return [...this.#moviesModel.movies].sort(sortMovieByRatingDown);
      case SortType.COMMENTS:
        return [...this.#moviesModel.movies].sort(sortMovieByCommentsQuantityDown);
    }

    return this.#moviesModel.movies;
  };

  #renderBoard = () => {
    this.#renderNavigationComponent();

    if (this.movies.length < 1) {
      this.#renderFilmsListEmptyComponent();
      return;
    }

    this.#renderSortComponent();
    this.#renderFilmsMainSectionComponent();
    this.#renderFilmsListAllUpcomingComponent();
    this.#renderFilmsListTopRatedComponent();
    this.#renderFilmsListMostCommentedComponent();
  };

  #renderNavigationComponent = () => {
    this.#navigationPresenter = new NavigationPresenter(this.#contentContainerElement);
    this.#navigationPresenter.init(generateFilter(this.movies));
  };

  #renderFilmsListEmptyComponent = () => {
    render(this.#filmsListEmptyComponent, this.#contentContainerElement);
  };

  #renderSortComponent = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandler);

    render(this.#sortComponent, this.#contentContainerElement);
  };

  #renderFilmsMainSectionComponent = () => {
    render(this.#filmsMainSectionComponent, this.#contentContainerElement);
  };

  #renderFilmCard = (movie, {element: parentElement}) => {
    const moviePresenter = new MoviePresenter(this.#popupPresenter, parentElement, this.#handleViewAction, this.#movieOpeningHandler);
    const presenters = !(this.#movieMainPresenters.has(movie.id)) ? [] : this.#movieMainPresenters.get(movie.id);

    moviePresenter.init(movie);
    this.#movieMainPresenters.set(movie.id, [...presenters, moviePresenter]);
  };

  #renderMoviesPortion = (parentComponent, movies) => {
    movies
      .forEach((movie) => {
        this.#renderFilmCard(movie, parentComponent);
      });
  };

  #renderFilmsComponent = (filmsMainComponent, filmsContainerComponent, movies) => {
    render(filmsMainComponent, this.#filmsMainSectionComponent.element);
    render(filmsContainerComponent, filmsMainComponent.element);
    this.#renderMoviesPortion(filmsContainerComponent, movies);
  };

  #renderShowMoreButtonComponent = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#showMoreButtonClickHandler);

    render(this.#showMoreButtonComponent, this.#filmsListAllUpcomingComponent.element);
  };

  #renderFilmsListAllUpcomingComponent = () => {
    const moviesQuqntity = this.movies.length;
    const movies = this.movies.slice(0, Math.min(moviesQuqntity, this.#renderedMovieCardsQuantity));
    this.#renderFilmsComponent(this.#filmsListAllUpcomingComponent, this.#filmsListContainerAllComponent, movies);

    if (moviesQuqntity > FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP) {
      this.#renderShowMoreButtonComponent();
    }
  };

  #renderFilmsListTopRatedComponent = () => {
    const moviesQuqntity = this.movies.length;
    const movies = this.#getSortedMovies(SortType.RATING).slice(0, Math.min(moviesQuqntity, FILM_EXTRA_TEST_CARDS_QUANTITY));
    this.#renderFilmsComponent(this.#filmsListTopRatedComponent, this.#filmsListContainerTopRatedComponent, movies);
  };

  #renderFilmsListMostCommentedComponent = () => {
    const moviesQuqntity = this.movies.length;
    const movies = this.#getSortedMovies(SortType.COMMENTS).slice(0, Math.min(moviesQuqntity, FILM_EXTRA_TEST_CARDS_QUANTITY));
    this.#renderFilmsComponent(this.#filmsListMostCommentedComponent, this.#filmsListContainerMostCommentedComponent, movies);
  };

  #destroyShowMoreButtonComponent = () => {
    remove(this.#showMoreButtonComponent);
  };

  #destroyNavigationComponent = () => {
    this.#navigationPresenter.destroy();
  };

  #clearBoard = ({resetRenderedMovieCardsQuantity = false, resetSortType = false} = {}) => {
    const moviesQuantity = this.movies.length;

    this.#movieMainPresenters.forEach((presenters) => {
      presenters.forEach((presenter) => {
        presenter.destroy();
      });
    });
    this.#movieMainPresenters.clear();
    this.#destroyShowMoreButtonComponent();

    remove(this.#filmsListContainerMostCommentedComponent);
    remove(this.#filmsListMostCommentedComponent);
    remove(this.#filmsListContainerTopRatedComponent);
    remove(this.#filmsListTopRatedComponent);
    remove(this.#filmsListContainerAllComponent);
    remove(this.#filmsListAllUpcomingComponent);

    remove(this.#filmsListEmptyComponent);
    remove(this.#sortComponent);
    remove(this.#filmsMainSectionComponent);

    this.#destroyNavigationComponent();

    if (resetRenderedMovieCardsQuantity) {
      this.#renderedMovieCardsQuantity = FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP;
    } else {
      this.#renderedMovieCardsQuantity = Math.min(moviesQuantity, this.#renderedMovieCardsQuantity);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {

    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;

      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        this.#moviesModel.addComment(updateType, update);
        break;

      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        this.#moviesModel.deleteComment(updateType, update);
        break;

      default:
        throw new Error(`Action type ${actionType} hasn't recognized.`);
    }
  };

  #handleModelEvent = (updateType, data) => {

    switch (updateType) {

      case UpdateType.PATCH:
        this.#movieMainPresenters.get(data.id).forEach((presenter) => {
          presenter.init(data);
          if (presenter.popupIsOpened) {
            this.#popupPresenter.init(data, null, null);
          }
        });
        break;

      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;

      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedMovieCardsQuantity: true, resetSortType: true});
        this.#renderBoard();
        break;
      default:
        throw new Error(`Update type ${updateType} hasn't recognized.`);
    }
  };

  #movieOpeningHandler = () => {
    this.#movieMainPresenters.forEach((presenters) => {
      presenters.forEach((presenter) => {
        presenter.popupIsOpened = false;
      });
    });
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedMovieCardsQuantity: true});
    this.#renderBoard();
  };

  #showMoreButtonClickHandler = () => {
    const moviesQuqntity = this.movies.length;
    const newRenderedMoviesQuqntity = Math.min(moviesQuqntity, this.#renderedMovieCardsQuantity + FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP);
    const movies = this.movies.slice(this.#renderedMovieCardsQuantity, newRenderedMoviesQuqntity);

    this.#renderMoviesPortion(this.#filmsListContainerAllComponent, movies);
    this.#renderedMovieCardsQuantity = newRenderedMoviesQuqntity;

    if (this.#renderedMovieCardsQuantity >= moviesQuqntity) {
      this.#destroyShowMoreButtonComponent();
    }
  };
}
