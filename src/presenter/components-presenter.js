import NavigationView from "../view/main/navigation-view.js";
import SortView from "../view/main/sort-view.js";

import FilmsMainSectionView from "../view/content/films-main-section-view.js";
import FilmsListAllUpcomingView from "../view/content/films-list-all-upcoming-view.js";
import FilmsListTopRatedView from "../view/content/films-list-top-rated-view";
import FilmsListMostCommentedView from "../view/content/films-list-most-commented-view";
import FilmsListContainerView from "../view/content/films-list-container-view.js";
import FilmCardView from "../view/content/film-card-view.js";
import ShowMoreButtonView from "../view/content/show-more-button-view.js";

import { render } from '../render.js';

const FILM_TEST_CARDS_QUANTITY = 5;

export default class ComponentsPresenter {
  navigationView = new NavigationView();
  sortView = new SortView();
  filmsMainSectionComponent = new FilmsMainSectionView();

  filmsListAllUpcomingView = new FilmsListAllUpcomingView();
  filmsListContainerAllView = new FilmsListContainerView();
  showMoreButtonAllView = new ShowMoreButtonView();

  filmsListTopRatedView = new FilmsListTopRatedView();
  filmsListContainerTopRatedView = new FilmsListContainerView();

  filmsListMostCommentedView = new FilmsListMostCommentedView();
  filmsListContainerMostCommentedView = new FilmsListContainerView();

  init = (contentContainer) => {
    this.contentContainer = contentContainer;

    render(this.navigationView, this.contentContainer);
    render(this.sortView, this.contentContainer);
    render(this.filmsMainSectionComponent, this.contentContainer);

    render(this.filmsListAllUpcomingView, this.filmsMainSectionComponent.getElement());
    render(this.filmsListContainerAllView, this.filmsListAllUpcomingView.getElement());
    for (let i = 0; i < FILM_TEST_CARDS_QUANTITY; i++) {
      render(new FilmCardView(), this.filmsListContainerAllView.getElement());
    }
    render(this.showMoreButtonAllView, this.filmsListAllUpcomingView.getElement());

    render(this.filmsListTopRatedView, this.filmsMainSectionComponent.getElement());
    render(this.filmsListContainerTopRatedView, this.filmsListTopRatedView.getElement());
    for (let i = 0; i < FILM_TEST_CARDS_QUANTITY; i++) {
      render(new FilmCardView(), this.filmsListContainerTopRatedView.getElement());
    }

    render(this.filmsListMostCommentedView, this.filmsMainSectionComponent.getElement());
    render(this.filmsListContainerMostCommentedView, this.filmsListMostCommentedView.getElement());
    for (let i = 0; i < FILM_TEST_CARDS_QUANTITY; i++) {
      render(new FilmCardView(), this.filmsListContainerMostCommentedView.getElement());
    }
  };
}
