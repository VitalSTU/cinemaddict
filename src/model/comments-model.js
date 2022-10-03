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

  addComment = async (updateType, {movie, comment}, adaptMovieToClient) => {
    this._checkParameter(updateType, 'updateType');
    this._checkParameter(movie, 'movie');
    this._checkParameter(comment, 'comment');

    try {
      const response = await this.#commentsApiService.addComment(movie, comment);
      const adaptedComments = this.#adaptToClient(response.comments);
      const adaptedMovie = adaptMovieToClient(response.movie);

      this.comments = adaptedComments;

      return adaptedMovie;

    } catch(error) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update) => {
    this._checkParameter(updateType, 'updateType');
    this._checkParameter(update, 'comment');

    const index = this.comments.findIndex((c) => compareParameters(c.id, update.id));
    if (index < 0) {
      throw new Error(`Comment with id ${update.id} not found`);
    }

    try {
      await this.#commentsApiService.deleteComment(update);
      this.comments = [
        ...this.comments.slice(0, index),
        ...this.comments.slice(index + 1),
      ];

    } catch(error) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (comment) => ({
    ...comment,
  });
}
