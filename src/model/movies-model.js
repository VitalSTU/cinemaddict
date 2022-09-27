import { generateMovie } from '../mock/movie.js';
import { compareParameters } from '../utils.js';
import AbstractCommentsObservable from './abstract-comments-observable.js';

const FILM_TEST_CARDS_QUANTITY = 42;

export default class MoviesModel extends AbstractCommentsObservable {
  #movies = null;

  constructor() {
    super();
    this.#movies = Array.from({length: FILM_TEST_CARDS_QUANTITY}, generateMovie);
  }

  get movies() {
    return this.#movies;
  }

  set movies(movies = []) {
    this.#movies = movies;
  }

  setMovie = (movie) => {
    if (!movie) {
      throw new Error('Null movie value provided');
    } else {
      const index = this.#movies.findIndex((m) => compareParameters(m.id, movie.id));

      if (index < 0) {
        throw new Error(`Movie ${movie} not found`);
      } else {
        this.#movies = [
          ...this.#movies.slice(0, index),
          movie,
          ...this.#movies.slice(index + 1),
        ];
      }
    }
  };

  deleteCommentById = (movie, commentId) => {
    if (!movie || !commentId) {
      throw new Error(`Null ${movie ? 'id' : 'movie and id'} value${movie ? '' : 's'} provided`);
    } else {
      const movieIndex = this.#movies.findIndex((m) => compareParameters(m.id, movie.id));

      if (movieIndex < 0) {
        throw new Error(`Movie ${movie} not found`);
      } else {
        const commentIndex = this.#movies[movieIndex].comments.findIndex((id) => compareParameters(id, commentId));

        if (commentIndex < 0) {
          throw new Error(`Comment with id ${commentId} not found in movie ${movie}`);
        } else {
          this.setMovie({
            ...this.#movies[movieIndex],
            comments: [
              ...this.#movies[movieIndex].comments.slice(0, commentIndex),
              ...this.#movies[movieIndex].comments.slice(commentIndex + 1),
            ],
          });
        }
      }
    }
  };
}
