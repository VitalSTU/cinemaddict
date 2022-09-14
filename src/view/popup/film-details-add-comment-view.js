import AbstractView from '../../framework/view/abstract-view.js';

const BLANK_COMMENT = {
  id: null,
  author: null,
  comment: null,
  date: null,
  emotion: null,
};

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

export default class FilmDetailsAddCommentView extends AbstractView {
  _state = null;
  #addEmojiContainer = null;
  #emojiContainer = null;

  constructor() {
    super();
    this._state = BLANK_COMMENT;

    this.#addEmojiContainer = this.element.querySelector('.film-details__add-emoji-label');
    this.#emojiContainer = this.element.querySelector('.film-details__emoji-list');
    this.#emojiContainer.addEventListener('click', this.#emojiClickHandler);
  }

  get template() {
    return createFilmDetailsAddCommentTemplate();
  }

  _restoreHandlers = () => {};

  #emojiClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName == 'IMG') {
      const newEmoji = evt.target.cloneNode(true);
      newEmoji.width="55";
      newEmoji.height="55";

      this.#addEmojiContainer.innerHTML = '';
      this.#addEmojiContainer.append(newEmoji);
    }
  };

  static parseCommentToState = (comment) => ({...comment});

  static parseStateToMovie = (state) => ({...state});
}
