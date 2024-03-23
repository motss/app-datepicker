import type {
  CalendarGrid,
  CalendarWeekday,
  DatesGridColumn,
} from '@ipohjs/calendar/dist/typings.js';
import type { nothing, TemplateResult } from 'lit';

import type { DatePickerProperties } from '../../../types.js';

// import type { DatePickerProperties, Formatters } from '../typings.js';

// export interface CalendarData extends PickDatePickerProperties {
//   calendar: Calendar['calendar'];
//   currentDate: Date;
//   date: Date;
//   disabledDatesSet: Set<number>;
//   disabledDaysSet: Set<number>;
//   formatters?: Formatters;
//   max: Date;
//   min: Date;
//   todayDate: Date;
//   weekdays: CalendarWeekday[];
// }

// export interface CalendarProperties {
//   data?: CalendarData;
// }

// type PickDatePickerProperties = Pick<
//   DatePickerProperties,
//   | 'selectedDateLabel'
//   | 'showWeekNumber'
//   | 'todayLabel'
// >;

export interface CalendarDayElement extends Omit<HTMLButtonElement, 'dataset'> {
  dataset: Record<'day' | 'fulldate', string>;
}

export interface CalendarProperties
  extends Pick<
    DatePickerProperties,
    | 'disabledDates'
    | 'disabledDays'
    | 'firstDayOfWeek'
    | 'locale'
    | 'max'
    | 'min'
    | 'shortWeekLabel'
    | 'showWeekNumber'
    | 'value'
    | 'weekLabel'
    | 'weekNumberTemplate'
    | 'weekNumberType'
  > {
  onDateUpdateByClick?(
    ev: MouseEvent,
    node: CalendarDayElement,
    calendarGrid: CalendarGrid
  ): void;
  onDateUpdateByKey?(
    ev: KeyboardEvent,
    node: CalendarDayElement,
    calendarGrid: CalendarGrid
  ): void;
  onUpdated?(): void;
  renderCalendarDay?(
    init: RenderCalendarDayInit
  ): TemplateResult | typeof nothing;
  renderFooter?(): TemplateResult | typeof nothing;
  renderWeekDay?(init: RenderWeekDayInit): TemplateResult | typeof nothing;
  renderWeekLabel?(init: RenderWeekLabelInit): TemplateResult | typeof nothing;
  renderWeekNumber?(
    init: RenderWeekNumberInit
  ): TemplateResult | typeof nothing;
}

export interface RenderCalendarDayInit extends GridIndices {
  data: DatesGridColumn;
}

export interface RenderWeekDayInit extends Pick<GridIndices, 'ri'> {
  weekday: CalendarWeekday;
}

export interface RenderWeekLabelInit extends LabelValue {}

export interface RenderWeekNumberInit extends GridIndices {
  data: DatesGridColumn;
}

export interface LabelValue {
  label: string;
  value: string;
}

export interface GridIndices {
  ci: number;
  ri: number;
}
