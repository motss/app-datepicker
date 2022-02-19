import '../../date-picker/app-date-picker';

import type { Button } from '@material/mwc-button';
import { expect } from '@open-wc/testing';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';

import { labelChooseMonth, labelChooseYear, labelNextMonth, labelPreviousMonth, MAX_DATE } from '../../constants';
import type { AppDatePicker } from '../../date-picker/app-date-picker';
import { appDatePickerName } from '../../date-picker/constants';
import { toDateString } from '../../helpers/to-date-string';
import { toFormatters } from '../../helpers/to-formatters';
import { toResolvedDate } from '../../helpers/to-resolved-date';
import type { MaybeDate } from '../../helpers/typings';
import type { AppMonthCalendar } from '../../month-calendar/app-month-calendar';
import type { CustomEventDetail, DatePickerProperties, Formatters, StartView } from '../../typings';
import type { AppYearGrid } from '../../year-grid/app-year-grid';
import { eventOnce } from '../test-utils/event-once';
import { messageFormatter } from '../test-utils/message-formatter';

describe(appDatePickerName, () => {
  const elementSelectors = {
    body: '.body',
    calendar: '.calendar',
    calendarDay: '.calendar-day',
    calendarDayWithLabel: (label: string) => `.calendar-day[aria-label="${label}"]`,
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

  type A = [StartView | undefined, ('body' | 'calendar' | 'header' | 'yearGrid')[], ('body' | 'calendar' | 'header' | 'yearGrid')[]];
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
        const el = await fixture<AppDatePicker>(
          html`<app-date-picker .startView=${testCalendarView as never}></app-date-picker>`
        );

        testElementsShouldRender.forEach((n) => {
          const element = el.query(elementSelectors[n]);

          expect(element).exist;

          // Verify year dropdown title
          const yearDropdown = el.query<Button>(elementSelectors.yearDropdown);

          expect(yearDropdown)
            .exist
            .attr(
              'title',
              testElementsShouldRender.includes('calendar') ?
                labelChooseYear :
                labelChooseMonth
            );

          // Verify body class to ensure .start-view--{calendar|yearGrid} is always set
          if (n === 'body') {
            expect(element).have.class(`start-view--${testCalendarView || 'calendar'}`);
          }
        });
        testElementsShouldNotRender.forEach((n) => {
          const element = el.query(elementSelectors[n]);

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

        const selectedYearMonth = el.query<HTMLParagraphElement>(
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
        'renders month navigation buttons (min=%s, max=%s, value=%s)',
        a
      ),
      async () => {
        const el = await fixture<AppDatePicker>(
          html`<app-date-picker
            .max=${testMax}
            .min=${testMin}
            .value=${testValue}
          ></app-date-picker>`
        );

        testElementsShouldRender.forEach((n) => {
          const element = el.query(elementSelectors[n]);

          expect(element)
            .exist
            .attr('title', n === 'nextMonthNavigationButton' ? labelNextMonth : labelPreviousMonth);
        });
        testElementsShouldNotRender.forEach((n) => {
          const element = el.query(elementSelectors[n]);

          expect(element).not.exist;
        });
      }
    );
  });

  type TestTitle = [
    properties: Partial<DatePickerProperties>,
    expected: Partial<DatePickerProperties>
  ];
  const casesTestTitle: TestTitle[] = [
    [
      {
        chooseMonthLabel: undefined,
        chooseYearLabel: undefined,
        nextMonthLabel: undefined,
        previousMonthLabel: undefined,
      },
      {
        chooseMonthLabel: undefined,
        chooseYearLabel: undefined,
        nextMonthLabel: undefined,
        previousMonthLabel: undefined,
      },
    ],
    [
      {
        chooseMonthLabel: '',
        chooseYearLabel: '',
        nextMonthLabel: '',
        previousMonthLabel: '',
      },
      {
        chooseMonthLabel: '',
        chooseYearLabel: '',
        nextMonthLabel: '',
        previousMonthLabel: '',
      },
    ],
    [
      {
        chooseMonthLabel: '選擇月份',
        chooseYearLabel: '選擇年份',
        nextMonthLabel: '下個月份',
        previousMonthLabel: '上個月份',
      },
      {
        chooseMonthLabel: '選擇月份',
        chooseYearLabel: '選擇年份',
        nextMonthLabel: '下個月份',
        previousMonthLabel: '上個月份',
      },
    ],
  ];
  casesTestTitle.forEach((a) => {
    const [testPartialProperties, expectedProperties] = a;

    it(
      messageFormatter('renders correct title for buttons (partialProperties=%j)', a),
      async () => {
        const el = await fixture<AppDatePicker>(
          html`<app-date-picker
            .chooseMonthLabel=${testPartialProperties.chooseMonthLabel as string}
            .chooseYearLabel=${testPartialProperties.chooseYearLabel as string}
            .max=${'2020-12-02'}
            .min=${'1970-01-01'}
            .nextMonthLabel=${testPartialProperties.nextMonthLabel as string}
            .previousMonthLabel=${testPartialProperties.previousMonthLabel as string}
            .value=${'2020-02-02'}
          ></app-date-picker>`
        );

        const yearDropdown = el.query<Button>(elementSelectors.yearDropdown);
        const nextMonthNavigationButton= el.query<Button>(elementSelectors.nextMonthNavigationButton);
        const previousMonthNavigationButton = el.query<Button>(elementSelectors.previousMonthNavigationButton);

        expect(yearDropdown).exist;
        expect(nextMonthNavigationButton).exist;
        expect(previousMonthNavigationButton).exist;

        if (
          expectedProperties.chooseYearLabel == null &&
          expectedProperties.nextMonthLabel == null &&
          expectedProperties.previousMonthLabel == null
        ) {
          expect(yearDropdown).not.attr('title');
          expect(nextMonthNavigationButton).not.attr('title');
          expect(previousMonthNavigationButton).not.attr('title');
        } else {
          expect(yearDropdown).attr('title', expectedProperties.chooseYearLabel);
          expect(nextMonthNavigationButton).attr('title', expectedProperties.nextMonthLabel);
          expect(previousMonthNavigationButton).attr('title', expectedProperties.previousMonthLabel);
        }
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

        const element = el.query<HTMLButtonElement>(
          elementSelectors[testMonthNavigationElementSelector]
        );

        element?.focus();
        element?.click();

        await elementUpdated(el);

        const selectedYearMonth = el.query<HTMLParagraphElement>(
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

    const yearDropdown = el.query<HTMLButtonElement>(
      elementSelectors.yearDropdown
    );

    yearDropdown?.focus();
    yearDropdown?.click();

    await elementUpdated(el);

    const yearGrid = el.query<AppYearGrid>(
      elementSelectors.yearGrid
    );

    expect(yearGrid).exist;

    const newSelectedYear = yearGrid?.query<HTMLButtonElement>(
      `${elementSelectors.yearGridButton}[data-year="${newSelectedDate.getUTCFullYear()}"]`
    );

    expect(newSelectedYear).exist;

    newSelectedYear?.focus();
    newSelectedYear?.click();

    await elementUpdated(el);

    const calendar = el.query<AppMonthCalendar>(
      elementSelectors.calendar
    );

    expect(calendar).exist;

    const selectedYearMonth = el.query<HTMLParagraphElement>(
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
      calendar?.query<HTMLTableCellElement>(
        `${elementSelectors.calendarDay}[aria-label="${newSelectedDate2Label}"]`
      );

    expect(newSelectedCalendarDay).exist;
    expect(newSelectedCalendarDay?.getAttribute('aria-label')).equal(
      newSelectedDate2Label
    );
    expect(newSelectedCalendarDay?.fullDate).deep.equal(newSelectedDate2);

    const dateUpdatedEventTask =
      eventOnce<
        typeof el,
        'date-updated',
        CustomEvent<CustomEventDetail['date-updated']['detail']>
      >(el, 'date-updated');

    newSelectedCalendarDay?.focus();
    newSelectedCalendarDay?.click();

    const dateUpdatedEvent = await dateUpdatedEventTask;

    await elementUpdated(calendar as AppMonthCalendar);
    await elementUpdated(el);

    const selectedCalendarDay =
      calendar?.query<HTMLTableCellElement>(
        elementSelectors.selectedCalendarDay
      );

    expect(selectedCalendarDay).exist;
    expect(selectedCalendarDay?.getAttribute('aria-label')).equal(
      newSelectedDate2Label
    );
    expect(selectedCalendarDay?.fullDate).deep.equal(
      newSelectedDate2
    );

    const expectedDateUpdatedEvent: CustomEventDetail['date-updated']['detail'] = {
      isKeypress: false,
      value: toDateString(newSelectedDate2),
      valueAsDate: newSelectedDate2,
      valueAsNumber: +newSelectedDate2,
    };

    expect(dateUpdatedEvent?.detail).deep.equal(expectedDateUpdatedEvent);
  });

  it('selects new date', async () => {
    const testValue = '2020-02-02';
    const testValueDate = new Date(testValue);
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${'2020-03-03'}
        .min=${'2020-01-01'}
        .value=${testValue}
      ></app-date-picker>`
    );

    expect(el.valueAsDate).deep.equal(testValueDate);
    expect(el.valueAsNumber).equal(+testValueDate);

    const newSelectedDate = new Date(
      new Date(testValue).setUTCDate(15)
    );
    const newSelectedDateLabel = formatters.fullDateFormat(newSelectedDate);

    const calendar = el.query<AppMonthCalendar>(
      elementSelectors.calendar
    );
    const newSelectedCalendarDay =
      calendar?.query<HTMLTableCellElement>(
        `${elementSelectors.calendarDay}[aria-label="${newSelectedDateLabel}"]`
      );

    expect(newSelectedCalendarDay).exist;

    const dateUpdatedEventTask =
      eventOnce<
        typeof el,
        'date-updated',
        CustomEvent<CustomEventDetail['date-updated']['detail']>
      >(el, 'date-updated');

    newSelectedCalendarDay?.focus();
    newSelectedCalendarDay?.click();

    const dateUpdatedEvent = await dateUpdatedEventTask;

    await elementUpdated(calendar as AppMonthCalendar);
    await elementUpdated(el);

    const selectedDate = calendar?.query<HTMLTableCellElement>(
      elementSelectors.selectedCalendarDay
    );
    const expectedDateUpdatedEvent: CustomEventDetail['date-updated']['detail'] = {
      isKeypress: false,
      value: toDateString(newSelectedDate),
      valueAsDate: newSelectedDate,
      valueAsNumber: +newSelectedDate,
    };

    expect(el.valueAsDate).deep.equal(newSelectedDate);
    expect(el.valueAsNumber).equal(+newSelectedDate);

    expect(selectedDate).exist;
    expect(selectedDate?.getAttribute('aria-label')).equal(
      newSelectedDateLabel
    );
    expect(selectedDate?.fullDate).deep.equal(newSelectedDate);
    expect(dateUpdatedEvent?.detail).deep.equal(expectedDateUpdatedEvent);
  });

  it('selects new startView', async () => {
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${'2020-03-03'}
        .min=${'2020-01-01'}
        .value=${'2020-02-02'}
      ></app-date-picker>`
    );

    const yearDropdown = el.query<HTMLButtonElement>(
      elementSelectors.yearDropdown
    );

    yearDropdown?.focus();
    yearDropdown?.click();

    await elementUpdated(el);

    const yearGrid = el.query<AppYearGrid>(
      elementSelectors.yearGrid
    );

    expect(yearGrid).exist;

    yearDropdown?.focus();
    yearDropdown?.click();

    await elementUpdated(el);

    const calendar = el.query<AppMonthCalendar>(
      elementSelectors.calendar
    );
    const yearGrid2 = el.query<AppYearGrid>(
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

        const calendar = el.query<AppMonthCalendar>(
          elementSelectors.calendar
        );
        const selectedDate = calendar?.query<HTMLTableCellElement>(
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

        const calendar2 = el.query<AppMonthCalendar>(
          elementSelectors.calendar
        );
        const newSelectedDate = calendar2?.query<HTMLTableCellElement>(
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

        const calendar = el.query<AppMonthCalendar>(
          elementSelectors.calendar
        );

        const minDate = calendar?.query<HTMLTableCellElement>(
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
          calendar?.query<HTMLTableCellElement>(
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

        const calendar2 = el.query<AppMonthCalendar>(
          elementSelectors.calendar
        );

        const minDate2 = calendar2?.query<HTMLTableCellElement>(
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
          el.query<HTMLButtonElement>(
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
            calendar?.query<HTMLTableCellElement>(
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

  type NullishDateString = string | null | undefined;
  type CaseOptionalMax = [
    [testMax: NullishDateString, testValue: NullishDateString, max: string, value: string],
    [testNewMax: NullishDateString, testNewValue: NullishDateString, newMax: string, newValue: string]
  ];
  const casesOptionalMax: CaseOptionalMax[] = [
    // max='',value=''
    [
      // same max and value subsequently
      ['', '', '2100-12-31', toDateString(todayDate)],
      ['2020-02-20', '2020-02-20', '2020-02-20', '2020-02-20'],
    ],
    [
      // larger max subsequently
      ['', '', '2100-12-31', toDateString(todayDate)],
      ['2020-02-21', '2020-02-20', '2020-02-21', '2020-02-20'],
    ],
    [
      // smaller max subsequently
      ['', '', '2100-12-31', toDateString(todayDate)],
      ['2020-02-19', '2020-02-20', '2020-02-19', '2020-02-19'],
    ],

    // max=null,value=null
    [
      // same max and value subsequently (null)
      [null, null, '2100-12-31', toDateString(todayDate)],
      ['2020-02-20', '2020-02-20', '2020-02-20', '2020-02-20'],
    ],
    [
      // larger max subsequently
      [null, null, '2100-12-31', toDateString(todayDate)],
      ['2020-02-21', '2020-02-20', '2020-02-21', '2020-02-20'],
    ],
    [
      // smaller max subsequently
      [null, null, '2100-12-31', toDateString(todayDate)],
      ['2020-02-19', '2020-02-20', '2020-02-19', '2020-02-19'],
    ],

    // max=undefined,value=undefined
    [
      // same max and value subsequently
      [undefined, undefined, '2100-12-31', toDateString(todayDate)],
      ['2020-02-20', '2020-02-20', '2020-02-20', '2020-02-20'],
    ],
    [
      // larger max subsequently
      [undefined, undefined, '2100-12-31', toDateString(todayDate)],
      ['2020-02-21', '2020-02-20', '2020-02-21', '2020-02-20'],
    ],
    [
      // smaller max subsequently
      [undefined, undefined, '2100-12-31', toDateString(todayDate)],
      ['2020-02-19', '2020-02-20', '2020-02-19', '2020-02-19'],
    ],

    // max=2020-02-02,value=2020-02-02
    [
      // max='' and value=2100-12-12 subsequently
      ['2020-02-02', '2020-02-02', '2020-02-02', '2020-02-02'],
      ['', '2100-12-12', '2020-02-02', '2020-02-02'],
    ],
    [
      // max=null and value=2100-12-12 subsequently
      ['2020-02-02', '2020-02-02', '2020-02-02', '2020-02-02'],
      [null, '2100-12-12', '2020-02-02', '2020-02-02'],
    ],
    [
      // max=undefined and value=2100-12-12 subsequently
      ['2020-02-02', '2020-02-02', '2020-02-02', '2020-02-02'],
      [undefined, '2100-12-12', toDateString(MAX_DATE), '2100-12-12'],
    ],
  ];
  casesOptionalMax.forEach((a) => {
    const [
      [testMax, testValue],
      [testNewMax, testNewValue],
    ] = a;
    it(
      `updates optional max (initially: max=${testMax}, value=${testValue}, subsequently: max=${testNewMax}, value=${testNewValue})`,
      async () => {
        const el = await fixture<AppDatePicker>(
          html`<app-date-picker
            .max=${testMax as never}
            .min=${'1970-01-01'}
            .value=${testMax as never}
          ></app-date-picker>`
        );

        const $a = a.map<[number, CaseOptionalMax[0]]>((n, i) => [i, n]);
        for (const [
          i,
          [$testMax, $testValue, $expectedMax, $expectedValue],
        ] of $a) {
          const calendar = el.query<AppMonthCalendar>(
            elementSelectors.calendar
          );

          if (i) {
            el.max = $testMax as never;
            el.value = $testValue;

            calendar && await elementUpdated(calendar);
            await elementUpdated(el);
          }

          const selectedDate = calendar?.query<HTMLTableCellElement>(
            elementSelectors.selectedCalendarDay
          );

          expect(calendar).exist;
          expect(selectedDate).exist;

          const expectedValueDate = new Date($expectedValue);

          expect(el.max).equal($expectedMax);
          expect(selectedDate?.getAttribute('aria-label')).equal(
            formatters.fullDateFormat(expectedValueDate)
          );
          expect(selectedDate?.fullDate).deep.equal(expectedValueDate);

          if (i) {
            const isMaxDate = $expectedMax === toDateString(MAX_DATE);

            if (isMaxDate) {
              /**
               * assert `$expectedMax` is the `MAX_DATE` supported and there will be no next month nav button
               */
               const nextMonthNavigationButton = el.query<Button>(
                elementSelectors.nextMonthNavigationButton
              );
              const maxDate = calendar?.query<HTMLTableCellElement>(
                elementSelectors.calendarDayWithLabel(formatters.fullDateFormat(MAX_DATE))
              );

              expect(nextMonthNavigationButton).not.exist;
              expect(maxDate).exist;

              expect(maxDate?.getAttribute('aria-selected')).equal('false');
              expect(maxDate?.getAttribute('aria-disabled')).equal('false');
            } else {
              /**
               * assert `$expectedMax` is the last non-disabled date in the current calendar month
               */
              const expectedMaxDateDate = new Date($expectedMax);
              const nextMaxDateDate = new Date(expectedMaxDateDate).setUTCDate(expectedMaxDateDate.getUTCDate() + 1);
              const nextMaxDate = calendar?.query<HTMLTableCellElement>(
                elementSelectors.calendarDayWithLabel(
                  formatters.fullDateFormat(nextMaxDateDate)
                )
              );

              expect(nextMaxDate).exist;
              expect(nextMaxDate?.getAttribute('aria-selected')).equal('false');
              expect(nextMaxDate?.getAttribute('aria-disabled')).equal('true');
            }
          }
        }

      });
    }
  );

});
