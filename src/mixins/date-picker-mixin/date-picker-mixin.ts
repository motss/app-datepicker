import type { WeekNumberType } from '@ipohjs/calendar/dist/typings.js';
import { property } from 'lit/decorators.js';

import {
  labelChooseMonth,
  labelChooseYear,
  labelNextMonth,
  labelPreviousMonth,
  labelSelectDate,
  labelSelectedDate,
  labelSelectedYearTemplate,
  labelShortWeek,
  labelToday,
  labelToyearTemplate,
  labelWeek,
  labelWeekNumberTemplate,
} from '../../constants.js';
import { nullishAttributeConverter } from '../../helpers/nullish-attribute-converter.js';
import type { LitConstructor } from '../../types.js';
import type { MixinReturnType } from '../types.js';
import type { DatePickerMixinProperties } from './types.js';

export const DatePickerMixin = <BaseConstructor extends LitConstructor>(
  superClass: BaseConstructor
): MixinReturnType<BaseConstructor, DatePickerMixinProperties> => {
  class DatePickerMixinClass
    extends superClass
    implements DatePickerMixinProperties
  {
    @property() chooseMonthLabel: string = labelChooseMonth;
    @property() chooseYearLabel: string = labelChooseYear;
    @property() disabledDates = '';
    @property() disabledDays = '';
    @property({ reflect: true, type: Number }) firstDayOfWeek = 0;
    @property() locale: string = Intl.DateTimeFormat().resolvedOptions().locale;
    @property() nextMonthLabel: string = labelNextMonth;
    @property() previousMonthLabel: string = labelPreviousMonth;
    @property() selectDateLabel: string = labelSelectDate;
    @property() selectedDateLabel: string = labelSelectedDate;
    @property() selectedYearTemplate: string = labelSelectedYearTemplate;
    @property() shortWeekLabel: string = labelShortWeek;
    @property({ reflect: true, type: Boolean }) showWeekNumber = false;
    @property() todayLabel: string = labelToday;
    @property() toyearTemplate: string = labelToyearTemplate;
    @property() weekLabel: string = labelWeek;
    @property() weekNumberTemplate: string = labelWeekNumberTemplate;
    @property({
      converter: { toAttribute: nullishAttributeConverter },
      reflect: true,
    })
    weekNumberType: WeekNumberType = 'first-4-day-week';
  }

  return DatePickerMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerMixinProperties
  >;
};
