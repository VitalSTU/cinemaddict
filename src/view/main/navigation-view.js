import AbstractView from '../../framework/view/abstract-view.js';

import { MovieFilterType } from '../../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => `
    <a href="#" class="main-navigation__item${filter.type === currentFilterType ? ' main-navigation__item--active' : ''}" value="${filter.type}">${filter.name}${filter.name !== MovieFilterType.ALL ? ` <span class="main-navigation__item-count">${filter.count}</span>` : ''}</a>`;

const createNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `
  <nav class="main-navigation">
    ${filterItemsTemplate}
  </nav>`;
};

export default class NavigationView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createNavigationTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.classList.contains('main-navigation__item')) {
      this._callback.filterTypeChange(evt.target.getAttribute('value'));
    } else if (evt.target.classList.contains('main-navigation__item-count')) {
      this._callback.filterTypeChange(evt.target.closest('.main-navigation__item').getAttribute('value'));
    }
  };
}
