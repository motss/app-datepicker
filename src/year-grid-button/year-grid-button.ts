import { ButtonBase } from '@material/mwc-button/mwc-button-base.js';
import { styles } from '@material/mwc-button/styles.css.js';

import { ElementMixin } from '../mixins/element-mixin.js';
import { yearGridButtonStyling } from './stylings.js';

export class YearGridButton extends ElementMixin(ButtonBase) {
  static override styles = [
    styles,
    yearGridButtonStyling,
  ];
}
