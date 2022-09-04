import { filter } from '../utils.js';

export const generateFilter = (movies) => Object.entries(filter).map(
  ([filterName, filterMovies]) => ({
    name: filterName,
    count: filterMovies(movies).length,
  }),
);

// export const generateFilter = (movies) => Object.entries(filter).map(
//   ([filterName, filterMovies]) => ({[filterName]: filterMovies(movies).length})
// );
//
// export const generateFilter = (movies) => {
//   const result = {};

//   Object.entries(filter).forEach(([filterName, filterMovies]) => {
//     result[filterName] = filterMovies(movies).length;
//   });

//   return result;
// };
