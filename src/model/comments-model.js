import AbstractCommentsObservable from './abstract-comments-observable.js';

import { UpdateType } from '../const.js';
import { compareParameters } from '../utils.js';

export default class CommentsModel extends AbstractCommentsObservable {
  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  set comments(comments = []) {
    this.#comments = comments;
  }

  init = async (movie) => {
    try {
      const comments = await this.#commentsApiService.getComments(movie);
      this.#comments = comments.map(this.#adaptToClient);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT);
  };

  addComment = (updateType, {comment: update}) => {
    this._checkParameter(updateType, 'updateType');
    this._checkParameter(update, 'comment');

    this.comments = [
      ...this.comments,
      update,
    ];
  };

  deleteComment = (updateType, {comment: update}) => {
    this._checkParameter(updateType, 'updateType');
    this._checkParameter(update, 'comment');

    const id = update.id;
    const index = this.comments.findIndex((c) => compareParameters(c.id, id));
    if (index < 0) {
      throw new Error(`Comment with id ${id} not found`);
    }

    this.comments = [
      ...this.comments.slice(0, index),
      ...this.comments.slice(index + 1),
    ];
  };

  #adaptToClient = (comment) => ({
    ...comment,
  });
}
