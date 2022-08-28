import * as CONST from '../../const.js';
import { createElement } from '../../render';

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

export default class FilmsListEmptyView {
  #filter = null;
  #element = null;

  constructor(filter) {
    this.#filter = filter;
  }

  get template() {
    return createFilmsListEmptyTemplate(this.#filter);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
