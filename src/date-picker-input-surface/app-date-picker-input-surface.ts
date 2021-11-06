import { customElement } from 'lit/decorators.js';

import { appDatePickerInputSurfaceName } from './constants.js';
import { DatePickerInputSurface } from './date-picker-input-surface.js';


@customElement(appDatePickerInputSurfaceName)
export class AppDatePickerInputSurface extends DatePickerInputSurface {}

declare global {
  interface HTMLElementTagNameMap {
    [appDatePickerInputSurfaceName]: AppDatePickerInputSurface;
  }
}
