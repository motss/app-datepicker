import type { LitElement } from 'lit';
import type { WeekNumberType } from 'nodemod/dist/calendar/calendar_typing';

import type { CalendarView, Constructor } from '../typings.js';

export interface DatePickerMinMaxProperties {
  max?: string;
  min?: string;
}

export interface DatePickerMixinProperties {
  disabledDates: string;
  disabledDays: string;
  dragRatio: number;
  firstDayOfWeek: number;
  inline: boolean;
  landscape: boolean;
  locale: string;
  nextMonthLabel: string;
  previousMonthLabel: string;
  selectedDateLabel: string;
  showWeekNumber: boolean;
  startView: CalendarView;
  value: string;
  weekLabel: string;
  weekNumberType: WeekNumberType;
  yearDropdownLabel: string;
}

export type MixinReturnType<
  BaseConstructor extends Constructor<LitElement>,
  Mixin
> = BaseConstructor & Constructor<Mixin>;
