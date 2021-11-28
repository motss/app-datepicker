import '../date-picker/app-date-picker.js';

import type { TemplateResult } from 'lit';

import { datePickerSlot } from '../helpers/date-picker-slot.js';
import { DatePickerDialogBase } from './date-picker-dialog-base.js';
import type { DatePickerDialogProperties } from './typings.js';

export class DatePickerDialog extends DatePickerDialogBase implements DatePickerDialogProperties {
  protected override $renderSlot(): TemplateResult {
    return datePickerSlot({
      disabledDates: this.disabledDates,
      disabledDays: this.disabledDays,
      firstDayOfWeek: this.firstDayOfWeek,
      inline: this.inline,
      landscape: this.landscape,
      locale: this.locale,
      max: this.max,
      min: this.min,
      nextMonthLabel: this.nextMonthLabel,
      onDatePickerDateUpdated: this.$onDatePickerDateUpdated,
      onDatePickerFirstUpdated: this.$onDatePickerFirstUpdated,
      previousMonthLabel: this.previousMonthLabel,
      selectedDateLabel: this.selectedDateLabel,
      showWeekNumber: this.showWeekNumber,
      startView: this.startView,
      value: this.value,
      weekLabel: this.weekLabel,
      weekNumberType: this.weekNumberType,
      yearDropdownLabel: this.yearDropdownLabel,
    });
  }
}
