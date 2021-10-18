import '../../month-calendar/app-month-calendar';

import { expect, fixture } from '@open-wc/testing';
import { html } from '@open-wc/testing-helpers';
import type { SendKeysPayload } from '@web/test-runner-commands';
import { sendKeys } from '@web/test-runner-commands';
import { calendar } from 'nodemod/dist/calendar/calendar.js';
import { getWeekdays } from 'nodemod/dist/calendar/helpers/get-weekdays.js';
import type { CalendarInit } from 'nodemod/dist/calendar/typings';

import type { confirmKeySet, navigationKeySetGrid } from '../../constants';
import { toFormatters } from '../../helpers/to-formatters';
import type { AppMonthCalendar } from '../../month-calendar/app-month-calendar';
import { appMonthCalendarName } from '../../month-calendar/constants';
import type { MonthCalendarData } from '../../month-calendar/typings';
import type { DateUpdatedEvent, InferredFromSet } from '../../typings';
import { messageFormatter } from '../test-utils/message-formatter';

describe(appMonthCalendarName, () => {
  const locale = 'en-US';
  const formatters = toFormatters(locale);
  const calendarInit: CalendarInit = {
    date: new Date('2020-02-02'),
    dayFormat: formatters.dayFormat,
    fullDateFormat: formatters.fullDateFormat,
    locale,
    disabledDates: [],
    disabledDays: [],
    firstDayOfWeek: 0,
    max: new Date('2100-12-31'),
    min: new Date('1970-01-01'),
    showWeekNumber: false,
    weekLabel: 'Wk',
    weekNumberType: 'first-4-day-week',
  };
  const calendarResult = calendar(calendarInit);
  const data: MonthCalendarData = {
    calendar: calendarResult.calendar,
    currentDate: calendarInit.date,
    date: calendarInit.date,
    disabledDatesSet: calendarResult.disabledDatesSet,
    disabledDaysSet: calendarResult.disabledDaysSet,
    max: calendarInit.max as Date,
    min: calendarInit.min as Date,
    todayDate: calendarInit.date,
    weekdays: getWeekdays({
      longWeekdayFormat: formatters.longWeekdayFormat,
      narrowWeekdayFormat: formatters.narrowWeekdayFormat,
      firstDayOfWeek: calendarInit.firstDayOfWeek,
      showWeekNumber: calendarInit.showWeekNumber,
      weekLabel: calendarInit.weekLabel,
    }),
    formatters,
  };
  const elementSelectors = {
    calendarCaption: '.calendar-caption',
    calendarTable: '.calendar-table',
    monthCalendar: '.month-calendar',
    calendarDay: 'td.calendar-day',
    tabbableCalendarDay: 'td.calendar-day[tabindex="0"]',
    selectedCalendarDay: 'td.calendar-day[aria-selected="true"]',
    disabledCalendarDay: 'td.calendar-day[aria-disabled="true"]',
    calendarDayWeekNumber: 'th.calendar-day.week-number',
    hiddenCalendarDay: 'td.calendar-day[aria-hidden="true"]',
  } as const;

  type A = [string, MonthCalendarData | undefined, boolean];
  const cases: A[] = [
    ['', data, true],
    ['nothing', undefined, false],
  ];
  cases.forEach(a => {
    const [, testData, testShouldRender] = a;

    it(messageFormatter('renders %s(data=%j)', a), async () => {
      const el = await fixture(
        html`<app-month-calendar .data=${testData}></app-month-calendar>`
      );

      const monthCalendar = el.shadowRoot?.querySelector<HTMLDivElement>(
        elementSelectors.monthCalendar
      );
      const calendarTable = el.shadowRoot?.querySelector<HTMLTableElement>(
        elementSelectors.calendarTable
      );

      if (testShouldRender) {
        expect(monthCalendar).exist;
        expect(calendarTable).exist;
      } else {
        expect(monthCalendar).not.exist;
        expect(calendarTable).not.exist;
      }
    });
  });

  it('renders first day of calendar month of current date when it has a different month than selected date', async () => {
    const testCurrentDate = new Date('2020-03-03');
    const testCalendar = calendar({
      ...calendarInit,
      date: testCurrentDate,
    });
    const el = await fixture<AppMonthCalendar>(
      html`<app-month-calendar .data=${{
        ...data,
        calendar: testCalendar.calendar,
        currentDate: testCurrentDate,
      }}></app-month-calendar>`
    );

    const expected = new Date('2020-03-01');
    const tabbableCalendarDay = el.shadowRoot?.querySelector<HTMLTableCellElement>(
      `${elementSelectors.tabbableCalendarDay}[aria-label="${formatters.fullDateFormat(expected)}"]`
    );

    expect(tabbableCalendarDay).exist;
    expect(tabbableCalendarDay?.fullDate).deep.equal(expected);
  });

  type A2 = [string, Partial<MonthCalendarData>, string];
  const cases2: A2[] = [
    ['calendar caption', { showCaption: true }, elementSelectors.calendarCaption],
    ['week numbers', { showWeekNumber: true }, elementSelectors.calendarDayWeekNumber],
    [
      'disabled day',
      {
        disabledDatesSet: new Set([+new Date('2020-02-15')]),
      },
      `${elementSelectors.disabledCalendarDay}[aria-label="${
        formatters.fullDateFormat(new Date('2020-02-15'))
      }"]`,
    ],
  ];
  cases2.forEach(a => {
    const [, testPartialData, testElementSelector] = a;
    it(messageFormatter('renders %s', a), async () => {
      const testCalendar = calendar({
        ...calendarInit,
        ...(
          testPartialData.disabledDatesSet && {
            disabledDates: [...testPartialData.disabledDatesSet].map(n => new Date(n)),
          }
        ),
        showWeekNumber: testPartialData.showWeekNumber,
      });
      const el = await fixture<AppMonthCalendar>(
        html`<app-month-calendar .data=${{
          ...data,
          ...testPartialData,
          calendar: testCalendar.calendar,
        }}></app-month-calendar>`
      );

      const element = el.shadowRoot?.querySelector<HTMLDivElement>(
        testElementSelector
      );

      expect(element).exist;
    });
  });

  type A3 = [
    'click' | 'keydown',
    (Partial<Record<
      'down' | 'press',
      InferredFromSet<typeof confirmKeySet> | InferredFromSet<typeof navigationKeySetGrid>
    >>)[],
    Date
  ];
  const cases3: A3[] = [
    ['click', [], new Date('2020-02-09')],
    [
      'keydown',
      [
        { down: 'ArrowDown' },
      ],
      data.date,
    ],
    [
      'keydown',
      [
        { down: 'ArrowDown' },
        { press: ' ' },
      ],
      data.date,
    ],
    [
      'keydown',
      [
        { down: 'ArrowDown' },
        { press: 'Enter' },
      ],
      data.date,
    ],
  ];
  cases3.forEach(a => {
    const [testEventType, testKeyPayloads, testSelectedDate] = a;
    it(
      messageFormatter('selects new date (eventType=%s, sendKeysPayloads=%j)', a),
      async () => {
        const el = await fixture<AppMonthCalendar>(
          html`<app-month-calendar .data=${data}></app-month-calendar>`
        );

        const dateUpdatedEventTask = new Promise((resolve) => {
          el.addEventListener('date-updated', function fn(ev) {
            resolve((ev as CustomEvent<DateUpdatedEvent>).detail);

            el.removeEventListener('date-updated', fn);
          });
        });

        const selectedDate = el.shadowRoot?.querySelector<HTMLTableCellElement>(
          `${elementSelectors.calendarDay}[aria-label="${
            formatters.fullDateFormat(testSelectedDate)
          }"]`
        );

        expect(selectedDate).exist;

        selectedDate?.focus();

        if (testEventType === 'click') {
          selectedDate?.click();
        } else {
          for (const n of testKeyPayloads) {
            await sendKeys(n as SendKeysPayload);
          }
        }

        el.requestUpdate();

        await el.updateComplete;
        const dateUpdatedEvent = await dateUpdatedEventTask;

        const newSelectedDate = el.shadowRoot?.querySelector<HTMLTableCellElement>(
          elementSelectors.selectedCalendarDay
        );

        expect(newSelectedDate).exist;
        expect(newSelectedDate?.getAttribute('aria-label')).equal(
          formatters.fullDateFormat(calendarInit.date)
        );
        expect(newSelectedDate?.fullDate).deep.equal(calendarInit.date);

        const expectedDateUpdatedEvent: DateUpdatedEvent = {
          isKeypress: testEventType === 'keydown',
          value: new Date('2020-02-09'),
        };

        expect(dateUpdatedEvent).deep.equal(expectedDateUpdatedEvent);
        expect(el.shadowRoot?.activeElement?.isEqualNode(newSelectedDate ?? null));
      }
    );
  });

  type A4 = [Partial<MonthCalendarData>, string];
  const cases4: A4[] = [
    [{}, elementSelectors.calendarTable],
    [{}, elementSelectors.hiddenCalendarDay],
    [
      {},
      `${elementSelectors.disabledCalendarDay}[aria-label="${
        formatters.fullDateFormat(new Date(calendarInit.date))
      }"]`,
    ],
    [
      {
        disabledDatesSet: new Set([+new Date('2020-02-15')]),
      },
      `${elementSelectors.disabledCalendarDay}[aria-label="${
        formatters.fullDateFormat(new Date('2020-02-15'))
      }"]`,
    ],
  ];
  cases4.forEach(a => {
    const [testPartialData, testElementSelector] = a;
    it(
      messageFormatter('does not select new date (partialData=%j, elementSelector=%s)', a),
      async () => {
        const testCalendar = calendar({
          ...calendarInit,
          ...(
            testPartialData.disabledDatesSet && {
              disabledDates: [...testPartialData.disabledDatesSet].map(n => new Date(n)),
            }
          ),
        });
        const el = await fixture<AppMonthCalendar>(
          html`<app-month-calendar .data=${{
            ...data,
            ...testPartialData,
            calendar: testCalendar.calendar,
            disabledDatesSet: testCalendar.disabledDatesSet,
          }}></app-month-calendar>`
        );

        const newSelectedDate = el.shadowRoot?.querySelector<HTMLTableCellElement>(
          testElementSelector
        );

        newSelectedDate?.focus();
        newSelectedDate?.click();

        await el.updateComplete;

        const selectedDate = el.shadowRoot?.querySelector<HTMLTableCellElement>(
          elementSelectors.selectedCalendarDay
        );

        expect(selectedDate).exist;
        expect(selectedDate?.getAttribute('aria-label')).equal(
          formatters.fullDateFormat(data.date)
        );
      }
    );
  });

  // type A5 = [string, 'click' | 'keydown'];
  // const cases5 = [
  //   ['focuses', 'click'],
  // ];
  // cases5.forEach(a => {
  //   const [testPartialData, testElementSelector] = a;
  //   it(
  //     messageFormatter('%s new date (eventType=%s)', a),
  //     async () => {
  //       const testCalendar = calendar({
  //         ...calendarInit,
  //         ...(
  //           testPartialData.disabledDatesSet && {
  //             disabledDates: [...testPartialData.disabledDatesSet].map(n => new Date(n)),
  //           }
  //         ),
  //       });
  //       const el = await fixture<AppMonthCalendar>(
  //         html`<app-month-calendar .data=${{
  //           ...data,
  //           ...testPartialData,
  //           calendar: testCalendar.calendar,
  //           disabledDatesSet: testCalendar.disabledDatesSet,
  //         }}></app-month-calendar>`
  //       );

  //       const newSelectedDate = el.shadowRoot?.querySelector<HTMLTableCellElement>(
  //         testElementSelector
  //       );

  //       newSelectedDate?.focus();
  //       newSelectedDate?.click();

  //       await el.updateComplete;

  //       const selectedDate = el.shadowRoot?.querySelector<HTMLTableCellElement>(
  //         elementSelectors.selectedCalendarDay
  //       );

  //       expect(selectedDate).exist;
  //       expect(selectedDate?.getAttribute('aria-label')).equal(
  //         formatters.fullDateFormat(data.date)
  //       );
  //     }
  //   );
  // });

});
