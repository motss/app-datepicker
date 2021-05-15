import { customElement } from 'lit/decorators.js';

import { APP_MONTH_CALENDAR_NAME } from '../constants.js';
import { MonthCalendar } from './month-calendar.js';

@customElement(APP_MONTH_CALENDAR_NAME)
class AppMonthCalendar extends MonthCalendar {}

declare global {
  interface HTMLElementTagNameMap {
    [APP_MONTH_CALENDAR_NAME]: AppMonthCalendar;
  }
}
