import SortView from '../view/main/sort-view.js';

import { render } from '../framework/render.js';

export default class SortPresenter {
  #sortComponent = new SortView();

  #contentContainer = null;

  constructor(contentContainer) {
    this.#contentContainer = contentContainer;
  }

  init = () => {
    render(this.#sortComponent, this.#contentContainer);
  };
}
