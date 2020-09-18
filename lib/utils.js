const SteamID = require('steamid');

const getId64 = (steamid) => new SteamID(String(steamid)).getSteamID64();

const cleansay = (str) => str
  .replace('ä', 'a')
  .replace('ö', 'o')
// eslint-disable-next-line no-control-regex
  .replace(/[^A-Za-z0-9\(\)\[\]:<>.?! \-_,\x06\x10\x05\x0e\x0f\x08]/g, '');

const shuffle = (arrayToBeShuffled) => {
  const array = arrayToBeShuffled;

  let currentIndex = array.length; let temporaryValue; let
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const getRandom = (arr) => shuffle(arr)[0];

module.exports = {
  getId64,
  cleansay,
  getRandom,
};
