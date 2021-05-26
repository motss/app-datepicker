import { toResolvedDate } from './helpers/to-resolved-date.js';
import type { CalendarViewTuple } from './typings.js';

//#region constants
export const APP_DATE_PICKER_DIALOG_NAME = 'app-date-picker-dialog';
export const APP_DATE_PICKER_INPUT_NAME = 'app-date-picker-input';
export const DEFAULT_LOCALE = 'en-US';
export const MAX_DATE = toResolvedDate('2100-12-31');
export const ONE_DAY_IN_SECONDS = 864e5;
//#endregion constants

export const calendarViews: CalendarViewTuple = [
  'calendar',
  'yearGrid',
];

export const DateTimeFormat = Intl.DateTimeFormat;

export const keyCodesRecord = {
  // CTRL: 17,
  // ALT: 18,
  ESCAPE: 27,
  SHIFT: 16,
  TAB: 9,
  ENTER: 13,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
} as const;

export const navigationKeyCodes = {
  next: [
    keyCodesRecord.ARROW_DOWN,
    keyCodesRecord.PAGE_DOWN,
    keyCodesRecord.END,
  ],
  previous: [
    keyCodesRecord.ARROW_UP,
    keyCodesRecord.PAGE_UP,
    keyCodesRecord.HOME,
  ],
} as const;

export const navigationKeyCodeSet = {
  all: new Set([
    ...navigationKeyCodes.next,
    ...navigationKeyCodes.previous,
    keyCodesRecord.ARROW_LEFT,
    keyCodesRecord.ARROW_RIGHT,
  ]),
  dayNext: new Set([keyCodesRecord.ARROW_RIGHT, ...navigationKeyCodes.next]),
  dayPrevious: new Set([keyCodesRecord.ARROW_LEFT, ...navigationKeyCodes.previous]),
} as const;

export const calendarKeyCodeSet = new Set([
  ...navigationKeyCodeSet.all,
  keyCodesRecord.ENTER,
  keyCodesRecord.SPACE,
]);

export const yearGridKeyCodeSet = new Set([
  keyCodesRecord.ARROW_DOWN,
  keyCodesRecord.ARROW_LEFT,
  keyCodesRecord.ARROW_RIGHT,
  keyCodesRecord.ARROW_UP,
  keyCodesRecord.END,
  keyCodesRecord.ENTER,
  keyCodesRecord.HOME,
  keyCodesRecord.SPACE,
]);
