import AbstractView from '../../framework/view/abstract-view.js';

const createFilmsMainSectionTemplate = () => `
  <section class="films">
  </section>`;

export default class FilmsMainSectionView extends AbstractView {

  get template() {
    return createFilmsMainSectionTemplate();
  }
}
