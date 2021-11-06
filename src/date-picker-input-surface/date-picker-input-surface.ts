import { MenuSurface } from '@material/mwc-menu/mwc-menu-surface.js';

import { appDatePickerName } from '../date-picker/constants.js';
import { appDatePickerInputName } from '../date-picker-input/constants.js';
import { DatePickerInputSurfaceStyling } from './stylings.js';

export class DatePickerInputSurface extends MenuSurface {
  public static override styles = [
    ...MenuSurface.styles,
    DatePickerInputSurfaceStyling,
  ];

  protected override onBodyClick(ev: MouseEvent) {
    const elements = (ev.composedPath() as HTMLElement[]).filter(({ nodeType }) => nodeType === Node.ELEMENT_NODE);
    const shouldClose =
      elements.some(n => n.classList.contains('calendar-day')) ||
      !elements.some(n => n.localName === appDatePickerName) ||
      !elements.some(n => n.localName === appDatePickerInputName);

    shouldClose && this.close();
  }
}
