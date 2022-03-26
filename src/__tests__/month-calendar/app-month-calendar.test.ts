import '../../month-calendar/app-month-calendar';

import { expect, fixture } from '@open-wc/testing';
import { html } from '@open-wc/testing-helpers';
import type { SendKeysPayload } from '@web/test-runner-commands';
import { sendKeys } from '@web/test-runner-commands';
import { calendar } from 'nodemod/dist/calendar/calendar.js';
import { getWeekdays } from 'nodemod/dist/calendar/helpers/get-weekdays.js';
import type { GetWeekdaysInit } from 'nodemod/dist/calendar/helpers/typings';
import type { CalendarInit } from 'nodemod/dist/calendar/typings';

import type { confirmKeySet, navigationKeySetGrid} from '../../constants';
import { labelShortWeek} from '../../constants';
import { weekNumberTemplate } from '../../constants';
import { labelWeek } from '../../constants';
import { labelSelectedDate, labelToday } from '../../constants';
import { toDateString } from '../../helpers/to-date-string';
import { toFormatters } from '../../helpers/to-formatters';
import type { AppMonthCalendar } from '../../month-calendar/app-month-calendar';
import { appMonthCalendarName } from '../../month-calendar/constants';
import type { MonthCalendarData } from '../../month-calendar/typings';
import type { CustomEventDetail, InferredFromSet } from '../../typings';
import { messageFormatter } from '../test-utils/message-formatter';
import { queryDeepActiveElement } from '../test-utils/query-deep-active-element';

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
    weekNumberTemplate,
    weekNumberType: 'first-4-day-week',
  };
  const weekdaysInit: GetWeekdaysInit = {
    longWeekdayFormat: formatters.longWeekdayFormat,
    narrowWeekdayFormat: formatters.narrowWeekdayFormat,
    firstDayOfWeek: calendarInit.firstDayOfWeek,
    showWeekNumber: calendarInit.showWeekNumber,
    shortWeekLabel: labelShortWeek,
    weekLabel: labelWeek,
  };
  const calendarResult = calendar(calendarInit);
  const data: MonthCalendarData = {
    calendar: calendarResult.calendar,
    currentDate: calendarInit.date,
    date: calendarInit.date,
    disabledDatesSet: calendarResult.disabledDatesSet,
    disabledDaysSet: calendarResult.disabledDaysSet,
    formatters,
    max: calendarInit.max as Date,
    min: calendarInit.min as Date,
    selectedDateLabel: labelSelectedDate,
    showCaption: false,
    showWeekNumber: false,
    todayDate: calendarInit.date,
    todayLabel: labelToday,
    weekdays: getWeekdays(weekdaysInit),
  };
  const elementSelectors = {
    calendarCaption: '.calendar-caption',
    calendarDay: 'td.calendar-day',
    calendarDayWeekNumber: 'th.calendar-day.week-number',
    calendarTable: '.calendar-table',
    disabledCalendarDay: 'td.calendar-day[aria-disabled="true"]',
    hiddenCalendarDay: 'td.calendar-day[aria-hidden="true"]',
    monthCalendar: '.month-calendar',
    selectedCalendarDay: 'td.calendar-day[aria-selected="true"]',
    tabbableCalendarDay: 'td.calendar-day[tabindex="0"]',
    todayCalendarDay: 'td.calendar-day.day--today',
    weekday: 'th.weekday',
  } as const;

  type CaseRenderMonthCalendar = [
    _message: string,
    data: MonthCalendarData | undefined,
    shouldRender: boolean
  ];
  const casesRenderMonthCalendar: CaseRenderMonthCalendar[] = [
    ['', data, true],
    ['nothing', undefined, false],
  ];
  casesRenderMonthCalendar.forEach(a => {
    const [, testData, testShouldRender] = a;

    it(messageFormatter('renders %s(data=%j)', a), async () => {
      const el = await fixture<AppMonthCalendar>(
        html`<app-month-calendar .data=${testData}></app-month-calendar>`
      );

      const monthCalendar = el.query<HTMLDivElement>(
        elementSelectors.monthCalendar
      );
      const calendarTable = el.query<HTMLTableElement>(
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
    const tabbableCalendarDay = el.query<HTMLTableCellElement>(
      `${elementSelectors.tabbableCalendarDay}[aria-label="${formatters.fullDateFormat(expected)}"]`
    );

    expect(tabbableCalendarDay).exist;
    expect(tabbableCalendarDay?.fullDate).deep.equal(expected);
  });

  type CaseRenderElement = [
    _message: string,
    partialData: Partial<MonthCalendarData>,
    elementSelector: string
  ];
  const casesRenderElement: CaseRenderElement[] = [
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
  casesRenderElement.forEach(a => {
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

      const element = el.query<HTMLDivElement>(
        testElementSelector
      );

      expect(element).exist;
    });
  });

  type CaseSelectNewDate = [
    eventType: 'click' | 'keydown',
    keyPayloads: (Partial<Record<
      'down' | 'up' | 'press',
      InferredFromSet<typeof confirmKeySet> | InferredFromSet<typeof navigationKeySetGrid>
    >>)[],
    selectedDate: Date
  ];
  const casesSelectNewDate: CaseSelectNewDate[] = [
    ['click', [], new Date('2020-02-09')],
    [
      'keydown',
      [
        { down: 'ArrowDown' },
        { up: 'ArrowDown' },
      ],
      data.date,
    ],
    [
      'keydown',
      [
        { down: 'ArrowDown' },
        { up: 'ArrowDown' },
        { press: ' ' },
      ],
      data.date,
    ],
    [
      'keydown',
      [
        { down: 'ArrowDown' },
        { up: 'ArrowDown' },
        { press: 'Enter' },
      ],
      data.date,
    ],
  ];
  casesSelectNewDate.forEach(a => {
    const [testEventType, testKeyPayloads, testSelectedDate] = a;
    it(
      messageFormatter('selects new date (eventType=%s, sendKeysPayloads=%j)', a),
      async () => {
        const el = await fixture<AppMonthCalendar>(
          html`<app-month-calendar .data=${data}></app-month-calendar>`
        );

        const dateUpdatedEventTask = new Promise((resolve) => {
          el.addEventListener('date-updated', function fn(ev) {
            resolve((ev as CustomEvent<CustomEventDetail['date-updated']['detail']>).detail);

            el.removeEventListener('date-updated', fn);
          });
        });

        const selectedDate = el.query<HTMLTableCellElement>(
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

        const newSelectedDate = el.query<HTMLTableCellElement>(
          elementSelectors.selectedCalendarDay
        );

        expect(newSelectedDate).exist;
        expect(newSelectedDate?.getAttribute('aria-label')).equal(
          formatters.fullDateFormat(calendarInit.date)
        );
        expect(newSelectedDate?.fullDate).deep.equal(calendarInit.date);

        const isKeypress = testEventType === 'keydown';
        const expectedDate = new Date('2020-02-09');
        const expectedDateUpdatedEvent: CustomEventDetail['date-updated']['detail'] = {
          isKeypress,
          value: toDateString(expectedDate),
          valueAsDate: expectedDate,
          valueAsNumber: +expectedDate,
          ...(isKeypress && { key: testKeyPayloads[0].down }),
        };

        expect(dateUpdatedEvent).deep.equal(expectedDateUpdatedEvent);
        expect(el.root.activeElement?.isEqualNode(newSelectedDate ?? null));
      }
    );
  });

  it('tabs new element', async () => {
    const el = await fixture<AppMonthCalendar>(
      html`<app-month-calendar .data=${data}></app-month-calendar>`
    );

    const calendarTable = el.query<HTMLTableElement>(elementSelectors.calendarTable);

    expect(calendarTable).exist;

    calendarTable?.focus();

    let activeElement = queryDeepActiveElement();

    expect(activeElement?.isEqualNode(calendarTable)).true;

    await sendKeys({ down: 'Tab' } as SendKeysPayload);
    await sendKeys({ up: 'Tab' } as SendKeysPayload);

    activeElement = queryDeepActiveElement();

    const selectedDate = el.query<HTMLTableCellElement>(
      `${elementSelectors.calendarDay}[aria-label="${
        formatters.fullDateFormat(calendarInit.date)
      }"]`
    );

    expect(activeElement).exist;
    expect(activeElement?.isEqualNode(selectedDate)).true;
  });

  type CaseNotSelectNewDate = [
    partialDate: Partial<MonthCalendarData>,
    elementSelector: string
  ];
  const casesNotSelectNewDate: CaseNotSelectNewDate[] = [
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
  casesNotSelectNewDate.forEach(a => {
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

        const newSelectedDate = el.query<HTMLTableCellElement>(
          testElementSelector
        );

        newSelectedDate?.focus();
        newSelectedDate?.click();

        await el.updateComplete;

        const selectedDate = el.query<HTMLTableCellElement>(
          elementSelectors.selectedCalendarDay
        );

        /**
         * NOTE(motss): Selected date remains unchanged after selecting new date
         */
        expect(selectedDate).exist;
        expect(selectedDate?.getAttribute('aria-label')).equal(
          formatters.fullDateFormat(data.date)
        );
      }
    );
  });

  it('renders correct attributes for selected today', async () => {
    const el = await fixture<AppMonthCalendar>(
      html`<app-month-calendar .data=${data}></app-month-calendar>`
    );

    const selectedDate = el.query<HTMLTableCellElement>(elementSelectors.selectedCalendarDay);
    const todayDate = el.query<HTMLTableCellElement>(elementSelectors.todayCalendarDay);

    expect(selectedDate).exist;
    expect(todayDate).exist;
    expect(selectedDate?.isEqualNode(todayDate)).true;

    expect(selectedDate).attr('title', labelSelectedDate);
    expect(todayDate).attr('title', labelSelectedDate);

    expect(todayDate?.part.contains('today')).true;
  });

  type CaseWeekdayTitles = [
    partialMonthCalendarData: Partial<MonthCalendarData>,
    partialWeekdaysInit: Partial<GetWeekdaysInit>,
    expectedWeekdayTitles: string[]
  ];
  const casesWeekdayTitles: CaseWeekdayTitles[] = [
    [{}, {}, ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']],
    [{ showWeekNumber: true }, { showWeekNumber: true }, [labelWeek, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']],
    [{ showWeekNumber: true }, { showWeekNumber: true, shortWeekLabel: '週', weekLabel: '週目' }, ['週目', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']],
  ];
  casesWeekdayTitles.forEach((a) => {
    const [
      testPartialMonthCalendarData,
      testPartialWeekdaysInit,
      expectedWeekdayTitles,
    ] = a;

    it(
      messageFormatter('renders correct title for weekdays (partialMonthCalendarData=%j, partialWeekdaysInit=%j)', a),
      async () => {
        const testData: MonthCalendarData = {
          ...data,
          ...testPartialMonthCalendarData,
        };

        const el = await fixture<AppMonthCalendar>(
          html`<app-month-calendar .data=${{
            ...testData,
            weekdays: getWeekdays({
              ...weekdaysInit,
              ...testPartialWeekdaysInit,
            }),
          }}></app-month-calendar>`
        );

        const weekdays = el.queryAll(elementSelectors.weekday);

        expect(weekdays.map(n => n.title)).deep.equal(expectedWeekdayTitles);
      }
    );
  });

  type CaseSelectedDateLabelAndTodayDateLabel = [
    testSelectedDateLabel: string | undefined,
    testTodayDateLabel: string | undefined,
    expectedSelectedDateLabel: string | undefined,
    expectedTodayDateLabel: string | undefined
  ];
  const casesSelectedDateLabelAndTodayDateLabel: CaseSelectedDateLabelAndTodayDateLabel[] = [
    [undefined, undefined, undefined, undefined],
    ['', '', '', ''],
    [labelSelectedDate, labelToday, labelSelectedDate, labelToday],
  ];
  casesSelectedDateLabelAndTodayDateLabel.forEach((a) => {
    const [
      testSelectedDateLabel,
      testTodayDateLabel,
      expectedSelectedDateLabel,
      expectedTodayDateLabel,
    ] = a;

    it(
      messageFormatter('renders correct title (selectedDateLabel=%s, todayDateLabel=%s)', a),
      async () => {
        const todayFullDate = new Date(data.todayDate);
        const todayUTCDate = todayFullDate.getUTCDate();

        const date = new Date(new Date(todayFullDate).setUTCDate(todayUTCDate + 2));
        const testData: MonthCalendarData = {
          ...data,
          date,
          selectedDateLabel: testSelectedDateLabel as string,
          todayLabel: testTodayDateLabel as string,
        };

        const el = await fixture<AppMonthCalendar>(
          html`<app-month-calendar .data=${testData}></app-month-calendar>`
        );

        const selectedDate = el.query<HTMLTableCellElement>(elementSelectors.selectedCalendarDay);
        const todayDate = el.query<HTMLTableCellElement>(elementSelectors.todayCalendarDay);

        expect(selectedDate).exist;
        expect(todayDate).exist;

        if (expectedSelectedDateLabel == null && expectedTodayDateLabel == null) {
          expect(selectedDate).not.attr('title');
          expect(todayDate).not.attr('title');
        } else {
          expect(selectedDate).attr('title', expectedSelectedDateLabel);
          expect(todayDate).attr('title', expectedTodayDateLabel);
        }
      }
    );
  });

});
