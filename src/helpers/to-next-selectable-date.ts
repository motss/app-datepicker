import { toUTCDate } from 'nodemod/dist/calendar/helpers/to-utc-date.js';

import { navigationKeyCodeSet } from '../constants.js';
import type { SupportedKeyCode } from '../typings.js';
import { toDateRange } from './to-date-range.js';
import type { ToNextSelectableDateInit } from './typings.js';

export function toNextSelectableDate({
  keyCode,
  disabledDaysSet,
  disabledDatesSet,
  focusedDate,
  maxTime,
  minTime,
}: ToNextSelectableDateInit): Date {
  const focusedDateTime = +focusedDate;

  let isLessThanMinTime = focusedDateTime < minTime;
  let isMoreThanMaxTime = focusedDateTime > maxTime;

  // Bail when there is no valid date range (< 1 day).
  if (toDateRange(minTime, maxTime) < 864e5) return focusedDate;

  let isDisabledDay =
    isLessThanMinTime ||
    isMoreThanMaxTime ||
    disabledDaysSet.has((focusedDate as Date).getUTCDay()) ||
    disabledDatesSet.has(focusedDateTime);

  if (!isDisabledDay) return focusedDate;

  let selectableFocusedDateTime = 0;
  let selectableFocusedDate = isLessThanMinTime === isMoreThanMaxTime ?
    focusedDate : new Date(isLessThanMinTime ? minTime - 864e5 : 864e5 + maxTime);

  const fy = selectableFocusedDate.getUTCFullYear();
  const m = selectableFocusedDate.getUTCMonth();
  let d = selectableFocusedDate.getUTCDate();

  while (isDisabledDay) {
    if (isLessThanMinTime || (!isMoreThanMaxTime && (navigationKeyCodeSet.dayNext as Set<SupportedKeyCode>).has(keyCode))) d += 1;
    if (isMoreThanMaxTime || (!isLessThanMinTime && (navigationKeyCodeSet.dayPrevious as Set<SupportedKeyCode>).has(keyCode))) d -= 1;

    selectableFocusedDate = toUTCDate(fy, m, d);
    selectableFocusedDateTime = +selectableFocusedDate;

    if (!isLessThanMinTime) {
      isLessThanMinTime = selectableFocusedDateTime < minTime;

      if (isLessThanMinTime) {
        selectableFocusedDate = new Date(minTime);
        selectableFocusedDateTime = +selectableFocusedDate;
        d = selectableFocusedDate.getUTCDate();
      }
    }

    if (!isMoreThanMaxTime) {
      isMoreThanMaxTime = selectableFocusedDateTime > maxTime;

      if (isMoreThanMaxTime) {
        selectableFocusedDate = new Date(maxTime);
        selectableFocusedDateTime = +selectableFocusedDate;
        d = selectableFocusedDate.getUTCDate();
      }
    }

    isDisabledDay =
      disabledDaysSet.has(selectableFocusedDate.getUTCDay()) ||
      disabledDatesSet.has(selectableFocusedDateTime);
  }

  return selectableFocusedDate;
}
