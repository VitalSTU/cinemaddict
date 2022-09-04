import { filter } from '../utils.js';

export const generateFilter = (movies) => Object.entries(filter).map(
  ([filterName, filterMovies]) => ({
    name: filterName,
    count: filterMovies(movies).length,
  }),
);
