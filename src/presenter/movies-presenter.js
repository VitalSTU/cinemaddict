import NavigationView from '../view/main/navigation-view.js';
import SortView from '../view/main/sort-view.js';

import FilmsMainSectionView from '../view/content/films-main-section-view.js';
import FilmsListAllUpcomingView from '../view/content/films-list-all-upcoming-view.js';
import FilmsListTopRatedView from '../view/content/films-list-top-rated-view';
import FilmsListMostCommentedView from '../view/content/films-list-most-commented-view';
import FilmsListContainerView from '../view/content/films-list-container-view.js';
import FilmCardView from '../view/content/film-card-view.js';
import PopupPresenter from '../presenter/popup-presenter.js';
import ShowMoreButtonView from '../view/content/show-more-button-view.js';

import CommentsModel from '../model/comments-model.js';

import { render } from '../render.js';

const FILM_EXTRA_TEST_CARDS_QUANTITY = 2;

export default class MoviesPresenter {
  #sortView = new SortView();
  #filmsMainSectionComponent = new FilmsMainSectionView();

  #filmsListAllUpcomingView = new FilmsListAllUpcomingView();
  #filmsListContainerAllView = new FilmsListContainerView();
  #showMoreButtonAllView = new ShowMoreButtonView();

  #filmsListTopRatedView = new FilmsListTopRatedView();
  #filmsListContainerTopRatedView = new FilmsListContainerView();

  #filmsListMostCommentedView = new FilmsListMostCommentedView();
  #filmsListContainerMostCommentedView = new FilmsListContainerView();

  #navigationView;
  #contentContainer;
  #movies;

  #initialiseData = () => {
    this.#navigationView = new NavigationView(this.#movies);
  };

  #renderFilms = (parentComponent, componentView, viewContainer, movies, quantity) => {
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

  init = (contentContainer, moviesModel) => {
    this.#contentContainer = contentContainer;
    this.#movies = [...moviesModel.movies];

    this.#initialiseData();

    render(this.#navigationView, this.#contentContainer);
    render(this.#sortView, this.#contentContainer);
    render(this.#filmsMainSectionComponent, this.#contentContainer);

    this.#renderFilms(this.#filmsMainSectionComponent, this.#filmsListAllUpcomingView,
      this.#filmsListContainerAllView, this.#movies, this.#movies.length);
    render(this.#showMoreButtonAllView, this.#filmsListAllUpcomingView.element);

    this.#renderFilms(this.#filmsMainSectionComponent, this.#filmsListTopRatedView,
      this.#filmsListContainerTopRatedView, this.#movies, FILM_EXTRA_TEST_CARDS_QUANTITY);

    this.#renderFilms(this.#filmsMainSectionComponent, this.#filmsListMostCommentedView,
      this.#filmsListContainerMostCommentedView, this.#movies, FILM_EXTRA_TEST_CARDS_QUANTITY);
  };
}
