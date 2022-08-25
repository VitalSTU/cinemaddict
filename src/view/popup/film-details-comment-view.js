import * as utils from '../view-utils.js';

import { createElement } from '../../render';

const createFilmDetailsCommentTemplate = ({author, comment, date, emotion}) => `

          <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="${utils.getEmojieUri(emotion)}" width="55" height="55" alt="emoji-smile">
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

export default class FilmDetailsCommentView {

  constructor(comment) {
    this.comment = comment;
  }

  getTemplate() {
    return createFilmDetailsCommentTemplate(this.comment);
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
