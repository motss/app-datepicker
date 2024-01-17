import type { DatesGridColumn } from '@ipohjs/calendar/dist/typings.js';

export interface RenderCalendarDayInit {
  data: DatesGridColumn;
  selected?: boolean;
}
