import * as viewUtils from '../view-utils.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const BLANK_COMMENT = {
  id: null,
  author: null,
  comment: null,
  date: null,
  emotion: null,
};

const BLANK_LOCAL_COMMENT = {
  comment: null,
  emotion: null,
};

const createFilmDetailsCommentTemplate = ({author, comment, date, emotion}) => `
        <li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="${viewUtils.getEmojieUri(emotion)}" width="55" height="55" alt="emoji-${emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${viewUtils.getCommentFullTDateTime(date)}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>
`;

const createFilmDetailsAddCommentTemplate = () => `
      <form class="film-details__new-comment" action="" method="get">
        <div class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </form>`;

const createFilmDetailsCommentsContainerTemplate = (comments) => {
  const commentsTemplate = [...comments]
    .map((comment) => createFilmDetailsCommentTemplate(comment))
    .join('');

  return `
        <ul class="film-details__comments-list">
        ${commentsTemplate}
        ${createFilmDetailsAddCommentTemplate()}
        </ul>`;
};

const createFilmDetailsBottomContainerTemplate = (comments) => `
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${viewUtils.getCommentsQuantity(comments)}</span></h3>
        ${createFilmDetailsCommentsContainerTemplate(comments)}
      </section>
    </div>`;

export default class FilmDetailsCommentsContainerView extends AbstractStatefulView {
  _state = null;

  constructor(comments = BLANK_COMMENT) {
    super();
    this._state = FilmDetailsCommentsContainerView.parseCommentsToState(comments);
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsBottomContainerTemplate(this._state.comments);
  }

  get deleteButtons() {
    return this.element.querySelectorAll('.film-details__comment-delete');
  }

  get addEmojiContainer() {
    return this.element.querySelector('.film-details__add-emoji-label');
  }

  get emojiContainer() {
    return this.element.querySelector('.film-details__emoji-list');
  }

  get commentInput() {
    return this.element.querySelector('.film-details__comment-input');
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._state = null;
    this.updateElement(null);
  };

  #updateRadioButtons = (evt) => {
    const emojieRadiobuttons = this.emojiContainer.querySelectorAll('.film-details__emoji-item');
    const thisImg = evt.target.closest('.film-details__emoji-label');
    const clickedRadioButton = [...emojieRadiobuttons].find((e) => [...e.labels].includes(thisImg));
    const emotion = clickedRadioButton.value;

    clickedRadioButton.checked = true;

    return emotion;
  };

  #setInnerHandlers = () => {
    [...this.deleteButtons].forEach((button) => {
      button.addEventListener('click', this.#deleteButtonClickHandler);
    });
    this.emojiContainer.addEventListener('click', this.#emojiClickHandler);
    this.commentInput.addEventListener('input', this.#commentInputHandler);
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'IMG') {
      const newEmoji = evt.target.cloneNode(true);
      newEmoji.width = '55';
      newEmoji.height = '55';

      this.addEmojiContainer.innerHTML = '';
      this.addEmojiContainer.append(newEmoji);

      const emotion = this.#updateRadioButtons(evt);
      this._setState({
        emotion,
      });
    }
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      localComment: evt.target.value,
    });
  };

  static parseCommentsToState = (comments) => ({
    comments: [...comments],
    localComment: BLANK_LOCAL_COMMENT,
    emotion: null,
  });
}
