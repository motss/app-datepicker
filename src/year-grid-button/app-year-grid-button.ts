import { customElement } from 'lit/decorators.js';

import { APP_YEAR_GRID_BUTTON_NAME } from './constants.js';
import { YearGridButton } from './year-grid-button.js';


@customElement(APP_YEAR_GRID_BUTTON_NAME)
export class AppYearGridButton extends YearGridButton {}

declare global {
  interface HTMLElementTagNameMap {
    [APP_YEAR_GRID_BUTTON_NAME]: AppYearGridButton;
  }
}
