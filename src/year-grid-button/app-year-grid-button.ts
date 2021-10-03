import { customElement } from 'lit/decorators.js';

import { appYearGridName } from './constants.js';
import { YearGridButton } from './year-grid-button.js';


@customElement(appYearGridName)
export class AppYearGridButton extends YearGridButton {}

declare global {
  interface HTMLElementTagNameMap {
    [appYearGridName]: AppYearGridButton;
  }
}
