import type { WeekNumberType } from "@ipohjs/calendar/dist/typings.js";
import { property } from "lit/decorators.js";

import {
  DateTimeFormat,
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
} from "../constants.js";
import { nullishAttributeConverter } from "../helpers/nullish-attribute-converter.js";
import { toDateString } from "../helpers/to-date-string.js";
import { toResolvedDate } from "../helpers/to-resolved-date.js";
import type { LitConstructor } from "../typings.js";
import type { DatePickerMixinProperties, MixinReturnType } from "./typings.js";

export const DatePickerMixin = <BaseConstructor extends LitConstructor>(
  SuperClass: BaseConstructor,
): MixinReturnType<BaseConstructor, DatePickerMixinProperties> => {
  class DatePickerMixinClass
    extends SuperClass
    implements DatePickerMixinProperties
  {
    @property() public chooseMonthLabel: string = labelChooseMonth;
    @property() public chooseYearLabel: string = labelChooseYear;
    @property() public disabledDates = "";
    @property() public disabledDays = "";
    @property({ reflect: true, type: Number }) public firstDayOfWeek = 0;
    @property() public locale: string =
      DateTimeFormat().resolvedOptions().locale;
    @property() public nextMonthLabel: string = labelNextMonth;
    @property() public previousMonthLabel: string = labelPreviousMonth;
    @property() public selectDateLabel: string = labelSelectDate;
    @property() public selectedDateLabel: string = labelSelectedDate;
    @property() public selectedYearTemplate: string = selectedYearTemplate;
    @property() public shortWeekLabel: string = labelShortWeek;
    @property({ reflect: true, type: Boolean }) public showWeekNumber = false;

    @property() public todayLabel: string = labelToday;
    @property() public toyearTemplate: string = toyearTemplate;

    /**
     * NOTE: `null` or `''` will always reset to the old valid date. In order to reset to
     * today's date, set `value` undefined.
     */
    @property() public value = toDateString(toResolvedDate());

    @property() public weekLabel: string = labelWeek;
    @property() public weekNumberTemplate: string = weekNumberTemplate;
    @property({
      converter: { toAttribute: nullishAttributeConverter },
      reflect: true,
    })
    public weekNumberType: WeekNumberType = "first-4-day-week";
  }

  return DatePickerMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerMixinProperties
  >;
};
