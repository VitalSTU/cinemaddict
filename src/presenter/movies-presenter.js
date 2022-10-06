import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import UserProfileView from '../view/header/user-profile-view.js';
import FilmsMainSectionView from '../view/content/films-main-section-view.js';
import FilmsListEmptyView from '../view/content/films-list-empty-view.js';
import FilmsListAllUpcomingView from '../view/content/films-list-all-upcoming-view.js';
import FilmsListTopRatedView from '../view/content/films-list-top-rated-view';
import FilmsListMostCommentedView from '../view/content/films-list-most-commented-view';
import FilmsListContainerView from '../view/content/films-list-container-view.js';
import SortView from '../view/main/sort-view.js';
import ShowMoreButtonView from '../view/content/show-more-button-view.js';
import FilmsListLoadingView from '../view/content/films-list-loading-view.js';
import StatisticsView from '../view/footer/statistics-view.js';

import NavigationPresenter from './navigation-presenter.js';
import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';

import FilterModel from '../model/filter-model.js';

import { FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP, MovieFilterType, SortType, UpdateType, UserAction } from '../const.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { sortMovieByDateDown, sortMovieByRatingDown, sortMovieByCommentsQuantityDown, filter, getRandomNumber } from '../utils.js';

const FILM_EXTRA_TEST_CARDS_QUANTITY = 2;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class MoviesPresenter {
  #contentContainerElement = null;
  #siteFooterElement = null;
  #siteHeaderElement = null;
  #userProfileComponent = null;

  #sortComponent = null;
  #filmsMainSectionComponent = new FilmsMainSectionView();
  #filmsListEmptyComponent = null;
  #filmsListAllUpcomingComponent = new FilmsListAllUpcomingView();
  #filmsListContainerAllComponent = new FilmsListContainerView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListContainerTopRatedComponent = new FilmsListContainerView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsListContainerMostCommentedComponent = new FilmsListContainerView();
  #showMoreButtonComponent = null;
  #loadingComponent = new FilmsListLoadingView();

  #renderedMovieCardsQuantity = FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP;

  #movieMainPresenters = new Map();
  #popupPresenter = null;
  #navigationPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #movieFilterType = MovieFilterType.ALL;
  #filterModel = new FilterModel();
  #moviesModel = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  #isLoading = true;
  #openedPopupMovieId = -1;

  constructor(siteFooterElement, siteHeaderElement) {
    this.#siteFooterElement = siteFooterElement;
    this.#siteHeaderElement = siteHeaderElement;
    this.#userProfileComponent = new UserProfileView([]);
  }

  get movies() {
    return this.#getSortedMovies(this.#currentSortType);
  }

  init = (contentContainer, moviesModel) => {
    this.#initialiseData(contentContainer, moviesModel);
    this.#renderBoard();
  };

  #initialiseData = (contentContainer, moviesModel) => {
    this.#contentContainerElement = contentContainer;
    this.#contentContainerElement.innerHTML = '';
    this.#moviesModel = moviesModel;
    this.#popupPresenter = new PopupPresenter(this.#handleViewAction);

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  };

  #getSortedMovies = (sortType = this.#currentSortType, noFilter = false) => {
    this.#movieFilterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = noFilter ? movies : filter[this.#movieFilterType](movies);

    switch (sortType) {
      case SortType.DATE:
        return [...filteredMovies].sort(sortMovieByDateDown);
      case SortType.RATING:
        return [...filteredMovies].sort(sortMovieByRatingDown);
      case SortType.COMMENTS:
        return [...filteredMovies].sort(sortMovieByCommentsQuantityDown);
    }

    return filteredMovies;
  };

  #renderUserProfileComponent = () => {
    remove(this.#userProfileComponent);
    this.#userProfileComponent = new UserProfileView(this.#moviesModel.movies);
    render(this.#userProfileComponent, this.#siteHeaderElement);
  };

  #renderBoard = () => {
    this.#renderUserProfileComponent();

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
    this.#navigationPresenter = new NavigationPresenter(this.#contentContainerElement, this.#filterModel, this.#moviesModel);
    this.#navigationPresenter.init();
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#contentContainerElement, RenderPosition.AFTERBEGIN);
  };

  #renderFilmsListEmptyComponent = () => {
    this.#filmsListEmptyComponent = new FilmsListEmptyView(this.#movieFilterType);
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
    const moviePresenter = new MoviePresenter(this.#popupPresenter, parentElement,
      this.#handleViewAction, this.#handlePopupOpening, this.#handlePopupClosing);
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
    const moviesQuantity = this.movies.length;
    const movies = this.movies.slice(0, Math.min(moviesQuantity, this.#renderedMovieCardsQuantity));
    this.#renderFilmsComponent(this.#filmsListAllUpcomingComponent, this.#filmsListContainerAllComponent, movies);

    if (moviesQuantity > FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP) {
      this.#renderShowMoreButtonComponent();
    }
  };

  #renderFilmsListTopRatedComponent = () => {
    const sortedMovies = this.#getSortedMovies(SortType.RATING, true);
    const allRatingsAreEqual = sortedMovies.map((m) => m.filmInfo.totalRating).reduce((r1, r2) => r1 === r2);
    let moviesToRender = [];

    if (allRatingsAreEqual) {
      const allRatingsAreZero = (sortedMovies.find((m) => m.filmInfo.totalRating > 0) ?? -1) < 0;
      if (allRatingsAreZero) {
        return;
      }
      moviesToRender = this.#getArrayOfTwoRandomElements(sortedMovies);
    } else {
      moviesToRender = sortedMovies.slice(0, Math.min(sortedMovies.length, FILM_EXTRA_TEST_CARDS_QUANTITY));
    }

    this.#renderFilmsComponent(this.#filmsListTopRatedComponent, this.#filmsListContainerTopRatedComponent, moviesToRender);
  };

  #renderFilmsListMostCommentedComponent = () => {
    const sortedMovies = this.#getSortedMovies(SortType.COMMENTS, true);
    const allCommentsQuantitiesAreEqual = sortedMovies.map((m) => m.comments.length).reduce((l1, l2) => l1 === l2);
    let moviesToRender = [];

    if (allCommentsQuantitiesAreEqual) {
      const allCommentsQuantitiesAreZero = (sortedMovies.find((m) => m.comments.length > 0) ?? -1) < 0;
      if (allCommentsQuantitiesAreZero) {
        return;
      }
      moviesToRender = this.#getArrayOfTwoRandomElements(sortedMovies);
    } else {
      moviesToRender = sortedMovies.slice(0, Math.min(sortedMovies.length, FILM_EXTRA_TEST_CARDS_QUANTITY));
    }

    this.#renderFilmsComponent(this.#filmsListMostCommentedComponent, this.#filmsListContainerMostCommentedComponent, moviesToRender);
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

    if (this.#filmsListEmptyComponent) {
      remove(this.#filmsListEmptyComponent);
    }

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
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

  #handlePopupOpening = (movie) => {
    this.#openedPopupMovieId = movie.id;
  };

  #handlePopupClosing = () => {
    this.#openedPopupMovieId = -1;
  };

  #setMovieCardStatus = (movieId, movieStatusHandler, popupStatusHandler, initiator, beingDeletedCommentId) => {
    this.#movieMainPresenters.get(movieId).forEach((presenter) => {
      presenter[movieStatusHandler](initiator);
    });
    if (movieId === this.#openedPopupMovieId) {
      this.#popupPresenter[popupStatusHandler](initiator, beingDeletedCommentId);
    }
  };

  #handleViewAction = async (actionType, updateType, update, initiator) => {
    let parsedMovie = null;
    let parsedComments = null;

    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_MOVIE:

        this.#setMovieCardStatus(update.id, 'setDisabled', 'setDisabled', initiator);
        try {
          await this.#moviesModel.updateMovie(updateType, update);
        } catch(err) {
          this.#setMovieCardStatus(update.id, 'setAborting', 'setAborting', initiator);
        }
        break;

      case UserAction.ADD_COMMENT:

        this.#setMovieCardStatus(update.movie.id, 'setDisabled', 'setSaving', initiator);
        try {
          [parsedMovie, parsedComments] = await this.#popupPresenter.addComment(updateType, update, this.#moviesModel.adaptToClient);
          await this.#moviesModel.updateMovie(updateType, parsedMovie);
          this.#popupPresenter.setComments(parsedComments);
        } catch(err) {
          this.#setMovieCardStatus(update.movie.id, 'setAborting', 'setAborting', initiator);
        }
        break;

      case UserAction.DELETE_COMMENT:

        this.#setMovieCardStatus(update.movie.id, 'setDisabled', 'setDeleting', initiator, update.comment.id);
        try {
          parsedComments = await this.#popupPresenter.deleteComment(updateType, update.comment);
          await this.#moviesModel.updateMovie(updateType, update.movie);
          this.#popupPresenter.setComments(parsedComments);
        } catch(err) {
          this.#setMovieCardStatus(update.movie.id, 'setAborting', 'setAborting', initiator, update.comment.id);
        }
        break;

      default:
        throw new Error(`Action type ${actionType} hasn't recognized.`);
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {

    switch (updateType) {

      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        render(new StatisticsView(this.#moviesModel.movies.length), this.#siteFooterElement);
        break;

      case UpdateType.PATCH:
        this.#movieMainPresenters.get(data.id).forEach((presenter) => {
          presenter.init(data);
        });
        if (data.id === this.#openedPopupMovieId) {
          this.#movieMainPresenters.get(data.id)[0].initialisePopup();
        }
        break;

      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();

        if (data.id === this.#openedPopupMovieId) {
          this.#movieMainPresenters.get(data.id)[0].initialisePopup();
        }
        break;

      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedMovieCardsQuantity: true, resetSortType: true});
        this.#renderBoard();
        break;

      default:
        throw new Error(`Update type ${updateType} hasn't recognized.`);
    }
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
    const moviesQuantity = this.movies.length;
    const newRenderedMoviesQuantity = Math.min(moviesQuantity, this.#renderedMovieCardsQuantity + FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP);
    const movies = this.movies.slice(this.#renderedMovieCardsQuantity, newRenderedMoviesQuantity);

    this.#renderMoviesPortion(this.#filmsListContainerAllComponent, movies);
    this.#renderedMovieCardsQuantity = newRenderedMoviesQuantity;

    if (this.#renderedMovieCardsQuantity >= moviesQuantity) {
      this.#destroyShowMoreButtonComponent();
    }
  };

  #getArrayOfTwoRandomElements = (inletObject) => {
    const array = [...inletObject];
    const max = array.length - 1;
    const index1 = getRandomNumber(max);
    let index2 = getRandomNumber(max);
    while (index1 === index2) {
      index2 = getRandomNumber(max);
    }

    return [ array[index1], array[index2] ];
  };
}
