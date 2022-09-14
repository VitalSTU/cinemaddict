import * as utils from '../view-utils.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const BLANK_COMMENT = {
  id: null,
  author: null,
  comment: null,
  date: null,
  emotion: null,
};

const createFilmDetailsCommentTemplate = ({author, comment, date, emotion}) => `

          <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="${utils.getEmojieUri(emotion)}" width="55" height="55" alt="emoji-${emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${utils.getCommentFullTDateTime(date)}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>
`;

export default class FilmDetailsCommentView extends AbstractStatefulView {
  _state = null;
  #deleteButton = null;

  constructor(comment = BLANK_COMMENT) {
    super();
    this._state = FilmDetailsCommentView.parseCommentToState(comment);

    this.#deleteButton = this.element.querySelector('.film-details__comment-delete');
    this.#deleteButton.addEventListener('click', this.#deleteButtonClickHandler);
  }

  get template() {
    return createFilmDetailsCommentTemplate(this._state);
  }

  _restoreHandlers = () => {};

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement(null);
  };

  static parseCommentToState = (comment) => ({...comment});

  static parseStateToMovie = (state) => ({...state});
}
