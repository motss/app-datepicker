import type {
  DatePickerMixinProperties,
  MinMaxMixinProperties,
} from '../../../mixins/types.js';
import type { ValueMixinProperties } from '../../../mixins/value-mixin/types.js';

export interface ModalDatePickerYearGridProperties
  extends MinMaxMixinProperties,
    ModalDatePickerYearGridStates,
    Pick<
      DatePickerMixinProperties,
      'locale' | 'selectedYearTemplate' | 'toyearTemplate'
    >,
    ValueMixinProperties {
  focusYearWhenNeeded(): void;
  onYearUpdate?(year: number): void;
}

interface ModalDatePickerYearGridStates {
  _yearFormat: Intl.DateTimeFormat;
}
