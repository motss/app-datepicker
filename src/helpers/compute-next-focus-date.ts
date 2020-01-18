import { toUTCDate } from 'nodemod/dist/calendar/to-utc-date.js';
import { NEXT_KEY_CODES_SET, PREV_KEY_CODES_SET } from '../CONSTANT.js';
import { KEY_CODES_MAP } from '../custom_typings.js';
import { getNextSelectableDate } from './get-selectable-date.js';

interface ParamsComputeNextFocusedDate {
  hasAltKey: boolean;
  keyCode: KeyboardEvent['keyCode'];
  focusedDate: Date;
  selectedDate: Date;
  disabledDaysSet: Set<number>;
  disabledDatesSet: Set<number>;
  minTime: number;
  maxTime: number;
}

export function computeNextFocusedDate({
  hasAltKey,
  keyCode,
  focusedDate,
  selectedDate,
  disabledDaysSet,
  disabledDatesSet,
  minTime,
  maxTime,
}: ParamsComputeNextFocusedDate) {
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
  const oldFy = focusedDate.getUTCFullYear();
  const oldM = focusedDate.getUTCMonth();
  const oldD = focusedDate.getUTCDate();
  const focusedDateTime = +focusedDate;

  const sdFy = selectedDate.getUTCFullYear();
  const sdM = selectedDate.getUTCMonth();

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
      keyCode === KEY_CODES_MAP.PAGE_DOWN ||
      keyCode === KEY_CODES_MAP.PAGE_UP ||
      keyCode === KEY_CODES_MAP.END;
  }

  switch (shouldRunSwitch) {
    case focusedDateTime === minTime && PREV_KEY_CODES_SET.has(keyCode):
    case focusedDateTime === maxTime && NEXT_KEY_CODES_SET.has(keyCode):
      break;
    case keyCode === KEY_CODES_MAP.ARROW_UP: {
      d -= 7;
      break;
    }
    case keyCode === KEY_CODES_MAP.ARROW_DOWN: {
      d += 7;
      break;
    }
    case keyCode === KEY_CODES_MAP.ARROW_LEFT: {
      d -= 1;
      break;
    }
    case keyCode === KEY_CODES_MAP.ARROW_RIGHT: {
      d += 1;
      break;
    }
    case keyCode === KEY_CODES_MAP.PAGE_DOWN: {
      hasAltKey ? fy += 1 : m += 1;
      break;
    }
    case keyCode === KEY_CODES_MAP.PAGE_UP: {
      hasAltKey ? fy -= 1 : m -= 1;
      break;
    }
    case keyCode === KEY_CODES_MAP.END: {
      m += 1;
      d = 0;
      break;
    }
    case keyCode === KEY_CODES_MAP.HOME:
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
  if (keyCode === KEY_CODES_MAP.PAGE_DOWN || keyCode === KEY_CODES_MAP.PAGE_UP) {
    const totalDaysOfMonth = toUTCDate(fy, m + 1, 0).getUTCDate();
    if (d > totalDaysOfMonth) {
      d = totalDaysOfMonth;
    }
  }

  /** Get next selectable focused date */
  const newFocusedDate = getNextSelectableDate({
    keyCode,
    maxTime,
    minTime,
    disabledDaysSet,
    disabledDatesSet,
    focusedDate: toUTCDate(fy, m, d),
  });

  return newFocusedDate;
}
