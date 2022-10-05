import AbstractCommentsObservable from './abstract-comments-observable.js';

import { UpdateType } from '../const.js';

export default class MoviesModel extends AbstractCommentsObservable {
  #moviesApiService = null;
  #movies = [];

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get movies() {
    return this.#movies;
  }

  set movies(movies = []) {
    this.#movies = movies;
  }

  init = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.adaptToClient);
    } catch(err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateMovie = async (updateType, update) => {
    this._checkParameter(updateType, 'updateType');
    this._checkParameter(update, 'movie');

    const index = this.movies.findIndex((m) => m.id === update.id);
    if (index < 0) {
      throw new Error(`Can't update. Movie ${update.toString()} not found.`);
    }

    try {
      const response = await this.#moviesApiService.updateMovie(update);
      const updatedMovie = this.adaptToClient(response);

      this.movies = [
        ...this.movies.slice(0, index),
        updatedMovie,
        ...this.movies.slice(index + 1),
      ];

      this._notify(updateType, updatedMovie);

    } catch (error) {
      throw new Error('Can\'t update movie');
    }
  };

  adaptToClient = (movie) => {
    const adaptedMovie = {...movie,
      filmInfo: {
        ...movie['film_info'],
        ageRating: movie['film_info']['age_rating'],
        alternativeTitle: movie['film_info']['alternative_title'],
        release: {
          ...movie['film_info']['release'],
          releaseCountry: movie['film_info']['release']['release_country'],
        },
        totalRating: movie['film_info']['total_rating'],
      },
      userDetails: {
        ...movie['user_details'],
        alreadyWatched: movie['user_details']['already_watched'],
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
