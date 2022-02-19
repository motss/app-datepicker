import { property } from 'lit/decorators.js';
import type { WeekNumberType } from 'nodemod/dist/calendar/typings.js';

import { DateTimeFormat, labelChooseMonth, labelChooseYear, labelNextMonth, labelPreviousMonth, labelSelectedDate, labelSelectedYear, labelShortWeek, labelTodayDate, labelTodayYear, labelWeek, weekNumberTemplate } from '../constants.js';
import { nullishAttributeConverter } from '../helpers/nullish-attribute-converter.js';
import { toDateString } from '../helpers/to-date-string.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import type { LitConstructor, StartView } from '../typings.js';
import type { DatePickerMixinProperties, MixinReturnType } from './typings.js';

export const DatePickerMixin = <BaseConstructor extends LitConstructor>(
  SuperClass: BaseConstructor
): MixinReturnType<BaseConstructor, DatePickerMixinProperties> => {
  class DatePickerMixinClass extends SuperClass implements DatePickerMixinProperties {
    @property() public chooseYearLabel: string = labelChooseYear;
    @property() public chooseMonthLabel: string = labelChooseMonth;
    @property() public disabledDays = '';
    @property() public disabledDates = '';
    @property({ type: Number, reflect: true }) public firstDayOfWeek = 0;
    @property({ type: Boolean }) public inline = false;
    @property({ type: Boolean, reflect: true }) public landscape = false;
    @property() public locale: string = DateTimeFormat().resolvedOptions().locale;
    @property() public nextMonthLabel: string = labelNextMonth;
    @property() public previousMonthLabel: string = labelPreviousMonth;
    @property() public selectedDateLabel: string = labelSelectedDate;
    @property() public selectedYearLabel: string = labelSelectedYear;
    @property() public shortWeekLabel: string = labelShortWeek;
    @property({ type: Boolean, reflect: true }) public showWeekNumber = false;
    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } }) public startView: StartView = 'calendar';
    @property() public todayDateLabel: string = labelTodayDate;
    @property() public todayYearLabel: string = labelTodayYear;

    /**
     * NOTE: `null` or `''` will always reset to the old valid date. In order to reset to
     * today's date, set `value` undefined.
     */
    @property() public value = toDateString(toResolvedDate());

    @property() public weekLabel: string = labelWeek;
    @property() public weekNumberTemplate: string = weekNumberTemplate;
    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } }) public weekNumberType: WeekNumberType = 'first-4-day-week';
  }

  return DatePickerMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerMixinProperties
  >;
};
