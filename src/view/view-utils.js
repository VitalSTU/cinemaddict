import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { DESCRIPTION_MAX_LENGTH, MOVIE_CARD_ACTIVE, MOVIE_DETAILS_ACTIVE, EmojiUri } from '../const.js';

const MINUTES_IN_ONE_HOUR = 60;
const BLANK_DAYJS_DURATION = {
  seconds: 0,
  minutes: 0,
  hours: 0,
  days: 0,
  months: 0,
  years: 0,
};

dayjs.extend(duration);

const isNotExist = (parameter) => (parameter === null || parameter === undefined);

export const getActors = ({actors}) => (isNotExist(actors) || actors.length === 0) ? '' : actors.join(', ');
export const getAgeRating = ({ageRating}) => isNotExist(ageRating) ? '' : `${ageRating}+`;
export const getAlternativeTitle = ({alternativeTitle: title}) => isNotExist(title) ? '' : title;
export const getCommentFullTDateTime = (tDate) => isNotExist(tDate) ? '' : dayjs(tDate).format('YYYY/MM/DD HH:mm');
export const getCommentsQuantity = (comments) => isNotExist(comments) ? 0 : comments.length;
export const getDirector = ({director}) => isNotExist(director) ? '' : director;
export const getEmojieUri = (emotion) => EmojiUri[emotion.toUpperCase()];
export const getFlagIfActive = (flag) => flag ? ` ${MOVIE_CARD_ACTIVE}` : '';
export const getFullDescription = ({description}) => isNotExist(description) ? '' : description;
export const getFullTDate = (tDate) => isNotExist(tDate) ? '' : dayjs(tDate).format('DD MMMM YYYY');
export const getGenres = ({genre: genres}) => {
  let genresString = '';

  if (isNotExist(genres) || genres.length === 0) {
    return '';
  } else {
    for (let i = 0; i < [...genres].length; i++) {
      genresString += `
                <span class="film-details__genre">${genres[i]}</span>`;
    }
  }

  return genresString;
};
export const getPopupFlagIfActive = (flag) => flag ? ` ${MOVIE_DETAILS_ACTIVE}` : '';
export const getPosterURI = ({poster}) => isNotExist(poster) ? '' : `./${poster}`;
export const getRating = ({totalRating}) => isNotExist(totalRating) ? '' : totalRating;
export const getReleaseCountry = ({release: {releaseCountry: country}}) => country;
export const getReleaseDateOrNull = ({release: {date}}) => date;
export const getRuntime = ({runtime}) => isNotExist(runtime) ? '' : runtime;
export const getShortDescription = ({description}) => {
  if (isNotExist(description)) {
    return '';
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    return `${description.slice(0, DESCRIPTION_MAX_LENGTH)}...`;
  }

  return description;
};
export const getTitle = ({title}) => isNotExist(title) ? '' : title;
export const getWriters = ({writers}) => (isNotExist(writers) || writers.length === 0) ? '' : writers.join(', ');
export const getYearOfTDate = (tDate) => isNotExist(tDate) ? '' : dayjs(tDate).format('YYYY');
export const humanizeMinutes = (minutes) => dayjs.duration({
  ...BLANK_DAYJS_DURATION,
  hours: Math.floor(minutes / MINUTES_IN_ONE_HOUR),
  minutes: Math.floor(minutes % MINUTES_IN_ONE_HOUR),
}).format('H[h] m[m]');
