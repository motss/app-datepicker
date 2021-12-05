import '../date-picker/app-date-picker.js';

import type { TemplateResult } from 'lit';
import { html } from 'lit';

import { appDatePickerName } from '../date-picker/constants.js';
import type { DatePickerSlotInit } from './typings.js';
import { warnUndefinedElement } from './warn-undefined-element.js';

export function datePickerSlot({
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
}: DatePickerSlotInit): TemplateResult {
  warnUndefinedElement(appDatePickerName);

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

// FIXME: Make this a mixin instead
