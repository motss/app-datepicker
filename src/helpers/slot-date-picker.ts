import '../date-picker/app-date-picker.js';

import type { TemplateResult } from 'lit';
import { html } from 'lit';

import type { SlotDatePickerInit } from './typings.js';

export function slotDatePicker({
  disabledDates,
  disabledDays,
  firstDayOfWeek,
  landscape,
  locale,
  max,
  min,
  nextMonthLabel,
  onDatePickerDateUpdated,
  onDatePickerFirstUpdated,
  previousMonthLabel,
  selectedDateLabel,
  showWeekNumber,
  startView,
  value,
  weekLabel,
  weekNumberType,
  yearDropdownLabel,
}: SlotDatePickerInit): TemplateResult {
  return html`<app-date-picker
    ?showWeekNumber=${showWeekNumber}
    .disabledDates=${disabledDates}
    .disabledDays=${disabledDays}
    .firstDayOfWeek=${firstDayOfWeek}
    .landscape=${landscape}
    .locale=${locale}
    .max=${max}
    .min=${min}
    .nextMonthLabel=${nextMonthLabel}
    .previousMonthLabel=${previousMonthLabel}
    .selectedDateLabel=${selectedDateLabel}
    .startView=${startView}
    .value=${value}
    .weekLabel=${weekLabel}
    .weekNumberType=${weekNumberType}
    .yearDropdownLabel=${yearDropdownLabel}
    @date-updated=${onDatePickerDateUpdated}
    @first-updated=${onDatePickerFirstUpdated}
  ></app-date-picker>`;
}
