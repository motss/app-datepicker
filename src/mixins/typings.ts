import type { WeekNumberType } from '@ipohjs/calendar/dist/typings.js';

import type { CustomEventAction, LitConstructor, StartView } from '../typings.js';
import type { Constructor } from '../utility-typings.js';

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
  selectedYearLabel: string;
  shortWeekLabel: string;
  showWeekNumber: boolean;
  startView: StartView;
  todayLabel: string;
  toyearLabel: string;
  value?: null | string;
  weekLabel: string;
  weekNumberTemplate: string;
  weekNumberType: WeekNumberType;
}

export interface ElementMixinProperties {
  fire<T extends CustomEventAction<string, unknown>>(action: T): void;
  query<T extends HTMLElement>(selector: string): T | null;
  queryAll<T extends HTMLElement>(selector: string): T[];
  root: ShadowRoot;
}

export type MixinReturnType<
  BaseConstructor extends LitConstructor,
  Mixin
> = BaseConstructor & Constructor<Mixin>;
