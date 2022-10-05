import AbstractView from '../../framework/view/abstract-view.js';

const rankOption = {
  'empty': [Number.NEGATIVE_INFINITY, 0],
  'novice': [1, 10],
  'fan': [11, 20],
  'movie buff': [21, Number.POSITIVE_INFINITY],
};

const createUserProfileTemplate = (rank) => `
  <section class="header__profile profile">
    ${rank === 'empty' ? '' : `<p class="profile__rating">${rank}</p>`}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;

export default class UserProfileView extends AbstractView {
  #moviesQuantity = null;

  constructor(movies = []) {
    super();
    this.#moviesQuantity = movies.filter((movie) => movie.userDetails.alreadyWatched).length;
  }

  get template() {
    const rank = [...Object.entries(rankOption)]
      .find( (option) => ((option[1][0] <= this.#moviesQuantity) && (this.#moviesQuantity <= option[1][1])) )[0];

    return createUserProfileTemplate(rank);
  }
}
