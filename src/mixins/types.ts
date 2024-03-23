import type { WeekNumberType } from '@ipohjs/calendar/dist/typings.js';

import type { CustomEventAction, LitConstructor, StartView } from '../types.js';
import type { Constructor } from '../utility.types.js';

export interface DatePickerMinMaxProperties {
  max?: string;
  min?: string;
}

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
  value?: null | string;
  weekLabel: string;
  weekNumberTemplate: string;
  weekNumberType: WeekNumberType;
}

export interface DatePickerStartViewProperties {
  startView?: StartView;
}

export interface ElementMixinProperties {
  fire<T extends CustomEventAction<string, unknown>>(action: T): void;
  query<T extends HTMLElement>(selector: string): T | null;
  queryAll<T extends HTMLElement>(selector: string): T[];
  root: ShadowRoot;
}

export type MixinReturnType<
  BaseConstructor extends LitConstructor,
  Mixin,
> = BaseConstructor & Constructor<Mixin>;
