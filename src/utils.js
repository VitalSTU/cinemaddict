import { MovieFilterType } from './const.js';

const filter = {
  [MovieFilterType.ALL]: (movies) => movies,
  [MovieFilterType.WATCH_LIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [MovieFilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [MovieFilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};

const getCommentsByIds = (ids, comments) => comments.filter((c) => ids.includes(c.id));

const updateItem = (items, update) => {
  updateIndex = items.find((item) => item.id === update.id);

  if (updateIndex === -1) {
    return items;
  }

  return [
    ...items.slice(0, updateIndex),
    update,
    ...items.slice(updateIndex + 1),
  ];
};

export { filter, getCommentsByIds, updateItem };
