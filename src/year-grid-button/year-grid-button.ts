import { ButtonBase } from '@material/mwc-button/mwc-button-base.js';
import { styles } from '@material/mwc-button/styles.css';

import { yearGridButtonStyling } from './stylings.js';

export class YearGridButton extends ButtonBase {
  static override styles = [
    styles,
    // FIXME(motss): Remove this hack once @material updates to use latest lit
    yearGridButtonStyling as unknown as typeof styles,
  ];
}
