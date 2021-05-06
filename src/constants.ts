import { toResolvedDate } from './helpers/to-resolved-date.js';
import type { CalendarViewTuple } from './typings.js';

export const APP_DATEPICKER_NAME = 'app-date-picker';

export const APP_DATEPICKER_DIALOG_NAME = 'app-date-picker-dialog';

export const APP_DATEPICKER_INPUT_NAME = 'app-date-picker-input';

export const calendarViews: CalendarViewTuple = [
  'calendar',
  'yearList',
];

export const DateTimeFormat = Intl.DateTimeFormat;

export const defaultLocale = 'en-US';

export const MAX_DATE = toResolvedDate('2100-12-31');