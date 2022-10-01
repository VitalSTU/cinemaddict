export const DESCRIPTION_MAX_LENGTH = 140;
export const FILM_CARDS_QUANTITY_TO_SHOW_PER_STEP = 5;

export const MOVIE_CARD_ACTIVE = 'film-card__controls-item--active';
export const MOVIE_DETAILS_ACTIVE = 'film-details__control-button--active';
export const SORT_BUTTON_ACTIVE = 'sort__button--active';

export const BLANK_MOVIE = {
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

export const BLANK_COMMENT = {
  id: null,
  author: null,
  comment: null,
  date: null,
  emotion: null,
};

export const BLANK_LOCAL_DATA = {
  localComment: {
    comment: null,
    emotion: null,
  },
  scrollTop: 0,
};

export const EmojiUri = {
  ANGRY: './images/emoji/angry.png',
  PUKE: './images/emoji/puke.png',
  SLEEPING: './images/emoji/sleeping.png',
  SMILE: './images/emoji/smile.png',
};

export const MovieFilterType = {
  ALL: 'All movies',
  WATCH_LIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
  COMMENTS: 'comments',
};

export const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
