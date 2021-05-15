import { ButtonBase } from '@material/mwc-button/mwc-button-base.js';
import { style } from '@material/mwc-button/styles-css.js';

import { yearGridButtonStyling } from './stylings.js';

export class YearGridButton extends ButtonBase {
  static styles = [
    style,
    // FIXME(motss): Remove this hack once @material updates to use latest lit
    yearGridButtonStyling as unknown as typeof style,
  ];
}
