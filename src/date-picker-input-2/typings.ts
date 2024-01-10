import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';

import type { DatePickerProperties } from '../typings';

export interface DatePickerInputProperties extends DatePickerProperties, Omit<MdOutlinedTextField, keyof DatePickerProperties> {}
