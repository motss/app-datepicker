import type { Calendar, CalendarWeekday } from 'nodemod/dist/calendar/typings.js';

import type { ChangedProperties, Formatters } from '../typings.js';

export type MonthCalendarChangedProperties = ChangedProperties<MonthCalendarProperties>;

export interface MonthCalendarData {
  calendar: Calendar['calendar'];
  date: Date;
  disabledDaysSet: Set<number>;
  disabledDatesSet: Set<number>;
  formatters?: Formatters;
  currentDate: Date;
  max: Date;
  min: Date;
  showCaption?: boolean;
  showWeekNumber?: boolean;
  todayDate: Date;
  weekdays: CalendarWeekday[];
}

export interface MonthCalendarProperties {
  data?: MonthCalendarData;
}
