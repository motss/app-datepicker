import type { MdDialog } from '@material/web/dialog/dialog.js';

import type { ValueMixinProperties } from '../../mixins/value-mixin/types.js';
import type { DatePickerProperties } from '../../types.js';

export interface ModalDatePickerProperties
  extends DatePickerProperties,
    ModalDatePickerStates,
    Pick<HTMLElement, 'id'>,
    Pick<MdDialog, 'returnValue' | 'show' | 'type'>,
    ValueMixinProperties {
  close(returnValue: ModalDatePickerPropertiesReturnValue): Promise<void>;
  open?: MdDialog['open'];
}

export type ModalDatePickerPropertiesReturnValue = 'confirm' | 'deny';

interface ModalDatePickerStates {
  _focusedDate: Date;
}
