import type { MdDialog } from '@material/web/dialog/dialog.js';

import type { ValueMixinProperties } from '../../mixins/value-mixin/types.js';
import type { DatePickerProperties as BaseDatePickerProperties } from '../../types.js';

export interface DatePickerProperties
  extends BaseDatePickerProperties,
    DatePickerStates,
    Pick<HTMLElement, 'id'>,
    Pick<MdDialog, 'type'>,
    ValueMixinProperties {
  close(): void;
  open?: MdDialog['open'];
  readonly returnValue: '' | 'confirm' | 'deny';
  show(): void;
}

interface DatePickerStates {
  _formatters: Record<
    'dateFormat' | 'longMonthYearFormat',
    Intl.DateTimeFormat
  >;
  _iconDirection: 'down' | 'up';
}
