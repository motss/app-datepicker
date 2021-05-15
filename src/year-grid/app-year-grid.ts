import { customElement } from 'lit/decorators.js';

import { APP_YEAR_GRID_NAME } from './constants.js';
import { YearGrid } from './year-grid.js';

@customElement(APP_YEAR_GRID_NAME)
class AppYearGrid extends YearGrid {}

declare global {
  interface HTMLElementTagNameMap {
    [APP_YEAR_GRID_NAME]: AppYearGrid;
  }
}
