import { createElement } from '../../render';

const createFilmsListEmptyTemplate = (filter) => {
  let title;

  switch (filter) {
    case 'All movies':
      title = 'There are no movies in our database';
      break;
    case 'Watchlist':
      title = 'There are no movies to watch now';
      break;
    case 'History':
      title = 'There are no watched movies now';
      break;
    case 'Favorites':
      title = 'There are no favorite movies now';
      break;
    default:
      title = 'Unknown filter';
      break;
  };

  return `
    <section class="films-list">
      <h2 class="films-list__title">${title}</h2>
    </section>`;
};

export default class FilmsListEmptyView {
  getTemplate() {
    return createFilmsListEmptyTemplate();
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
