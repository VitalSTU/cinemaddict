import { generateMovie } from '../mock/movie.js';

const FILM_TEST_CARDS_QUANTITY = 5;

export default class MoviesModel {
  movies = Array.from({length: FILM_TEST_CARDS_QUANTITY}, generateMovie);

  constructor() {
    for (let i = 0; i < this.movies.length; i++) {
      this.movies[i].id = i;
    }
  }

  getMovies = () => this.movies;
}
