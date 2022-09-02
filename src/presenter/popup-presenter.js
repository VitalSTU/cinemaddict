import FilmDetailsMainContainerView from '../view/popup/film-details-main-container-view.js';
import FilmDetailsTopContainerView from '../view/popup/film-details-top-container-view.js';
import FilmDetailsBottomContainerView from '../view/popup/film-details-bottom-container-view.js';
import FilmDetailsCommentsContainerView from '../view/popup/film-details-comments-container-view.js';
import FilmDetailsCommentView from '../view/popup/film-details-comment-view.js';
import FilmDetailsAddCommentView from '../view/popup/film-details-add-comment-view.js';

import { render, remove } from '../framework/render.js';
import { getCommentsByIds } from '../utils.js';

export default class PopupPresenter {
  #popupMainContainer;
  #popupTopContainer;
  #popupBottomContainer;
  #commentsContainerView;
  #filmDetailsAddCommentView;
  #contentContainer;
  #movie;
  #comments;

  #initialiseData = () => {
    this.#popupMainContainer = new FilmDetailsMainContainerView();
    this.#popupTopContainer = new FilmDetailsTopContainerView(this.#movie);
    this.#popupBottomContainer = new FilmDetailsBottomContainerView(this.#comments);
    this.#commentsContainerView = new FilmDetailsCommentsContainerView();
    this.#filmDetailsAddCommentView = new FilmDetailsAddCommentView(this.#movie, this.#comments);
  };

  #onCloseButtonClick = () => {
    remove(this.#popupMainContainer);
    this.#contentContainer.classList.remove('hide-overflow');
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
    this.#contentContainer = popupContainer;
    this.#movie = movie;
    this.#comments = getCommentsByIds(this.#movie.comments, [...commentsModel.comments]);

    this.#initialiseData();

    this.#popupTopContainer.setCloseBtnClickHandler(this.#onCloseButtonClick);
    this.#contentContainer.classList.add('hide-overflow');

    render(this.#popupMainContainer, this.#contentContainer);
    render(this.#popupTopContainer, this.#popupMainContainer.element);
    render(this.#popupBottomContainer, this.#popupMainContainer.element);
    render(this.#commentsContainerView, this.#popupBottomContainer.element);
    for (let i = 0; i < this.#comments.length; i++) {
      render(new FilmDetailsCommentView(this.#comments[i]), this.#commentsContainerView.element);
    }
    render(this.#filmDetailsAddCommentView, this.#popupBottomContainer.element);

    return this.#popupMainContainer;
  };
}
