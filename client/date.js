import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function toUTCDate(date) {
  return dayjs(date).utc().toDate();
}
