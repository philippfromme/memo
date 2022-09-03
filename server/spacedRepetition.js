const dayjs = require("dayjs");

module.exports.isPaused = function(card) {
  const { paused = false } = card;

  return paused;
};