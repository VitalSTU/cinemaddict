import AbstractView from '../../framework/view/abstract-view.js';

import { MovieFilterType } from '../../const.js';

const createFilmsListEmptyTemplate = (filter) => {
  let title;

  switch (filter) {
    case MovieFilterType.ALL:
      title = 'There are no movies in our database';
      break;
    case MovieFilterType.WATCH_LIST:
      title = 'There are no movies to watch now';
      break;
    case MovieFilterType.HISTORY:
      title = 'There are no watched movies now';
      break;
    case MovieFilterType.FAVORITES:
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
    super();
    this.#filter = filter;
  }

  get template() {
    return createFilmsListEmptyTemplate(this.#filter);
  }
}
