import type { WeekNumberType } from 'nodemod/dist/calendar/typings.js';

import type { Constructor, CustomEventAction, LitConstructor, StartView } from '../typings.js';

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
  inline: boolean;
  landscape: boolean;
  locale: string;
  nextMonthLabel: string;
  previousMonthLabel: string;
  selectedDateLabel: string;
  selectedYearLabel: string;
  shortWeekLabel: string;
  showWeekNumber: boolean;
  startView: StartView;
  todayDateLabel: string;
  todayYearLabel: string;
  value?: string | null;
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
