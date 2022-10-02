import FilmDetailsView from '../view/popup/film-details-view.js';

import CommentsModel from '../model/comments-model.js';//TODO new

import { render, remove } from '../framework/render.js';
import { getCommentsByIds, getNow, compareParameters } from '../utils.js';
import { AUTHORIZATION, END_POINT, UserAction, UpdateType } from '../const.js';

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

  constructor(changeData/*, commentsModel*/) {//TODO delete commentsModel
    this.#changeData = changeData;
    // this.#commentsModel = commentsModel;//TODO delete
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
    this.#commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION), movie);

    this.#removeOldPopup();

    this.#initialiseData(movie, localData, resetOpenedStatusFlag);

    this.#setCloseBtnClickHandler();
    this.#deactivateMainPageScrollbar();

    this.#setChangeDataClickHandlers();
    this.#renderPopupComponent();
    this.#popupComponent.setScrollPosition();
  };

  addComment = (updateType, update) => {
    this.#commentsModel.addComment(updateType, update);
  };

  deleteComment = (updateType, update) => {
    this.#commentsModel.deleteComment(updateType, update);
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
      UpdateType.MINOR,
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
      UpdateType.MINOR,
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
      UpdateType.MINOR,
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
