import { createElement } from '../../render';

const createStatisticsTemplate = () => '    <p>0 movies inside</p>';

export default class StatisticsView {
  getTemplate() {
    return createStatisticsTemplate();
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
