import type { MdDialog } from '@material/web/dialog/dialog.js';

import type { ModalDatePickerBodyProperties } from '../modal-date-picker-body/types.js';
import type { DatePickerProperties } from '../typings.js';

export interface DockedDatePickerProperties extends DatePickerProperties, Pick<HTMLElement, 'id'>, Pick<MdDialog, 'returnValue' | 'show' | 'type'>, Pick<ModalDatePickerBodyProperties, 'onDateUpdate' | 'reset'> {
  close(returnValue: DockedDatePickerPropertiesReturnValue): Promise<void>;
  open?: MdDialog['open'];
}

export type DockedDatePickerPropertiesReturnValue = 'confirm' | 'deny';
