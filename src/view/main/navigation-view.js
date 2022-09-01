import AbstractView from '../../framework/view/abstract-view.js';

const createNavigationTemplate = (moviesInWatchList, moviesInHistory, moviesInFavorites) => `
  <nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${moviesInWatchList}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${moviesInHistory}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${moviesInFavorites}</span></a>
  </nav>`;

export default class NavigationView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    let moviesInWatchList = 0;
    let moviesInHistory = 0;
    let moviesInFavorites = 0;

    for (const movie of this.#movies) {
      moviesInWatchList += movie.userDetails.watchlist;
      moviesInHistory += movie.userDetails.alreadyWatched;
      moviesInFavorites += movie.userDetails.favorite;
    }

    return createNavigationTemplate(moviesInWatchList, moviesInHistory, moviesInFavorites);
  }
}
