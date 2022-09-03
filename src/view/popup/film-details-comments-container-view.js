import AbstractView from '../../framework/view/abstract-view.js';

const createFilmDetailsCommentsContainerTemplate = () => `

        <ul class="film-details__comments-list">
        </ul>`;

export default class FilmDetailsCommentsContainerView extends AbstractView {

  get template() {
    return createFilmDetailsCommentsContainerTemplate();
  }
}
