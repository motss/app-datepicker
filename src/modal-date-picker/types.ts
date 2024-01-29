import type { MdDialog } from '@material/web/dialog/dialog.js';

import type { DatePickerProperties } from '../typings.js';

export interface ModalDatePickerProperties extends DatePickerProperties, Pick<HTMLElement, 'id'>, Pick<MdDialog, 'show' | 'type'> {
  close(returnValue: ModalDatePickerPropertiesReturnValue): Promise<void>;
  open?: MdDialog['open'];
}

export type ModalDatePickerPropertiesReturnValue = 'confirm' | 'deny';
