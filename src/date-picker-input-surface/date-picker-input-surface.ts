import { MenuSurface } from '@material/mwc-menu/mwc-menu-surface.js';

import { appDatePickerName } from '../date-picker/constants.js';
import { appDatePickerInputName } from '../date-picker-input/constants.js';
import { ElementMixin } from '../mixins/element-mixin.js';
import { baseStyling, resetShadowRoot } from '../stylings.js';
import type { InferredFromSet } from '../typings.js';
import { DatePickerInputSurfaceStyling } from './stylings.js';

const alwaysOpenElementSet = new Set([
  appDatePickerInputName,
  appDatePickerName,
]);

export class DatePickerInputSurface extends ElementMixin(MenuSurface) {
  public static override styles = [
    ...MenuSurface.styles,
    baseStyling,
    resetShadowRoot,
    DatePickerInputSurfaceStyling,
  ];

  protected override onBodyClick(ev: MouseEvent) {
    const elements =
      (ev.composedPath() as HTMLElement[])
        .filter(({ nodeType }) => nodeType === Node.ELEMENT_NODE);
    const shouldClose =
      elements.some(n => n.classList.contains('calendar-day') && !n.hasAttribute('aria-hidden')) ||
      !elements.some(
        n =>
          alwaysOpenElementSet.has(n.localName as InferredFromSet<typeof alwaysOpenElementSet>)
      );

    shouldClose && this.close();
  }
}
