import '../../date-picker-dialog/app-date-picker-dialog';

import type { Button } from '@material/mwc-button';
import { expect, fixture, html } from '@open-wc/testing';

import { DateTimeFormat } from '../../constants';
import type { AppDatePicker } from '../../date-picker/app-date-picker';
import { appDatePickerName } from '../../date-picker/constants';
import type { AppDatePickerDialog } from '../../date-picker-dialog/app-date-picker-dialog';
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
import { messageFormatter } from '../test-utils/message-formatter';

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
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const properties: DeepNonNullableAndRequired<OmitKey<DatePickerProperties, 'fire' | 'query' | 'queryAll' | 'root'>> = {
    chooseMonthLabel: '選擇月份',
    chooseYearLabel: '選擇年份',
    disabledDates: '2020-02-02',
    disabledDays: '2',
    firstDayOfWeek: 2,
    inline: false,
    landscape: false,
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
    todayDateLabel: '今日',
    todayYearLabel: '今年',
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

      globalThis.setTimeout(() => resolve(element), promiseTimeout);
    });

    const datePickerDialogBase =
      el.query<AppDatePickerDialogBase>(elementSelectors.datePickerDialogBase);
    const datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

    await datePicker?.updateComplete;
    await datePickerDialogBase?.updateComplete;

    for (const [key, value] of Object.entries(properties)) {
      if (key === 'inline') {
        expect(datePicker?.[key as keyof DatePickerProperties]).true;
      } else {
        expect(datePicker?.[key as keyof DatePickerProperties]).equal(value, `${key} not matched`);
      }
    }

    expect(datePickerDialogBase).exist;
    expect(datePicker).exist;
    expect(datePickerDialogBase?.hasAttribute('open')).true;
    expect(el.valueAsDate).deep.equal(new Date(properties.value));
    expect(el.valueAsNumber).equal(+new Date(properties.value));

    const dialogActionReset = el.query(elementSelectors.dialogActionReset);
    const dialogActionCancel = el.query(elementSelectors.dialogActionCancel);
    const dialogActionSet = el.query(elementSelectors.dialogActionSet);

    expect(dialogActionReset).exist;
    expect(dialogActionCancel).exist;
    expect(dialogActionSet).exist;

    expect(dialogActionReset).text(resetLabel);
    expect(dialogActionCancel).text(dismissLabel);
    expect(dialogActionSet).text(confirmLabel);
  });

  it('always re-opens in calendar view', async () => {
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

    // ensure date picker still in the down after closing
    expect(closed).not.undefined;
    expect(datePicker).exist;
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

    // ensure dialog re-opens with date picker rendered in calendar view
    expect(opened).not.undefined;
    expect(monthCalendar).exist;
    expect(yearGrid).not.exist;
    expect(datePickerDialogBase?.hasAttribute('open')).true;
  });

  type CaseSelectsAndConfirmsNewDate = [string, string, DialogClosingEventDetailAction, boolean, string];
  const casesSelectsAndConfirmsNewDate: CaseSelectsAndConfirmsNewDate[] = [
    ['but does not confirm a new date', '2020-02-04', 'cancel', false, properties.value],
    ['and confirms a new date', '2020-02-04', 'set', false, '2020-02-04'],
    ['a new date but resets it', '2020-02-04', 'reset', true, toDateString(toResolvedDate())],
  ];

  casesSelectsAndConfirmsNewDate.forEach((a) => {
    const [
      ,
      testNewValue,
      testDialogAction,
      expectedDatePickerDialogHasAttributeOpen,
      expectedDatePickerDialogValue,
    ] = a;

    it(
      messageFormatter(`selects %s`, a),
      async () => {
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
        expect(el.value).equal(properties.value);

        const newValueDate = new Date(testNewValue);
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

        expect(el.value).equal(properties.value);
        expect(datePicker?.value).equal(testNewValue);
        expect(datePicker?.valueAsDate).deep.equal(newValueDate);
        expect(datePicker?.valueAsNumber).equal(+newValueDate);

        const closedTask = eventOnce<
          typeof el,
          'closed',
          CustomEvent<DialogClosedEventDetail>
        >(el, 'closed');

        switch (testDialogAction) {
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

        if (testDialogAction === 'reset') {
          expect(closed).undefined;
        } else {
          expect(closed).not.undefined;
        }

        expect(
          datePickerDialogBase?.hasAttribute('open')
        ).equal(expectedDatePickerDialogHasAttributeOpen);

        expect(el.value).equal(expectedDatePickerDialogValue);
        expect(el.valueAsDate).deep.equal(new Date(expectedDatePickerDialogValue));
        expect(el.valueAsNumber).equal(+new Date(expectedDatePickerDialogValue));
      }
    );
  });

});
