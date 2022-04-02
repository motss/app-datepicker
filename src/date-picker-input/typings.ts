import type { TextField } from '@material/mwc-textfield';

import type { DatePickerProperties } from '../typings';

export interface DatePickerInputProperties extends DatePickerProperties, Omit<TextField, keyof DatePickerProperties> {}
