import { MovieFilterType } from './const.js';

const getCommentsByIds = (ids, comments) => comments.filter((c) => ids.includes(c.id));

const filter = {
  [MovieFilterType.ALL]: (movies) => movies,
  [MovieFilterType.WATCH_LIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [MovieFilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [MovieFilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};

export { getCommentsByIds , filter };
