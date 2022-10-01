import NavigationView from '../view/main/navigation-view.js';

import { render, remove } from '../framework/render.js';

export default class NavigationPresenter {
  #navigationComponent = null;

  #contentContainer = null;

  constructor(contentContainer) {
    this.#contentContainer = contentContainer;
  }

  init = (moviesFilter) => {
    this.#navigationComponent = new NavigationView(moviesFilter);

    render(this.#navigationComponent, this.#contentContainer);
  };

  destroy = () => {
    remove(this.#navigationComponent);
  };
}
