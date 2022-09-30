import FilmDetailsView from '../view/popup/film-details-view.js';

import { render, remove } from '../framework/render.js';
import { getCommentsByIds, getNow, compareParameters } from '../utils.js';
import { UserAction, UpdateType } from '../const.js';

export default class PopupPresenter {
  #movie = null;

  #popupComponent = null;
  #contentContainer = null;

  #commentsModel = null;

  #changeData = null;
  #resetOpenedStatusFlag = null;

  #localData = {
    localComment: {
      comment: null,
      emotion: null,
    },
    scrollTop: 0,
  };

  get comments() {
    return this.#commentsModel.comments;
  }

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
  init = (movie, localData, resetOpenedStatusFlag) => {
    this.#removeOldPopup();

    this.#initialiseData(movie, localData, resetOpenedStatusFlag);

    this.#setCloseBtnClickHandler();
    this.#deactivateMainPageScrollbar();

    this.#setChangeDataClickHandlers();
    this.#renderPopupComponent();
    this.#popupComponent.setScrollPosition();
  };

  #initialiseData = (movie, localData, resetOpenedStatusFlag) => {
    this.#movie = movie;
    this.#localData = (localData) ? localData : this.#localData;
    this.#resetOpenedStatusFlag = (resetOpenedStatusFlag) ? resetOpenedStatusFlag : this.#resetOpenedStatusFlag;

    this.#popupComponent = new FilmDetailsView(
      this.#movie,
      getCommentsByIds(this.#movie.comments, [...this.comments]),
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

  #renderPopupComponent = () => {
    render(this.#popupComponent, this.#contentContainer);
  };

  #setCloseBtnClickHandler = () => {
    this.#popupComponent.setCloseBtnClickHandler(this.#closeBtnClickHandler);
  };

  #setChangeDataClickHandlers = () => {
    this.#popupComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#popupComponent.setHistoryClickHandler(this.#historyClickHandler);
    this.#popupComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#popupComponent.setDeleteButtonsClickHandler(this.#deleteButtonClickHandler);
    this.#popupComponent.setAddCommentHandler(this.#addCommentHandler);
  };

  #closeBtnClickHandler = () => {
    this.#resetOpenedStatusFlag();
    this.#removePopupComponent();
    this.#activateMainPageScrollbar();
  };

  #watchlistClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          watchlist: !this.#movie.userDetails.watchlist,
        },
      }
    );
  };

  #historyClickHandler = () => {
    const alreadyWatched = this.#movie.userDetails.alreadyWatched;

    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          alreadyWatched: !alreadyWatched,
          watchingDate: alreadyWatched ? '' : getNow(),
        },
      }
    );
  };

  #favoriteClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {
        ...this.#movie,
        userDetails: {
          ...this.#movie.userDetails,
          favorite: !this.#movie.userDetails.favorite,
        },
      }
    );
  };

  #deleteButtonClickHandler = (commentId) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        movieToUpdate: this.#movie,
        comment: this.comments.find((c) => compareParameters(c.id.toString(), commentId)),
      }
    );
  };

  #addCommentHandler = (comment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {
        movieToUpdate: this.#movie,
        comment,
      }
    );
  };
}
