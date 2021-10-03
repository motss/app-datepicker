import { customElement } from 'lit/decorators.js';

import { appMonthCalendarName } from './constants.js';
import { MonthCalendar } from './month-calendar.js';

@customElement(appMonthCalendarName)
export class AppMonthCalendar extends MonthCalendar {}

declare global {
  interface HTMLElementTagNameMap {
    [appMonthCalendarName]: AppMonthCalendar;
  }
}
