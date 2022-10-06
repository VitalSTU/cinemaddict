import FilmDetailsView from '../view/popup/film-details-view.js';

import CommentsModel from '../model/comments-model.js';
import CommentsApiService from '../api/comments-api-service.js';

import { render, remove } from '../framework/render.js';
import { getCommentsByIds, getNow, compareParameters } from '../utils.js';
import { AUTHORIZATION, END_POINT, POPUP_MOVIE_CHANGE_INITIATOR, UserAction, UpdateType } from '../const.js';

export default class PopupPresenter {
  #movie = null;

  #popupComponent = null;
  #contentContainer = null;

  #commentsModel = null;

  #changeData = null;
  #handlePopupClosing = null;

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

  constructor(changeData) {
    this.#changeData = changeData;
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
  init = (movie, localData, handlePopupClosing) => {
    this.#commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
    this.#commentsModel.init(movie)
      .finally(() => {
        this.#removeOldPopup();

        this.#initialiseData(movie, localData, handlePopupClosing);

        this.#setCloseBtnClickHandler();
        this.#deactivateMainPageScrollbar();

        this.#setChangeDataClickHandlers();
        this.#renderPopupComponent();
        this.#popupComponent.setScrollPosition();
      });
  };

  addComment = async (updateType, update, adaptMovieToClient) => await this.#commentsModel.addComment(updateType, update, adaptMovieToClient);

  deleteComment = async (updateType, update) => {
    await this.#commentsModel.deleteComment(updateType, update);
  };

  setComments = (comments) => {
    this.#commentsModel.comments = comments;
  };

  setDisabled = () => {
    this.#popupComponent.updateElement({
      isDisabled: true,
    });
  };

  setSaving = () => {
    this.#popupComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setDeleting = (_initiator, beingDeletedCommentId) => {
    this.#popupComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
      beingDeletedCommentId,
    });
  };

  setAborting = (initiator, beingDeletedCommentId) => {
    const resetState = () => {
      this.#popupComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#popupComponent.setAborting(resetState, initiator, beingDeletedCommentId);
  };

  #initialiseData = (movie, localData, handlePopupClosing) => {
    this.#movie = movie;
    this.#localData = (localData) ? localData : this.#localData;
    this.#handlePopupClosing = handlePopupClosing;

    this.#popupComponent = new FilmDetailsView(
      this.#movie,
      getCommentsByIds(this.#movie.comments, [...this.comments]),
      this.#localData,
      this.#updateLocalData
    );
    this.#contentContainer = this.#popupComponent.popupContainerElement;
  };

  #updateLocalData = (localData) => {
    if (localData && localData.scrollTop) {
      this.#localData.scrollTop = localData.scrollTop;
    }
    if (localData && localData.localComment) {
      this.#localData.localComment = {localComment: {
        comment: (localData.localComment.comment) ? localData.localComment.comment : null,
        emotion: (localData.localComment.emotion) ? localData.localComment.emotion : null,
      }};
    }
  };

  #activateMainPageScrollbar = () => {
    this.#contentContainer.classList.remove('hide-overflow');
  };

  #deactivateMainPageScrollbar = () => {
    this.#contentContainer.classList.add('hide-overflow');
  };

  #removePopupComponent = () => {
    this.#popupComponent.clearHandlers();
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
    this.#removePopupComponent();
    this.#activateMainPageScrollbar();
    this.#handlePopupClosing();
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
      },
      POPUP_MOVIE_CHANGE_INITIATOR.CHANGE_MOVIE
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
      },
      POPUP_MOVIE_CHANGE_INITIATOR.CHANGE_MOVIE
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
      },
      POPUP_MOVIE_CHANGE_INITIATOR.CHANGE_MOVIE
    );
  };

  #deleteButtonClickHandler = (commentId) => {
    const index = this.#movie.comments.findIndex((id) => id === commentId);
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        movie: {
          ...this.#movie,
          comments: [
            ...this.#movie.comments.slice(0, index),
            ...this.#movie.comments.slice(index + 1),
          ],
        },
        comment: this.comments.find((c) => compareParameters(c.id.toString(), commentId)),
      },
      POPUP_MOVIE_CHANGE_INITIATOR.DELETE_COMMENT
    );
  };

  #addCommentHandler = (comment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {
        movie: this.#movie,
        comment,
      },
      POPUP_MOVIE_CHANGE_INITIATOR.ADD_COMMENT
    );
  };
}
