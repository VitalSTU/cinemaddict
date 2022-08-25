import FilmDetailsMainContainerView from '../view/popup/film-details-main-container-view.js';
import FilmDetailsTopContainerView from '../view/popup/film-details-top-container-view.js';
import FilmDetailsBottomContainerView from '../view/popup/film-details-bottom-container-view.js';
import FilmDetailsCommentsContainerView from '../view/popup/film-details-comments-container-view.js';
import FilmDetailsCommentView from '../view/popup/film-details-comment-view.js';
import FilmDetailsAddCommentView from '../view/popup/film-details-add-comment-view.js';

import { render } from '../render.js';
import { getCommentsByIds } from '../utils.js';

export default class PopupPresenter {

  initialiseData = () => {
    this.popupMainContainer = new FilmDetailsMainContainerView();
    this.popupTopContainer = new FilmDetailsTopContainerView(this.movie);
    this.popupBottomContainer = new FilmDetailsBottomContainerView(this.comments);
    this.commentsContainerView = new FilmDetailsCommentsContainerView();
    this.filmDetailsAddCommentView = new FilmDetailsAddCommentView(this.movie, this.comments);
  };

  init = (contentContainer, movie, commentsModel) => {
    this.contentContainer = contentContainer;
    this.movie = movie;
    this.comments = getCommentsByIds(this.movie.comments, [...commentsModel.getComments()]);

    this.initialiseData();

    render(this.popupMainContainer, this.contentContainer);
    render(this.popupTopContainer, this.popupMainContainer.getElement());
    render(this.popupBottomContainer, this.popupMainContainer.getElement());
    render(this.commentsContainerView, this.popupBottomContainer.getElement());
    for (let i = 0; i < this.comments.length; i++) {
      render(new FilmDetailsCommentView(this.comments[i]), this.commentsContainerView.getElement());
    }
    render(this.filmDetailsAddCommentView, this.popupBottomContainer.getElement());
  };
}
