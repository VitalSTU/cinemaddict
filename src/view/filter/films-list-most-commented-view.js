import { createElement } from '../../render';

const createFilmsListMostCommentedTemplate = () => `<section class="films-list films-list--extra">
  <h2 class="films-list__title">Most commented</h2>
  <div class="films-list__container">
  </div>
</section>`;

export default class FilmsListMostCommentedView {
  getTemplate() {
    return createFilmsListMostCommentedTemplate();
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
