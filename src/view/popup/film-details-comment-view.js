import * as utils from '../view-utils.js';
import AbstractView from '../../framework/view/abstract-view.js';

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

export default class FilmDetailsCommentView extends AbstractView {
  #comment = null;

  constructor(comment) {
    this.#comment = comment;
  }

  get template() {
    return createFilmDetailsCommentTemplate(this.#comment);
  }
}
