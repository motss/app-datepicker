import { customElement } from 'lit/decorators.js';

import { Calendar } from './calendar.js';
import { appCalendarName } from './constants.js';

@customElement(appCalendarName)
export class AppCalendar extends Calendar {}

declare global {
  interface HTMLElementTagNameMap {
    [appCalendarName]: AppCalendar;
  }
}
