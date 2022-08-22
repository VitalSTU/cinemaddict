import { generateComment } from '../mock/comment.js';

const COMMENT_TEST_CARDS_QUANTITY = 2;

export default class CommentsModel {
  comments = Array.from({length: COMMENT_TEST_CARDS_QUANTITY}, generateComment);

  getComments = () => this.comments;
}
