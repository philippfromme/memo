const { toUTCDate } = require('./date');

module.exports.createCard = function createCard(options = {}) {
  return {
    front: "",
    back: "",
    description: "",
    sourceLanguage: "de",
    targetLanguage: "sv",
    tags: [],
    level: 0,
    dueDate: toUTCDate(),
    created: toUTCDate(),
    modified: toUTCDate(),
    ...options,
  };
};

module.exports.createDeck = function createDeck(options = {}) {
  return {
    name: "",
    description: "",
    sourceLanguage: "de",
    targetLanguage: "sv",
    created: toUTCDate(),
    modified: toUTCDate(),
    ...options,
  };
};
