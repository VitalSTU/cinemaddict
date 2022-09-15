import * as CONST from './const.js';
import { getRandomElementOrNull, getRandomDate } from './mock-utils.js';

export const generateComment = () => ({
  id: 42,
  author: `${getRandomElementOrNull(CONST.names)}`,
  comment: `${getRandomElementOrNull(CONST.longReads)}`,
  date: `${getRandomDate()}`,
  emotion: `${getRandomElementOrNull(CONST.emotions)}`,
});
