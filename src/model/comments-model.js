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

  deleteCommentById = (id) => {
    if (!id) {
      throw new Error('Null id value provided');
    } else {
      const index = this.#comments.findIndex((c) => compareParameters(c.id, id));

      if (index < 0) {
        throw new Error(`Comment with id ${id} not found`);
      } else {
        this.#comments = [
          ...this.#comments.slice(0, index),
          ...this.#comments.slice(index + 1),
        ];
      }
    }
  };
}
