const getRandomInteger = (a, b) => {
  let min = a;
  let max = b;

  if (b === undefined) {
    min = 0;
    max = a;
  } else if (a === undefined) {
    min = 0;
    max = 1;
  }

  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomElementOrNull = (array) => (!array || !array.length)
  ? null
  : array[getRandomInteger(array.length - 1)];

export {
  getRandomInteger,
  getRandomElementOrNull,
};
