import '../../date-picker/app-date-picker';
import '../../date-picker-dialog/app-date-picker-dialog';

import type { Button } from '@material/mwc-button';
import { fixture, html } from '@open-wc/testing-helpers';
import { describe, expect, it } from 'vitest';

import { DateTimeFormat } from '../../constants';
import type {AppDatePicker } from '../../date-picker/app-date-picker';
import { appDatePickerName } from '../../date-picker/constants';
import type {AppDatePickerDialog } from '../../date-picker-dialog/app-date-picker-dialog';
import type { AppDatePickerDialogBase } from '../../date-picker-dialog/app-date-picker-dialog-base';
import { appDatePickerDialogBaseName, appDatePickerDialogName } from '../../date-picker-dialog/constants';
import type { DialogClosedEventDetail, DialogClosingEventDetailAction } from '../../date-picker-dialog/typings';
import { toDateString } from '../../helpers/to-date-string';
import { toResolvedDate } from '../../helpers/to-resolved-date';
import type { AppMonthCalendar } from '../../month-calendar/app-month-calendar';
import { appMonthCalendarName } from '../../month-calendar/constants';
import type { CustomEventDetail, DatePickerProperties } from '../../typings';
import type { DeepNonNullableAndRequired, OmitKey } from '../../utility-typings';
import type { AppYearGrid } from '../../year-grid/app-year-grid';
import { appYearGridName } from '../../year-grid/constants';
import { promiseTimeout } from '../constants';
import { eventOnce } from '../test-utils/event-once';

