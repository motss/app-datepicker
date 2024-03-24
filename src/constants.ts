import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { nothing } from 'lit';

import {
  keyArrowDown,
  keyArrowLeft,
  keyArrowRight,
  keyArrowUp,
  keyEnd,
  keyEnter,
  keyHome,
  keyPageDown,
  keyPageUp,
  keySpace,
} from './key-values.js';

export const confirmKeySet = new Set([keyEnter, keySpace]);
export const DateTimeFormat = Intl.DateTimeFormat;
export const emptyReadonlyArray: readonly unknown[] = [];
export const labelChooseMonth = 'Choose month' as const;
export const labelChooseYear = 'Choose year' as const;
export const labelConfirm = 'OK' as const;
export const labelDeny = 'Cancel' as const;
export const labelMonthMenuItemTemplate = 'current month is %s' as const;
export const labelNextMonth = 'Next month' as const;
export const labelNextYear = 'Next year' as const;
export const labelPreviousMonth = 'Previous month' as const;
export const labelPreviousYear = 'Previous year' as const;
export const labelSelectDate = 'Select date' as const;
export const labelSelectedDate = 'Selected date' as const;
export const labelSelectedMonthMenuItemTemplate =
  'selected month is %s' as const;
export const labelSelectedYearMenuItemTemplate = 'selected year is %s' as const;
export const labelShortWeek = 'Wk' as const;
export const labelShowCalendar = 'Show calendar' as const;
export const labelSupportingText = 'YYYY-MM-DD';
export const labelToday = 'Today' as const;
export const labelWeek = 'Week' as const;
export const labelYearMenuItemTemplate = 'current year is %s' as const;
export const selectedYearTemplate = 'Selected year is %s' as const;
export const toyearTemplate = 'Toyear is %s' as const;
export const MAX_DATE = fromPartsToUtcDate(2100, 11, 31);
export const MIN_DATE = fromPartsToUtcDate(1900, 1, 1);
export const navigationKeyListNext = [keyArrowDown, keyPageDown, keyEnd];
export const navigationKeyListPrevious = [keyArrowUp, keyPageUp, keyHome];
export const navigationKeySetDayNext = new Set([
  ...navigationKeyListNext,
  keyArrowRight,
]);
export const navigationKeySetDayPrevious = new Set([
  ...navigationKeyListPrevious,
  keyArrowLeft,
]);
export const navigationKeySetGrid = new Set([
  ...navigationKeySetDayNext,
  ...navigationKeySetDayPrevious,
]);
export const startViews = ['calendar', 'yearGrid'] as const;
export const weekNumberTemplate = 'Week %s' as const;
export const noop = () => {
  /** no-op */
};
export const renderNoop: () => typeof nothing = () => nothing;

export const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
  weekday: 'short',
};
export const dayFormatOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  timeZone: 'UTC',
};
export const fullDateFormatOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
};
export const longMonthYearFormatOptions: Intl.DateTimeFormatOptions = {
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
};
export const longWeekDayFormatOptions: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
  weekday: 'long',
};
export const longMonthFormatOptions: Intl.DateTimeFormatOptions = {
  month: 'long',
  timeZone: 'UTC',
};
export const narrowWeekDayFormatOptions: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
  weekday: 'narrow',
};
export const shortMonthFormatOptions: Intl.DateTimeFormatOptions = {
  month: 'short',
  timeZone: 'UTC',
};
export const yearFormatOptions: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
  year: 'numeric',
};
