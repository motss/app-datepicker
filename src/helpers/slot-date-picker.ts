import { html, type TemplateResult } from 'lit';

import { appDatePickerName } from '../date-picker/constants.js';
import type { SlotDatePickerInit } from './typings.js';
import { warnUndefinedElement } from './warn-undefined-element.js';

export function slotDatePicker({
  chooseMonthLabel,
  chooseYearLabel,
  disabledDates,
  disabledDays,
  firstDayOfWeek,
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
  todayLabel,
  toyearLabel,
  value,
  weekLabel,
  weekNumberTemplate,
  weekNumberType,
}: SlotDatePickerInit): TemplateResult {
  warnUndefinedElement(appDatePickerName);

  return html`<app-date-picker
    ?showWeekNumber=${showWeekNumber}
    .chooseMonthLabel=${chooseMonthLabel}
    .chooseYearLabel=${chooseYearLabel}
    .disabledDates=${disabledDates}
    .disabledDays=${disabledDays}
    .firstDayOfWeek=${firstDayOfWeek}
    .locale=${locale}
    .max=${max}
    .min=${min}
    .nextMonthLabel=${nextMonthLabel}
    .previousMonthLabel=${previousMonthLabel}
    .selectedDateLabel=${selectedDateLabel}
    .selectedYearLabel=${selectedYearLabel}
    .shortWeekLabel=${shortWeekLabel}
    .startView=${startView}
    .todayLabel=${todayLabel}
    .toyearLabel=${toyearLabel}
    .value=${value}
    .weekLabel=${weekLabel}
    .weekNumberTemplate=${weekNumberTemplate}
    .weekNumberType=${weekNumberType}
    @date-updated=${onDatePickerDateUpdated}
    @first-updated=${onDatePickerFirstUpdated}
  ></app-date-picker>`;
}