describe(appDatePickerDialogName, () => {
  const elementSelectors = {
    calendarDay: (label: string) => `td.calendar-day[aria-label="${label}"]`,
    datePicker: appDatePickerName,
    datePickerDialogBase: appDatePickerDialogBaseName,
    dialogActionCancel: `mwc-button[dialogaction="cancel"]`,
    dialogActionReset: `mwc-button[data-dialog-action="reset"]`,
    dialogActionSet: `mwc-button[dialogaction="set"]`,
    monthCalendar: appMonthCalendarName,
    yearGrid: appYearGridName,
  } as const;
  const formatter = DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const properties: DeepNonNullableAndRequired<OmitKey<DatePickerProperties, 'fire' | 'query' | 'queryAll' | 'root'>> = {
    chooseMonthLabel: '選擇月份',
    chooseYearLabel: '選擇年份',
    disabledDates: '2020-02-02',
    disabledDays: '2',
    firstDayOfWeek: 2,
    locale: 'en-SG',
    max: '2200-12-31',
    min: '1970-12-31',
    nextMonthLabel: '下個月份',
    previousMonthLabel: '上個月份',
    selectedDateLabel: '選定日期',
    selectedYearLabel: '選定年份',
    shortWeekLabel: '週',
    showWeekNumber: true,
    startView: 'yearGrid',
    todayLabel: '今日',
    toyearLabel: '今年',
    value: '2020-02-02',
    weekLabel: '週目',
    weekNumberTemplate: '%s週目',
    weekNumberType: 'first-day-of-year',
  };

  it('renders', async () => {
    const confirmLabel = '確定' as const;
    const dismissLabel = '取消' as const;
    const resetLabel = '重置' as const;

    const el = await new Promise<AppDatePickerDialog>(async (resolve) => {
      const element = await fixture<AppDatePickerDialog>(
        html`<app-date-picker-dialog
          .confirmLabel=${confirmLabel}
          .dismissLabel=${dismissLabel}
          .open=${true}
          .resetLabel=${resetLabel}
          @opened=${() => resolve(element)}
        ></app-date-picker-dialog>`
      );

      for (const [key, value] of Object.entries(properties)) {
        Object.assign(element, { [key]: value });
      }

      await element.updateComplete;

      window.setTimeout(() => resolve(element), promiseTimeout);
    });

    const datePickerDialogBase =
      el.query<AppDatePickerDialogBase>(elementSelectors.datePickerDialogBase);
    const datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

    await datePicker?.updateComplete;
    await datePickerDialogBase?.updateComplete;

    for (const [key, value] of Object.entries(properties)) {
      expect(datePicker?.[key as keyof DatePickerProperties]).equal(value, `${key} not matched`);
    }

    expect(datePickerDialogBase).exist;
    expect(datePicker).exist;
    expect(datePickerDialogBase?.hasAttribute('open')).true;
    expect(el.valueAsDate).toEqual(new Date(properties.value as string));
    expect(el.valueAsNumber).toEqual(+new Date(properties.value as string));

    const dialogActionReset = el.query(elementSelectors.dialogActionReset);
    const dialogActionCancel = el.query(elementSelectors.dialogActionCancel);
    const dialogActionSet = el.query(elementSelectors.dialogActionSet);

    expect(dialogActionReset).exist;
    expect(dialogActionCancel).exist;
    expect(dialogActionSet).exist;
    expect(dialogActionReset?.textContent).toBe(resetLabel);
    expect(dialogActionCancel?.textContent).toBe(dismissLabel);
    expect(dialogActionSet?.textContent).toBe(confirmLabel);
  });

  it('always reopens with the correct startView', async () => {
    const el = await fixture<AppDatePickerDialog>(
      html`<app-date-picker-dialog
        .startView=${'yearGrid'}
      ></app-date-picker-dialog>`
    );

    let openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent
    >(el, 'opened');

    const datePickerDialogBase =
      el.query<AppDatePickerDialogBase>(elementSelectors.datePickerDialogBase);
    let datePicker = datePickerDialogBase?.query<AppDatePicker>(elementSelectors.datePicker);

    // initially no date picker is rendered
    expect(datePickerDialogBase).exist;
    expect(datePicker).not.exist;
    expect(datePickerDialogBase?.hasAttribute('open')).false;

    el.show();
    let opened = await openedTask;
    await datePicker?.updateComplete;
    await datePickerDialogBase?.updateComplete;
    await el.updateComplete;

    datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);
    let yearGrid = datePicker?.query<AppYearGrid>(elementSelectors.yearGrid);

    // ensure dialog opens with date picker rendered in year grid view
    expect(opened).not.undefined;
    expect(datePicker).exist;
    expect(datePickerDialogBase?.hasAttribute('open')).true;
    expect(yearGrid).exist;

    const closedTask = eventOnce<
      typeof el,
      'closed',
      CustomEvent<DialogClosedEventDetail>
    >(el, 'closed');

    el.hide();
    const closed = await closedTask;
    await datePicker?.updateComplete;
    await datePickerDialogBase?.updateComplete;
    await el.updateComplete;

    datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

    expect(closed).not.undefined;
    expect(datePicker).not.exist;
    expect(datePickerDialogBase?.hasAttribute('open')).false;

    openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent
    >(el, 'opened');

    el.show();
    opened = await openedTask;
    await datePicker?.updateComplete;
    await datePickerDialogBase?.updateComplete;
    await el.updateComplete;

    datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);
    const monthCalendar = datePicker?.query<AppMonthCalendar>(elementSelectors.monthCalendar);
    yearGrid = datePicker?.query<AppYearGrid>(elementSelectors.yearGrid);

    expect(opened).not.undefined;
    expect(datePicker).exist;
    expect(monthCalendar).not.exist;
    expect(yearGrid).exist;

    expect(datePickerDialogBase?.hasAttribute('open')).true;
  });

  it.each<{
    $_dialogOpen: boolean;
    $_dialogValue: string;
    _message: string;
    dialogAction: DialogClosingEventDetailAction;
    value: string;
  }>([
    {
      $_dialogOpen: false,
      $_dialogValue: properties.value as string,
      _message: 'but does not confirm a new date',
      dialogAction: 'cancel',
      value: '2020-02-04',
    },
    {
      $_dialogOpen: false,
      $_dialogValue: '2020-02-04',
      _message: 'and confirms a new date',
      dialogAction: 'set',
      value: '2020-02-04',
    },
    {
      $_dialogOpen: true,
      $_dialogValue: toDateString(toResolvedDate()),
      _message: 'a new date but resets it',
      dialogAction: 'reset',
      value: '2020-02-04',
    },
  ])(`selects $_message (value=$newValue, dialogAction=$dialogAction)`, async ({
    $_dialogOpen,
    $_dialogValue,
    dialogAction,
    value,
  }) => {
    const el = await fixture<AppDatePickerDialog>(
      html`<app-date-picker-dialog
        .max=${properties.max}
        .min=${properties.min}
        .value=${properties.value}
      ></app-date-picker-dialog>`
    );

    const openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent
    >(el, 'opened');

    let datePickerDialogBase =
      el.query<AppDatePickerDialogBase>(elementSelectors.datePickerDialogBase);
    let datePicker =
      datePickerDialogBase?.query<AppDatePicker>(elementSelectors.datePicker);
    let monthCalendar =
      datePicker?.query<AppMonthCalendar>(elementSelectors.monthCalendar);

    el.show();
    const opened = await openedTask;
    await monthCalendar?.updateComplete;
    await datePicker?.updateComplete;
    await datePickerDialogBase?.updateComplete;
    await el.updateComplete;

    datePickerDialogBase =
      el.query<AppDatePickerDialogBase>(elementSelectors.datePickerDialogBase);
    datePicker =
      datePickerDialogBase?.querySelector<AppDatePicker>(elementSelectors.datePicker);
    monthCalendar =
      datePicker?.query<AppMonthCalendar>(elementSelectors.monthCalendar);
    const dialogActionReset =
      datePickerDialogBase?.querySelector<Button>(elementSelectors.dialogActionReset);
    const dialogActionCancel =
      datePickerDialogBase?.querySelector<Button>(elementSelectors.dialogActionCancel);
    const dialogActionSet =
      datePickerDialogBase?.querySelector<Button>(elementSelectors.dialogActionSet);

    expect(opened).not.undefined;
    expect(monthCalendar).exist;
    expect(datePicker).exist;
    expect(datePickerDialogBase).exist;
    expect(dialogActionReset).exist;
    expect(dialogActionCancel).exist;
    expect(dialogActionSet).exist;
    expect(datePickerDialogBase?.hasAttribute('open')).true;
    expect(el.value).toBe(properties.value);

    const newValueDate = new Date(value);
    const newSelectedDate =
      monthCalendar?.query(elementSelectors.calendarDay(formatter.format(newValueDate)));

    const dateUpdatedTask = eventOnce<
      AppDatePicker,
      'date-updated',
      CustomEvent<CustomEventDetail['date-updated']>
    >(datePicker as AppDatePicker, 'date-updated');

    expect(newSelectedDate).exist;

    newSelectedDate?.click();
    await dateUpdatedTask;
    await monthCalendar?.updateComplete;
    await datePicker?.updateComplete;
    await datePickerDialogBase?.updateComplete;
    await el.updateComplete;

    expect(el.value).toBe(properties.value);
    expect(datePicker?.value).toBe(value);
    expect(datePicker?.valueAsDate).toEqual(newValueDate);
    expect(datePicker?.valueAsNumber).toBe(+newValueDate);

    const closedTask = eventOnce<
      typeof el,
      'closed',
      CustomEvent<DialogClosedEventDetail>
    >(el, 'closed');

    switch (dialogAction) {
      case 'cancel': {
        dialogActionCancel?.click();
        break;
      }
      case 'reset': {
        dialogActionReset?.click();
        break;
      }
      case 'set': {
        dialogActionSet?.click();
        break;
      }
      default:
    }

    const closed = await closedTask;
    await monthCalendar?.updateComplete;
    await datePicker?.updateComplete;
    await datePickerDialogBase?.updateComplete;
    await el.updateComplete;

    if (dialogAction === 'reset') {
      expect(closed).undefined;
    } else {
      expect(closed).not.undefined;
    }

    expect(
      datePickerDialogBase?.hasAttribute('open')
    ).equal($_dialogOpen);

    expect(el.value).toBe($_dialogValue);
    expect(el.valueAsDate).toEqual(new Date($_dialogValue));
    expect(el.valueAsNumber).toBe(+new Date($_dialogValue));
  });

});
