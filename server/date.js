const dayjs = require("dayjs");

const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

module.exports.toUTCDate = function (date) {
  return dayjs(date).utc().toDate();
};
