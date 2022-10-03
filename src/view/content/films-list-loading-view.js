import AbstractView from '../../framework/view/abstract-view.js';

const createFilmsListLoadingTemplate = () => `
    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>`;

export default class FilmsListLoadingView extends AbstractView {

  get template() {
    return createFilmsListLoadingTemplate();
  }
}
