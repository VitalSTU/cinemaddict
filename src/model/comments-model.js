import { COMMENT_TEST_CARDS_QUANTITY } from '../mock/const.js';
import { generateComment } from '../mock/comment.js';

export default class CommentsModel extends Observable {
  #comments = Array.from({length: COMMENT_TEST_CARDS_QUANTITY}, generateComment);

  constructor() {
    for (let i = 0; i < this.#comments.length; i++) {
      this.#comments[i].id = i;
    }
  }

  get comments() {
    return this.#comments;
  }
}
