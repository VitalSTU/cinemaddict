import * as utils from '../view-utils.js';
import AbstractView from '../../framework/view/abstract-view.js';

const createFilmDetailsTopContainerTemplate = ({filmInfo: movie, userDetails}) => `
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${utils.getPosterURI(movie)}" alt="">

          <p class="film-details__age">${utils.getAgeRating(movie)}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${utils.getTitle(movie)}</h3>
              <p class="film-details__title-original">Original: ${utils.getAlternativeTitle(movie)}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${utils.getRating(movie)}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${utils.getDirector(movie)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${utils.getWriters(movie)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${utils.getActors(movie)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${utils.getFullTDate(utils.getReleaseDateOrNull(movie))}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${utils.humanizeMinutes(utils.getRuntime(movie))}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${utils.getReleaseCountry(movie)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">${utils.getGenres(movie)}</td>
            </tr>
          </table>

          <p class="film-details__film-description">${utils.getFullDescription(movie)}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button${utils.getPopupFlagIfActive(userDetails.watchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button${utils.getPopupFlagIfActive(userDetails.alreadyWatched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button${utils.getPopupFlagIfActive(userDetails.favorite)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`;

export default class FilmDetailsTopContainerView extends AbstractView {
  #movie = null;

  constructor(movie) {
    this.#movie = movie;
  }

  get template() {
    return createFilmDetailsTopContainerTemplate(this.#movie);
  }
}
