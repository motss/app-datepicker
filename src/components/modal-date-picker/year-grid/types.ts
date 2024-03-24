import type {
  DatePickerMixinProperties,
  MinMaxMixinProperties,
} from '../../../mixins/types.js';

export interface ModalDatePickerYearGridProperties
  extends Pick<
      DatePickerMixinProperties,
      'locale' | 'selectedYearTemplate' | 'toyearTemplate' | 'value'
    >,
    MinMaxMixinProperties {
  focusYearWhenNeeded(): void;
  onYearUpdate?(year: number): void;
}
