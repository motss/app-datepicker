import type {
  DatePickerMinMaxProperties,
  DatePickerMixinProperties,
} from '../../../mixins/types.js';

export interface ModalDatePickerYearGridProperties
  extends Pick<
      DatePickerMixinProperties,
      'locale' | 'selectedYearTemplate' | 'toyearTemplate' | 'value'
    >,
    DatePickerMinMaxProperties {
  focusYearWhenNeeded(): void;
  onYearUpdate?(year: number): void;
}
