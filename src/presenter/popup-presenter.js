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

  /**
   * Popup presenter initialization function
   *
   * @param {*} movie           movie object
   * @param {*} commentsModel   all comments collection
   * @param {*} popupContainer  container to render popup in
   * @returns {FilmDetailsView} Created popup component
   * @memberof PopupPresenter
   */
  init = (movie, localData) => {
    this.#removeOldPopup();

    this.#initialiseData(movie, localData);

    this.#setCloseBtnClickHandler();
    this.#deactivateMainPageScrollbar();

    this.#setChangeDataClickHandlers();
    this.#renderPopupMainContainerComponent();
    this.#popupComponent.setScrollPosition();
  };

  #initialiseData = (movie, localData) => {
    this.#movie = movie;
    this.#localData = (localData) ? localData : this.#localData;
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
    this.#localData = null;
    if (localData) {
      this.#localData = {...localData, localComment: {...localData.localComment}};
    }
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

  #renderPopupMainContainerComponent = () => {
    render(this.#popupComponent, this.#contentContainer);
  };

  #setCloseBtnClickHandler = () => {
    this.#popupComponent.setCloseBtnClickHandler(this.#closeBtnClickHandler);
  };

  #setChangeDataClickHandlers = () => {
    this.#popupComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#popupComponent.setHistoryClickHandler(this.#historyClickHandler);
    this.#popupComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
  };

  #closeBtnClickHandler = () => {
    this.#removePopupComponent();
    this.#activateMainPageScrollbar();
  };

  #watchlistClickHandler = () => {
    this.#changeData(
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          watchlist: !this.#movie.userDetails.watchlist
        }
      },
      {...this.#localData}
    );
  };

  #historyClickHandler = () => {
    const alreadyWatched = this.#movie.userDetails.alreadyWatched;

    this.#changeData(
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          alreadyWatched: !alreadyWatched,
          watchingDate: alreadyWatched ? '' : getNow(),
        }
      },
      {...this.#localData}
    );
  };

  #favoriteClickHandler = () => {
    this.#changeData(
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          favorite: !this.#movie.userDetails.favorite
        }
      },
      {...this.#localData}
    );
  };
}
