import FilmDetailsView from '../view/popup/film-details-view.js';

import { render, remove } from '../framework/render.js';
import { getCommentsByIds, getNow } from '../utils.js';

export default class PopupPresenter {
  #movie = null;

  #popupComponent = null;
  #contentContainer = null;

  #commentsModel = null;
  #comments = null;

  #changeData = null;

  #localData = {
    localComment: {
      comment: null,
      emotion: null,
    },
    scrollTop: 0,
  };

  constructor(changeData, commentsModel) {
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
  }

  #initialiseData = (movie) => {
    this.#movie = movie;
    this.#comments = getCommentsByIds(this.#movie.comments, [...this.#commentsModel.comments]);

    this.#popupComponent = new FilmDetailsView(
      this.#movie,
      this.#comments,
      this.#localData,
      this.#updateLocalData
    );
    this.#contentContainer = this.#popupComponent.popupContainerElement;
  };

  #updateLocalData = (localData) => {
    this.#localData = {...localData, localComment: {...localData.localComment}};
  };

  #onCloseButtonClick = () => {
    this.#removePopupComponent();
    this.#activateMainPageScrollbar();
  };

  #onWatchlistClick = () => {
    this.#changeData({...this.#movie,
      userDetails: {...this.#movie.userDetails,
        watchlist: !this.#movie.userDetails.watchlist
      }
    }, true);
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
    remove(this.#popupComponent);
  };

  #removeOldPopup = () => {
    if (this.#popupComponent) {
      this.#removePopupComponent();
    }
  };

  #setCloseBtnClickHandler = () => {
    this.#popupComponent.setCloseBtnClickHandler(this.#onCloseButtonClick);
  };

  #setChangeDataClickHandlers = () => {
    this.#popupComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#popupComponent.setHistoryClickHandler(this.#onHistoryClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onFavoriteClick);
  };

  #renderPopupMainContainerComponent = () => {
    render(this.#popupComponent, this.#contentContainer);
  };

  /**
   * Popup presenter initialization function
   *
   * @param {*} movie           movie object
   * @param {*} commentsModel   all comments collection
   * @param {*} popupContainer  container to render popup in
   * @returns {FilmDetailsView} Created popup component
   * @memberof PopupPresenter
   */
  init = (movie) => {
    this.#removeOldPopup();

    this.#initialiseData(movie);

    this.#setCloseBtnClickHandler();
    this.#deactivateMainPageScrollbar();

    this.#setChangeDataClickHandlers();
    this.#renderPopupMainContainerComponent();

    return this.#popupComponent;
  };
}
