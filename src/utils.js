import dayjs from 'dayjs';
import { MovieFilterType } from './const.js';
import { getCommentsQuantity } from './view/view-utils.js';

export const filter = {
  [MovieFilterType.ALL]: (movies) => movies,
  [MovieFilterType.WATCH_LIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [MovieFilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [MovieFilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};

const isNumber = (value) => (typeof value === 'number') && isFinite(value);
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

export const compareParameters = (paramA, paramB) => {
  const weight = getWeightForNullValue(paramA, paramB) === 0;

  if (isNumber(paramA) && isNumber(paramA)) {
    return weight || paramA === paramB;
  }

  return weight || paramA.toString().toUpperCase() === paramB.toString().toUpperCase();
};
export const duplicateMovie = (movie) => ({
  ...movie,
  comments: [...movie.comments],
  filmInfo: {
    ...movie.filmInfo,
    writers: [...movie.filmInfo.writers],
    actors: [...movie.filmInfo.actors],
    release: {...movie.filmInfo.release},
    genre: [...movie.filmInfo.genre],
  },
  userDetails: {...movie.userDetails},
});
export const getCommentsByIds = (ids, comments) => comments.filter((c) => ids.includes(c.id));
export const getNow = () => dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
export const sortMovieByCommentsQuantityDown = ({comments: commentsA}, {comments: commentsB}) => {
  const quantityA = getCommentsQuantity(commentsA);
  const quantityB = getCommentsQuantity(commentsB);
  const weight = getWeightForNullValue(quantityA, quantityB);

  return weight ?? quantityB - quantityA;
};
export const sortMovieByDateDown = ({filmInfo: {release: {date: dateA}}}, {filmInfo: {release: {date: dateB}}}) => {
  const weight = getWeightForNullValue(dateA, dateB);

  return weight ?? dayjs(dateB).diff(dayjs(dateA));
};
export const sortMovieByRatingDown = ({filmInfo: {totalRating: ratingA}}, {filmInfo: {totalRating: ratingB}}) => {
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
