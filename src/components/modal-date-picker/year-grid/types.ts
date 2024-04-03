import type { DatePickerMixinProperties } from '../../../mixins/date-picker-mixin/types.js';
import type { MinMaxMixinProperties } from '../../../mixins/min-max-mixin/types.js';
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
