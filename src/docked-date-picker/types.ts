// import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';

import type { DatePickerProperties, MenuListType } from '../typings.js';
import type { OmitKey } from '../utility-typings.js';

// Pick<MdOutlinedTextField, ''>

export interface DockedDatePickerProperties extends OmitKey<DatePickerProperties, 'startView'> {
  open?: boolean;
  startView?: MenuListType | NonNullable<DatePickerProperties['startView']>;
}

export type DockedDatePickerPropertiesReturnValue = 'confirm' | 'deny';
