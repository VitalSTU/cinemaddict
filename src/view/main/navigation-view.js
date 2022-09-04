import AbstractView from '../../framework/view/abstract-view.js';

import { MovieFilterType } from '../../const.js';

const createFilterItemTemplate = (filter, isActive) => `
    <a href="#" class="main-navigation__item${isActive ? ' main-navigation__item--active' : ''}">${filter.name}${filter.name !== MovieFilterType.ALL ? ` <span class="main-navigation__item-count">${filter.count}</span>` : ''}</a>`;

const createNavigationTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `
  <nav class="main-navigation">
    ${filterItemsTemplate}
  </nav>`;
};

export default class NavigationView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createNavigationTemplate(this.#filters);
  }
}
