import { COMMENT_TEST_CARDS_QUANTITY } from '../mock/const.js';
import { generateComment } from '../mock/comment.js';
import { compareParameters } from '../utils.js';
import AbstractCommentsObservable from './abstract-comments-observable.js';

export default class CommentsModel extends AbstractCommentsObservable {
  #comments = Array.from({length: COMMENT_TEST_CARDS_QUANTITY}, generateComment);

  constructor() {
    super();
    for (let i = 0; i < this.#comments.length; i++) {
      this.#comments[i].id = i;
    }
  }

  get comments() {
    return this.#comments;
  }

  set comments(comments = []) {
    this.#comments = comments;
  }

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
}
