import type {
  DatePickerMixinProperties,
  MinMaxMixinProperties,
} from '../../../mixins/types.js';
import type { ValueMixinProperties } from '../../../mixins/value-mixin/types.js';

export interface YearGridProperties
  extends MinMaxMixinProperties,
    YearGridStates,
    Pick<
      DatePickerMixinProperties,
      'locale' | 'selectedYearTemplate' | 'toyearTemplate'
    >,
    ValueMixinProperties {
  focusYearWhenNeeded(): void;
  onYearUpdate?(year: number): void;
}

interface YearGridStates {
  _yearFormat: Intl.DateTimeFormat;
}
