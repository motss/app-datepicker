import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';

import { type navigationKeyListNext, navigationKeySetDayNext, navigationKeySetDayPrevious } from '../constants.js';
import { keyArrowDown, keyArrowLeft, keyArrowRight, keyArrowUp, keyEnd, keyHome, keyPageDown, keyPageUp } from '../key-values.js';
import type { InferredFromSet } from '../typings.js';
import { toNextSelectableDate } from './to-next-selectable-date.js';
import type { ToNextSelectedDateInit } from './typings.js';

export function toNextSelectedDate({
  currentDate,
  date,
  disabledDatesSet,
  disabledDaysSet,
  hasAltKey,
  key,
  maxTime,
  minTime,
}: ToNextSelectedDateInit): Date {
  /**
   * To update focused date,
   *
   *   1. Checks if focused date is not in the same month, skip update by focusing 1st selectable
   *      day of the new focused month. Continue at `Step 4.`.
   *   2. Checks if current focused date is either `min` or `max` then bails out immediately.
   *   3. Compute new focused date based on key pressed.
   *        a. `UP` - `d -= 7`
   *        b. `DOWN` - `d += 7`
   *        c. `LEFT` - `d -= 1`
   *        d. `RIGHT` - `d += 1`
   *        e. `PAGE_DOWN` - `m += 1`
   *        f. `PAGE_UP` - `m -= 1`
   *        g. `Alt` + `PAGE_DOWN` - `fy += 1`
   *        h. `Alt` + `PAGE_UP` - `fy -= 1`
   *        i. `END` - `m += 1; d = 0`
   *        j. `HOME` - `d = 1`
   *   4. Compute selectable date based on new focused date with `while` loop for any disabled date:
   *        a. UP, RIGHT, PAGE_UP, Alt + PAGE_UP - `d += 1`
   *        b. DOWN, LEFT, PAGE_DOWN, Alt + PAGE_DOWN - `d -= 1`
   *        c. If new focused date is either `min` or `max`, reverse order `d += 1` -> `d -= 1` and
   *         continue the loop until new selectable focused date.
   */
  const dateFullYear = date.getUTCFullYear();
  const dateMonth = date.getUTCMonth();
  const dateDate = date.getUTCDate();
  const dateTime = +date;

  const currentDateFullYear = currentDate.getUTCFullYear();
  const currentDateMonth = currentDate.getUTCMonth();

  const notInCurrentMonth = currentDateMonth !== dateMonth || currentDateFullYear !== dateFullYear;

  let fy = dateFullYear;
  let m = dateMonth;
  let d = dateDate;
  let shouldRunSwitch = true;

  // If the focused date is not in the current month, focus the first day of the month
  // Only run switch case, when one of the following keys is pressed:
  // * PageDown (w/ or w/o Alt)
  // * PageUp (w/ or w/o Alt)
  // * End
  if (notInCurrentMonth) {
    fy = currentDateFullYear;
    m = currentDateMonth;
    d = 1;

    shouldRunSwitch =
      key === keyPageDown ||
      key === keyPageUp ||
      key === keyEnd;
  }

  switch (shouldRunSwitch) {
    case dateTime === minTime && navigationKeySetDayPrevious.has(key as InferredFromSet<typeof navigationKeySetDayPrevious>):
    case dateTime === maxTime && navigationKeySetDayNext.has(key as InferredFromSet<typeof navigationKeyListNext>):
      break;
    case key === keyArrowUp: {
      d -= 7;
      break;
    }
    case key === keyArrowDown: {
      d += 7;
      break;
    }
    case key === keyArrowLeft: {
      d -= 1;
      break;
    }
    case key === keyArrowRight: {
      d += 1;
      break;
    }
    case key === keyPageDown: {
      hasAltKey ? fy += 1 : m += 1;
      break;
    }
    case key === keyPageUp: {
      hasAltKey ? fy -= 1 : m -= 1;
      break;
    }
    case key === keyEnd: {
      m += 1;
      d = 0;
      break;
    }
    case key === keyHome: {
      d = 1;
      break;
    }
    default:
  }

  /**
   * NOTE(motss): When updating month and year, check if the value of day exceeds
   * the total days of the updated date. If true, then focus the last day of the new month.
   * This also applies to the following cases:
   *
   * - `2020-01-31` -> next month -> `2020-02-31` (invalid) -> fallback to `2020-02-29`
   * - `2020-02-29` -> next year -> `2021-02-29` (invalid) -> fallback to `2021-02-28`
   */
  if (key === keyPageDown || key === keyPageUp) {
    const totalDaysOfMonth = fromPartsToUtcDate(fy, m + 1, 0).getUTCDate();
    if (d > totalDaysOfMonth) {
      d = totalDaysOfMonth;
    }
  }

  /** Get next selectable focused date */
  const nextSelectableDate = toNextSelectableDate({
    date: fromPartsToUtcDate(fy, m, d),
    disabledDatesSet,
    disabledDaysSet,
    key,
    maxTime,
    minTime,
  });

  return nextSelectableDate;
}
