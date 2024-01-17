import type { DatesGridColumn } from '@ipohjs/calendar/dist/typings.js';

export interface RenderCalendarDayInit {
  data: DatesGridColumn;
  selectedDate: Date;
  tabbableDate: Date;
  todayDate: Date;
}
