import type { TemplateResult } from 'lit';

import { slotDatePicker } from '../helpers/slot-date-picker.js';
import { DatePickerDialogBase } from './date-picker-dialog-base.js';
import type { DatePickerDialogProperties } from './typings.js';

export class DatePickerDialog extends DatePickerDialogBase implements DatePickerDialogProperties {
  protected override $renderSlot(): TemplateResult {
    const {
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      landscape,
      locale,
      max,
      min,
      nextMonthLabel,
      previousMonthLabel,
      selectedDateLabel,
      showWeekNumber,
      startView,
      value,
      weekLabel,
      weekNumberType,
      yearDropdownLabel,
    } = this;

    return slotDatePicker({
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      inline: true,
      landscape,
      locale,
      max,
      min,
      nextMonthLabel,
      onDatePickerDateUpdated: this.$onDatePickerDateUpdated,
      onDatePickerFirstUpdated: this.$onDatePickerFirstUpdated,
      previousMonthLabel,
      selectedDateLabel,
      showWeekNumber,
      startView,
      value,
      weekLabel,
      weekNumberType,
      yearDropdownLabel,
    });
  }
}
