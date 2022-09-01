import * as CONST from '../../const.js';
import AbstractView from '../../framework/view/abstract-view.js';

const createFilmsListEmptyTemplate = (filter) => {
  let title;

  switch (filter) {
    case CONST.movieFilters.allMovies:
      title = 'There are no movies in our database';
      break;
    case CONST.movieFilters.watchList:
      title = 'There are no movies to watch now';
      break;
    case CONST.movieFilters.history:
      title = 'There are no watched movies now';
      break;
    case CONST.movieFilters.favorites:
      title = 'There are no favorite movies now';
      break;
    default:
      title = 'Unknown filter';
      break;
  }

  return `
    <section class="films-list">
      <h2 class="films-list__title">${title}</h2>
    </section>`;
};

export default class FilmsListEmptyView extends AbstractView {
  #filter = null;

  constructor(filter) {
    this.#filter = filter;
  }

  get template() {
    return createFilmsListEmptyTemplate(this.#filter);
  }
}
