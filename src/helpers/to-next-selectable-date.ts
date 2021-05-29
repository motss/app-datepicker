import { toUTCDate } from 'nodemod/dist/calendar/helpers/to-utc-date.js';

import { navigationKeySetDayNext, navigationKeySetDayPrevious } from '../constants.js';
import type { InferredFromSet } from '../typings.js';
import { toDateRange } from './to-date-range.js';
import type { ToNextSelectableDateInit } from './typings.js';

export function toNextSelectableDate({
  date,
  disabledDatesSet,
  disabledDaysSet,
  key,
  maxTime,
  minTime,
}: ToNextSelectableDateInit): Date {
  const focusedDateTime = +date;

  let isLessThanMinTime = focusedDateTime < minTime;
  let isMoreThanMaxTime = focusedDateTime > maxTime;

  // Bail when there is no valid date range (< 1 day).
  if (toDateRange(minTime, maxTime) < 864e5) return date;

  let isDisabledDay =
    isLessThanMinTime ||
    isMoreThanMaxTime ||
    disabledDaysSet.has((date as Date).getUTCDay()) ||
    disabledDatesSet.has(focusedDateTime);

  if (!isDisabledDay) return date;

  let selectableDateTime = 0;
  let selectableDate = isLessThanMinTime === isMoreThanMaxTime ?
    date : new Date(isLessThanMinTime ? minTime - 864e5 : 864e5 + maxTime);

  const fy = selectableDate.getUTCFullYear();
  const m = selectableDate.getUTCMonth();
  let d = selectableDate.getUTCDate();

  while (isDisabledDay) {
    if (isLessThanMinTime || (!isMoreThanMaxTime && navigationKeySetDayNext.has(key as InferredFromSet<typeof navigationKeySetDayNext>))) d += 1;
    if (isMoreThanMaxTime || (!isLessThanMinTime && navigationKeySetDayPrevious.has(key as InferredFromSet<typeof navigationKeySetDayPrevious>))) d -= 1;

    selectableDate = toUTCDate(fy, m, d);
    selectableDateTime = +selectableDate;

    if (!isLessThanMinTime) {
      isLessThanMinTime = selectableDateTime < minTime;

      if (isLessThanMinTime) {
        selectableDate = new Date(minTime);
        selectableDateTime = +selectableDate;
        d = selectableDate.getUTCDate();
      }
    }

    if (!isMoreThanMaxTime) {
      isMoreThanMaxTime = selectableDateTime > maxTime;

      if (isMoreThanMaxTime) {
        selectableDate = new Date(maxTime);
        selectableDateTime = +selectableDate;
        d = selectableDate.getUTCDate();
      }
    }

    isDisabledDay =
      disabledDaysSet.has(selectableDate.getUTCDay()) ||
      disabledDatesSet.has(selectableDateTime);
  }

  return selectableDate;
}
