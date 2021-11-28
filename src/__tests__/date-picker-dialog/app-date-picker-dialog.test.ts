import '../../date-picker-dialog/app-date-picker-dialog';

import type { Button } from '@material/mwc-button';
import { expect, fixture, html } from '@open-wc/testing';

import { DateTimeFormat } from '../../constants';
import type { AppDatePicker } from '../../date-picker/app-date-picker';
import { appDatePickerName } from '../../date-picker/constants';
import type { AppDatePickerDialog } from '../../date-picker-dialog/app-date-picker-dialog';
import type { AppDatePickerDialogDialog } from '../../date-picker-dialog/app-date-picker-dialog-dialog';
import { appDatePickerDialogDialogName, appDatePickerDialogName } from '../../date-picker-dialog/constants';
import type { DialogClosedEventDetail, DialogClosingEventDetailAction } from '../../date-picker-dialog/typings';
import { toDateString } from '../../helpers/to-date-string';
import { toResolvedDate } from '../../helpers/to-resolved-date';
import type { AppMonthCalendar } from '../../month-calendar/app-month-calendar';
import { appMonthCalendarName } from '../../month-calendar/constants';
import type { CustomEventDetail } from '../../typings';
import { promiseTimeout } from '../constants';
import { eventOnce } from '../test-utils/event-once';
import { messageFormatter } from '../test-utils/message-formatter';

describe(appDatePickerDialogName, () => {
  const elementSelectors = {
    calendarDay: (label: string) => `td.calendar-day[aria-label="${label}"]`,
    datePicker: appDatePickerName,
    datePickerDialogDialog: appDatePickerDialogDialogName,
    dialogActionCancel: `mwc-button[dialogaction="cancel"]`,
    dialogActionReset: `mwc-button[data-dialog-action="reset"]`,
    dialogActionSet: `mwc-button[dialogaction="set"]`,
    monthCalendar: appMonthCalendarName,
  } as const;
  const formatter = DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const max = '2100-12-31';
  const min = '1970-01-01';
  const value = '2020-02-02';

  it('renders', async () => {
    const el = await new Promise<AppDatePickerDialog>(async (resolve) => {
      const element = await fixture<AppDatePickerDialog>(
        html`<app-date-picker-dialog
          .max=${max}
          .min=${min}
          .open=${true}
          .value=${value}
          @opened=${() => resolve(element)}
        ></app-date-picker-dialog>`
      );

      globalThis.setTimeout(() => resolve(element), promiseTimeout);
    });

    const datePickerDialogDialog =
      el.querySelector<AppDatePickerDialogDialog>(elementSelectors.datePickerDialogDialog);
    const datePicker = el.querySelector(elementSelectors.datePicker);

    await datePicker?.updateComplete;
    await datePickerDialogDialog?.updateComplete;

    expect(datePickerDialogDialog).exist;
    expect(datePicker).exist;
    expect(datePickerDialogDialog?.hasAttribute('open')).true;
    expect(el.valueAsDate).deep.equal(new Date(value));
    expect(el.valueAsNumber).equal(+new Date(value));

    const dialogActionReset = el.querySelector(elementSelectors.dialogActionReset);
    const dialogActionCancel = el.querySelector(elementSelectors.dialogActionCancel);
    const dialogActionSet = el.querySelector(elementSelectors.dialogActionSet);

    expect(dialogActionReset).exist;
    expect(dialogActionCancel).exist;
    expect(dialogActionSet).exist;
  });

  it('opens and closes date picker dialog', async () => {
    const el = await fixture<AppDatePickerDialog>(
      html`<app-date-picker-dialog></app-date-picker-dialog>`
    );

    const openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent
    >(el, 'opened');

    const datePickerDialogDialog =
      el.querySelector<AppDatePickerDialogDialog>(elementSelectors.datePickerDialogDialog);
    let datePicker = el.querySelector(elementSelectors.datePicker);

    expect(datePickerDialogDialog).exist;
    expect(datePicker).exist;
    expect(datePickerDialogDialog?.hasAttribute('open')).false;

    el.show();
    const opened = await openedTask;
    await el.updateComplete;

    expect(opened).not.undefined;

    datePicker = el.querySelector(elementSelectors.datePicker);

    expect(datePickerDialogDialog?.hasAttribute('open')).true;

    const closedTask = eventOnce<
      typeof el,
      'closed',
      CustomEvent<DialogClosedEventDetail>
    >(el, 'closed');

    el.hide();
    const closed = await closedTask;
    await el.updateComplete;

    expect(closed).not.undefined;

    datePicker = el.querySelector(elementSelectors.datePicker);

    expect(datePickerDialogDialog?.hasAttribute('open')).false;
  });

  type CaseSelectsAndConfirmsNewDate = [string, string, DialogClosingEventDetailAction, boolean, string];
  const casesSelectsAndConfirmsNewDate: CaseSelectsAndConfirmsNewDate[] = [
    ['but does not confirm a new date', '2020-02-04', 'cancel', false, value],
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
            .max=${max}
            .min=${min}
            .value=${value}
          ></app-date-picker-dialog>`
        );

        const openedTask = eventOnce<
          typeof el,
          'opened',
          CustomEvent
        >(el, 'opened');

        const datePickerDialogDialog =
          el.querySelector<AppDatePickerDialogDialog>(elementSelectors.datePickerDialogDialog);
        const datePicker =
          el.querySelector<AppDatePicker>(elementSelectors.datePicker);
        const monthCalendar =
          datePicker?.query<AppMonthCalendar>(elementSelectors.monthCalendar);
        const dialogActionReset =
          el.querySelector<Button>(elementSelectors.dialogActionReset);
        const dialogActionCancel =
          el.querySelector<Button>(elementSelectors.dialogActionCancel);
        const dialogActionSet =
          el.querySelector<Button>(elementSelectors.dialogActionSet);

        el.show();
        const opened = await openedTask;
        await el.updateComplete;

        expect(opened).not.undefined;
        expect(datePickerDialogDialog).exist;
        expect(datePicker).exist;
        expect(dialogActionSet).exist;
        expect(datePickerDialogDialog?.hasAttribute('open')).true;
        expect(el.value).equal(value);

        const newValueDate = new Date(testNewValue);
        const newSelectedDate =
          monthCalendar?.query(elementSelectors.calendarDay(formatter.format(newValueDate)))

        const dateUpdatedTask = eventOnce<
          AppDatePicker,
          'date-updated',
          CustomEvent<CustomEventDetail['date-updated']>

          >(datePicker as AppDatePicker, 'date-updated');

        expect(newSelectedDate).exist;

        newSelectedDate?.click();
        await dateUpdatedTask;
        await datePicker?.updateComplete;
        await el.updateComplete;

        expect(el.value).equal(value);
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
        await datePicker?.updateComplete;
        await el.updateComplete;

        if (testDialogAction === 'reset') {
          expect(closed).undefined;
        } else {
          expect(closed).not.undefined;
        }

        expect(
          datePickerDialogDialog?.hasAttribute('open')
        ).equal(expectedDatePickerDialogHasAttributeOpen);
        expect(el.value).equal(expectedDatePickerDialogValue);
        expect(el.valueAsDate).deep.equal(new Date(expectedDatePickerDialogValue));
        expect(el.valueAsNumber).equal(+new Date(expectedDatePickerDialogValue));
      }
    )
  });

});
