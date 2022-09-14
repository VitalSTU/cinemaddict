import FilmDetailsMainContainerView from '../view/popup/film-details-main-container-view.js';
import FilmDetailsTopContainerView from '../view/popup/film-details-top-container-view.js';
import FilmDetailsBottomContainerView from '../view/popup/film-details-bottom-container-view.js';
import FilmDetailsCommentsContainerView from '../view/popup/film-details-comments-container-view.js';
import FilmDetailsCommentView from '../view/popup/film-details-comment-view.js';
import FilmDetailsAddCommentView from '../view/popup/film-details-add-comment-view.js';

import { render, remove } from '../framework/render.js';
import { getCommentsByIds, getNow } from '../utils.js';
import { getCommentsQuantity } from '../view/view-utils.js';

export default class PopupPresenter {
  #movie = null;

  #popupMainContainerComponent = null;
  #popupTopContainerComponent = null;
  #popupBottomContainerComponent = null;
  #commentsContainerComponent = null;
  #filmDetailsAddCommentComponent = null;
  #contentContainer = null;

  #commentsModel = null;
  #comments = null;

  #changeData = null;

  constructor(changeData, commentsModel) {
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
  }

  #initialiseData = (movie) => {
    this.#movie = movie;
    this.#comments = getCommentsByIds(this.#movie.comments, [...this.#commentsModel.comments]);

    this.#popupMainContainerComponent = new FilmDetailsMainContainerView();
    this.#contentContainer = this.#popupMainContainerComponent.popupContainerElement;
    this.#popupTopContainerComponent = new FilmDetailsTopContainerView(this.#movie);
    this.#popupBottomContainerComponent = new FilmDetailsBottomContainerView(getCommentsQuantity(this.#comments));
    this.#commentsContainerComponent = new FilmDetailsCommentsContainerView();
    this.#filmDetailsAddCommentComponent = new FilmDetailsAddCommentView();
  };

  #onCloseButtonClick = () => {
    this.#removePopupComponent();
    this.#activateMainPageScrollbar();
  };

  #onWatchlistClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}}, true);
  };

  #onHistoryClick = () => {
    const alreadyWatched = this.#movie.userDetails.alreadyWatched;

    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails,
      alreadyWatched: !alreadyWatched,
      watchingDate: alreadyWatched ? '' : getNow(),
    }}, true);
  };

  #onFavoriteClick = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}}, true);
  };

  #activateMainPageScrollbar = () => {
    this.#contentContainer.classList.remove('hide-overflow');
  };

  #deactivateMainPageScrollbar = () => {
    this.#contentContainer.classList.add('hide-overflow');
  };

  #removePopupComponent = () => {
    remove(this.#popupMainContainerComponent);
  };

  #removeOldPopup = () => {
    if (this.#popupMainContainerComponent) {
      this.#removePopupComponent();
    }
  };

  #setCloseBtnClickHandler = () => {
    this.#popupTopContainerComponent.setCloseBtnClickHandler(this.#onCloseButtonClick);
  };

  #setChangeDataClickHandlers = () => {
    this.#popupTopContainerComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#popupTopContainerComponent.setHistoryClickHandler(this.#onHistoryClick);
    this.#popupTopContainerComponent.setFavoriteClickHandler(this.#onFavoriteClick);
  };

  #renderPopupMainContainerComponent = () => {
    render(this.#popupMainContainerComponent, this.#contentContainer);
  };

  #renderMovieInfoComponent = () => {
    render(this.#popupTopContainerComponent, this.#popupMainContainerComponent.element);
  };

  #renderPopupCommentsSectionContainerComponent = () => {
    render(this.#popupBottomContainerComponent, this.#popupMainContainerComponent.element);
  };

  #renderPopupCommentsContainerComponent = () => {
    render(this.#commentsContainerComponent, this.#popupBottomContainerComponent.element);
  };

  #renderCommentComponent = (comment) => {
    render(new FilmDetailsCommentView(comment), this.#commentsContainerComponent.element);
  };

  #renderComments = () => {
    this.#comments.forEach((comment) => {
      this.#renderCommentComponent(comment);
    });
  };

  #renderPopupNewCommentComponent = () => {
    render(this.#filmDetailsAddCommentComponent, this.#popupBottomContainerComponent.element);
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
  init = (movie) => {
    this.#removeOldPopup();

    this.#initialiseData(movie);

    this.#setCloseBtnClickHandler();
    this.#deactivateMainPageScrollbar();

    this.#setChangeDataClickHandlers();
    this.#renderPopupMainContainerComponent();
    this.#renderMovieInfoComponent();
    this.#renderCommentsSectionComponent();

    return this.#popupMainContainerComponent;
  };
}
