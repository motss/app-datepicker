import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';

import type { DatePickerProperties, MenuListType } from '../../types.js';
import type { OmitKey } from '../../utility.types.js';

type PickMdOutlinedTextField = Pick<MdOutlinedTextField, 'supportingText'>;

export interface DockedDatePickerProperties
  extends OmitKey<DatePickerProperties, 'startView'>,
    Partial<PickMdOutlinedTextField> {
  open?: boolean;
  startView?: MenuListType | NonNullable<DatePickerProperties['startView']>;
}

export type DockedDatePickerPropertiesReturnValue = 'confirm' | 'deny';
