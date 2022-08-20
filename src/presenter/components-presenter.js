// import FilmBoardView from '../view/content/films-main-section-view.js';

import { render } from '../render.js';

export default class ComponentsPresenter {
  // filmBoardComponent = new FilmBoardView();

  init = (contentContainer) => {
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
