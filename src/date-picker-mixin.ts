import type { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { WeekNumberType } from 'nodemod/dist/calendar/calendar_typing';

import { nullishAttributeConverter } from './helpers/nullish-attribute-converter.js';
import { toDateString } from './helpers/to-date-string.js';
import { toResolvedDate } from './helpers/to-resolved-date.js';
import { toResolvedLocale } from './helpers/to-resolved-locale.js';

import type { CalendarView, Constructor, DatePickerElementInterface, MixinReturnType } from './typings.js';

export const DatePickerMixin = <BaseConstructor extends Constructor<LitElement>>(
  SuperClass: BaseConstructor
): MixinReturnType<BaseConstructor, DatePickerElementInterface> => {
  class DatePickerElement extends SuperClass {
    @property()
    public disabledDays?: string;

    @property()
    public disabledDates?: string;

    @property({ type: Number })
    public dragRatio = .15;

    @property({ type: Number, reflect: true })
    public firstDayOfWeek = 0;

    @property({ type: Boolean })
    public inline = false;

    @property({ type: Boolean, reflect: true })
    public landscape = false;

    @property()
    public locale: string = toResolvedLocale();

    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } })
    public max?: string;

    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } })
    public min?: string;

    @property()
    public nextMonthLabel = 'Next month';

    @property()
    public previousMonthLabel = 'Previous month';

    @property()
    public selectedDateLabel = 'Selected date';

    @property({ type: Boolean, reflect: true })
    public showWeekNumber = false;

    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } })
    public startView: CalendarView = 'calendar';

    @property()
    public value: string = toDateString(toResolvedDate());

    @property()
    public weekLabel = 'Wk';

    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } })
    public weekNumberType: WeekNumberType = 'first-4-day-week';

    @property()
    public yearDropdownLabel = 'Choose year and month';
  }

  return DatePickerElement as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerElementInterface
  >;
};
