import type { MdDialog } from '@material/web/dialog/dialog.js';

import type { ValueMixinProperties } from '../../mixins/value-mixin/types.js';
import type { DatePickerProperties as BaseDatePickerProperties } from '../../types.js';

export interface DatePickerProperties
  extends BaseDatePickerProperties,
    DatePickerStates,
    Pick<HTMLElement, 'id'>,
    Pick<MdDialog, 'returnValue' | 'show' | 'type'>,
    ValueMixinProperties {
  close(returnValue: DatePickerPropertiesReturnValue): Promise<void>;
  open?: MdDialog['open'];
}

export type DatePickerPropertiesReturnValue = 'confirm' | 'deny';

interface DatePickerStates {
  _iconDirection: 'down' | 'up';
}
