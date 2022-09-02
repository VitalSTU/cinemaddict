import * as CONST from './const.js';
import { getRandomInteger, getRandomElementOrNull } from './mock-utils.js';

const BOOLEAN_MAX_INTEGER_EQUIVALENT = 1;
const MAX_RATING = 10;
const MAX_AGE = 18;
const MIN_RUNTIME = 60;
const MAX_RUNTIME = 180;

export const generateMovie = () => {
  const comments = Array.from(
    new Set(
      Array.from( {length: getRandomInteger(CONST.COMMENT_TEST_CARDS_QUANTITY - 1)},
        () => getRandomInteger(CONST.COMMENT_TEST_CARDS_QUANTITY - 1)
      )
    )
  );

  return {
    id: 0,
    comments,
    filmInfo: {
      title: `${getRandomElementOrNull(CONST.movies)}`,
      alternativeTitle: `${getRandomElementOrNull(CONST.movies)}`,
      totalRating: getRandomInteger(MAX_RATING * MAX_RATING) / MAX_RATING,
      poster: `images/posters/${getRandomElementOrNull(CONST.posters)}`,
      ageRating: getRandomInteger(MAX_AGE),
      director: `${getRandomElementOrNull(CONST.names)}`,
      writers: [
        `${getRandomElementOrNull(CONST.names)}`, `${getRandomElementOrNull(CONST.names)}`,
      ],
      actors: [
        `${getRandomElementOrNull(CONST.names)}`, `${getRandomElementOrNull(CONST.names)}`, `${getRandomElementOrNull(CONST.names)}`,
      ],
      release: {
        date: '2019-05-08T00:00:00.000Z',
        releaseCountry: 'Finland'
      },
      runtime: getRandomInteger(MIN_RUNTIME, MAX_RUNTIME),
      genre: [
        'Comedy'
      ],
      description: `${getRandomElementOrNull(CONST.longReads)}`,
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(BOOLEAN_MAX_INTEGER_EQUIVALENT)),
      alreadyWatched: getRandomInteger(BOOLEAN_MAX_INTEGER_EQUIVALENT),
      watchingDate: '2019-04-12T16:12:32.554Z',
      favorite: getRandomInteger(BOOLEAN_MAX_INTEGER_EQUIVALENT),
    }
  };
};
