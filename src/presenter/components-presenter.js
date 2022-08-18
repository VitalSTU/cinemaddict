import FilmBoardView from '../view/content/film-board-view.js';
import FilmsListLoadingView from '../view/filter/films-list-loading-view.js';
import FilmsListEmptyView from '../view/filter/films-list-empty-view.js';
import FilmsListAllUpcomingView from '../view/filter/films-list-all-upcoming-view.js';
import FilmsListTopRatedView from '../view/filter/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/filter/films-list-most-commented-view.js';

import FilmCardView from '../view/content/film-card-view.js';
import ShowMoreButtonView from '../view/content/show-more-button-view.js';

import EmojiSmileView from '../view/popup/emoji-smile-view.js';
import PopupAddCommentsView from '../view/popup/popup-add-comment-view.js';
// import PopupView from '../view/popup/popup-view.js';
// import PopupWithoutCommentsView from '../view/popup/popup-without-comments-view.js';
import { render } from '../render.js';

export default class ComponentsPresenter {
  filmBoardComponent = new FilmBoardView();
  popupBoardComponent = new FilmBoardView();
  filmsListLoadingComponent = new FilmsListLoadingView();
  filmsListEmptyComponent = new FilmsListEmptyView();
  filmsListAllUpcomingComponent = new FilmsListAllUpcomingView();
  filmsListTopRatedComponent = new FilmsListTopRatedView();
  filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  showMoreButtonComponent = new ShowMoreButtonView();
  popupAddCommentsComponent = new PopupAddCommentsView();
  emojiSmileComponent = new EmojiSmileView();

  init = (contentContainer) => {
    // debugger;
    this.contentContainer = contentContainer;

    render(this.filmBoardComponent, this.contentContainer);
    render(this.filmsListLoadingComponent, this.filmBoardComponent.getElement());
    render(this.filmsListEmptyComponent, this.filmBoardComponent.getElement());

    render(this.filmsListAllUpcomingComponent, this.filmBoardComponent.getElement());
    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmsListAllUpcomingComponent.getElement());
      // render(new PopupWithoutCommentsView(), this.filmsListAllUpcomingComponent.getElement().lastChild);
    }
    render(this.showMoreButtonComponent, this.filmsListAllUpcomingComponent.getElement());

    render(this.filmsListTopRatedComponent, this.filmBoardComponent.getElement());
    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmsListTopRatedComponent.getElement());
      // render(new PopupView(), this.filmsListMostCommentedComponent.getElement().lastChild);
    }

    render(this.filmsListMostCommentedComponent, this.filmBoardComponent.getElement());
    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmsListMostCommentedComponent.getElement());
      // render(new PopupView(), this.filmsListMostCommentedComponent.getElement().lastChild);
    }

    render(this.popupBoardComponent, this.contentContainer);
    // render(this.popupAddCommentsComponent, this.popupBoardComponent.getElement());
    // render(this.emojiSmileComponent, this.popupBoardComponent.getElement());
  };
}
