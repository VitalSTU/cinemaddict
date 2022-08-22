import { generateMovie } from '../mock/movie.js';

export default class MoviesModel {
  movies = Array.from({length: 3}, generateMovie);

  getMovies = () => this.movies;
}
