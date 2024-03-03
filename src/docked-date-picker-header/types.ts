import type { MenuListType } from '../docked-date-picker/types.js';
import type { DatePickerProperties } from '../typings.js';

export interface HeaderDataset extends DOMStringMap {
  type: HeaderMenuType;
}

export type HeaderMenuType = `${'month' | 'year'}${'Dec' | 'Inc'}` | MenuListType;

export interface HeaderProperties extends Partial<Pick<DatePickerProperties, 'locale' | 'max' | 'min' | 'value'>> {
  nextMonthButtonLabel?: string;
  nextYearButtonLabel?: string;
  onMonthMenuClick?(init: HeaderPropertiesMenuClickFnInit): void;
  onYearMenuClick?(init: HeaderPropertiesMenuClickFnInit): void;
  prevMonthButtonLabel?: string;
  prevYearButtonLabel?: string;
}

export interface HeaderPropertiesMenuClickFnInit {
  date: Date;
  type: HeaderMenuType;
}
