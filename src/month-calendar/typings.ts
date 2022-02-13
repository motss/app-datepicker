import type { Calendar, CalendarWeekday } from 'nodemod/dist/calendar/typings.js';

import type { ChangedProperties, Formatters } from '../typings.js';

export type MonthCalendarChangedProperties = ChangedProperties<MonthCalendarProperties>;

export interface MonthCalendarData {
  calendar: Calendar['calendar'];
  currentDate: Date;
  date: Date;
  disabledDatesSet: Set<number>;
  disabledDaysSet: Set<number>;
  formatters?: Formatters;
  max: Date;
  min: Date;
  selectedDateLabel?: string;
  showCaption?: boolean;
  showWeekNumber?: boolean;
  todayDate: Date;
  todayDateLabel?: string;
  weekdays: CalendarWeekday[];
}

export interface MonthCalendarProperties {
  data?: MonthCalendarData;
}

export interface MonthCalendarRenderCalendarDayInit extends HTMLElement {
  day: string;
  fullDate: Date;
}
