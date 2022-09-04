import AbstractView from '../../framework/view/abstract-view.js';

const createStatisticsTemplate = (moviesQuantity) => `    <p>${moviesQuantity} movies inside</p>`;

export default class StatisticsView extends AbstractView {
  #moviesQuantity = null;

  constructor(moviesQuantity) {
    super();
    this.#moviesQuantity = moviesQuantity;
  }

  get template() {
    return createStatisticsTemplate(this.#moviesQuantity);
  }
}
