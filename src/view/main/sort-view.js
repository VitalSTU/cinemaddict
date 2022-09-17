import AbstractView from '../../framework/view/abstract-view.js';
import { SORT_BUTTON_ACTIVE, SortType } from '../../const.js';

const createSortTemplate = () => `
  <ul class="sort">
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;

export default class SortView extends AbstractView {
  #activeLink = this.element.querySelector(`[data-sort-type="${SortType.DEFAULT}"]`);

  constructor() {
    super();
    this.#activeLink.classList.add(SORT_BUTTON_ACTIVE);
  }

  get template() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #setActiveLink = (sortType) => {
    this.#activeLink.classList.remove(SORT_BUTTON_ACTIVE);
    this.#activeLink = this.element.querySelector(`[data-sort-type="${sortType}"]`);
    this.#activeLink.classList.add(SORT_BUTTON_ACTIVE);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
    this.#setActiveLink(evt.target.dataset.sortType);
  };
}
