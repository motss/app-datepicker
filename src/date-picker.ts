import type { TemplateResult } from 'lit';
import type { CalendarView, ChangeProperties, DatePickerElementInterface, DatePickerInterface, Formatters } from './typings.js';

import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';

import { MAX_DATE, calendarViews } from './constants.js';
import { DatePickerMixin } from './date-picker-mixin.js';
import { dateValidator } from './helpers/date-validator.js';
import { toFormatters } from './helpers/to-formatters.js';
import { toResolvedDate } from './helpers/to-resolved-date.js';
import { toYearList } from './helpers/to-year-list.js';
import type { MaybeDate } from './helpers/typings.js';

export class DatePicker extends DatePickerMixin(LitElement) implements DatePickerInterface {
  //#region public properties
  //#endregion public properties

  //#region private states
  @state()
  private _focusedDate!: Date;

  @state()
  private _hasMax!: boolean;
  
  @state()
  private _hasMin!: boolean;

  @state()
  private _max!: Date;

  @state()
  private _maxDate!: Date;

  @state()
  private _min!: Date;

  @state()
  private _selectedDate!: Date;

  @state()
  private _lastSelectedDate!: Date;

  @state()
  private _startView: CalendarView = 'calendar';
  //#endregion private states
  
  //#region private properties
  private _formatters: Formatters;
  private _TODAY_DATE: Date;
  private _yearList: number[];
  //#endregion private properties

  public static styles = [
    css``,
  ];

  constructor() {
    super();

    const todayDate = toResolvedDate();

    this._min = new Date(todayDate);
    this._max = new Date(MAX_DATE);
    this._TODAY_DATE = todayDate;
    this._yearList = toYearList(todayDate, MAX_DATE);
    this._selectedDate = new Date(todayDate);
    this._focusedDate = new Date(todayDate);
    this._formatters = toFormatters(this.locale);
  }

  protected update(changedProperties: ChangeProperties<DatePickerInterface>): void {
    const hasMax = changedProperties.has('max');

    if (hasMax || changedProperties.has('min')) {
      const oldValue = toResolvedDate(
        changedProperties.get(hasMax ? 'max' : 'min') as string
      ) || (hasMax ? MAX_DATE: this._TODAY_DATE);
      const value = this[hasMax ? 'max' : 'min'] as MaybeDate;
      const { date, isValid } = dateValidator(value, oldValue);

      this[hasMax ? '_max' : '_min'] = date;
      this[hasMax ? '_hasMax' : '_hasMin'] = isValid;
    }

    if (changedProperties.has('startView')) {
      const oldStartView = changedProperties.get('startView') as CalendarView;

      if (!calendarViews.includes(this.startView)) {
        this._startView = this.startView = oldStartView;
      }
    }

    if (changedProperties.has('value')) {
      const oldValue = toResolvedDate(
        changedProperties.get('value') as string
      ) || this._TODAY_DATE;
      const { date } = dateValidator(this.value, oldValue);

      this._focusedDate = new Date(date);
      this._selectedDate = this._lastSelectedDate = new Date(date);
      // this.valueAsDate = newDate;
      // this.valueAsNumber = +newDate;
    }

    super.update(changedProperties);
  }

  protected render(): TemplateResult {
    return html`
    <div>
      ${JSON.stringify({
        max: this.max,
        min: this.min,
        disabledDates: this.disabledDates,
        disabledDays: this.disabledDays,
        dragRatio: this.dragRatio,
        firstDayOfWeek: this.firstDayOfWeek,
        inline: this.inline,
        landscape: this.landscape,
        locale: this.locale,
        showWeekNumber: this.showWeekNumber,
        startView: this.startView,
        value: this.value,
        weekLabel: this.weekLabel,
        weekNumberType: this.weekNumberType,
      } as DatePickerElementInterface, null, 2)}
    </div>
    `;
  }
}
