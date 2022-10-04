import he from 'he';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import * as viewUtils from '../view-utils.js';
import * as mainUtils from '../../utils.js';
import { BLANK_MOVIE, BLANK_COMMENT, BLANK_LOCAL_DATA } from '../../const.js';

const createFilmDetailsTopContainerTemplate = ({filmInfo: movie, userDetails}, isDisabled) => `
    <div class="film-details__inner">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${viewUtils.getPosterURI(movie)}" alt="">

            <p class="film-details__age">${viewUtils.getAgeRating(movie)}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${viewUtils.getTitle(movie)}</h3>
                <p class="film-details__title-original">Original: ${viewUtils.getAlternativeTitle(movie)}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${viewUtils.getRating(movie)}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${viewUtils.getDirector(movie)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${viewUtils.getWriters(movie)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${viewUtils.getActors(movie)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${viewUtils.getFullTDate(viewUtils.getReleaseDateOrNull(movie))}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${viewUtils.humanizeMinutes(viewUtils.getRuntime(movie))}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${viewUtils.getReleaseCountry(movie)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genre${viewUtils.getCommentsQuantity(movie.comments) > 1 ? 's' : ''}</td>
                <td class="film-details__cell">${viewUtils.getGenres(movie)}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${viewUtils.getFullDescription(movie)}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button${viewUtils.getPopupFlagIfActive(userDetails.watchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist"${isDisabled ? ' disabled' : ''}>Add to watchlist</button>
          <button type="button" class="film-details__control-button${viewUtils.getPopupFlagIfActive(userDetails.alreadyWatched)} film-details__control-button--watched" id="watched" name="watched"${isDisabled ? ' disabled' : ''}>Already watched</button>
          <button type="button" class="film-details__control-button${viewUtils.getPopupFlagIfActive(userDetails.favorite)} film-details__control-button--favorite" id="favorite" name="favorite"${isDisabled ? ' disabled' : ''}>Add to favorites</button>
        </section>
      </div>
    </div>`;

const createFilmDetailsCommentTemplate = ({id, author, comment, date, emotion}, isDisabled, isDeleting) => `
          <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="${viewUtils.getEmojieUri(emotion)}" width="55" height="55" alt="emoji-${emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${he.encode(comment)}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${viewUtils.getCommentFullTDateTime(date)}</span>
                <button class="film-details__comment-delete" data-comment-id="${id}"${isDisabled ? ' disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
              </p>
            </div>
          </li>
`;

const createEmotionTemplate = (emotion) => (!emotion) ? '' : `
<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
`;

