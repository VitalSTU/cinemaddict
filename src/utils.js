import dayjs from 'dayjs';
import { MovieFilterType } from './const.js';
import { getCommentsQuantity } from './view/view-utils.js';

const isNumber = (value) => (typeof value === 'number') && isFinite(value);

const filter = {
  [MovieFilterType.ALL]: (movies) => movies,
  [MovieFilterType.WATCH_LIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [MovieFilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [MovieFilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};

const getCommentsByIds = (ids, comments) => comments.filter((c) => ids.includes(c.id));

const updateItem = (items, update) => {
  const updateIndex = items.find((item) => item.id === update.id);

  if (updateIndex === -1) {
    return items;
  }

  return [
    ...items.slice(0, updateIndex),
    update,
    ...items.slice(updateIndex + 1),
  ];
};

const getNow = () => dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

const getWeightForNullValue = (valueA, valueB) => {
  if (valueA === null && valueB === null) {
    return 0;
  }

  if (valueA === null) {
    return 1;
  }

  if (valueB === null) {
    return -1;
  }

  return null;
};

const sortMovieByDateDown = ({filmInfo: {release: {date: dateA}}}, {filmInfo: {release: {date: dateB}}}) => {
  const weight = getWeightForNullValue(dateA, dateB);

  return weight ?? dayjs(dateB).diff(dayjs(dateA));
};

const sortMovieByRatingDown = ({filmInfo: {totalRating: ratingA}}, {filmInfo: {totalRating: ratingB}}) => {
  const weight = getWeightForNullValue(ratingA, ratingB);

  if (isNumber(ratingA) && isNumber(ratingB)) {
    return weight ?? ratingB - ratingA;
  }

  let result = 0;
  if (ratingA.toString().toUpperCase() < ratingB.toString().toUpperCase()) {
    result = 1;
  } else if (ratingA.toString().toUpperCase() > ratingB.toString().toUpperCase()) {
    result = -1;
  }

  return weight ?? result;
};

const sortMovieByCommentsQuantityDown = ({comments: commentsA}, {comments: commentsB}) => {
  const quantityA = getCommentsQuantity(commentsA);
  const quantityB = getCommentsQuantity(commentsB);
  const weight = getWeightForNullValue(quantityA, quantityB);

  return weight ?? quantityB - quantityA;
};

export { filter, getCommentsByIds, updateItem, getNow, sortMovieByDateDown, sortMovieByRatingDown, sortMovieByCommentsQuantityDown };
