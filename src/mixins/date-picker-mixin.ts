import type { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { WeekNumberType } from 'nodemod/dist/calendar/typings.js';

import { nullishAttributeConverter } from '../helpers/nullish-attribute-converter.js';
import { toDateString } from '../helpers/to-date-string.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { toResolvedLocale } from '../helpers/to-resolved-locale.js';
import type { CalendarView, Constructor } from '../typings.js';
import type { DatePickerMixinProperties, MixinReturnType } from './typings.js';

export const DatePickerMixin = <BaseConstructor extends Constructor<LitElement>>(
  SuperClass: BaseConstructor
): MixinReturnType<BaseConstructor, DatePickerMixinProperties> => {
  class DatePickerMixinClass extends SuperClass implements DatePickerMixinProperties {
    @property()
    public disabledDays = '';

    @property()
    public disabledDates = '';

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

  return DatePickerMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerMixinProperties
  >;
};
