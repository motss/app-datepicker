import { toUTCDate } from 'nodemod/dist/calendar/to-utc-date.js';
import { NEXT_DAY_KEY_CODES_SET, PREV_DAY_KEY_CODES_SET } from '../constants.js';

interface ParamsGetNextSelectableDate {
  keyCode: KeyboardEvent['keyCode'];
  disabledDaysSet: Set<number>;
  disabledDatesSet: Set<number>;
  focusedDate: Date;
  maxTime: number;
  minTime: number;
}

export function getNextSelectableDate({
  keyCode,
  disabledDaysSet,
  disabledDatesSet,
  focusedDate,
  maxTime,
  minTime,
}: ParamsGetNextSelectableDate) {
  const focusedDateTime = +focusedDate;
  let isLessThanMinTime = focusedDateTime < minTime;
  let isMoreThanMaxTime = focusedDateTime > maxTime;

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
    if (isLessThanMinTime || (!isMoreThanMaxTime && NEXT_DAY_KEY_CODES_SET.has(keyCode))) d += 1;
    if (isMoreThanMaxTime || (!isLessThanMinTime && PREV_DAY_KEY_CODES_SET.has(keyCode))) d -= 1;

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
