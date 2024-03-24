import type { MdDialog } from '@material/web/dialog/dialog.js';

import type { DatePickerProperties } from '../../types.js';

export interface ModalDatePickerProperties
  extends ModalDatePickerStates,
    DatePickerProperties,
    Pick<HTMLElement, 'id'>,
    Pick<MdDialog, 'returnValue' | 'show' | 'type'> {
  close(returnValue: ModalDatePickerPropertiesReturnValue): Promise<void>;
  open?: MdDialog['open'];
}

export type ModalDatePickerPropertiesReturnValue = 'confirm' | 'deny';

interface ModalDatePickerStates {
  _focusedDate: Date;
}
