import FilmDetailsMainContainerView from '../view/popup/film-details-main-container-view.js';
import FilmDetailsTopContainerView from '../view/popup/film-details-top-container-view.js';
import FilmDetailsCommentsContainerView from '../view/popup/film-details-comments-container-view.js';

import { render, remove } from '../framework/render.js';
import { getCommentsByIds, getNow } from '../utils.js';

export default class PopupPresenter {
  #movie = null;

  #popupMainContainerComponent = null;
  #popupTopContainerComponent = null;
  #commentsContainerComponent = null;
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
    this.#commentsContainerComponent = new FilmDetailsCommentsContainerView(this.#comments);
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

  #renderPopupCommentsContainerComponent = () => {
    render(this.#commentsContainerComponent, this.#popupTopContainerComponent.element);
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
    this.#renderPopupCommentsContainerComponent();

    return this.#popupMainContainerComponent;
  };
}
