import type { DatePickerProperties, MenuListType } from '../typings.js';

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
  startView?: MenuListType | NonNullable<DatePickerProperties['startView']>;
}

export interface HeaderPropertiesMenuClickFnInit {
  date: Date;
  type: HeaderMenuType;
}
