import type { Calendar, CalendarWeekday } from 'nodemod/dist/calendar/calendar_typing.js';

import type { Formatters } from '../typings.js';

export interface MonthCalendarData {
  calendar: Calendar['calendar'];
  date: Date;
  disabledDaysSet: Set<number>;
  disabledDatesSet: Set<number>;
  formatters?: Formatters;
  currentDate: Date;
  max: Date;
  min: Date;
  showCaption: boolean;
  showWeekNumber: boolean;
  todayDate: Date;
  weekdays: CalendarWeekday[];
}

export interface MonthCalendarProperties {
  data: MonthCalendarData;
}
