import * as viewUtils from '../view-utils.js';
import * as mainUtils from '../../utils.js';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const BLANK_MOVIE = {
  id: null,
  comments: null,
  filmInfo: {
    title: null,
    alternativeTitle: null,
    totalRating: null,
    poster: null,
    ageRating: null,
    director: null,
    writers: null,
    actors: null,
    release: {
      date: null,
      releaseCountry: null,
    },
    runtime: null,
    genre: null,
    description: null,
  },
  userDetails: {
    watchlist: false,
    alreadyWatched: false,
    watchingDate: null,
    favorite: false,
  },
};

const BLANK_COMMENT = {
  id: null,
  author: null,
  comment: null,
  date: null,
  emotion: null,
};

const BLANK_LOCAL_DATA = {
  localComment: {
    comment: null,
    emotion: null,
  },
  scrollTop: 0,
};

const createFilmDetailsTopContainerTemplate = ({filmInfo: movie, userDetails}) => `
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
          <button type="button" class="film-details__control-button${viewUtils.getPopupFlagIfActive(userDetails.watchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button${viewUtils.getPopupFlagIfActive(userDetails.alreadyWatched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button${viewUtils.getPopupFlagIfActive(userDetails.favorite)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>
    </div>`;

const createFilmDetailsCommentTemplate = ({id, author, comment, date, emotion}) => `
          <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="${viewUtils.getEmojieUri(emotion)}" width="55" height="55" alt="emoji-${emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${viewUtils.getCommentFullTDateTime(date)}</span>
                <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
              </p>
            </div>
          </li>
`;

const createEmotionTemplate = (emotion) => (!emotion) ? '' : `
<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
`;

const createFilmDetailsAddCommentTemplate = ({comment, emotion}) => `
          <form class="film-details__new-comment" action="" method="get">
            <div class="film-details__add-emoji-label">${createEmotionTemplate(emotion)}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${(comment) ? comment : ''}</textarea>
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

const createFilmDetailsCommentsContainerTemplate = ({comments, localComment}) => {
  const commentsTemplate = [...comments]
    .map((comment) => createFilmDetailsCommentTemplate(comment))
    .join('');

  return `
        <ul class="film-details__comments-list">
          ${commentsTemplate}
          ${createFilmDetailsAddCommentTemplate(localComment)}
        </ul>`;
};

const createFilmDetailsBottomContainerTemplate = (comments) => `
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${viewUtils.getCommentsQuantity(comments)}</span></h3>
        ${createFilmDetailsCommentsContainerTemplate(comments)}
      </section>
    </div>`;

const createFilmDetailsMainContainerTemplate = ({movie, comments}) => `
  <section class="film-details">
    ${createFilmDetailsTopContainerTemplate(movie)}
    ${createFilmDetailsBottomContainerTemplate(comments)}
  </section>`;

export default class FilmDetailsMainContainerView extends AbstractStatefulView {
  constructor(movie = BLANK_MOVIE, comments = [BLANK_COMMENT], localData = BLANK_LOCAL_DATA) {
    super();
    this._state = FilmDetailsMainContainerView.parseMovieToState(movie, comments, localData);
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
    this.closeButton.addEventListener('click', this.#onCloseBtnClick);
    document.addEventListener('keydown', this.#onKeydown);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.watchlistButton.addEventListener('click', this.#onWatchlistClick);
  };

  setHistoryClickHandler = (callback) => {
    this._callback.historyClick = callback;
    this.watchedButton.addEventListener('click', this.#onHistoryClick);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.favoriteButton.addEventListener('click', this.#onFavoriteClick);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseBtnClickHandler(this._callback.closeClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setHistoryClickHandler(this._callback.historyClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  #setScrollPosition = () => {
    this.element.scrollTop = this._state.scrollTop;
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

    this.#setScrollPosition();
  };

  #clearExternalListeners = () => {
    this.closeButton.removeEventListener('click', this.#onCloseBtnClick);
    document.removeEventListener('keydown', this.#onKeydown);
    this.watchlistButton.removeEventListener('click', this.#onWatchlistClick);
    this.watchedButton.removeEventListener('click', this.#onHistoryClick);
    this.favoriteButton.removeEventListener('click', this.#onFavoriteClick);
  };

  #updateRadioButtons = (evt) => {
    const emojieRadiobuttons = this.emojiContainer.querySelectorAll('.film-details__emoji-item');
    const thisImg = evt.target.closest('.film-details__emoji-label');
    const clickedRadioButton = [...emojieRadiobuttons].find((e) => [...e.labels].includes(thisImg));
    const emotion = clickedRadioButton.value;

    clickedRadioButton.checked = true;

    return emotion;
  };

  #onCloseBtnClick = (evt) => {
    evt.preventDefault();
    this.#clearExternalListeners();
    this._callback.closeClick();
  };

  #onKeydown = (evt) => {
    if (evt.key === 'Escape') {
      this.#clearExternalListeners();
      this._callback.closeClick();
    }
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #onHistoryClick = (evt) => {
    evt.preventDefault();
    this._callback.historyClick();
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #watchlistToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      movie: {...this._state.movie,
        userDetails: {...this._state.movie.userDetails,
          watchlist: !this._state.movie.userDetails.watchlist
        },
      },
      scrollTop: this.element.scrollTop,
    });
  };

  #watchedToggleHandler = (evt) => {
    evt.preventDefault();

    const update = {
      movie: {...this._state.movie,
        userDetails: {...this._state.movie.userDetails,
          alreadyWatched: !this._state.movie.userDetails.alreadyWatched
        },
      },
      scrollTop: this.element.scrollTop,
    };

    update.movie.userDetails.watchingDate = FilmDetailsMainContainerView
      .updateMovieUserDetailsDate(update);
    this.updateElement(update);
  };

  #favoriteToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      movie: {...this._state.movie,
        userDetails: {...this._state.movie.userDetails,
          favorite: !this._state.movie.userDetails.favorite
        },
      },
      scrollTop: this.element.scrollTop,
    });
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();

    const idToDelete = parseInt(evt.target.dataset.commentId, 10);
    this.updateElement({
      movie: {...this._state.movie,
        comments: [...this._state.movie.comments.filter((c) => c !== idToDelete)],
      },
      comments: {...this._state.comments,
        comments: [...this._state.comments.comments.filter((c) => c.id !== idToDelete)],
      },
      scrollTop: this.element.scrollTop,
    });
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
        comments: {...this._state.comments,
          localComment: {
            ...this._state.comments.localComment,
            emotion
          },
        },
        scrollTop: this.element.scrollTop,
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

  static parseMovieToState = (movie, comments, localData) => ({
    movie: {...movie,
      filmInfo: {...movie.filmInfo, release: {...movie.filmInfo.release}},
      userDetails: {...movie.userDetails},
    },
    comments: {
      comments: [...comments],
      localComment: localData.localComment,
    },
    scrollTop: localData.scrollTop,
  });
}
