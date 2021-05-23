import { toUTCDate } from 'nodemod/dist/calendar/helpers/to-utc-date.js';

import { keyCodesRecord, navigationKeyCodeSet } from '../constants.js';
import type { SupportedKeyCode } from '../typings.js';
import { toNextSelectableDate } from './to-next-selectable-date.js';
import type { ComputeNextSelectedDateInit as ComputeNextSelectedDateInit } from './typings.js';

const {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  END,
  HOME,
  PAGE_DOWN,
  PAGE_UP,
} = keyCodesRecord;

export function computeNextSelectedDate({
  currentDate,
  date,
  disabledDatesSet,
  disabledDaysSet,
  hasAltKey,
  keyCode,
  maxTime,
  minTime,
}: ComputeNextSelectedDateInit): Date {
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
  const oldFy = currentDate.getUTCFullYear();
  const oldM = currentDate.getUTCMonth();
  const oldD = currentDate.getUTCDate();
  const focusedDateTime = +currentDate;

  const sdFy = date.getUTCFullYear();
  const sdM = date.getUTCMonth();

  const notInCurrentMonth = sdM !== oldM || sdFy !== oldFy;

  let fy = oldFy;
  let m = oldM;
  let d = oldD;
  let shouldRunSwitch = true;

  // If the focused date is not in the current month, focus the first day of the month
  // Only run switch case, when one of the following keys is pressed:
  // * PageDown (w/ or w/o Alt)
  // * PageUp (w/ or w/o Alt)
  // * End
  if (notInCurrentMonth) {
    fy = sdFy;
    m = sdM;
    d = 1;

    shouldRunSwitch =
      keyCode === PAGE_DOWN ||
      keyCode === PAGE_UP ||
      keyCode === END;
  }

  switch (shouldRunSwitch) {
    case focusedDateTime === minTime && (navigationKeyCodeSet.dayPrevious as Set<SupportedKeyCode>).has(keyCode):
    case focusedDateTime === maxTime && (navigationKeyCodeSet.dayNext as Set<SupportedKeyCode>).has(keyCode):
      break;
    case keyCode === ARROW_UP: {
      d -= 7;
      break;
    }
    case keyCode === ARROW_DOWN: {
      d += 7;
      break;
    }
    case keyCode === ARROW_LEFT: {
      d -= 1;
      break;
    }
    case keyCode === ARROW_RIGHT: {
      d += 1;
      break;
    }
    case keyCode === PAGE_DOWN: {
      hasAltKey ? fy += 1 : m += 1;
      break;
    }
    case keyCode === PAGE_UP: {
      hasAltKey ? fy -= 1 : m -= 1;
      break;
    }
    case keyCode === END: {
      m += 1;
      d = 0;
      break;
    }
    case keyCode === HOME:
    default: {
      d = 1;
    }
  }

  /**
   * NOTE(motss): When updating month and year, check if the value of day exceeds
   * the total days of the updated date. If true, then focus the last day of the new month.
   * This also applies to the following cases:
   *
   * - `2020-01-31` -> next month -> `2020-02-31` (invalid) -> fallback to `2020-02-29`
   * - `2020-02-29` -> next year -> `2021-02-29` (invalid) -> fallback to `2021-02-28`
   */
  if (keyCode === PAGE_DOWN || keyCode === PAGE_UP) {
    const totalDaysOfMonth = toUTCDate(fy, m + 1, 0).getUTCDate();
    if (d > totalDaysOfMonth) {
      d = totalDaysOfMonth;
    }
  }

  /** Get next selectable focused date */
  const nextSelectableDate = toNextSelectableDate({
    date: toUTCDate(fy, m, d),
    disabledDatesSet,
    disabledDaysSet,
    keyCode,
    maxTime,
    minTime,
  });

  return nextSelectableDate;
}
