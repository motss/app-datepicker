import '../../date-picker/app-date-picker';

import type { Button } from '@material/mwc-button';
import { describe, expect, it } from 'vitest';
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

describe(appDatePickerName, () => {
  const elementSelectors = {
    body: '.body',
    calendar: '.calendar',
    calendarDay: '.calendar-day',
    calendarDayWithLabel: (label: string) => `.calendar-day[aria-label="${label}"]`,
    disabledCalendarDay: '.calendar-day[aria-disabled="true"]',
    header: '.header',
    nextMonthNavigationButton: 'app-icon-button[data-navigation="next"]',
    previousMonthNavigationButton: 'app-icon-button[data-navigation="previous"]',
    selectedCalendarDay: '.calendar-day[aria-selected="true"]',
    selectedYear: '.year-grid-button[aria-selected="true"]',
    selectedYearMonth: '.selected-year-month',
    yearDropdown: '.year-dropdown',
    yearGrid: '.year-grid',
    yearGridButton: '.year-grid-button',
  } as const;
  const formatters: Formatters = toFormatters('en-US');
  const todayDate = toResolvedDate();

  it.each<{
    startView: StartView | undefined,
    $_visibleElements: ('body' | 'calendar' | 'header' | 'yearGrid')[],
    $_hiddenElements: ('body' | 'calendar' | 'header' | 'yearGrid')[];
  }>([
    {
      startView: undefined,
      $_visibleElements: ['body', 'calendar', 'header'],
      $_hiddenElements: ['yearGrid'],
    },
    {
      startView: 'calendar',
      $_visibleElements: ['body', 'calendar', 'header'],
      $_hiddenElements: ['yearGrid'],
    },
    {
      startView: 'yearGrid',
      $_visibleElements: ['body', 'header', 'yearGrid'],
      $_hiddenElements: ['calendar'],
    }
  ])(`renders (startView=$startView)`, async ({
    startView,
    $_hiddenElements,
    $_visibleElements,
  }) => {
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker .startView=${startView as never}></app-date-picker>`
    );

    $_visibleElements.forEach((n) => {
      const element = el.query(elementSelectors[n]);

      // Verify year dropdown title
      const yearDropdown = el.query<Button>(elementSelectors.yearDropdown);

      expect(yearDropdown).exist;
      expect(yearDropdown?.getAttribute('title')).toBe(
        $_visibleElements.includes('calendar') ?
          labelChooseYear :
          labelChooseMonth
      );

      // Verify body class to ensure .start-view--{calendar|yearGrid} is always set
      if (n === 'body') {
        expect(element?.classList.contains(`start-view--${startView || 'calendar'}`)).toBeTruthy();
      }
    });

    $_hiddenElements.forEach((n) => {
      const element = el.query(elementSelectors[n]);

      expect(element).not.exist;
    });

    if (startView === 'yearGrid') {
      const yearGrid = el.query<AppYearGrid>(elementSelectors.yearGrid);

      expect(yearGrid).exist;
      expect(yearGrid?.getAttribute('exportparts')).toBe('year-grid,year,toyear');
    } else {
      const calendar = el.query<AppMonthCalendar>(elementSelectors.calendar);

      expect(calendar).exist;
      expect(calendar?.getAttribute(
        'exportparts')).toBe(
          'table,caption,weekdays,weekday,weekday-value,week-number,calendar-day,today,calendar'
        );
    }
  });

  it.each<{
    locale: string | undefined,
    $_locale: string,
    $_yearMonthLabel: string;
  }>([
    {
      locale: undefined,
      $_locale: Intl.DateTimeFormat().resolvedOptions().locale,
      $_yearMonthLabel: 'February 2020'
    },
    {
      locale: 'zh-TW',
      $_locale: 'zh-TW',
      $_yearMonthLabel: '2020年2月',
    }
  ])(`renders (locale=$locale)`, async ({
    $_locale,
    $_yearMonthLabel,
    locale,
  }) => {
    const testValue = '2020-02-02';
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker .locale=${locale as never} min="1970-01-01" value=${testValue}></app-date-picker>`
    );

    const selectedYearMonth = el.query<HTMLParagraphElement>(
      elementSelectors.selectedYearMonth
    );

    expect(el.locale).equal($_locale);
    expect(el.value).equal(testValue);
    expect(selectedYearMonth?.textContent).equal($_yearMonthLabel);
  });

  it.each<{
    max: string,
    min: string,
    value: string,
    $_visibleElements: (keyof Pick<typeof elementSelectors, 'nextMonthNavigationButton' | 'previousMonthNavigationButton'>)[],
    $_hiddenElements: (keyof Pick<typeof elementSelectors, 'nextMonthNavigationButton' | 'previousMonthNavigationButton'>)[];
  }>([
    {
      max: '2020-03-03',
      min: '2020-01-01',
      value: '2020-02-02',
      $_visibleElements: ['nextMonthNavigationButton', 'previousMonthNavigationButton'],
      $_hiddenElements: [],
    },
    {
      max: '2020-03-03',
      min: '2020-01-01',
      value: '2020-01-01',
      $_visibleElements: ['nextMonthNavigationButton'],
      $_hiddenElements: ['previousMonthNavigationButton'],
    },
    {
      max: '2020-03-03',
      min: '2020-01-01',
      value: '2020-03-03',
      $_visibleElements: ['previousMonthNavigationButton'],
      $_hiddenElements: ['nextMonthNavigationButton'],
    }
  ])(`renders month navigation buttons (min=$min, max=$max, value=$value)`, async ({
    $_hiddenElements,
    $_visibleElements,
    max,
    min,
    value,
  }) => {
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${max}
        .min=${min}
        .value=${value}
      ></app-date-picker>`
    );

    $_visibleElements.forEach((n) => {
      const element = el.query(elementSelectors[n]);

      expect(element).exist;
      expect(element?.getAttribute('title')).toBe(n === 'nextMonthNavigationButton' ? labelNextMonth : labelPreviousMonth);
    });

    $_hiddenElements.forEach((n) => {
      const element = el.query(elementSelectors[n]);

      expect(element).not.exist;
    });
  });

  it.each<{
    properties: Partial<DatePickerProperties>,
    $_: Partial<DatePickerProperties>;
  }>([
    {
      properties: {
        chooseMonthLabel: undefined,
        chooseYearLabel: undefined,
        nextMonthLabel: undefined,
        previousMonthLabel: undefined,
      },
      $_: {
        chooseMonthLabel: undefined,
        chooseYearLabel: undefined,
        nextMonthLabel: undefined,
        previousMonthLabel: undefined,
      }
    },
    {
      properties: {
        chooseMonthLabel: '',
        chooseYearLabel: '',
        nextMonthLabel: '',
        previousMonthLabel: '',
      },
      $_: {
        chooseMonthLabel: '',
        chooseYearLabel: '',
        nextMonthLabel: '',
        previousMonthLabel: '',
      },
    },
    {
      properties: {
        chooseMonthLabel: '選擇月份',
        chooseYearLabel: '選擇年份',
        nextMonthLabel: '下個月份',
        previousMonthLabel: '上個月份',
      },
      $_: {
        chooseMonthLabel: '選擇月份',
        chooseYearLabel: '選擇年份',
        nextMonthLabel: '下個月份',
        previousMonthLabel: '上個月份',
      },
    }
  ])(`renders correct title for buttons (partialProperties=$properties)`, async ({
    properties,
    $_,
  }) => {
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .chooseMonthLabel=${properties.chooseMonthLabel as string}
        .chooseYearLabel=${properties.chooseYearLabel as string}
        .max=${'2020-12-02'}
        .min=${'1970-01-01'}
        .nextMonthLabel=${properties.nextMonthLabel as string}
        .previousMonthLabel=${properties.previousMonthLabel as string}
        .value=${'2020-02-02'}
      ></app-date-picker>`
    );

    const yearDropdown = el.query<Button>(elementSelectors.yearDropdown);
    const nextMonthNavigationButton = el.query<Button>(elementSelectors.nextMonthNavigationButton);
    const previousMonthNavigationButton = el.query<Button>(elementSelectors.previousMonthNavigationButton);

    expect(yearDropdown).exist;
    expect(nextMonthNavigationButton).exist;
    expect(previousMonthNavigationButton).exist;

    if (
      $_.chooseYearLabel == null &&
      $_.nextMonthLabel == null &&
      $_.previousMonthLabel == null
    ) {
      expect(yearDropdown).exist;
      expect(yearDropdown!.hasAttribute('title')).toBeFalsy();
      expect(nextMonthNavigationButton!.hasAttribute('title')).toBeFalsy();
      expect(previousMonthNavigationButton!.hasAttribute('title')).toBeFalsy();
    } else {
      expect(yearDropdown).exist;
      expect(yearDropdown!.getAttribute('title')).toBe($_.chooseYearLabel);
      expect(nextMonthNavigationButton!.getAttribute('title')).toBe($_.nextMonthLabel);
      expect(previousMonthNavigationButton!.getAttribute('title')).toBe($_.previousMonthLabel);
    }
  });

  it.each<{
    navigationButtonElementSelector: keyof Pick<typeof elementSelectors, 'nextMonthNavigationButton' | 'previousMonthNavigationButton'>,
    $_currentDate: Date;
  }>([
    {
      navigationButtonElementSelector: 'previousMonthNavigationButton',
      $_currentDate: new Date('2020-01-01'),
    },
    {
      navigationButtonElementSelector: 'nextMonthNavigationButton',
      $_currentDate: new Date('2020-03-01'),
    },
  ])(`navigates to new month by clicking $navigationButtonElementSelector`, async ({
    $_currentDate,
    navigationButtonElementSelector,
  }) => {
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${'2020-03-03'}
        .min=${'2020-01-01'}
        .value=${'2020-02-02'}
      ></app-date-picker>`
    );

    const element = el.query<Button>(elementSelectors[navigationButtonElementSelector]);

    element?.focus();
    element?.click();

    await elementUpdated(el);

    const selectedYearMonth = el.query<HTMLParagraphElement>(
      elementSelectors.selectedYearMonth
    );
    const oldSelectedDate = el.query<HTMLTableCellElement>(
      elementSelectors.selectedCalendarDay
    );

    expect(selectedYearMonth?.textContent).equal(
      formatters.longMonthYearFormat($_currentDate)
    );
    expect(oldSelectedDate).not.exist;
  });

  it('navigates to new year then new month to update current date and ensures selected date remains unchanged', async () => {
    const testMin = '2000-01-01';
    const testValue = '2020-02-02';

    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${'2020-12-31'}
        .min=${testMin}
        .value=${testValue}
      ></app-date-picker>`
    );

    // START: Go to year grid view
    const yearDropdown = el.query<Button>(elementSelectors.yearDropdown);

    yearDropdown?.focus();
    yearDropdown?.click();

    await elementUpdated(el);

    const yearGrid = el.query<AppYearGrid>(elementSelectors.yearGrid);

    expect(yearGrid).exist;
    // END: Go to year grid view

    // START: Select new year in year grid view
    let newSelectedDateDate = new Date(
      new Date(testValue).setUTCFullYear(new Date(testMin).getUTCFullYear())
    );
    const newSelectedYear = yearGrid?.query<HTMLButtonElement>(
      `${elementSelectors.yearGridButton}[data-year="${newSelectedDateDate.getUTCFullYear()}"]`
    );
    let selectedYear = yearGrid?.query<HTMLButtonElement>(elementSelectors.selectedYear);

    expect(newSelectedDateDate).exist;
    expect(selectedYear).exist;
    expect(selectedYear?.getAttribute('aria-label')).toBe(new Date(testValue).getUTCFullYear().toString());

    newSelectedYear?.focus();
    newSelectedYear?.click();

    await elementUpdated(el);

    const calendar = el.query<AppMonthCalendar>(elementSelectors.calendar);
    const oldSelectedDate = el.query<HTMLTableCellElement>(elementSelectors.selectedCalendarDay);
    let selectedYearMonth = el.query<HTMLParagraphElement>(elementSelectors.selectedYearMonth);

    expect(calendar).exist;
    expect(oldSelectedDate).not.exist;
    expect(selectedYearMonth?.textContent).equal(
      formatters.longMonthYearFormat(newSelectedDateDate)
    );
    // END: Select new year in year grid view

    // START: Select new month in calendar view to update current date
    const nextMonthNavigationButton = el.query<Button>(elementSelectors.nextMonthNavigationButton);

    nextMonthNavigationButton?.focus();
    nextMonthNavigationButton?.click();

    await elementUpdated(el);

    selectedYearMonth = el.query<HTMLParagraphElement>(elementSelectors.selectedYearMonth);
    newSelectedDateDate = new Date(new Date(newSelectedDateDate).setUTCMonth(newSelectedDateDate.getUTCMonth() + 1));

    expect(selectedYearMonth?.textContent).toBe(formatters.longMonthYearFormat(newSelectedDateDate));
    // END: Select new month in calendar view to update current date

    // START: Ensure old selected year remains unchanged
    yearDropdown?.focus();
    yearDropdown?.click();

    await elementUpdated(el);

    selectedYear = yearGrid?.query<HTMLButtonElement>(elementSelectors.selectedYear);

    expect(selectedYear).exist;
    expect(selectedYear?.getAttribute('aria-label')).toBe(new Date(testValue).getUTCFullYear().toString());
    // END: Ensure old selected year remains unchanged
  });

  it('navigates to new year then new date', async () => {
    const testMax = '2020-12-31';
    const testMin = '2000-01-01';
    const testValue = '2020-02-02';

    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${testMax}
        .min=${testMin}
        .value=${testValue}
      ></app-date-picker>`
    );

    // START: Go to year grid view
    const yearDropdown = el.query<Button>(
      elementSelectors.yearDropdown
    );

    yearDropdown?.focus();
    yearDropdown?.click();

    await elementUpdated(el);

    const yearGrid = el.query<AppYearGrid>(
      elementSelectors.yearGrid
    );
    // END: Go to year grid view

    // START: Select new year in year grid view
    let newSelectedDate = new Date(
      new Date(testValue).setUTCFullYear(new Date(testMin).getUTCFullYear())
    );
    const newSelectedYear = yearGrid?.query<HTMLButtonElement>(
      `${elementSelectors.yearGridButton}[data-year="${newSelectedDate.getUTCFullYear()}"]`
    );

    newSelectedYear?.focus();
    newSelectedYear?.click();

    await elementUpdated(el);
    // END: Select new year in year grid view

    // START: Select new date in calendar view
    newSelectedDate = new Date(
      new Date(newSelectedDate).setUTCDate(15)
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
    expect(newSelectedCalendarDay?.getAttribute('aria-label')).equal(
      newSelectedDateLabel
    );
    expect(newSelectedCalendarDay?.fullDate).deep.equal(newSelectedDate);

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
    const expectedDateUpdatedEvent: CustomEventDetail['date-updated']['detail'] = {
      isKeypress: false,
      value: toDateString(newSelectedDate),
      valueAsDate: newSelectedDate,
      valueAsNumber: +newSelectedDate,
    };

    expect(selectedCalendarDay).exist;
    expect(selectedCalendarDay?.getAttribute('aria-label')).equal(
      newSelectedDateLabel
    );
    expect(selectedCalendarDay?.fullDate).deep.equal(newSelectedDate);

    expect(dateUpdatedEvent?.detail).deep.equal(expectedDateUpdatedEvent);
    // END: Select new date in calendar view
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

    const yearDropdown = el.query<Button>(elementSelectors.yearDropdown);

    yearDropdown?.focus();
    yearDropdown?.click();

    await elementUpdated(el);

    let yearGrid = el.query<AppYearGrid>(elementSelectors.yearGrid);

    expect(yearGrid).exist;

    yearDropdown?.focus();
    yearDropdown?.click();

    await elementUpdated(el);

    const calendar = el.query<AppMonthCalendar>(elementSelectors.calendar);
    yearGrid = el.query<AppYearGrid>(elementSelectors.yearGrid);

    expect(yearGrid).not.exist;
    expect(calendar).exist;
  });

  it.each<{
    value: MaybeDate | undefined,
    newValue: MaybeDate | undefined,
    $_valueDate: Date,
    $_newValueDate: Date;
  }>([
    {
      value: '', newValue: '2020-02-02', $_valueDate: todayDate, $_newValueDate: toResolvedDate('2020-02-02'),
    },
    {
      value: '', newValue: '2020-02-02', $_valueDate: todayDate, $_newValueDate: toResolvedDate('2020-02-02'),
    },
    {
      value: '2020-02-02', newValue: '', $_valueDate: toResolvedDate('2020-02-02'), $_newValueDate: toResolvedDate('2020-02-02'),
    },
    {
      value: null, newValue: '2020-02-02', $_valueDate: todayDate, $_newValueDate: toResolvedDate('2020-02-02')
    },
    {
      value: '2020-02-02', newValue: null, $_valueDate: toResolvedDate('2020-02-02'), $_newValueDate: toResolvedDate('2020-02-02')
    },
    {
      value: undefined, newValue: '2020-02-02', $_valueDate: todayDate, $_newValueDate: toResolvedDate('2020-02-02')
    },
    {
      value: '2020-02-02', newValue: undefined, $_valueDate: toResolvedDate('2020-02-02'), $_newValueDate: todayDate
    }
  ])(`updates optional value (value=$value, newValue=$newValue)`, async ({
    $_newValueDate,
    $_valueDate,
    newValue,
    value,
  }) => {
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${'2100-12-31'}
        .min=${'1970-01-01'}
        .value=${value as never}
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
      formatters.fullDateFormat($_valueDate)
    );
    expect(selectedDate?.fullDate).deep.equal(
      $_valueDate
    );

    el.value = newValue as never;

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
      formatters.fullDateFormat($_newValueDate)
    );
    expect(newSelectedDate?.fullDate).deep.equal(
      $_newValueDate
    );
  });

  it.each<{
    min: MaybeDate | undefined,
    newMin: MaybeDate | undefined,
    $_minDate: Date,
    $_newMinDate: Date;
  }>([
    {
      min: '', newMin: '2020-02-02', $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-02'),
    },
    {
      min: null, newMin: '2020-02-02', $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-02')
    },
    {
      min: '', newMin: '2020-02-02', $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-02')
    },
    {
      min: undefined, newMin: '2020-02-02', $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-02')
    },
    {
      min: '', newMin: '2020-02-01', $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-01')
    },
    {
      min: null, newMin: '2020-02-01', $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-01')
    },
    {
      min: '', newMin: '2020-02-01', $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-01')
    },
    {
      min: undefined, newMin: '2020-02-01', $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-01')
    },
    {
      min: '2020-02-02', newMin: '', $_minDate: toResolvedDate('2020-02-02'), $_newMinDate: toResolvedDate('2020-02-02')
    },
    {
      min: '2020-02-02', newMin: null, $_minDate: toResolvedDate('2020-02-02'), $_newMinDate: toResolvedDate('2020-02-02')
    },
    {
      min: '2020-02-02', newMin: undefined, $_minDate: toResolvedDate('2020-02-02'), $_newMinDate: todayDate
    }
  ])(`updates optional min (min=$min, newMin=$newMin)`, async ({
    $_minDate,
    $_newMinDate,
    min,
    newMin,
  }) => {
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${'2100-12-31'}
        .min=${min as never}
        .value=${min as never}
      ></app-date-picker>`
    );

    const calendar = el.query<AppMonthCalendar>(
      elementSelectors.calendar
    );

    const minDate = calendar?.query<HTMLTableCellElement>(
      `${elementSelectors.calendarDay}[aria-label="${formatters.fullDateFormat($_minDate)
      }"]`
    );

    expect(minDate).exist;
    expect(minDate?.getAttribute('aria-label')).equal(
      formatters.fullDateFormat($_minDate)
    );
    expect(minDate?.fullDate).deep.equal($_minDate);

    const expectedOneDayBeforeMinDate = toResolvedDate(
      new Date($_minDate).setUTCDate(
        $_minDate.getUTCDate() - 1
      )
    );
    const oneDayBeforeMinDate =
      calendar?.query<HTMLTableCellElement>(
        `${elementSelectors.calendarDay}[aria-label="${formatters.fullDateFormat(expectedOneDayBeforeMinDate)
        }"]`
      );

    expect(oneDayBeforeMinDate).exist;
    expect(oneDayBeforeMinDate?.getAttribute('aria-label')).equal(
      formatters.fullDateFormat(expectedOneDayBeforeMinDate)
    );
    expect(oneDayBeforeMinDate?.fullDate).deep.equal(expectedOneDayBeforeMinDate);

    el.min = el.value = newMin as never;

    await elementUpdated(calendar as AppMonthCalendar);
    await elementUpdated(el);

    const calendar2 = el.query<AppMonthCalendar>(
      elementSelectors.calendar
    );

    const minDate2 = calendar2?.query<HTMLTableCellElement>(
      `${elementSelectors.calendarDay}[aria-label="${formatters.fullDateFormat($_newMinDate)
      }"]`
    );

    expect(minDate2).exist;
    expect(minDate2?.getAttribute('aria-label')).equal(
      formatters.fullDateFormat($_newMinDate)
    );
    expect(minDate2?.fullDate).deep.equal($_newMinDate);

    const previousMonthNavigationButton = el.query<Button>(elementSelectors.previousMonthNavigationButton);

    expect(previousMonthNavigationButton).not.exist;

    // NOTE: Skip checking for one day before min when new min is 01 or first day of the month
    if (!(newMin as string)?.endsWith('01')) {
      const expectedOneDayBeforeMinDate2 = toResolvedDate(
        new Date($_newMinDate).setUTCDate(
          $_newMinDate.getUTCDate() - 1
        )
      );
      const oneDayBeforeMinDate2 =
        calendar?.query<HTMLTableCellElement>(
          `${elementSelectors.calendarDay}[aria-label="${formatters.fullDateFormat(expectedOneDayBeforeMinDate2)
          }"]`
        );

      expect(oneDayBeforeMinDate2).exist;
      expect(oneDayBeforeMinDate2?.getAttribute('aria-label')).equal(
        formatters.fullDateFormat(expectedOneDayBeforeMinDate2)
      );
      expect(oneDayBeforeMinDate2?.fullDate).deep.equal(expectedOneDayBeforeMinDate2);
    }
  });

  type NullishDateString = string | null | undefined;
  interface TestUpdatesOptionalMax {
    max: NullishDateString,
    value: NullishDateString,
    $_max: string,
    $_value: string;
  }
  it.each<{
    before: TestUpdatesOptionalMax,
    after: TestUpdatesOptionalMax;
  }>([
    // max='',value=''
    {
      // same max and value subsequently
      before: { max: '', value: '', $_max: '2100-12-31', $_value: toDateString(todayDate) },
      after: { max: '2020-02-20', value: '2020-02-20', $_max: '2020-02-20', $_value: '2020-02-20', }
    },
    {
      // larger max subsequently
      before: { max: '', value: '', $_max: '2100-12-31', $_value: toDateString(todayDate) },
      after: { max: '2020-02-21', value: '2020-02-20', $_max: '2020-02-21', $_value: '2020-02-20' },
    },
    {
      // smaller max subsequently
      before: { max: '', value: '', $_max: '2100-12-31', $_value: toDateString(todayDate) },
      after: { max: '2020-02-19', value: '2020-02-20', $_max: '2020-02-19', $_value: '2020-02-19' },
    },

    // max=null,value=null
    {
      // same max and value subsequently (null)
      before: { max: null, value: null, $_max: '2100-12-31', $_value: toDateString(todayDate) },
      after: { max: '2020-02-20', value: '2020-02-20', $_max: '2020-02-20', $_value: '2020-02-20' },
    },
    {
      // larger max subsequently
      before: { max: null, value: null, $_max: '2100-12-31', $_value: toDateString(todayDate) },
      after: { max: '2020-02-21', value: '2020-02-20', $_max: '2020-02-21', $_value: '2020-02-20' },
    },
    {
      // smaller max subsequently
      before: { max: null, value: null, $_max: '2100-12-31', $_value: toDateString(todayDate) },
      after: { max: '2020-02-19', value: '2020-02-20', $_max: '2020-02-19', $_value: '2020-02-19' }
    },

    // max=undefined,value=undefined
    {
      // same max and value subsequently
      before: { max: undefined, value: undefined, $_max: '2100-12-31', $_value: toDateString(todayDate) },
      after: { max: '2020-02-20', value: '2020-02-20', $_max: '2020-02-20', $_value: '2020-02-20' }
    },
    {
      // larger max subsequently
      before: { max: undefined, value: undefined, $_max: '2100-12-31', $_value: toDateString(todayDate) },
      after: { max: '2020-02-21', value: '2020-02-20', $_max: '2020-02-21', $_value: '2020-02-20' },
    },
    {
      // smaller max subsequently
      before: { max: undefined, value: undefined, $_max: '2100-12-31', $_value: toDateString(todayDate) },
      after: { max: '2020-02-19', value: '2020-02-20', $_max: '2020-02-19', $_value: '2020-02-19' },
    },

    // max=2020-02-02,value=2020-02-02
    {
      // max='' and value=2100-12-12 subsequently
      before: { max: '2020-02-02', value: '2020-02-02', $_max: '2020-02-02', $_value: '2020-02-02' },
      after: { max: '', value: '2100-12-12', $_max: '2020-02-02', $_value: '2020-02-02' }
    },
    {
      // max=null and value=2100-12-12 subsequently
      before: { max: '2020-02-02', value: '2020-02-02', $_max: '2020-02-02', $_value: '2020-02-02' },
      after: { max: null, value: '2100-12-12', $_max: '2020-02-02', $_value: '2020-02-02' }
    },
    {
      // max=undefined and value=2100-12-12 subsequently
      before: { max: '2020-02-02', value: '2020-02-02', $_max: '2020-02-02', $_value: '2020-02-02' },
      after: { max: undefined, value: '2100-12-12', $_max: toDateString(MAX_DATE), $_value: '2100-12-12' }
    },
  ])(`updates optional max (before: $before, after: $after)`, async ({
    before,
    after,
  }) => {
    const el = await fixture<AppDatePicker>(
      html`<app-date-picker
        .max=${before.max as never}
        .min=${'1970-01-01'}
        .value=${before.max as never}
      ></app-date-picker>`
    );

    const $a = [before, after].map<[number, TestUpdatesOptionalMax]>((n, i) => [i, n]);
    for (const [
      i,
      {
        max: $testMax,
        value: $testValue,
        $_max: $expectedMax,
        $_value: $expectedValue,
      }
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

});
