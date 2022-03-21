import type { Calendar, CalendarWeekday } from 'nodemod/dist/calendar/typings.js';

import type { ChangedProperties, DatePickerProperties, Formatters } from '../typings.js';

export type MonthCalendarChangedProperties = ChangedProperties<MonthCalendarProperties>;

export interface MonthCalendarData extends PickDatePickerProperties {
  calendar: Calendar['calendar'];
  currentDate: Date;
  date: Date;
  disabledDatesSet: Set<number>;
  disabledDaysSet: Set<number>;
  formatters?: Formatters;
  max: Date;
  min: Date;
  showCaption?: boolean;
  todayDate: Date;
  weekdays: CalendarWeekday[];
}

export interface MonthCalendarProperties {
  data?: MonthCalendarData;
}

export interface MonthCalendarRenderCalendarDayInit extends Omit<HTMLElement, 'part'> {
  day: string;
  fullDate: Date;
  part: string;
}

type PickDatePickerProperties = Pick<
  DatePickerProperties,
  | 'selectedDateLabel'
  | 'showWeekNumber'
  | 'todayDateLabel'
>;