const createFilmDetailsAddCommentTemplate = ({comment, emotion}, isDisabled, isSaving) => `
          <form class="film-details__new-comment" action="" method="get">
            <div class="film-details__add-emoji-label">${createEmotionTemplate(emotion)}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"${(isDisabled || isSaving) ? ' disabled' : ''}>${(comment) ? comment : ''}</textarea>
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

const createFilmDetailsCommentsContainerTemplate = ({comments, localComment}, isDisabled, isSaving, isDeleting) => {
  const commentsTemplate = [...comments]
    .map((comment) => createFilmDetailsCommentTemplate(comment, isDisabled, isDeleting))
    .join('');

  return `
        <ul class="film-details__comments-list">
          ${commentsTemplate}
          ${createFilmDetailsAddCommentTemplate(localComment, isDisabled, isSaving)}
        </ul>`;
};

const createFilmDetailsBottomContainerTemplate = (comments, isDisabled, isSaving, isDeleting) => `
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${viewUtils.getCommentsQuantity(comments)}</span></h3>
        ${createFilmDetailsCommentsContainerTemplate(comments, isDisabled, isSaving, isDeleting)}
      </section>
    </div>`;

const createFilmDetailsMainContainerTemplate = ({movie, comments, isDisabled, isSaving, isDeleting}) => `
  <section class="film-details">
    ${createFilmDetailsTopContainerTemplate(movie, isDisabled)}
    ${createFilmDetailsBottomContainerTemplate(comments, isDisabled, isSaving, isDeleting)}
  </section>`;

export default class FilmDetailsView extends AbstractStatefulView {
  #updateLocalData = null;
  #metaKey = false;

  constructor(movie = BLANK_MOVIE, comments = [BLANK_COMMENT], localData = BLANK_LOCAL_DATA, updateLocalData) {
    super();
    this._state = FilmDetailsView.parseMovieToState(movie, comments, localData);
    this.#updateLocalData = updateLocalData;
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsMainContainerTemplate(this._state);
  }

  get popupContainerElement() {
    return document.querySelector('body');
  }

  get closeButton() {
    return this.element.querySelector('.film-details__close-btn');
  }

  get watchlistButton() {
    return this.element.querySelector('.film-details__control-button--watchlist');
  }

  get watchedButton() {
    return this.element.querySelector('.film-details__control-button--watched');
  }

  get favoriteButton() {
    return this.element.querySelector('.film-details__control-button--favorite');
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

  setCloseBtnClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.closeButton.addEventListener('click', this.#closeBtnClickExternalHandler);
    document.addEventListener('keydown', this.#keydownExternalHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.watchlistButton.addEventListener('click', this.#watchlistClickExternalHandler);
  };

  setHistoryClickHandler = (callback) => {
    this._callback.historyClick = callback;
    this.watchedButton.addEventListener('click', this.#historyClickExternalHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.favoriteButton.addEventListener('click', this.#favoriteClickExternalHandler);
  };

  setDeleteButtonsClickHandler = (callback) => {
    this._callback.deleteButtonClick = callback;
    [...this.deleteButtons].forEach((button) => {
      button.addEventListener('click', this.#deleteButtonClickExternalHandler);
    });
  };

  setAddCommentHandler = (callback) => {
    this._callback.addCommentClick = callback;
  };

  setScrollPosition = () => {
    this.element.scrollTop = this._state.scrollTop;
  };

  clearHandlers = () => {
    this.#clearExternalHandlers();
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseBtnClickHandler(this._callback.closeClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setHistoryClickHandler(this._callback.historyClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteButtonsClickHandler(this._callback.deleteButtonClick);
    this.setAddCommentHandler(this._callback.addCommentClick);
  };

  #setInnerHandlers = () => {
    this.watchlistButton.addEventListener('click', this.#watchlistToggleHandler);
    this.watchedButton.addEventListener('click', this.#watchedToggleHandler);
    this.favoriteButton.addEventListener('click', this.#favoriteToggleHandler);
    [...this.deleteButtons].forEach((button) => {
      button.addEventListener('click', this.#deleteButtonClickHandler);
    });
    this.emojiContainer.addEventListener('click', this.#emojiClickHandler);
    this.commentInput.addEventListener('input', this.#commentInputHandler);
    this.element.addEventListener('scroll', this.#elementScrollHandler);

    this.setScrollPosition();
  };

  #clearExternalHandlers = () => {
    this.closeButton.removeEventListener('click', this.#closeBtnClickExternalHandler);
    document.removeEventListener('keydown', this.#keydownExternalHandler);
    document.removeEventListener('keyup', this.#keyupExternalHandler);
    this.watchlistButton.removeEventListener('click', this.#watchlistClickExternalHandler);
    this.watchedButton.removeEventListener('click', this.#historyClickExternalHandler);
    this.favoriteButton.removeEventListener('click', this.#favoriteClickExternalHandler);
    [...this.deleteButtons].forEach((button) => {
      button.removeEventListener('click', this.#deleteButtonClickExternalHandler);
    });

    this.#updateLocalData(BLANK_LOCAL_DATA);
  };

  #updateRadioButtons = (evt) => {
    const emojieRadiobuttons = this.emojiContainer.querySelectorAll('.film-details__emoji-item');
    const thisImg = evt.target.closest('.film-details__emoji-label');
    const clickedRadioButton = [...emojieRadiobuttons].find((e) => [...e.labels].includes(thisImg));
    const emotion = clickedRadioButton.value;

    clickedRadioButton.checked = true;

    return emotion;
  };

  #closeBtnClickExternalHandler = (evt) => {
    evt.preventDefault();
    this.#clearExternalHandlers();
    this._callback.closeClick();
  };

  #keydownExternalHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#clearExternalHandlers();
      this._callback.closeClick();

    } else if (evt.key === 'Control') {
      this.#metaKey = true;
      document.addEventListener('keyup', this.#keyupExternalHandler);

    } else if ((evt.key === 'Enter') && (evt.metaKey || this.#metaKey) && (evt.target.classList.contains('film-details__comment-input'))) {
      evt.preventDefault();

      const emotionElement = this.addEmojiContainer.querySelector('img');
      if (!emotionElement) {
        this.shake.apply({element: this.commentInput.closest('.film-details__new-comment')});

      } else {
        const comment = evt.target.value.trim();
        const emotion = emotionElement.alt.slice(6);
        const update = {
          ...BLANK_COMMENT,
          comment,
          emotion,
          id: null,
        };

        this.#clearExternalHandlers();
        this._callback.addCommentClick(update);
      }
    }
  };

  #keyupExternalHandler = (evt) => {
    if (evt.key === 'Control') {
      this.#metaKey = false;
      document.removeEventListener('keyup', this.#keyupExternalHandler);
    }
  };

  #watchlistClickExternalHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #historyClickExternalHandler = (evt) => {
    evt.preventDefault();
    this._callback.historyClick();
  };

  #favoriteClickExternalHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #deleteButtonClickExternalHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteButtonClick(evt.target.dataset.commentId);
  };

  #watchlistToggleHandler = (evt) => {
    evt.preventDefault();

    const movie = FilmDetailsView.parseStateToMovie(this._state);
    this.updateElement({
      movie: {...movie,
        userDetails: {...movie.userDetails,
          watchlist: !movie.userDetails.watchlist
        },
      },
      scrollTop: this.element.scrollTop,
    });

    this.#updateLocalData({
      localComment: {...this._state.comments.localComment},
      scrollTop: this._state.scrollTop
    });
  };

  #watchedToggleHandler = (evt) => {
    evt.preventDefault();

    const movie = FilmDetailsView.parseStateToMovie(this._state);
    const update = {
      movie: {...movie,
        userDetails: {...movie.userDetails,
          alreadyWatched: !movie.userDetails.alreadyWatched
        },
      },
      scrollTop: this.element.scrollTop,
    };

    update.movie.userDetails.watchingDate = FilmDetailsView.updateMovieUserDetailsDate(update);
    this.updateElement(update);

    this.#updateLocalData({
      localComment: {...this._state.comments.localComment},
      scrollTop: this._state.scrollTop
    });
  };

  #favoriteToggleHandler = (evt) => {
    evt.preventDefault();

    const movie = FilmDetailsView.parseStateToMovie(this._state);
    this.updateElement({
      movie: {...movie,
        userDetails: {...movie.userDetails,
          favorite: !movie.userDetails.favorite
        },
      },
      scrollTop: this.element.scrollTop,
    });

    this.#updateLocalData({
      localComment: {...this._state.comments.localComment},
      scrollTop: this._state.scrollTop
    });
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();

    this.#updateLocalData({
      localComment: {...this._state.comments.localComment},
      scrollTop: this._state.scrollTop
    });
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'IMG') {
      const newEmoji = evt.target.cloneNode(true);
      newEmoji.width = '55';
      newEmoji.height = '55';
      newEmoji.alt = evt.target.closest('.film-details__emoji-label').getAttribute('for');

      this.addEmojiContainer.innerHTML = '';
      this.addEmojiContainer.append(newEmoji);

      const emotion = this.#updateRadioButtons(evt);
      this._setState({
        comments: {...this._state.comments,
          localComment: {
            ...this._state.comments.localComment,
            emotion
          },
        },
        scrollTop: this.element.scrollTop,
      });

      this.#updateLocalData({
        localComment: {...this._state.comments.localComment},
        scrollTop: this._state.scrollTop
      });
    }
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      comments: {...this._state.comments,
        localComment: {
          ...this._state.comments.localComment,
          comment: evt.target.value
        },
      },
      scrollTop: this.element.scrollTop,
    });

    this.#updateLocalData({
      localComment: {...this._state.comments.localComment},
      scrollTop: this._state.scrollTop
    });
  };

  #elementScrollHandler = () => {
    this._state.scrollTop = this.element.scrollTop;

    this.#updateLocalData({
      localComment: {...this._state.comments.localComment},
      scrollTop: this._state.scrollTop
    });
  };

  static updateMovieUserDetailsDate = ({movie}) => {
    let watchingDate = movie.userDetails.watchingDate;

    if (!movie.userDetails.alreadyWatched) {
      watchingDate = null;
    } else if (!watchingDate) {
      watchingDate = mainUtils.getNow();
    }

    return watchingDate;
  };

  static parseStateToMovie = ({movie}) => mainUtils.duplicateMovie(movie);

  static parseMovieToState = (movie, comments, localData) => ({
    movie: mainUtils.duplicateMovie(movie),
    comments: {
      comments: [...comments],
      localComment: localData.localComment,
    },
    scrollTop: localData.scrollTop,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });
}
