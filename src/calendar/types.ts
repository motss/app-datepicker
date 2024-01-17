// import type { Calendar, CalendarWeekday } from 'nodemod/dist/calendar/typings.js';

import type { nothing, TemplateResult } from 'lit';

import type { DatePickerProperties } from '../typings';

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

export interface CalendarProperties extends
  Pick<
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
  >
{
  onClick?(ev: MouseEvent): void;
  onKeydown?(ev: KeyboardEvent): void;
  onKeyup?(ev: KeyboardEvent): void;
  renderCalendarDay(init: RenderFnInit): TemplateResult | typeof nothing;
  renderFooter(): TemplateResult | typeof nothing;
  renderWeekLabel(init: RenderFnInit): TemplateResult | typeof nothing;
  renderWeekNumber(init: RenderFnInit): TemplateResult | typeof nothing;
  renderWeekday(init: RenderFnInit): TemplateResult | typeof nothing;
}

export interface CalendarProperties_RenderCellInit extends RenderFnInit {}

export interface RenderCalendarDayInit extends RenderFnInit {}
export interface RenderWeekLabelInit extends RenderFnInit {}
export interface RenderWeekNumberInit extends RenderFnInit {}
export interface RenderWeekdayInit extends RenderFnInit {}

interface RenderFnInit {
  ci: number;
  label: string;
  ri: number;
  value: string;
}

export interface LabelValue {
  label: string;
  value: string;
}

export interface GridIndices {
  ci: number;
  ri: number;
}
