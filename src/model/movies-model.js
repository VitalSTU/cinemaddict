import { generateMovie } from '../mock/movie.js';

const FILM_TEST_CARDS_QUANTITY = 5;

export default class MoviesModel {
  movies = Array.from({length: FILM_TEST_CARDS_QUANTITY}, generateMovie);

  getMovies = () => this.movies;
}
