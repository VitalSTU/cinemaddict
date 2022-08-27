import * as CONST from './const.js';
import { getRandomInteger, getRandomElementOrNull } from './mock-utils.js';

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
      totalRating: 5.3,
      poster: 'images/posters/the-dance-of-life.jpg',
      ageRating: 0,
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
      runtime: 77,
      genre: [
        'Comedy'
      ],
      description: `${getRandomElementOrNull(CONST.longReads)}`,
    },
    userDetails: {
      watchlist: false,
      alreadyWatched: true,
      watchingDate: '2019-04-12T16:12:32.554Z',
      favorite: false
    }
  };
};
