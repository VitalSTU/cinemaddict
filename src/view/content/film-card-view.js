import dayjs from 'dayjs';
import { createElement } from '../../render.js';

const MINUTES_IN_ONE_HOUR = 60;
const DESCRIPTION_MAX_LENGTH = 140;

const isNotExist = (parameter) => (parameter === null || parameter === undefined);
const getTitle = ({title}) => isNotExist(title) ? '' : title;
const getRating = ({totalRating}) => isNotExist(totalRating) ? '' : totalRating;
const getReleaseDateOrNull = ({release: {date}}) => date;
const getYearOfTDate = (tDate) => isNotExist(tDate) ? '' : dayjs(tDate).format('YYYY');
const getRuntime = ({runtime}) => isNotExist(runtime) ? '' : runtime;
const getGenres = ({genre}) => (isNotExist(genre) || genre.length === 0) ? '' : genre.join(', ');
const getPosterURI = ({poster}) => isNotExist(poster) ? '' : `./${poster}`;

const getShortDescription = ({description}) => {
  if (isNotExist(description)) {
    return '';
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    return `${description.slice(0, DESCRIPTION_MAX_LENGTH)}...`
  }

  return description;
};

const getCommentsQuantity = (comments) => isNotExist(comments) ? 0 : comments.length;
const getFlagIfActive = (flag) => flag ? ' film-card__controls-item--active' : '';

const humanizeMinutes = (minutes) => `${Math.floor(minutes / MINUTES_IN_ONE_HOUR)}h ${Math.floor(minutes % MINUTES_IN_ONE_HOUR)}m`;

const createFilmCardTemplate = ({comments, filmInfo: movie, userDetails}) => `
        <article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${getTitle(movie)}</h3>
            <p class="film-card__rating">${getRating(movie)}</p>
            <p class="film-card__info">
              <span class="film-card__year">${getYearOfTDate(getReleaseDateOrNull(movie))}</span>
              <span class="film-card__duration">${humanizeMinutes(getRuntime(movie))}</span>
              <span class="film-card__genre">${getGenres(movie)}</span>
            </p>
            <img src="${getPosterURI(movie)}" alt="" class="film-card__poster">
            <p class="film-card__description">${getShortDescription(movie)}</p>
            <span class="film-card__comments">${getCommentsQuantity(comments)} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist${getFlagIfActive(userDetails.watchlist)}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched${getFlagIfActive(userDetails.alreadyWatched)}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite${getFlagIfActive(userDetails.favorite)}" type="button">Mark as favorite</button>
          </div>
        </article>`;

export default class FilmCardView {

  constructor(movie) {
    this.movie = movie;
  }

  getTemplate() {
    return createFilmCardTemplate(this.movie);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
