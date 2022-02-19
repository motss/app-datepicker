import '../date-picker/app-date-picker.js';

import type { TemplateResult } from 'lit';
import { html } from 'lit';

import type { SlotDatePickerInit } from './typings.js';

export function slotDatePicker({
  chooseMonthLabel,
  chooseYearLabel,
  disabledDates,
  disabledDays,
  firstDayOfWeek,
  inline,
  landscape,
  locale,
  max,
  min,
  nextMonthLabel,
  onDatePickerDateUpdated,
  onDatePickerFirstUpdated,
  previousMonthLabel,
  selectedDateLabel,
  selectedYearLabel,
  shortWeekLabel,
  showWeekNumber,
  startView,
  todayDateLabel,
  todayYearLabel,
  value,
  weekLabel,
  weekNumberTemplate,
  weekNumberType,
}: SlotDatePickerInit): TemplateResult {
  return html`<app-date-picker
    ?showWeekNumber=${showWeekNumber}
    .chooseMonthLabel=${chooseMonthLabel}
    .chooseYearLabel=${chooseYearLabel}
    .disabledDates=${disabledDates}
    .disabledDays=${disabledDays}
    .firstDayOfWeek=${firstDayOfWeek}
    .inline=${inline}
    .landscape=${landscape}
    .locale=${locale}
    .max=${max}
    .min=${min}
    .nextMonthLabel=${nextMonthLabel}
    .previousMonthLabel=${previousMonthLabel}
    .selectedDateLabel=${selectedDateLabel}
    .selectedYearLabel=${selectedYearLabel}
    .shortWeekLabel=${shortWeekLabel}
    .startView=${startView}
    .todayDateLabel=${todayDateLabel}
    .todayYearLabel=${todayYearLabel}
    .value=${value}
    .weekLabel=${weekLabel}
    .weekNumberTemplate=${weekNumberTemplate}
    .weekNumberType=${weekNumberType}
    @date-updated=${onDatePickerDateUpdated}
    @first-updated=${onDatePickerFirstUpdated}
  ></app-date-picker>`;
}
