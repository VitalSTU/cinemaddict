import FilmDetailsMainContainerView from '../view/popup/film-details-main-container-view.js';
import FilmDetailsTopContainerView from '../view/popup/film-details-top-container-view.js';
import FilmDetailsBottomContainerView from '../view/popup/film-details-bottom-container-view.js';
import FilmDetailsCommentsContainerView from '../view/popup/film-details-comments-container-view.js';
import FilmDetailsCommentView from '../view/popup/film-details-comment-view.js';
import FilmDetailsAddCommentView from '../view/popup/film-details-add-comment-view.js';

import { render } from '../framework/render.js';
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

  #setEventListeners = (element) => {

    const removeElement = () => {
      document.querySelector('body').classList.remove('hide-overflow');
      document.removeEventListener('keydown', onPopupEscKeydown);
      element.removeEventListener('click', onCloseBtnClick);
      element.closest('.film-details').remove();
    };

    function onCloseBtnClick() {
      removeElement();
    }

    function onPopupEscKeydown(evt) {
      if (evt.key === 'Escape') {
        removeElement();
      }
    }

    element.addEventListener('click', onCloseBtnClick);
    document.addEventListener('keydown', onPopupEscKeydown);
  };

  init = (contentContainer, movie, commentsModel) => {
    this.#contentContainer = contentContainer;
    this.#movie = movie;
    this.#comments = getCommentsByIds(this.#movie.comments, [...commentsModel.comments]);

    this.#initialiseData();

    const closeButton = this.#popupTopContainer.element.querySelector('.film-details__close-btn');
    this.#setEventListeners(closeButton);
    document.querySelector('body').classList.add('hide-overflow');

    render(this.#popupMainContainer, this.#contentContainer);
    render(this.#popupTopContainer, this.#popupMainContainer.element);
    render(this.#popupBottomContainer, this.#popupMainContainer.element);
    render(this.#commentsContainerView, this.#popupBottomContainer.element);
    for (let i = 0; i < this.#comments.length; i++) {
      render(new FilmDetailsCommentView(this.#comments[i]), this.#commentsContainerView.element);
    }
    render(this.#filmDetailsAddCommentView, this.#popupBottomContainer.element);
  };
}
