import { generateComment } from '../mock/comment.js';

const COMMENT_TEST_CARDS_QUANTITY = 8;

export default class CommentsModel {
  comments = Array.from({length: COMMENT_TEST_CARDS_QUANTITY}, generateComment);

  constructor() {
    for (let i = 0; i < this.comments.length; i++) {
      this.comments[i].id = i;
    }
  }

  getComments = () => this.comments;
}
