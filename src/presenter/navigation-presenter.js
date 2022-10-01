import NavigationView from '../view/main/navigation-view.js';

import { render, replace, remove } from '../framework/render.js';
import { MovieFilterType, UpdateType } from '../const.js';
import { filter } from '../utils.js';

export default class NavigationPresenter {
  #contentContainer = null;
  #navigationComponent = null;

  #filterModel = null;
  #moviesModel = null;

  constructor(contentContainer, filterModel, moviesModel) {
    this.#contentContainer = contentContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const movies = this.#moviesModel.movies;

    return [
      {
        type: MovieFilterType.ALL,
        name: 'All movies',
        count: filter[MovieFilterType.ALL](movies).length,
      },
      {
        type: MovieFilterType.WATCH_LIST,
        name: 'Watchlist',
        count: filter[MovieFilterType.WATCH_LIST](movies).length,
      },
      {
        type: MovieFilterType.HISTORY,
        name: 'History',
        count: filter[MovieFilterType.HISTORY](movies).length,
      },
      {
        type: MovieFilterType.FAVORITES,
        name: 'Favorites',
        count: filter[MovieFilterType.FAVORITES](movies).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevNavigationComponent = this.#navigationComponent;

    this.#navigationComponent = new NavigationView(filters, this.#filterModel.filter);
    this.#navigationComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevNavigationComponent === null) {
      render(this.#navigationComponent, this.#contentContainer);
      return;
    }

    replace(this.#navigationComponent, prevNavigationComponent);
    remove(prevNavigationComponent);
  };

  destroy = () => {
    remove(this.#navigationComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
