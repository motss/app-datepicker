import type { WeekNumberType } from '@ipohjs/calendar/dist/typings.js';
import { property } from 'lit/decorators.js';

import {
  labelChooseMonth,
  labelChooseYear,
  labelNextMonth,
  labelPreviousMonth,
  labelSelectDate,
  labelSelectedDate,
  labelShortWeek,
  labelToday,
  labelWeek,
  selectedYearTemplate,
  toyearTemplate,
  weekNumberTemplate,
} from '../constants.js';
import { nullishAttributeConverter } from '../helpers/nullish-attribute-converter.js';
import type { LitConstructor } from '../types.js';
import type { DatePickerMixinProperties, MixinReturnType } from './types.js';

export const DatePickerMixin = <BaseConstructor extends LitConstructor>(
  superClass: BaseConstructor
): MixinReturnType<BaseConstructor, DatePickerMixinProperties> => {
  class DatePickerMixinClass
    extends superClass
    implements DatePickerMixinProperties
  {
    @property() public chooseMonthLabel: string = labelChooseMonth;
    @property() public chooseYearLabel: string = labelChooseYear;
    @property() public disabledDates = '';
    @property() public disabledDays = '';
    @property({ reflect: true, type: Number }) public firstDayOfWeek = 0;
    @property() public locale: string =
      Intl.DateTimeFormat().resolvedOptions().locale;
    @property() public nextMonthLabel: string = labelNextMonth;
    @property() public previousMonthLabel: string = labelPreviousMonth;
    @property() public selectDateLabel: string = labelSelectDate;
    @property() public selectedDateLabel: string = labelSelectedDate;
    @property() public selectedYearTemplate: string = selectedYearTemplate;
    @property() public shortWeekLabel: string = labelShortWeek;
    @property({ reflect: true, type: Boolean }) public showWeekNumber = false;
    @property() public todayLabel: string = labelToday;
    @property() public toyearTemplate: string = toyearTemplate;
    @property() public weekLabel: string = labelWeek;
    @property() public weekNumberTemplate: string = weekNumberTemplate;
    @property({
      converter: { toAttribute: nullishAttributeConverter },
      reflect: true,
    })
    public weekNumberType: WeekNumberType = 'first-4-day-week';
  }

  return DatePickerMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerMixinProperties
  >;
};
