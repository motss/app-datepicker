import type { ValueMixinProperties } from '../../../mixins/value-mixin/types.js';
import type { DatePickerProperties, MenuListType } from '../../../types.js';

export interface HeaderDataset extends DOMStringMap {
  type: HeaderMenuType;
}

interface HeaderFormatters {
  shortMonthFormat: Intl.DateTimeFormat;
  yearFormat: Intl.DateTimeFormat;
}

export type HeaderMenuType =
  | `${'month' | 'year'}${'Dec' | 'Inc'}`
  | MenuListType;

export interface HeaderProperties
  extends HeaderStates,
    Partial<Pick<DatePickerProperties, 'locale' | 'max' | 'min' | 'value'>>,
    ValueMixinProperties {
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

interface HeaderStates {
  _formatters: HeaderFormatters;
}
