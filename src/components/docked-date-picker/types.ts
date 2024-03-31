import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';

import type {
  DatePickerProperties as BaseDatePickerProperties,
  MenuListType,
} from '../../types.js';
import type { OmitKey } from '../../utility.types.js';

export interface DatePickerProperties
  extends OmitKey<BaseDatePickerProperties, 'startView'>,
    Partial<Pick<MdOutlinedTextField, 'supportingText'>> {
  open?: boolean;
  startView?: MenuListType | NonNullable<BaseDatePickerProperties['startView']>;
}
