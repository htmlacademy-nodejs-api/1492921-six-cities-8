const generateRandomValue = (min:number, max: number, numAfterDigit = 0) =>
  +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);

const getRandomItems = <T>(items: T[] | readonly T[], count?: number):T[] =>
  items.toSorted(() => 0.5 - Math.random()).slice(0, count ?? generateRandomValue(1, items.length));

const getRandomItem = <T>(items: T[] | readonly T[]):T =>
  items[generateRandomValue(0, items.length - 1)];

export {generateRandomValue, getRandomItems, getRandomItem};
