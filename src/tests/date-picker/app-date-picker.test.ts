import '../../date-picker/app-date-picker';

import { expect } from '@open-wc/testing';
import { elementUpdated,fixture, html, oneEvent } from '@open-wc/testing-helpers';

import { MAX_DATE } from '../../constants';
import type { AppDatePicker } from '../../date-picker/app-date-picker';
import { appDatePickerName } from '../../date-picker/constants';
import { toFormatters } from '../../helpers/to-formatters';
import { toResolvedDate } from '../../helpers/to-resolved-date';
import type { MaybeDate } from '../../helpers/typings';
import type { AppMonthCalendar } from '../../month-calendar/app-month-calendar';
import type { CalendarView, DateUpdatedEvent, Formatters } from '../../typings';
import type { AppYearGrid } from '../../year-grid/app-year-grid';
import { messageFormatter } from '../test-utils/message-formatter';

describe(appDatePickerName, () => {
  const elementSelectors = {
    body: '.body',
    calendar: '.calendar',
    calendarDay: '.calendar-day',
    disabledCalendarDay: '.calendar-day[aria-disabled="true"]',
    header: '.header',
    nextMonthNavigationButton: 'mwc-icon-button[data-navigation="next"]',
    previousMonthNavigationButton: 'mwc-icon-button[data-navigation="previous"]',
    selectedCalendarDay: '.calendar-day[aria-selected="true"]',
    selectedYearMonth: '.selected-year-month',
    yearDropdown: '.year-dropdown',
    yearGrid: '.year-grid',
    yearGridButton: '.year-grid-button',
  } as const;
  const formatters: Formatters = toFormatters('en-US');
  const todayDate = toResolvedDate();

  type A = [CalendarView | undefined, (keyof typeof elementSelectors)[], (keyof typeof elementSelectors)[]];
  const cases: A[] = [
    [
      undefined,
      ['body', 'calendar', 'header'],
      ['yearGrid'],
    ],
    [
      'calendar',
      ['body', 'calendar', 'header'],
      ['yearGrid'],
    ],
    [
      'yearGrid',
      ['body', 'header', 'yearGrid'],
      ['calendar'],
    ],
  ];
  cases.forEach((a) => {
    const [testCalendarView, testElementsShouldRender, testElementsShouldNotRender] = a;
    it(
      messageFormatter('renders (startView=%s)', a),
      async () => {
        const el = await fixture(
          html`<app-date-picker .startView=${testCalendarView as never}></app-date-picker>`
        );

        testElementsShouldRender.forEach((n) => {
          const element = el.shadowRoot?.querySelector(
            elementSelectors[n]
          );

          expect(element).exist;
        });
        testElementsShouldNotRender.forEach((n) => {
          const element = el.shadowRoot?.querySelector(
            elementSelectors[n]
          );

          expect(element).not.exist;
        });
      }
    );
  });

  type A2 = [string | undefined, string, string];
  const cases2: A2[] = [
    [undefined, Intl.DateTimeFormat().resolvedOptions().locale, 'February 2020'],
    ['zh-TW', 'zh-TW', '2020年2月'],
  ];
  cases2.forEach((a) => {
    const [testLocale, expectedLocale, expectedYearMonthLabel] = a;
    it(
      messageFormatter('renders (locale=%s)', a),
      async () => {
        const testValue = '2020-02-02';
        const el = await fixture<AppDatePicker>(
          html`<app-date-picker .locale=${testLocale as never} min="1970-01-01" value=${testValue}></app-date-picker>`
        );

        const selectedYearMonth = el.shadowRoot?.querySelector<HTMLParagraphElement>(
          elementSelectors.selectedYearMonth
        );

        expect(el.locale).equal(expectedLocale);
        expect(el.value).equal(testValue);
        expect(selectedYearMonth?.textContent).equal(expectedYearMonthLabel);
      }
    );
  });

  type A3 = [
    string,
    string,
    string,
    (keyof Pick<typeof elementSelectors, 'nextMonthNavigationButton' | 'previousMonthNavigationButton'>)[],
    (keyof Pick<typeof elementSelectors, 'nextMonthNavigationButton' | 'previousMonthNavigationButton'>)[]
  ];
  const cases3: A3[] = [
    [
      '2020-03-03',
      '2020-01-01',
      '2020-02-02',
      ['nextMonthNavigationButton', 'previousMonthNavigationButton'],
      [],
    ],
    [
      '2020-03-03',
      '2020-01-01',
      '2020-01-01',
      ['nextMonthNavigationButton'],
      ['previousMonthNavigationButton'],
    ],
    [
      '2020-03-03',
      '2020-01-01',
      '2020-03-03',
      ['previousMonthNavigationButton'],
      ['nextMonthNavigationButton'],
    ],
  ];
  cases3.forEach((a) => {
    const [testMax, testMin, testValue, testElementsShouldRender, testElementsShouldNotRender] = a;
    it(
      messageFormatter(
        'renders with month navigation buttons (min=%s, max=%s, value=%s)',
        a
      ),
      async () => {
        const el = await fixture(
          html`<app-date-picker
            .max=${testMax}
            .min=${testMin}
            .value=${testValue}
          ></app-date-picker>`
        );

        testElementsShouldRender.forEach((n) => {
          const element = el.shadowRoot?.querySelector(
            elementSelectors[n]
          );

          expect(element).exist;
        });
        testElementsShouldNotRender.forEach((n) => {
          const element = el.shadowRoot?.querySelector(
            elementSelectors[n]
          );

          expect(element).not.exist;
        });
      }
    );
  });

  type A4 = [
    keyof Pick<typeof elementSelectors, 'nextMonthNavigationButton' | 'previousMonthNavigationButton'>,
    Date
  ];
  const cases4: A4[] = [
    ['previousMonthNavigationButton', new Date('2020-01-01')],
    ['nextMonthNavigationButton', new Date('2020-03-01')],
  ];
  cases4.forEach((a) => {
    const [testMonthNavigationElementSelector, testCurrentDate] = a;
    it(
      messageFormatter('navigates to new month by clicking %s', a),
      async () => {
        const el = await fixture<AppDatePicker>(
          html`<app-date-picker
            .max=${'2020-03-03'}
            .min=${'2020-01-01'}
            .value=${'2020-02-02'}
          ></app-date-picker>`
        );

        const element = el.shadowRoot?.querySelector<HTMLButtonElement>(
          elementSelectors[testMonthNavigationElementSelector]
        );

        element?.focus();
        element?.click();

        await elementUpdated(el);

        const selectedYearMonth = el.shadowRoot?.querySelector<HTMLParagraphElement>(
          elementSelectors.selectedYearMonth
        );

        expect(selectedYearMonth?.textContent).equal(
          formatters.longMonthYearFormat(testCurrentDate)
        );
      }
    );
  });

  it('selects new year then new date', async () => {
    const testMax = '2021-12-31';
    const testMin = '2019-01-01';
    const testValue = '2020-02-02';
    const newSelectedDate = new Date(
      new Date(testValue)
        .setUTCFullYear(new Date(testMax).getUTCFullYear())
    );
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${testMax}
        .min=${testMin}
        .value=${testValue}
      ></app-date-picker>`
    );

    const yearDropdown = el.shadowRoot?.querySelector<HTMLButtonElement>(
      elementSelectors.yearDropdown
    );

    yearDropdown?.focus();
    yearDropdown?.click();

    await elementUpdated(el);

    const yearGrid = el.shadowRoot?.querySelector<AppYearGrid>(
      elementSelectors.yearGrid
    );

    expect(yearGrid).exist;

    const newSelectedYear = yearGrid?.shadowRoot?.querySelector<HTMLButtonElement>(
      `${elementSelectors.yearGridButton}[data-year="${newSelectedDate.getUTCFullYear()}"]`
    );

    expect(newSelectedYear).exist;

    newSelectedYear?.focus();
    newSelectedYear?.click();

    await elementUpdated(el);

    const calendar = el.shadowRoot?.querySelector<AppMonthCalendar>(
      elementSelectors.calendar
    );

    expect(calendar).exist;

    const selectedYearMonth = el.shadowRoot?.querySelector<HTMLParagraphElement>(
      elementSelectors.selectedYearMonth
    );

    expect(selectedYearMonth?.textContent).equal(
      formatters.longMonthYearFormat(newSelectedDate)
    );

    const newSelectedDate2 = new Date(
      new Date(newSelectedDate).setUTCDate(15)
    );
    const newSelectedDate2Label = formatters.fullDateFormat(newSelectedDate2);

    const newSelectedCalendarDay =
      calendar?.shadowRoot?.querySelector<HTMLTableCellElement>(
        `${elementSelectors.calendarDay}[aria-label="${newSelectedDate2Label}"]`
      );

    expect(newSelectedCalendarDay).exist;
    expect(newSelectedCalendarDay?.getAttribute('aria-label')).equal(
      newSelectedDate2Label
    );
    expect(newSelectedCalendarDay?.fullDate).deep.equal(newSelectedDate2);


    const dateUpdatedEventTask =
      oneEvent(el, 'date-updated');

    newSelectedCalendarDay?.focus();
    newSelectedCalendarDay?.click();

    const dateUpdatedEvent = await dateUpdatedEventTask;

    await elementUpdated(calendar as AppMonthCalendar);
    await elementUpdated(el);

    const selectedCalendarDay =
      calendar?.shadowRoot?.querySelector<HTMLTableCellElement>(
        elementSelectors.selectedCalendarDay
      );

    expect(selectedCalendarDay).exist;
    expect(selectedCalendarDay?.getAttribute('aria-label')).equal(
      newSelectedDate2Label
    );
    expect(selectedCalendarDay?.fullDate).deep.equal(
      newSelectedDate2
    );

    const expectedDateUpdatedEvent: DateUpdatedEvent = {
      isKeypress: false,
      value: newSelectedDate2,
    };

    expect(dateUpdatedEvent.detail).deep.equal(expectedDateUpdatedEvent);
  });

  it('selects new date', async () => {
    const testValue = '2020-02-02';
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${'2020-03-03'}
        .min=${'2020-01-01'}
        .value=${testValue}
      ></app-date-picker>`
    );

    const newSelectedDate = new Date(
      new Date(testValue).setUTCDate(15)
    );
    const newSelectedDateLabel = formatters.fullDateFormat(newSelectedDate);

    const calendar = el.shadowRoot?.querySelector<AppMonthCalendar>(
      elementSelectors.calendar
    );
    const newSelectedCalendarDay =
      calendar?.shadowRoot?.querySelector<HTMLTableCellElement>(
        `${elementSelectors.calendarDay}[aria-label="${newSelectedDateLabel}"]`
      );

    expect(newSelectedCalendarDay).exist;

    const dateUpdatedEventTask =
      oneEvent(el, 'date-updated');

    newSelectedCalendarDay?.focus();
    newSelectedCalendarDay?.click();

    const dateUpdatedEvent = await dateUpdatedEventTask;

    await elementUpdated(calendar as AppMonthCalendar);
    await elementUpdated(el);

    const selectedDate = calendar?.shadowRoot?.querySelector<HTMLTableCellElement>(
      elementSelectors.selectedCalendarDay
    );

    expect(selectedDate).exist;
    expect(selectedDate?.getAttribute('aria-label')).equal(
      newSelectedDateLabel
    );
    expect(selectedDate?.fullDate).deep.equal(newSelectedDate);

    const expectedDateUpdatedEvent: DateUpdatedEvent = {
      isKeypress: false,
      value: newSelectedDate,
    };

    expect(dateUpdatedEvent.detail).deep.equal(expectedDateUpdatedEvent);
  });

  it('selects new startView', async () => {
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${'2020-03-03'}
        .min=${'2020-01-01'}
        .value=${'2020-02-02'}
      ></app-date-picker>`
    );

    const yearDropdown = el.shadowRoot?.querySelector<HTMLButtonElement>(
      elementSelectors.yearDropdown
    );

    yearDropdown?.focus();
    yearDropdown?.click();

    await elementUpdated(el);

    const yearGrid = el.shadowRoot?.querySelector<AppYearGrid>(
      elementSelectors.yearGrid
    );

    expect(yearGrid).exist;

    yearDropdown?.focus();
    yearDropdown?.click();

    await elementUpdated(el);

    const calendar = el.shadowRoot?.querySelector<AppMonthCalendar>(
      elementSelectors.calendar
    );
    const yearGrid2 = el.shadowRoot?.querySelector<AppYearGrid>(
      elementSelectors.yearGrid
    );

    expect(yearGrid2).not.exist;
    expect(calendar).exist;
  });

  type A5 = [
    MaybeDate | undefined,
    MaybeDate | undefined,
    Date,
    Date
  ];
  const cases5: A5[] = [
    ['', '2020-02-02', todayDate, toResolvedDate('2020-02-02')],
    ['2020-02-02', '', toResolvedDate('2020-02-02'), toResolvedDate('2020-02-02')],
    [null, '2020-02-02', todayDate, toResolvedDate('2020-02-02')],
    ['2020-02-02', null, toResolvedDate('2020-02-02'), toResolvedDate('2020-02-02')],
    [undefined, '2020-02-02', todayDate, toResolvedDate('2020-02-02')],
    ['2020-02-02', undefined, toResolvedDate('2020-02-02'), todayDate],
  ];
  cases5.forEach((a) => {
    const [testValue, testNewValue, expectedValueDate, expectedNewValueDate] = a;
    it(
      messageFormatter('updates optional value (value=%s, newValue=%s)', a),
      async () => {
        const el = await fixture<AppDatePicker>(
          html`<app-date-picker
            .max=${'2100-12-31'}
            .min=${'1970-01-01'}
            .value=${testValue as never}
          ></app-date-picker>`
        );

        const calendar = el.shadowRoot?.querySelector<AppMonthCalendar>(
          elementSelectors.calendar
        );
        const selectedDate = calendar?.shadowRoot?.querySelector<HTMLTableCellElement>(
          elementSelectors.selectedCalendarDay
        );

        expect(selectedDate).exist;
        expect(selectedDate?.getAttribute('aria-label')).equal(
          formatters.fullDateFormat(expectedValueDate)
        );
        expect(selectedDate?.fullDate).deep.equal(
          expectedValueDate
        );

        el.value = testNewValue as never;

        await elementUpdated(calendar as AppMonthCalendar);
        await elementUpdated(el);

        const calendar2 = el.shadowRoot?.querySelector<AppMonthCalendar>(
          elementSelectors.calendar
        );
        const newSelectedDate = calendar2?.shadowRoot?.querySelector<HTMLTableCellElement>(
          elementSelectors.selectedCalendarDay
        );

        expect(newSelectedDate).exist;
        expect(newSelectedDate?.getAttribute('aria-label')).equal(
          formatters.fullDateFormat(expectedNewValueDate)
        );
        expect(newSelectedDate?.fullDate).deep.equal(
          expectedNewValueDate
        );
      });
    }
  );

  type A6 = [
    MaybeDate | undefined,
    MaybeDate | undefined,
    Date,
    Date
  ];
  const cases6: A6[] = [
    ['', '2020-02-02', todayDate, toResolvedDate('2020-02-02')],
    [null, '2020-02-02', todayDate, toResolvedDate('2020-02-02')],
    ['', '2020-02-02', todayDate, toResolvedDate('2020-02-02')],
    [undefined, '2020-02-02', todayDate, toResolvedDate('2020-02-02')],
    ['', '2020-02-01', todayDate, toResolvedDate('2020-02-01')],
    [null, '2020-02-01', todayDate, toResolvedDate('2020-02-01')],
    ['', '2020-02-01', todayDate, toResolvedDate('2020-02-01')],
    [undefined, '2020-02-01', todayDate, toResolvedDate('2020-02-01')],
    ['2020-02-02', '', toResolvedDate('2020-02-02'), toResolvedDate('2020-02-02')],
    ['2020-02-02', null, toResolvedDate('2020-02-02'), toResolvedDate('2020-02-02')],
    ['2020-02-02', undefined, toResolvedDate('2020-02-02'), todayDate],
  ];
  cases6.forEach((a) => {
    const [testMin, testNewMin, expectedMinDate, expectedNewMinDate] = a;
    it(
      messageFormatter('updates optional min (min=%s, newMin=%s)', a),
      async () => {
        const el = await fixture<AppDatePicker>(
          html`<app-date-picker
            .max=${'2100-12-31'}
            .min=${testMin as never}
            .value=${testMin as never}
          ></app-date-picker>`
        );

        const calendar = el.shadowRoot?.querySelector<AppMonthCalendar>(
          elementSelectors.calendar
        );

        const minDate = calendar?.shadowRoot?.querySelector<HTMLTableCellElement>(
          `${elementSelectors.calendarDay}[aria-label="${
            formatters.fullDateFormat(expectedMinDate)
          }"]`
        );

        expect(minDate).exist;
        expect(minDate?.getAttribute('aria-label')).equal(
          formatters.fullDateFormat(expectedMinDate)
        );
        expect(minDate?.fullDate).deep.equal(expectedMinDate);

        const expectedOneDayBeforeMinDate = toResolvedDate(
          new Date(expectedMinDate).setUTCDate(
            expectedMinDate.getUTCDate() - 1
          )
        );
        const oneDayBeforeMinDate =
          calendar?.shadowRoot?.querySelector<HTMLTableCellElement>(
            `${elementSelectors.calendarDay}[aria-label="${
              formatters.fullDateFormat(expectedOneDayBeforeMinDate)
            }"]`
          );

        expect(oneDayBeforeMinDate).exist;
        expect(oneDayBeforeMinDate?.getAttribute('aria-label')).equal(
          formatters.fullDateFormat(expectedOneDayBeforeMinDate)
        );
        expect(oneDayBeforeMinDate?.fullDate).deep.equal(expectedOneDayBeforeMinDate);

        el.min = el.value = testNewMin as never;

        await elementUpdated(calendar as AppMonthCalendar);
        await elementUpdated(el);

        const calendar2 = el.shadowRoot?.querySelector<AppMonthCalendar>(
          elementSelectors.calendar
        );

        const minDate2 = calendar2?.shadowRoot?.querySelector<HTMLTableCellElement>(
          `${elementSelectors.calendarDay}[aria-label="${
            formatters.fullDateFormat(expectedNewMinDate)
          }"]`
        );

        expect(minDate2).exist;
        expect(minDate2?.getAttribute('aria-label')).equal(
          formatters.fullDateFormat(expectedNewMinDate)
        );
        expect(minDate2?.fullDate).deep.equal(expectedNewMinDate);

        const previousMonthNavigationButton =
          el.shadowRoot?.querySelector<HTMLButtonElement>(
            elementSelectors.previousMonthNavigationButton
          );

        expect(previousMonthNavigationButton).not.exist;

        // NOTE: Skip checking for one day before min when new min is 01 or first day of the month
        if (!(testNewMin as string)?.endsWith('01')) {
          const expectedOneDayBeforeMinDate2 = toResolvedDate(
            new Date(expectedNewMinDate).setUTCDate(
              expectedNewMinDate.getUTCDate() - 1
            )
          );
          const oneDayBeforeMinDate2 =
            calendar?.shadowRoot?.querySelector<HTMLTableCellElement>(
              `${elementSelectors.calendarDay}[aria-label="${
                formatters.fullDateFormat(expectedOneDayBeforeMinDate2)
              }"]`
            );

          expect(oneDayBeforeMinDate2).exist;
          expect(oneDayBeforeMinDate2?.getAttribute('aria-label')).equal(
            formatters.fullDateFormat(expectedOneDayBeforeMinDate2)
          );
          expect(oneDayBeforeMinDate2?.fullDate).deep.equal(expectedOneDayBeforeMinDate2);
        }
      });
    }
  );

  type A7 = [
    MaybeDate | undefined,
    MaybeDate | undefined,
    Date,
    Date,
    Date
  ];
  const cases7: A7[] = [
    // MAX_DATE (i=3) will not affect test result and it will always return '' after init
    ['', '2020-02-20', todayDate, MAX_DATE, toResolvedDate('2020-02-20')],
    // MAX_DATE (i=3) will not affect test result and it will always return '' after init
    [null, '2020-02-20', todayDate, MAX_DATE, toResolvedDate('2020-02-20')],
    // MAX_DATE (i=3) will not affect test result and it will always return '' after init
    ['', MAX_DATE.toJSON(), todayDate, MAX_DATE, MAX_DATE],
    // MAX_DATE (i=3) will not affect test result and it will always return '' after init
    [null, MAX_DATE.toJSON(), todayDate, MAX_DATE, MAX_DATE],

    // defined max to old max
    ['2020-02-02', '', toResolvedDate('2020-02-02'), toResolvedDate('2020-02-02'), toResolvedDate('2020-02-02')],
    ['2020-02-02', null, toResolvedDate('2020-02-02'), toResolvedDate('2020-02-02'), toResolvedDate('2020-02-02')],

    // defined max to old max
    [undefined, '2020-02-20', todayDate, MAX_DATE, toResolvedDate('2020-02-20')],
    ['2020-02-02', undefined, toResolvedDate('2020-02-02'), toResolvedDate('2020-02-02'), MAX_DATE],
  ];
  cases7.forEach((a) => {
    const [testMax, testNewMax, expectedSelectedDate, expectedMaxDate, expectedNewMaxDate] = a;
    it(
      messageFormatter('updates optional max (max=%s, newMax=%s)', a),
      async () => {
        const el = await fixture<AppDatePicker>(
          html`<app-date-picker
            .max=${testMax as never}
            .min=${'1970-01-01'}
            .value=${testMax as never}
          ></app-date-picker>`
        );

        const calendar = el.shadowRoot?.querySelector<AppMonthCalendar>(
          elementSelectors.calendar
        );

        const selectedDate = calendar?.shadowRoot?.querySelector<HTMLTableCellElement>(
          elementSelectors.selectedCalendarDay
        );

        expect(selectedDate).exist;
        expect(selectedDate?.getAttribute('aria-label')).equal(
          formatters.fullDateFormat(expectedSelectedDate)
        );
        expect(selectedDate?.fullDate).deep.equal(expectedSelectedDate);

        el.value = expectedMaxDate.toJSON();

        await elementUpdated(calendar as AppMonthCalendar);
        await elementUpdated(el);

        const assertMaxDate = (
          date: MaybeDate | undefined,
          expectedDate: Date
        ): void => {
          const isSameCalendarMonth = toResolvedDate(date).getUTCMonth() === expectedDate.getUTCMonth();

          if (isSameCalendarMonth) {
            const maxDate = calendar?.shadowRoot?.querySelector<HTMLTableCellElement>(
              `${elementSelectors.calendarDay}[aria-label="${
                formatters.fullDateFormat(expectedDate)
              }"]`
            );

            expect(maxDate).exist;
            expect(maxDate?.getAttribute('aria-disabled')).equal('false');
            expect(maxDate?.getAttribute('aria-label')).equal(
              formatters.fullDateFormat(expectedDate)
            );
            expect(maxDate?.fullDate).deep.equal(expectedDate);
          }

          const isNotLastDayOfCalendarMonth =
            expectedDate.getUTCDate() !== new Date(
              expectedDate.getUTCFullYear(),
              expectedDate.getMonth() + 1,
              0
            ).getUTCDate();
          const isNotMaxDate = expectedDate.getTime() !== MAX_DATE.getTime();

          if (isNotLastDayOfCalendarMonth && isNotMaxDate) {
            const expectedOneDayAfterMaxDate = toResolvedDate(
              new Date(expectedDate).setUTCDate(
                expectedDate.getUTCDate() + 1
              )
            );
            const oneDayAfterMaxDate =
              calendar?.shadowRoot?.querySelector<HTMLTableCellElement>(
                `${elementSelectors.calendarDay}[aria-label="${
                  formatters.fullDateFormat(expectedOneDayAfterMaxDate)
                }"]`
              );

            expect(oneDayAfterMaxDate).exist;
            expect(oneDayAfterMaxDate?.getAttribute('aria-disabled')).equal('true');
            expect(oneDayAfterMaxDate?.getAttribute('aria-label')).equal(
              formatters.fullDateFormat(expectedOneDayAfterMaxDate)
            );
            expect(oneDayAfterMaxDate?.fullDate).deep.equal(expectedOneDayAfterMaxDate);
          }
        };

        assertMaxDate(testMax, expectedMaxDate);

        el.max = el.value = testNewMax as never;

        await elementUpdated(calendar as AppMonthCalendar);
        await elementUpdated(el);

        assertMaxDate(testNewMax, expectedNewMaxDate);
      });
    }
  );

});
