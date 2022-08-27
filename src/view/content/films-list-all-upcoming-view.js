import { createElement } from '../../render';

const createFilmsListAllUpcomingTemplate = () => `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`;

export default class FilmsListAllUpcomingView {
  #element = null;

  get template() {
    return createFilmsListAllUpcomingTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
