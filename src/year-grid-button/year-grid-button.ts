import { MdOutlinedButton } from '@material/web/button/outlined-button.js';

import { ElementMixin } from '../mixins/element-mixin.js';
import { yearGridButtonStyling } from './stylings.js';

export class YearGridButton extends ElementMixin(MdOutlinedButton) {
  static override styles = [
    ...MdOutlinedButton.styles,
    yearGridButtonStyling,
  ];
}
