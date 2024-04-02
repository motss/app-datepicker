import type { WeekNumberType } from '@ipohjs/calendar/dist/typings.js';

import type { LitConstructor } from '../types.js';
import type { Constructor } from '../utility.types.js';

export interface DatePickerMixinProperties {
  chooseMonthLabel: string;
  chooseYearLabel: string;
  disabledDates: string;
  disabledDays: string;
  firstDayOfWeek: number;
  locale: string;
  nextMonthLabel: string;
  previousMonthLabel: string;
  selectDateLabel: string;
  selectedDateLabel: string;
  selectedYearTemplate: string;
  shortWeekLabel: string;
  showWeekNumber: boolean;
  todayLabel: string;
  toyearTemplate: string;
  weekLabel: string;
  weekNumberTemplate: string;
  weekNumberType: WeekNumberType;
}

export type MixinReturnType<
  BaseConstructor extends LitConstructor,
  Mixin,
> = BaseConstructor & Constructor<Mixin>;
