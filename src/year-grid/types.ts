import type { DatePickerMinMaxProperties, DatePickerMixinProperties } from '../mixins/typings.js';

export interface YearGridProperties extends Pick<DatePickerMixinProperties, 'locale' | 'selectedYearTemplate' | 'toyearTemplate' | 'value'>, DatePickerMinMaxProperties {
  onYearUpdate?(year: number): void;
}
