import { customElement } from 'lit/decorators.js';

import { RootElement } from '../../root-element/root-element.js';
import {
  baseStyling,
  resetShadowRoot,
  resetTableStyle,
  visuallyHiddenStyle,
} from '../../styles.js';
import { Calendar } from './calendar.js';
import { appCalendarName } from './constants.js';
import { calendarStyles } from './styles.js';

@customElement(appCalendarName)
export class AppCalendar extends Calendar {
  public static override shadowRootOptions = {
    ...RootElement.shadowRootOptions,
    delegatesFocus: true,
  };

  public static override styles = [
    resetShadowRoot,
    resetTableStyle,
    baseStyling,
    visuallyHiddenStyle,
    calendarStyles,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [appCalendarName]: AppCalendar;
  }
}
