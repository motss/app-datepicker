import { customElement } from 'lit/decorators.js';

import { appYearGridButtonName } from './constants.js';
import { YearGridButton } from './year-grid-button.js';


@customElement(appYearGridButtonName)
export class AppYearGridButton extends YearGridButton {}

declare global {
  interface HTMLElementTagNameMap {
    [appYearGridButtonName]: AppYearGridButton;
  }
}
