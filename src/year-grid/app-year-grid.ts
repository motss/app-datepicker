import { customElement } from 'lit/decorators.js';

import { appYearGridName } from './constants.js';
import { YearGrid } from './year-grid.js';

@customElement(appYearGridName)
export class AppYearGrid extends YearGrid {}

declare global {
  interface HTMLElementTagNameMap {
    [appYearGridName]: AppYearGrid;
  }
}
