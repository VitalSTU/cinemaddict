import FilmDetailsMainContainerView from '../view/popup/film-details-main-container-view.js';
import FilmDetailsTopContainerView from '../view/popup/film-details-top-container-view.js';
import FilmDetailsBottomContainerView from '../view/popup/film-details-bottom-container-view.js';
import FilmDetailsCommentsContainerView from '../view/popup/film-details-comments-container-view.js';
import FilmDetailsCommentView from '../view/popup/film-details-comment-view.js';
import FilmDetailsAddCommentView from '../view/popup/film-details-add-comment-view.js';

import { render, remove } from '../framework/render.js';
import { getCommentsByIds } from '../utils.js';

export default class PopupPresenter {
  #movie = null;
  #popupMainContainer = null;
  #popupTopContainer = null;
  #popupBottomContainer = null;
  #commentsContainerView = null;
  #filmDetailsAddCommentView = null;
  #contentContainer = null;
  #comments = null;

  #initialiseData = (movie, commentsModel, popupContainer) => {
    this.#movie = movie;
    this.#comments = getCommentsByIds(this.#movie.comments, [...commentsModel.comments]);
    this.#contentContainer = popupContainer;

    this.#popupMainContainer = new FilmDetailsMainContainerView();
    this.#popupTopContainer = new FilmDetailsTopContainerView(this.#movie);
    this.#popupBottomContainer = new FilmDetailsBottomContainerView(this.#comments);
    this.#commentsContainerView = new FilmDetailsCommentsContainerView();
    this.#filmDetailsAddCommentView = new FilmDetailsAddCommentView(this.#movie, this.#comments);
  };

  #onCloseButtonClick = () => {
    this.#removePopupComponent();
    this.#activateMainPageScrollbar();
  };

  #activateMainPageScrollbar = () => {
    this.#contentContainer.classList.remove('hide-overflow');
  };

  #deactivateMainPageScrollbar = () => {
    this.#contentContainer.classList.add('hide-overflow');
  };

  #removePopupComponent = () => {
    remove(this.#popupMainContainer);
  };

  #setCloseBtnClickHandler = () => {
    this.#popupTopContainer.setCloseBtnClickHandler(this.#onCloseButtonClick);
  };

  #renderPopupMainContainerComponent = () => {
    render(this.#popupMainContainer, this.#contentContainer);
  };

  #renderMovieInfoComponent = () => {
    render(this.#popupTopContainer, this.#popupMainContainer.element);
  };

  #renderPopupCommentsSectionContainerComponent = () => {
    render(this.#popupBottomContainer, this.#popupMainContainer.element);
  };

  #renderPopupCommentsContainerComponent = () => {
    render(this.#commentsContainerView, this.#popupBottomContainer.element);
  };

  #renderCommentComponent = (comment) => {
    render(new FilmDetailsCommentView(comment), this.#commentsContainerView.element);
  };

  #renderComments = () => {
    this.#comments.forEach((comment) => {
      this.#renderCommentComponent(comment);
    });
  };

  #renderPopupNewCommentComponent = () => {
    render(this.#filmDetailsAddCommentView, this.#popupBottomContainer.element);
  };

  #renderCommentsSectionComponent = () => {
    this.#renderPopupCommentsSectionContainerComponent();
    this.#renderPopupCommentsContainerComponent();
    this.#renderComments();
    this.#renderPopupNewCommentComponent();
  };

  /**
   * Popup presenter initialization function
   *
   * @param {*} movie           movie object
   * @param {*} commentsModel   all comments collection
   * @param {*} popupContainer  container to render popup in
   * @returns {FilmDetailsMainContainerView} Created popup component
   * @memberof PopupPresenter
   */
  init = (movie, commentsModel, popupContainer) => {
    this.#initialiseData(movie, commentsModel, popupContainer);

    this.#setCloseBtnClickHandler();
    this.#deactivateMainPageScrollbar();

    this.#renderPopupMainContainerComponent();
    this.#renderMovieInfoComponent();
    this.#renderCommentsSectionComponent();

    return this.#popupMainContainer;
  };
}
