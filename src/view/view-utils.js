import dayjs from 'dayjs';

const MINUTES_IN_ONE_HOUR = 60;
const DESCRIPTION_MAX_LENGTH = 140;
const emojiesUri = {
  angry: './images/emoji/angry.png',
  puke: './images/emoji/puke.png',
  sleeping: './images/emoji/sleeping.png',
  smile: './images/emoji/smile.png',
};

const isNotExist = (parameter) => (parameter === null || parameter === undefined);

export const getTitle = ({title}) => isNotExist(title) ? '' : title;
export const getAlternativeTitle = ({alternativeTitle: title}) => isNotExist(title) ? '' : title;
export const getRating = ({totalRating}) => isNotExist(totalRating) ? '' : totalRating;
export const getReleaseDateOrNull = ({release: {date}}) => date;
export const getYearOfTDate = (tDate) => isNotExist(tDate) ? '' : dayjs(tDate).format('YYYY');
export const getFullTDate = (tDate) => isNotExist(tDate) ? '' : dayjs(tDate).format('DD MMMM YYYY');
export const getCommentFullTDateTime = (tDate) => isNotExist(tDate) ? '' : dayjs(tDate).format('YYYY/MM/DD HH:mm');
export const getReleaseCountry = ({release: {releaseCountry: country}}) => country;
export const getRuntime = ({runtime}) => isNotExist(runtime) ? '' : runtime;
export const getPosterURI = ({poster}) => isNotExist(poster) ? '' : `./${poster}`;

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

export const getFullDescription = ({description}) => isNotExist(description) ? '' : description;
export const getShortDescription = ({description}) => {
  if (isNotExist(description)) {
    return '';
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    return `${description.slice(0, DESCRIPTION_MAX_LENGTH)}...`;
  }

  return description;
};

export const getCommentsQuantity = (comments) => isNotExist(comments) ? 0 : comments.length;
export const getFlagIfActive = (flag) => flag ? ' film-card__controls-item--active' : '';
export const getPopupFlagIfActive = (flag) => flag ? ' film-details__control-button--active' : '';
export const getAgeRating = ({ageRating}) => isNotExist(ageRating) ? '' : `${ageRating}+`;
export const getDirector = ({director}) => isNotExist(director) ? '' : director;
export const getWriters = ({writers}) => (isNotExist(writers) || writers.length === 0) ? '' : writers.join(', ');
export const getActors = ({actors}) => (isNotExist(actors) || actors.length === 0) ? '' : actors.join(', ');
export const getEmojieUri = (emotion) => emojiesUri[emotion];

export const humanizeMinutes = (minutes) => `${Math.floor(minutes / MINUTES_IN_ONE_HOUR)}h ${Math.floor(minutes % MINUTES_IN_ONE_HOUR)}m`;
