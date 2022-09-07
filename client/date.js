import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function toISOString(date) {
  return dayjs(date).utc().toISOString();
}
