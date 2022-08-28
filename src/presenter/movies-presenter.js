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

import * as CONST from '../const.js';
import { render } from '../render.js';

const FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP = 5;
const FILM_EXTRA_TEST_CARDS_QUANTITY = 2;

export default class MoviesPresenter {
  #sortView = new SortView();
  #filmsMainSectionComponent = new FilmsMainSectionView();
  #filmsListEmptyComponent = new FilmsListEmptyView(CONST.movieFilters.allMovies);

  #filmsListAllUpcomingView = new FilmsListAllUpcomingView();
  #filmsListContainerAllView = new FilmsListContainerView();
  #showMoreButtonAllView = new ShowMoreButtonView();

  #filmsListTopRatedView = new FilmsListTopRatedView();
  #filmsListContainerTopRatedView = new FilmsListContainerView();

  #filmsListMostCommentedView = new FilmsListMostCommentedView();
  #filmsListContainerMostCommentedView = new FilmsListContainerView();

  #renderedMovieCardsQuantity = FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP;

  #navigationView;
  #contentContainer;
  #movies;

  #initialiseData = () => {
    this.#contentContainer.innerHTML = '';
    this.#navigationView = new NavigationView(this.#movies);
  };

  #renderFirstFilms = (parentComponent, componentView, viewContainer, movies, quantity) => {
    render(componentView, parentComponent.element);
    render(viewContainer, componentView.element);
    for (let i = 0; i < quantity; i++) {
      const movieView = new FilmCardView(movies[i]);
      this.#renderFilmCard(movieView, viewContainer.element);
    }
  };

  #renderFilmCard = (elementToRender, parentElement) => {
    const commentsModel = new CommentsModel();
    const element = elementToRender.element;
    const popupAnchor = element.querySelector('.film-card__link');

    popupAnchor.addEventListener('click', () => {
      const popupPresenter = new PopupPresenter();
      const siteBodyElement = document.querySelector('body');
      const oldPopup = siteBodyElement.querySelector('.film-details');

      if (oldPopup) {
        oldPopup.remove();
      }

      popupPresenter.init(siteBodyElement, elementToRender.movie, commentsModel);
    });

    render(elementToRender, parentElement);
  };

  #onShowMoreButtonClick = (evt) => {
    evt.preventDefault();

    this.#movies
      .slice(this.#renderedMovieCardsQuantity, this.#renderedMovieCardsQuantity + FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP)
      .forEach((movie) => {
        const movieView = new FilmCardView(movie);
        this.#renderFilmCard(movieView, this.#filmsListContainerAllView.element);
      });
    this.#renderedMovieCardsQuantity += FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP;

    if (this.#renderedMovieCardsQuantity >= this.#movies.length) {
      evt.target.remove();
      this.#showMoreButtonAllView.removeElement();
    }
  };

  init = (contentContainer, moviesModel) => {
    this.#contentContainer = contentContainer;
    this.#movies = [...moviesModel.movies];

    this.#initialiseData();

    render(this.#navigationView, this.#contentContainer);

    if (this.#movies.length < 1) {
      render(this.#filmsListEmptyComponent, this.#contentContainer);
    } else {
      render(this.#sortView, this.#contentContainer);
      render(this.#filmsMainSectionComponent, this.#contentContainer);

      this.#renderFirstFilms(this.#filmsMainSectionComponent, this.#filmsListAllUpcomingView,
        this.#filmsListContainerAllView, this.#movies, Math.min(this.#movies.length, FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP));

      if (this.#movies.length > FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP) {
        this.#showMoreButtonAllView.element.addEventListener('click', this.#onShowMoreButtonClick);
        render(this.#showMoreButtonAllView, this.#filmsListAllUpcomingView.element);
      }

      this.#renderFirstFilms(this.#filmsMainSectionComponent, this.#filmsListTopRatedView,
        this.#filmsListContainerTopRatedView, this.#movies, Math.min(this.#movies.length, FILM_EXTRA_TEST_CARDS_QUANTITY));

      this.#renderFirstFilms(this.#filmsMainSectionComponent, this.#filmsListMostCommentedView,
        this.#filmsListContainerMostCommentedView, this.#movies, Math.min(this.#movies.length, FILM_EXTRA_TEST_CARDS_QUANTITY));
    }
  };
}
