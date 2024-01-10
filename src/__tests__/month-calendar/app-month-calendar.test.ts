import '../../month-calendar/app-month-calendar';

import { defineCE, fixture, html, unsafeStatic } from '@open-wc/testing-helpers';
import { state } from 'lit/decorators.js';
import { calendar, getWeekdays } from 'nodemod/calendar';
import type { GetWeekdaysInit } from 'nodemod/dist/calendar/helpers/typings.js';
import type { CalendarInit } from 'nodemod/dist/calendar/typings.js';
import { describe, expect, it } from 'vitest';

import { type confirmKeySet, labelSelectedDate, labelShortWeek, labelToday, labelWeek, type navigationKeySetGrid, weekNumberTemplate } from '../../constants';
import { toDateString } from '../../helpers/to-date-string';
import { toFormatters } from '../../helpers/to-formatters';
import type { AppMonthCalendar } from '../../month-calendar/app-month-calendar';
import { appMonthCalendarName } from '../../month-calendar/constants';
import type { MonthCalendarData } from '../../month-calendar/typings';
import { RootElement } from '../../root-element/root-element';
import type { CustomEventDetail, InferredFromSet } from '../../typings';
import { queryDeepActiveElement } from '../test-utils/query-deep-active-element';

describe(appMonthCalendarName, () => {
  const locale = 'en-US';
  const formatters = toFormatters(locale);
  const calendarInit: CalendarInit = {
    date: new Date('2020-02-02'),
    dayFormat: formatters.dayFormat,
    disabledDates: [],
    disabledDays: [],
    firstDayOfWeek: 0,
    fullDateFormat: formatters.fullDateFormat,
    locale,
    max: new Date('2100-12-31'),
    min: new Date('1970-01-01'),
    showWeekNumber: false,
    weekNumberTemplate,
    weekNumberType: 'first-4-day-week',
  };
  const weekdaysInit = {
    firstDayOfWeek: calendarInit.firstDayOfWeek,
    longWeekdayFormat: formatters.longWeekdayFormat,
    narrowWeekdayFormat: formatters.narrowWeekdayFormat,
    shortWeekLabel: labelShortWeek,
    showWeekNumber: calendarInit.showWeekNumber,
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

  it.each<{
    $_shouldRender: boolean;
    _message: string;
    data: MonthCalendarData | undefined;
  }>([
    { $_shouldRender: true, _message: '', data },
    { $_shouldRender: false, _message: 'nothing', data: undefined },
  ])('renders $_message(data=$data)', async ({
    $_shouldRender,
    data,
  }) => {
    const el = await fixture<AppMonthCalendar>(
      html`<app-month-calendar .data=${data}></app-month-calendar>`
    );

    const monthCalendar = el.query<HTMLDivElement>(
      elementSelectors.monthCalendar
    );
    const calendarTable = el.query<HTMLTableElement>(
      elementSelectors.calendarTable
    );

    if ($_shouldRender) {
      expect(monthCalendar).toBeInTheDocument();
      expect(calendarTable).toBeInTheDocument();
    } else {
      expect(monthCalendar).not.toBeInTheDocument();
      expect(calendarTable).not.toBeInTheDocument();
    }
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

    expect(tabbableCalendarDay).toBeInTheDocument();
    expect(tabbableCalendarDay?.fullDate).toEqual(expected);
  });

  it.each<{
    _message: string;
    elementSelector: string;
    partialData: Partial<MonthCalendarData>;
  }>([
    { _message: 'calendar caption', elementSelector: elementSelectors.calendarCaption, partialData: { showCaption: true } },
    { _message: 'week numbers', elementSelector: elementSelectors.calendarDayWeekNumber, partialData: { showWeekNumber: true } },
    {
      _message: 'disabled day',
      elementSelector: `${elementSelectors.disabledCalendarDay}[aria-label="${
        formatters.fullDateFormat(new Date('2020-02-15'))
      }"]`,
      partialData: {
        disabledDatesSet: new Set([+new Date('2020-02-15')]),
      },
    },
  ])('renders $_message', async ({
    elementSelector,
    partialData,
  }) => {
    const testCalendar = calendar({
      ...calendarInit,
      ...(
        partialData.disabledDatesSet && {
          disabledDates: [...partialData.disabledDatesSet].map(n => new Date(n)),
        }
      ),
      showWeekNumber: partialData.showWeekNumber,
    });
    const el = await fixture<AppMonthCalendar>(
      html`<app-month-calendar .data=${{
        ...data,
        ...partialData,
        calendar: testCalendar.calendar,
      }}></app-month-calendar>`
    );

    const element = el.query<HTMLDivElement>(elementSelector);

    expect(element).toBeInTheDocument();
  });

  it.each<{
    eventType: 'click' | 'keydown';
    keyTriggerList: {
      key: InferredFromSet<typeof confirmKeySet> | InferredFromSet<typeof navigationKeySetGrid>
      type: `key${'down' | 'press' | 'up'}`;
    }[];
    selectedDate: Date;
  }>([
    { eventType: 'click', keyTriggerList: [], selectedDate: new Date('2020-02-09') },
    {
      eventType: 'keydown',
      keyTriggerList: [
        { key: 'ArrowDown', type: 'keydown' },
        { key: 'ArrowDown', type: 'keyup' },
      ],
      selectedDate: new Date('2020-02-09'),
    },
    {
      eventType: 'keydown',
      keyTriggerList: [
        { key: 'ArrowDown', type: 'keydown' },
        { key: 'ArrowDown', type: 'keyup' },
        { key: ' ', type: 'keypress' },
      ],
      selectedDate: new Date('2020-02-09'),
    },
    {
      eventType: 'keydown',
      keyTriggerList: [
        { key: 'ArrowDown', type: 'keydown' },
        { key: 'ArrowDown', type: 'keyup' },
        { key: 'Enter', type: 'keypress' },
      ],
      selectedDate: new Date('2020-02-09'),
    },
  ])('selects new date (eventType=$eventType, keyTriggerList=$keyTriggerList)', async ({
    eventType,
    keyTriggerList,
    selectedDate,
  }) => {
    class Test extends RootElement {
      #updateData = async ({
        detail: {
          isKeypress,
          key,
          value,
          valueAsDate,
          valueAsNumber,
        },
      }: CustomEvent<CustomEventDetail['date-updated']['detail']>) => {
        this.newValue = value ?? '';

        await this.updateComplete;

        this.fire({
          detail: {
            isKeypress,
            key,
            value,
            valueAsDate,
            valueAsNumber,
          },
          type: 'done',
        });
      };

      @state() private newValue: string = '';
  
      override render() {
        const monthCalendarData: MonthCalendarData = {
          ...data,
          ...(
            this.newValue ? { date: new Date(this.newValue) } : {}
          ),
        };
  
        return html`
        <app-month-calendar
          .data=${monthCalendarData}
          @date-updated=${this.#updateData}
        ></app-month-calendar>
        `;
      }
    }

    const renderWithWrapper = async (): Promise<{
      el: AppMonthCalendar;
      root: Test;
    }> => {
      const tag = defineCE(Test);
      // eslint-disable-next-line lit/binding-positions, lit/no-invalid-html
      const root = await fixture<Test>(html`<${unsafeStatic(tag)}></${unsafeStatic(tag)}>`);
      
      return {
        el: root.query<AppMonthCalendar>('app-month-calendar') as AppMonthCalendar,
        root,
      };
    };
    const { el, root } = await renderWithWrapper();

    const dateUpdatedEventTask = new Promise((resolve) => {
      root.addEventListener('done', (ev) => {
        resolve((ev as CustomEvent<CustomEventDetail['date-updated']['detail']>).detail);
      }, { once: true });
    });

    const selectedDateEl = el.query<HTMLTableCellElement>(
      `${elementSelectors.calendarDay}[aria-label="${
        formatters.fullDateFormat(selectedDate)
      }"]`
    );

    expect(selectedDateEl).toBeInTheDocument();

    selectedDateEl?.focus();

    if (eventType === 'click') {
      selectedDateEl?.click();
    } else {
      for (const { key, type } of keyTriggerList) {
        // fixme: use native browser keypress when vitest supports it
        el.query('table')?.dispatchEvent(new KeyboardEvent(type, { key }));
      }
    }

    const dateUpdatedEvent = await dateUpdatedEventTask;

    const newSelectedDateEl = el.query<HTMLTableCellElement>(
      elementSelectors.selectedCalendarDay
    );

    expect(newSelectedDateEl).toBeInTheDocument();
    expect(newSelectedDateEl).toHaveAttribute('aria-label', formatters.fullDateFormat(selectedDate));
    expect(newSelectedDateEl?.fullDate).toEqual(selectedDate);

    const isKeypress = eventType === 'keydown';
    const expectedDate = new Date('2020-02-09');
    const expectedDateUpdatedEvent: CustomEventDetail['date-updated']['detail'] = {
      isKeypress,
      value: toDateString(expectedDate),
      valueAsDate: expectedDate,
      valueAsNumber: +expectedDate,
      ...(isKeypress && { key: keyTriggerList[0].key }),
    };

    expect(dateUpdatedEvent).toEqual(expectedDateUpdatedEvent);
    expect(el.root.activeElement?.isEqualNode(newSelectedDateEl ?? null)).true;
  });

  it.skip(/** fixme: require native browser keypress to tab to focus */'tabs new element', async () => {
    const el = await fixture<AppMonthCalendar>(
      html`<app-month-calendar .data=${data}></app-month-calendar>`
    );

    const calendarTable = el.query<HTMLTableElement>(elementSelectors.calendarTable);

    expect(calendarTable).toBeInTheDocument();

    calendarTable?.focus();

    let activeElement = queryDeepActiveElement();

    expect(activeElement?.isEqualNode(calendarTable)).true;

    // await sendKeys({ down: 'Tab' } as SendKeysPayload);
    // await sendKeys({ up: 'Tab' } as SendKeysPayload);
    // fixme: use native browser keypress when vitest supports it
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Tab' }));

    activeElement = queryDeepActiveElement();

    const selectedDate = el.query<HTMLTableCellElement>(
      `${elementSelectors.calendarDay}[aria-label="${
        formatters.fullDateFormat(calendarInit.date)
      }"]`
    );

    expect(activeElement).toBeInTheDocument();
    expect(activeElement?.isEqualNode(selectedDate)).true;
  });

  it.each<{
    elementSelector: string;
    partialData: Partial<MonthCalendarData>;
  }>([
    { elementSelector: elementSelectors.calendarTable, partialData: {} },
    { elementSelector: elementSelectors.hiddenCalendarDay, partialData: {} },
    {
      elementSelector: `${elementSelectors.disabledCalendarDay}[aria-label="${
        formatters.fullDateFormat(new Date(calendarInit.date))
      }"]`,
      partialData: {},
    },
    {
      elementSelector: `${elementSelectors.disabledCalendarDay}[aria-label="${
        formatters.fullDateFormat(new Date('2020-02-15'))
      }"]`,
      partialData: {
        disabledDatesSet: new Set([+new Date('2020-02-15')]),
      },
    },
  ])('does not select new date (partialData=$partialData, elementSelector=$elementSelector)', async ({
    elementSelector,
    partialData,
  }) => {
    const testCalendar = calendar({
      ...calendarInit,
      ...(
        partialData.disabledDatesSet && {
          disabledDates: [...partialData.disabledDatesSet].map(n => new Date(n)),
        }
      ),
    });
    const el = await fixture<AppMonthCalendar>(
      html`<app-month-calendar .data=${{
        ...data,
        ...partialData,
        calendar: testCalendar.calendar,
        disabledDatesSet: testCalendar.disabledDatesSet,
      }}></app-month-calendar>`
    );

    const newSelectedDate = el.query<HTMLTableCellElement>(
      elementSelector
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
    expect(selectedDate).toBeInTheDocument();
    expect(selectedDate).toHaveAttribute('aria-label', formatters.fullDateFormat(data.date));
  });

  it('renders correct attributes for selected today', async () => {
    const el = await fixture<AppMonthCalendar>(
      html`<app-month-calendar .data=${data}></app-month-calendar>`
    );

    const selectedDate = el.query<HTMLTableCellElement>(elementSelectors.selectedCalendarDay);
    const todayDate = el.query<HTMLTableCellElement>(elementSelectors.todayCalendarDay);

    expect(selectedDate).toBeInTheDocument();
    expect(todayDate).toBeInTheDocument();
    expect(selectedDate?.isEqualNode(todayDate)).true;

    expect(selectedDate).toHaveAttribute('title', labelSelectedDate);
    expect(todayDate).toHaveAttribute('title', labelSelectedDate);

    expect(todayDate?.part.contains('today')).true;
  });

  it.each<{
    $_weekdayTitles: string[];
    partialMonthCalendarData: Partial<MonthCalendarData>;
    partialWeekdaysInit: Partial<GetWeekdaysInit>;
  }>([
    { $_weekdayTitles: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], partialMonthCalendarData: {}, partialWeekdaysInit: {} },
    { $_weekdayTitles: [labelWeek, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], partialMonthCalendarData: { showWeekNumber: true }, partialWeekdaysInit: { showWeekNumber: true } },
    { $_weekdayTitles: ['週目', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], partialMonthCalendarData: { showWeekNumber: true }, partialWeekdaysInit: { shortWeekLabel: '週', showWeekNumber: true, weekLabel: '週目' } },
  ])('renders correct title for weekdays (partialMonthCalendarData=$partialMonthCalendarData, partialWeekdaysInit=$partialWeekdaysInit)', async ({
    $_weekdayTitles,
    partialMonthCalendarData,
    partialWeekdaysInit,
  }) => {
    const testData: MonthCalendarData = {
      ...data,
      ...partialMonthCalendarData,
    };

    const el = await fixture<AppMonthCalendar>(
      html`<app-month-calendar .data=${{
        ...testData,
        weekdays: getWeekdays({
          ...weekdaysInit,
          ...partialWeekdaysInit,
        }),
      }}></app-month-calendar>`
    );

    const weekdays = el.queryAll(elementSelectors.weekday);

    expect(weekdays.map(n => n.title)).toEqual($_weekdayTitles);
  });

  it.each<{
    $_selectedDateLabel: string | undefined;
    $_todayDateLabel: string | undefined;
    selectedDateLabel: string | undefined;
    todayDateLabel: string | undefined;
  }>([
    {
      $_selectedDateLabel: undefined,
      $_todayDateLabel: undefined,
      selectedDateLabel: undefined,
      todayDateLabel: undefined,
    },
    {
      $_selectedDateLabel: '',
      $_todayDateLabel: '',
      selectedDateLabel: '',
      todayDateLabel: '',
    },
    {
      $_selectedDateLabel: labelSelectedDate,
      $_todayDateLabel: labelToday,
      selectedDateLabel: labelSelectedDate,
      todayDateLabel: labelToday,
    },
  ])('renders correct title (selectedDateLabel=$selectedDateLabel, todayDateLabel=$todayDateLabel)', async ({
    $_selectedDateLabel,
    $_todayDateLabel,
    selectedDateLabel,
    todayDateLabel,
  }) => {
    const todayFullDate = new Date(data.todayDate);
    const todayUTCDate = todayFullDate.getUTCDate();

    const date = new Date(new Date(todayFullDate).setUTCDate(todayUTCDate + 2));
    const testData: MonthCalendarData = {
      ...data,
      date,
      selectedDateLabel: selectedDateLabel as string,
      todayLabel: todayDateLabel as string,
    };

    const el = await fixture<AppMonthCalendar>(
      html`<app-month-calendar .data=${testData}></app-month-calendar>`
    );

    const selectedDate = el.query<HTMLTableCellElement>(elementSelectors.selectedCalendarDay);
    const todayDate = el.query<HTMLTableCellElement>(elementSelectors.todayCalendarDay);

    expect(selectedDate).toBeInTheDocument();
    expect(todayDate).toBeInTheDocument();

    if (selectedDateLabel == null && todayDateLabel == null) {
      expect(selectedDate).not.toHaveAttribute('title');
      expect(todayDate).not.toHaveAttribute('title');
    } else {
      expect(selectedDate).toHaveAttribute('title', $_selectedDateLabel);
      expect(todayDate).toHaveAttribute('title', $_todayDateLabel);
    }
  });

});
