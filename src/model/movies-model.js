import { generateMovie } from '../mock/movie.js';
import { compareParameters } from '../utils.js';
import AbstractCommentsObservable from './abstract-comments-observable.js';

const FILM_TEST_CARDS_QUANTITY = 42;

export default class MoviesModel extends AbstractCommentsObservable {
  #moviesApiService = null;
  #movies = null;

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;

    this.#moviesApiService.movies.then((movies) => {
      console.log(movies);
    });

    this.#movies = Array.from({length: FILM_TEST_CARDS_QUANTITY}, generateMovie);//TODO delete
  }

  get movies() {
    return this.#movies;
  }

  set movies(movies = []) {
    this.#movies = movies;
  }

  updateMovie = (updateType, update) => {
    this._checkParameter(updateType, 'updateType');
    this._checkParameter(update, 'update');

    const index = this.movies.findIndex((m) => compareParameters(m.id, update.id));
    if (index < 0) {
      throw new Error(`Can't update. Movie ${update} not found.`);
    }

    this.movies = [
      ...this.movies.slice(0, index),
      update,
      ...this.movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addComment = (updateType, {movieToUpdate, comment}) => {
    this._checkParameter(updateType, 'updateType');
    this._checkParameter(movieToUpdate, 'movie');
    this._checkParameter(comment, 'comment');

    const commentId = comment.id;
    const movieId = movieToUpdate.id;
    const movieIndex = this.movies.findIndex((m) => compareParameters(m.id, movieId));
    if (movieIndex < 0) {
      throw new Error(`Movie ${movieToUpdate} not found.`);
    }

    const movie = this.movies[movieIndex];
    const update = {
      ...movie,
      comments: [...movie.comments, commentId],
    };

    this.updateMovie(updateType, update);
  };

  deleteComment = (updateType, {movieToUpdate, comment}) => {
    this._checkParameter(updateType, 'updateType');
    this._checkParameter(movieToUpdate, 'movie');
    this._checkParameter(comment, 'comment');

    const commentId = comment.id;
    const movieIndex = this.movies.findIndex((m) => compareParameters(m.id, movieToUpdate.id));
    if (movieIndex < 0) {
      throw new Error(`Movie ${movieToUpdate} not found.`);
    }

    const movie = this.movies[movieIndex];
    const commentIndex = movie.comments.findIndex((id) => compareParameters(id, commentId));
    if (commentIndex < 0) {
      throw new Error(`Comment with id ${commentId} not found in movie ${movieToUpdate}.`);
    }

    const update = {
      ...movie, comments: [
        ...movie.comments.slice(0, commentIndex),
        ...movie.comments.slice(commentIndex + 1),
      ],
    };

    this.updateMovie(updateType, update);
  };
}
