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
      console.log(movies.map(this.#adaptToClient));
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

  #adaptToClient = (movie) => {
    const adaptedMovie = {...movie,
      filmInfo: {
        ...movie['film_info'],
        ageRating: movie['film_info']['age_rating'],
        alternativeTitle: movie['film_info']['alternative_title'],
        release: {
          ...movie['film_info']['release'],
          // date: movie['film_info']['release']['date'] !== null ? new Date(movie['film_info']['release']['date']) : movie['film_info']['release']['date'],
          releaseCountry: movie['film_info']['release']['release_country'],
        },
        totalRating: movie['film_info']['total_rating'],
      },
      userDetails: {
        ...movie['user_details'],
        alreadyWatched: movie['user_details']['already_watched'],
        // watchingDate: movie['user_details']['watching_date'] !== null ? new Date(movie['user_details']['watching_date']) : movie['user_details']['watching_date'],
        watchingDate: movie['user_details']['watching_date'],
      },
    };

    delete adaptedMovie['film_info'];
    delete adaptedMovie.filmInfo['age_rating'];
    delete adaptedMovie.filmInfo['alternative_title'];
    delete adaptedMovie.filmInfo.release['release_country'];
    delete adaptedMovie.filmInfo['total_rating'];
    delete adaptedMovie['user_details'];
    delete adaptedMovie.userDetails['already_watched'];
    delete adaptedMovie.userDetails['watching_date'];

    return adaptedMovie;
  };
}
