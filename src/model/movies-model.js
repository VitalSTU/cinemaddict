import { generateMovie } from '../mock/movie.js';

const FILM_TEST_CARDS_QUANTITY = 42;

export default class MoviesModel {
  #movies = null;

  constructor() {
    this.#movies = Array.from({length: FILM_TEST_CARDS_QUANTITY}, generateMovie);
  }

  get movies() {
    return this.#movies;
  }
}
