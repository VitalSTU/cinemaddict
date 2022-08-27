import * as CONST from './const.js';
import { getRandomElementOrNull } from './mock-utils.js';

export const generateComment = () => ({
  id: 42,
  author: `${getRandomElementOrNull(CONST.names)}`,
  comment: `${getRandomElementOrNull(CONST.longReads)}`,
  date: '2019-05-09T16:13:32.554Z',
  emotion: `${getRandomElementOrNull(CONST.emotions)}`,
});
