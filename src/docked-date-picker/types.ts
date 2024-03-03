// import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';

import type { DatePickerProperties } from '../typings.js';

// Pick<MdOutlinedTextField, ''>

export interface DockedDatePickerProperties extends DatePickerProperties {
  open?: boolean;
}

export type DockedDatePickerPropertiesReturnValue = 'confirm' | 'deny';

export type MenuListType = 'monthMenu' | 'yearMenu';
