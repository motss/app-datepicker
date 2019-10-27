import { AppDatepickerDialog, DatepickerDialogClosedEvent } from '../../app-datepicker-dialog.js';
import { START_VIEW } from '../../app-datepicker.js';
import { makeNumberPrecise } from '../../datepicker-helpers.js';
import {
  date13,
  date15,
  defaultLocale,
} from '../test-config.js';
import {
  dragTo,
  forceUpdate,
  getComputedStylePropertyValue,
  getShadowInnerHTML,
  getTestName,
  OptionsDragTo,
  queryInit,
  selectNewYearFromYearListView,
  setupDragPoint,
  triggerEvent,
} from '../test-helpers.js';

const {
  strictEqual,
  isNotNull,
  isTrue,
} = chai.assert;
const name = AppDatepickerDialog.is;

describe(getTestName(name), () => {
  describe('gestures', () => {
    describe('navigating calendar by gestures', () => {
      let el: AppDatepickerDialog;
      let t: ReturnType<typeof queryInit>;

      beforeEach(async () => {
        el = document.createElement(name) as AppDatepickerDialog;
        document.body.appendChild(el);

        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        await forceUpdate(el);

        el.open();
        await forceUpdate(el);

        t = queryInit(el);
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      // it(`goes to next month`, async () => {
      //   el.min = date13;
      //   el.value = date15;
      //   await forceUpdate(el);

      //   const nextBtnMonthSelectorEl = t.getBtnNextMonthSelector();
      //   const btnYearSelectorEl = t.getBtnYearSelector();
      //   const btnCalendarSelectorEl = t.getBtnCalendarSelector();

      //   strictEqual(
      //     getShadowInnerHTML(btnYearSelectorEl),
      //     '2020',
      //     `Initial year not matched`);
      //   strictEqual(
      //     getShadowInnerHTML(btnCalendarSelectorEl),
      //     'Wed, Jan 15',
      //     `Initial date not matched`);

      //   const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
      //   /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      //   isTrue(
      //     ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
      //     `Calendar label not matched (${calendarLabel})`);

      //   const animationComplete = t.waitForDragAnimationFinished();
      //   triggerEvent(nextBtnMonthSelectorEl, 'click');
      //   await animationComplete;

      //   strictEqual(
      //     getShadowInnerHTML(btnYearSelectorEl),
      //     '2020',
      //     `Year not updated`);
      //   strictEqual(
      //     getShadowInnerHTML(btnCalendarSelectorEl),
      //     'Wed, Jan 15',
      //     `Date not updated`);

      //   const newCalendarLabel = getShadowInnerHTML(t.getCalendarLabel());
      //   /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      //   isTrue(
      //     ['Feb 2020', 'February, 2020', 'February 2020'].some(n => newCalendarLabel === n),
      //     `Calendar label not updated (${newCalendarLabel})`);
      // });

      // it(`goes to previous month`, async () => {
      //   el.min = date13;
      //   el.value = '2020-05-13';
      //   await forceUpdate(el);

      //   const prevBtnMonthSelectorEl = t.getBtnPrevMonthSelector();
      //   const btnYearSelectorEl = t.getBtnYearSelector();
      //   const btnCalendarSelectorEl = t.getBtnCalendarSelector();

      //   strictEqual(
      //     getShadowInnerHTML(btnYearSelectorEl),
      //     '2020',
      //     `Initial year not matched`);
      //   strictEqual(
      //     getShadowInnerHTML(btnCalendarSelectorEl),
      //     'Wed, May 13',
      //     `Initial date not matched`);

      //   const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
      //   isTrue(
      //     ['May, 2020', 'May 2020'].some(n => calendarLabel === n),
      //     `Calendar label not matched (${calendarLabel})`);

      //   const animationComplete = t.waitForDragAnimationFinished();
      //   triggerEvent(prevBtnMonthSelectorEl, 'click');
      //   await animationComplete;

      //   strictEqual(
      //     getShadowInnerHTML(btnYearSelectorEl),
      //     '2020',
      //     `Year not updated`);
      //   strictEqual(
      //     getShadowInnerHTML(btnCalendarSelectorEl),
      //     'Wed, May 13',
      //     `Date not updated`);

      //   const newCalendarLabel = getShadowInnerHTML(t.getCalendarLabel());
      //   /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      //   isTrue(
      //     ['Apr 2020', 'April, 2020', 'April 2020'].some(n => newCalendarLabel === n),
      //     `Calendar label not updated (${newCalendarLabel})`);
      // });

      it(`switches to ${START_VIEW.YEAR_LIST} view`, async () => {
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        const btnYearSelectorEl = t.getBtnYearSelector();
        strictEqual(
          getShadowInnerHTML(btnYearSelectorEl),
          '2020',
          `Year selector label not matched`);

        triggerEvent(btnYearSelectorEl, 'click');
        await forceUpdate(el);

        isNotNull(t.getYearListViewFullList());
        strictEqual(
          getShadowInnerHTML(t.getYearListViewListItemYearSelectedDiv()),
          '2020',
          `New selected year label not matched`);

        triggerEvent(t.getBtnCalendarSelector(), 'click');
        await forceUpdate(el);

        strictEqual(
          getShadowInnerHTML(t.getBtnYearSelector()),
          '2020',
          `New year selector label not matched`);

        strictEqual(
          getShadowInnerHTML(t.getBtnCalendarSelector()),
          'Wed, Jan 15',
          `New calendar selector label not matched`);

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `New calendar label not matched (${calendarLabel})`);
      });

      it(`restores to focused date when switches back to calendar view`, async () => {
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        let runClick = 3;
        while (runClick) {
          const animationComplete = t.waitForDragAnimationFinished();
          triggerEvent(t.getBtnNextMonthSelector(), 'click');
          await animationComplete;
          runClick -= 1;
        }

        triggerEvent(t.getBtnYearSelector(), 'click');
        await forceUpdate(el);

        triggerEvent(t.getBtnCalendarSelector(), 'click');
        await forceUpdate(el);

        strictEqual(
          getShadowInnerHTML(t.getBtnYearSelector()),
          '2020',
          `Year not updated`);
        strictEqual(
          getShadowInnerHTML(t.getBtnCalendarSelector()),
          'Wed, Jan 15',
          `Date not updated`);

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `New calendar label not matched (${calendarLabel})`);
      });

      it(`switches back to calendar view with new selected year`, async () => {
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        let runClick = 3;
        while (runClick) {
          const animationComplete = t.waitForDragAnimationFinished();
          triggerEvent(t.getBtnNextMonthSelector(), 'click');
          await animationComplete;
          runClick -= 1;
        }

        triggerEvent(t.getBtnYearSelector(), 'click');
        await forceUpdate(el);

        selectNewYearFromYearListView(t.elem, '2025');
        await forceUpdate(el);

        strictEqual(
          getShadowInnerHTML(t.getBtnYearSelector()),
          '2025',
          `Year not updated`);
        strictEqual(
          getShadowInnerHTML(t.getBtnCalendarSelector()),
          'Wed, Jan 15',
          `Date not updated`);

        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2025', 'January, 2025', 'January 2025'].some(n => calendarLabel === n),
          `New calendar label not matched (${calendarLabel})`);
      });

      // it(`goes to next month by dragging/ swiping calendar`, async () => {
      //   el.min = date13;
      //   el.value = date15;
      //   await forceUpdate(el);

      //   const btnYearSelectorEl = t.getBtnYearSelector();
      //   const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      //   const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();

      //   strictEqual(
      //     getShadowInnerHTML(btnYearSelectorEl),
      //     '2020',
      //     `First year selector text not matched`);
      //   strictEqual(
      //     getShadowInnerHTML(btnCalendarSelectorEl),
      //     'Wed, Jan 15',
      //     `First calendar selector text not matched`);

      //   const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
      //   /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      //   isTrue(
      //     ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
      //     `First calendar label not matched (${calendarLabel})`);

      //   const startingPoint = setupDragPoint('left', t.elem);
      //   const dragOptions: OptionsDragTo = { ...startingPoint, dx: -50 };
      //   const animationComplete = t.waitForDragAnimationFinished();
      //   await dragTo(calendarViewFullCalendarEl, dragOptions);
      //   await animationComplete;

      //   strictEqual(
      //     getShadowInnerHTML(btnYearSelectorEl),
      //     '2020',
      //     `Year selector text should not change`);
      //   strictEqual(
      //     getShadowInnerHTML(btnCalendarSelectorEl),
      //     'Wed, Jan 15',
      //     `Calendar selector text should not change`);

      //   const newCalendarLabel = getShadowInnerHTML(t.getCalendarLabel());
      //   /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      //   isTrue(
      //     ['Feb 2020', 'February, 2020', 'February 2020'].some(n => newCalendarLabel === n),
      //     `New calendar label not updated (${newCalendarLabel})`);
      // });

      // it(`goes to previous month by dragging/ swiping calendar`, async () => {
      //   el.min = date13;
      //   el.value = '2020-05-13';
      //   await forceUpdate(el);

      //   const btnYearSelectorEl = t.getBtnYearSelector();
      //   const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      //   const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();

      //   strictEqual(
      //     getShadowInnerHTML(btnYearSelectorEl),
      //     '2020',
      //     `First year selector text not matched`);
      //   strictEqual(
      //     getShadowInnerHTML(btnCalendarSelectorEl),
      //     'Wed, May 13',
      //     `First calendar selector text not matched`);

      //   const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
      //   isTrue(
      //     ['May, 2020', 'May 2020'].some(n => calendarLabel === n),
      //     `First calendar label not matched (${calendarLabel})`);

      //   const startingPoint = setupDragPoint('right', t.elem);
      //   const dragOptions: OptionsDragTo = { ...startingPoint, dx: 50 };
      //   const animationComplete = t.waitForDragAnimationFinished();
      //   await dragTo(calendarViewFullCalendarEl, dragOptions);
      //   await animationComplete;

      //   strictEqual(
      //     getShadowInnerHTML(btnYearSelectorEl),
      //     '2020',
      //     `Year selector text should not change`);
      //   strictEqual(
      //     getShadowInnerHTML(btnCalendarSelectorEl),
      //     'Wed, May 13',
      //     `Calendar selector text should not change`);

      //   const newCalendarLabel = getShadowInnerHTML(t.getCalendarLabel());
      //   /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
      //   isTrue(
      //     ['Apr 2020', 'April, 2020', 'April 2020'].some(n => newCalendarLabel === n),
      //     `New calendar label not updated (${newCalendarLabel})`);
      // });

    });

    describe('navigating year list by button', () => {
      let el: AppDatepickerDialog;
      let t: ReturnType<typeof queryInit>;

      beforeEach(async () => {
        el = document.createElement(name) as AppDatepickerDialog;
        document.body.appendChild(el);

        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        el.open();
        await forceUpdate(el);

        t = queryInit(el);
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`navigates to year list by button`, async () => {
        const calendarLabel = getShadowInnerHTML(t.getCalendarLabel());
        const btnYearSelectorLabel = getShadowInnerHTML(t.getBtnYearSelector());

        strictEqual(
          el.startView,
          START_VIEW.CALENDAR,
          `Initial 'startView' is not ${START_VIEW.CALENDAR}`);
        strictEqual(
          btnYearSelectorLabel,
          '2020',
          `Initial year selector label not matched (${btnYearSelectorLabel})`);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Jan 2020', 'January, 2020', 'January 2020'].some(n => calendarLabel === n),
          `Initial calendar label not matched (${calendarLabel})`);

        const btnYearSelectorEl = t.getBtnYearSelector();

        triggerEvent(btnYearSelectorEl, 'click');
        await forceUpdate(el);

        /**
         * NOTE: Datepicker dialog will remain the initial value which is `START_VIEW.CALENDAR`.
         * Only datepicker updates the value of `startView`.
         */
        strictEqual(
          t.elem.startView,
          START_VIEW.YEAR_LIST,
          `Datepicker's 'startView' not updated`);
        strictEqual(
          el.startView,
          START_VIEW.CALENDAR,
          `Datepicker dialog's 'startView' should not update`);
        isTrue(t.getCalendarLabel() == null, `No calendar should render`);
        isNotNull(t.getYearListViewFullList(), `Year list view should render`);

        const selectedYearEl = t.getYearListViewListItemYearSelectedDiv();
        isNotNull(selectedYearEl, `Selected year not found`);
        strictEqual(
          getShadowInnerHTML(selectedYearEl), '2020', `Selected year label not matched`);
      });

      it(`selects new year by button`, async () => {
        const btnYearSelectorEl = t.getBtnYearSelector();

        triggerEvent(btnYearSelectorEl, 'click');
        await forceUpdate(el);

        /**
         * NOTE: Datepicker dialog will remain the initial value which is `START_VIEW.CALENDAR`.
         * Only datepicker updates the value of `startView`.
         */
        strictEqual(
          t.elem.startView,
          START_VIEW.YEAR_LIST,
          `Datepicker's 'startView' not updated`);
        strictEqual(
          el.startView,
          START_VIEW.CALENDAR,
          `Datepicker dialog's 'startView' should not update`);
        isTrue(t.getCalendarLabel() == null, `No calendar should render`);
        isNotNull(t.getYearListViewFullList(), `Year list view should render`);

        selectNewYearFromYearListView(t.elem, '2025');
        await forceUpdate(el);

        const newBtnYearSelectorEl = t.getBtnYearSelector();

        isNotNull(newBtnYearSelectorEl, `Year selector button not found`);
        strictEqual(el.startView, START_VIEW.CALENDAR, `Calendar should render`);
        strictEqual(
          getShadowInnerHTML(newBtnYearSelectorEl),
          '2025',
          `New selected year not matched`);
      });

    });

    describe('focusing new date by gestures', () => {
      const runTestOnDialogClosed =
        (cb: (ev: CustomEvent<DatepickerDialogClosedEvent>) => void) =>
          new Promise((yay, nah) => {
            el.addEventListener('datepicker-dialog-closed', async (ev) => {
              try {
                await forceUpdate(el);
                cb(ev as CustomEvent);
                yay();
              } catch (e) {
                nah(e);
              }
            }, { once: true });
          });

      let el: AppDatepickerDialog;
      let t: ReturnType<typeof queryInit>;

      beforeEach(async () => {
        el = document.createElement(name) as AppDatepickerDialog;
        document.body.appendChild(el);

        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        el.open();
        await forceUpdate(el);

        t = queryInit(el);
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`focuses correct date by gestures`, async () => {
        strictEqual(el.value, date15, `Focused date not matched (${el.value})`);

        const newCalendarDay = t.getDatepickerBodyCalendarViewDay('Jan 22, 2020')!;
        triggerEvent(newCalendarDay, 'click');
        await forceUpdate(el);

        /**
         * NOTE: Datepicker dialog only updates `value` when user agrees upon by clicking on
         * the confirm button. Datepicker's `value` however updates on selection.
         */
        strictEqual(
          t.elem.value,
          '2020-01-22',
          `Datepicker's new focused date not updated (${el.value})`);
        strictEqual(el.value, date15, `Datepicker dialog's 'value' should not update`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector button not found`);

        const calendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          calendarSelectorLabel,
          'Wed, Jan 22',
          `Calendar selector label not matched (${calendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getFocusedCalendarDay();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          '22',
          `New focused date label not matched (${newFocusedDateLabel})`);
      });

      it(`focuses date on new month by gestures`, async () => {
        strictEqual(el.value, date15, `Focused date not matched (${el.value})`);

        const nextBtnMonthSelectorEl = t.getBtnNextMonthSelector();
        isNotNull(nextBtnMonthSelectorEl, `Next month selector button not found`);

        const animationComplete = t.waitForDragAnimationFinished();
        triggerEvent(nextBtnMonthSelectorEl, 'click');
        await animationComplete;

        const newCalendarDay = t.getDatepickerBodyCalendarViewDay('Feb 25, 2020')!;
        isNotNull(newCalendarDay, `New calendar day not found`);

        triggerEvent(newCalendarDay, 'click');
        await forceUpdate(el);

        /**
         * NOTE: Datepicker dialog only updates `value` when user agrees upon by clicking on
         * the confirm button. Datepicker's `value` however updates on selection.
         */
        strictEqual(t.elem.value, '2020-02-25', `New focused date not updated (${el.value})`);
        strictEqual(el.value, date15, `New focused date not updated (${el.value})`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, 'Calendar selector button not found');

        const calendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          calendarSelectorLabel,
          'Tue, Feb 25',
          `Calendar selector label not matched (${calendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getFocusedCalendarDay()!;
        isNotNull(newFocusedDateLabelEl, 'New focused date not found');

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl);
        strictEqual(
          newFocusedDateLabel,
          '25',
          `New focused date label not matched (${newFocusedDateLabel})`);
      });

      it(`selects new date by gestures + confirm button`, async () => {
        strictEqual(el.value, date15, `Focused date not matched (${el.value})`);

        const newCalendarDay = t.getDatepickerBodyCalendarViewDay('Jan 22, 2020')!;
        triggerEvent(newCalendarDay, 'click');
        await forceUpdate(el);

        /**
         * NOTE: Datepicker dialog only updates `value` when user agrees upon by clicking on
         * the confirm button. Datepicker's `value` however updates on selection.
         */
        strictEqual(
          t.elem.value,
          '2020-01-22',
          `Datepicker's new focused date not updated (${el.value})`);
        strictEqual(el.value, date15, `Datepicker dialog's 'value' should not update`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector button not found`);

        const calendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          calendarSelectorLabel,
          'Wed, Jan 22',
          `Calendar selector label not matched (${calendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getFocusedCalendarDay();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          '22',
          `New focused date label not matched (${newFocusedDateLabel})`);

        const valueMatchedFromEvent = runTestOnDialogClosed((ev) => {
          const { opened, value } = ev.detail;
          const expectedValue = '2020-01-22';

          strictEqual(value, expectedValue, `Updated value from event not matched (${value})`);
          strictEqual(
            el.value,
            expectedValue,
            `Datepicker dialog's 'value' not updated (${el.value})`);
          strictEqual(
            t.elem.value,
            expectedValue,
            `Datepicker dialog's 'value' not updated (${t.elem.value})`);
          isTrue(!opened, `Datepicker dialog's should be closed`);
          isTrue(
            'none' === getComputedStylePropertyValue(el, 'display'),
            `Datepicker dialog's 'display' should set to 'none'`);
          isTrue(
            el.hasAttribute('aria-hidden'),
            `Datepicker dialog's has to be closed after new date selection`);
        });
        const dialogConfirmActionButton = t.getDialogConfirmActionButton();
        isNotNull(dialogConfirmActionButton, `Dialog confirm button not found`);

        triggerEvent(dialogConfirmActionButton, 'click');
        await forceUpdate(el);
        await valueMatchedFromEvent;
      });

      it(`does not confirm new selected date by gestures + dismiss button`, async () => {
        strictEqual(el.value, date15, `Focused date not matched (${el.value})`);

        const newCalendarDay = t.getDatepickerBodyCalendarViewDay('Jan 22, 2020')!;
        triggerEvent(newCalendarDay, 'click');
        await forceUpdate(el);

        /**
         * NOTE: Datepicker dialog only updates `value` when user agrees upon by clicking on
         * the confirm button. Datepicker's `value` however updates on selection.
         */
        strictEqual(
          t.elem.value,
          '2020-01-22',
          `Datepicker's new focused date not updated (${el.value})`);
        strictEqual(el.value, date15, `Datepicker dialog's 'value' should not update`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector button not found`);

        const calendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          calendarSelectorLabel,
          'Wed, Jan 22',
          `Calendar selector label not matched (${calendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getFocusedCalendarDay();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          '22',
          `New focused date label not matched (${newFocusedDateLabel})`);

        const valueMatchedFromEvent = runTestOnDialogClosed((ev) => {
          const { opened, value } = ev.detail;
          const expectedValue = date15;

          strictEqual(value, expectedValue, `Updated value from event not matched (${value})`);
          strictEqual(
            el.value,
            expectedValue,
            `Datepicker dialog's 'value' not updated (${el.value})`);
          strictEqual(
            t.elem.value,
            '2020-01-22',
            `Datepicker dialog's 'value' not updated (${t.elem.value})`);
          isTrue(!opened, `Datepicker dialog's should be closed`);
          isTrue(
            'none' === getComputedStylePropertyValue(el, 'display'),
            `Datepicker dialog's 'display' should set to 'none'`);
          isTrue(
            el.hasAttribute('aria-hidden'),
            `Datepicker dialog's has to be closed after new date selection`);
        });
        const dialogDismissActionButton = t.getDialogDismissActionButton();
        isNotNull(dialogDismissActionButton, `Dialog confirm button not found`);

        triggerEvent(dialogDismissActionButton, 'click');
        await forceUpdate(el);
        await valueMatchedFromEvent;
      });

      it(`closes dialog by clicking on scrim`, async () => {
        strictEqual(el.value, date15, `Focused date not matched (${el.value})`);

        const newCalendarDay = t.getDatepickerBodyCalendarViewDay('Jan 22, 2020')!;
        triggerEvent(newCalendarDay, 'click');
        await forceUpdate(el);

        /**
         * NOTE: Datepicker dialog only updates `value` when user agrees upon by clicking on
         * the confirm button. Datepicker's `value` however updates on selection.
         */
        strictEqual(
          t.elem.value,
          '2020-01-22',
          `Datepicker's new focused date not updated (${el.value})`);
        strictEqual(el.value, date15, `Datepicker dialog's 'value' should not update`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector button not found`);

        const calendarSelectorLabel = getShadowInnerHTML(btnCalendarSelectorEl);
        strictEqual(
          calendarSelectorLabel,
          'Wed, Jan 22',
          `Calendar selector label not matched (${calendarSelectorLabel})`);

        const newFocusedDateLabelEl = t.getFocusedCalendarDay();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        const newFocusedDateLabel = getShadowInnerHTML(newFocusedDateLabelEl!);
        strictEqual(
          newFocusedDateLabel,
          '22',
          `New focused date label not matched (${newFocusedDateLabel})`);

        const valueMatchedFromEvent = runTestOnDialogClosed((ev) => {
          const { opened, value } = ev.detail;
          const expectedValue = date15;

          strictEqual(value, expectedValue, `Updated value from event not matched (${value})`);
          strictEqual(
            el.value,
            expectedValue,
            `Datepicker dialog's 'value' not updated (${el.value})`);
          strictEqual(
            t.elem.value,
            '2020-01-22',
            `Datepicker dialog's 'value' not updated (${t.elem.value})`);
          isTrue(!opened, `Datepicker dialog's should be closed`);
          isTrue(
            'none' === getComputedStylePropertyValue(el, 'display'),
            `Datepicker dialog's 'display' should set to 'none'`);
          isTrue(
            el.hasAttribute('aria-hidden'),
            `Datepicker dialog's has to be closed after new date selection`);
        });
        const dialogScrim = t.getDialogScrim();
        isNotNull(dialogScrim, `Dialog confirm button not found`);

        triggerEvent(dialogScrim, 'click');
        await forceUpdate(el);
        await valueMatchedFromEvent;
      });

      it(`focuses '_min' when updating year from month < that of '_min'`, async () => {
        const updateYear = async (year: string) => {
          const btnYearSelector = t.getBtnYearSelector();
          isNotNull(btnYearSelector, `Year selector not found`);

          triggerEvent(btnYearSelector, 'click');
          await forceUpdate(el);

          const yearListViewFullList = t.getYearListViewFullList();
          isNotNull(yearListViewFullList, `Year list view full list not found`);

          selectNewYearFromYearListView(t.elem, year);
          await forceUpdate(el);

          const btnYearSelectorLabel = getShadowInnerHTML(btnYearSelector);
          strictEqual(btnYearSelectorLabel, year, `Year selector label not updated`);
        };
        const verifyDate = (e: string[], e1: string, e2: string) => {
          const calendarLabel = t.getCalendarLabel();
          isNotNull(calendarLabel, `Calendar label not found`);

          const newCalendarLabel = getShadowInnerHTML(t.getCalendarLabel());
          /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
          isTrue(
            e.some(n => newCalendarLabel === n),
            `Calendar label not updated (${newCalendarLabel})`);

          const btnCalendarSelector = t.getBtnCalendarSelector();
          isNotNull(btnCalendarSelector, `Calendar selector not found`);
          strictEqual(getShadowInnerHTML(btnCalendarSelector), e1);

          const focusedDateDiv = t.getFocusedCalendarDay()!;
          isNotNull(focusedDateDiv, `Focused date not found`);
          strictEqual(
            getShadowInnerHTML(focusedDateDiv), e2, `New focused not updated`);
        };

        el.min = '2020-04-13';
        el.value = '2020-04-25';
        await forceUpdate(el);
        await updateYear('2021');

        const btnPrevMonthSelector = t.getBtnPrevMonthSelector();
        isNotNull(btnPrevMonthSelector, 'Prev month selector button not found');

        for (let i = 0; i < 3; i += 1) {
          triggerEvent(btnPrevMonthSelector, 'click');
          await t.waitForDragAnimationFinished();
        }
        await forceUpdate(el);

        const selectableDate = t.getSelectableDate('Jan 15, 2021');
        isNotNull(selectableDate, `Selectable date not found`);

        triggerEvent(selectableDate, 'click');
        await forceUpdate(el);

        verifyDate(['Jan 2021', 'January, 2021', 'January 2021'], 'Fri, Jan 15', '15');

        await updateYear('2020');

        verifyDate(['Apr 2020', 'April, 2020', 'April 2020'], 'Mon, Apr 13', '13');

      });

      it(`shows the correct calendar month with '_max'`, async () => {
        /**
         * NOTE: This tests `_updateMonth` works correctly on condition check for max date.
         */
        el.min = '2000-01-15';
        el.max = '2020-10-15';
        el.value = '2019-08-13';
        await forceUpdate(el);

        const nextBtnMonthSelectorEl = t.getBtnNextMonthSelector();
        isNotNull(nextBtnMonthSelectorEl, `Next month selector button not found`);

        for (let i = 0; i < 3; i += 1) {
          triggerEvent(nextBtnMonthSelectorEl, 'click');
          await t.waitForDragAnimationFinished();
        }
        await forceUpdate(el);

        const calendarLabelEl = t.getCalendarLabel();
        isNotNull(calendarLabelEl, 'Calendar label not found');

        const calendarLabel = getShadowInnerHTML(calendarLabelEl);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          ['Nov 2019', 'November, 2019', 'November 2019'].some(n => calendarLabel === n),
          `Calendar label not updated (${calendarLabel})`);

      });

    });

    describe('landscape', () => {
      let el: AppDatepickerDialog;
      let t: ReturnType<typeof queryInit>;

      const testCalendarLabel = (testName: string, e: string[]) => {
        const calendarLabelEl = t.getCalendarLabel();
        isNotNull(calendarLabelEl, `Calendar label ${testName} not found`);

        const calendarLabel = getShadowInnerHTML(calendarLabelEl);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          e.some(n => calendarLabel === n),
          `Calendar label ${testName} not ${
            testName === '1' ? 'matched' : 'updated'} (${calendarLabel})`);
      };
      const dragCalendar = async (
        testName: string,
        dir: 'left' | 'right',
        dx: number,
        times: number
      ) => {
        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(
          calendarViewFullCalendarEl, `Calendar view full calendar ${testName} not found`);

        for (let i = 0; i < times; i += 1) {
          const startingPoint = setupDragPoint(dir, t.elem);
          const dragOptions: OptionsDragTo = { ...startingPoint, dx };
          await dragTo(calendarViewFullCalendarEl, dragOptions);
          await t.waitForDragAnimationFinished();
        }
        await forceUpdate(el);
      };

      beforeEach(async () => {
        el = document.createElement(name) as AppDatepickerDialog;
        document.body.appendChild(el);

        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        el.min = date13;
        el.value = date15;
        el.landscape = true;
        await forceUpdate(el);

        el.open();
        await forceUpdate(el);

        t = queryInit(el);
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`updates calendar correctly`, async () => {
        const goNextMonth = async (testName: string, times: number) => {
          const btnNextMonthSelectorEl = t.getBtnNextMonthSelector();
          isNotNull(btnNextMonthSelectorEl, `Next month button ${testName} not found`);

          for (let i = 0; i < times; i += 1) {
            triggerEvent(btnNextMonthSelectorEl, 'click');
            await t.waitForDragAnimationFinished();
          }
          await forceUpdate(el);
        };
        const goPrevMonth = async (testName: string, times: number) => {
          const btnPrevMonthSelectorEl = t.getBtnPrevMonthSelector();
          isNotNull(btnPrevMonthSelectorEl, `Next month button ${testName} not found`);

          for (let i = 0; i < times; i += 1) {
            triggerEvent(btnPrevMonthSelectorEl, 'click');
            await t.waitForDragAnimationFinished();
          }
          await forceUpdate(el);
        };
        const goYearListView = async (testName: string) => {
          const btnYearSelectorEl = t.getBtnYearSelector();
          isNotNull(btnYearSelectorEl, `Year selector ${testName} not found`);

          triggerEvent(btnYearSelectorEl, 'click');
          await forceUpdate(el);
        };

        testCalendarLabel('1', ['Jan 2020', 'January, 2020', 'January 2020']);
        await goYearListView('1');

        selectNewYearFromYearListView(t.elem, '2021');
        await forceUpdate(el);

        testCalendarLabel('2', ['Jan 2021', 'January, 2021', 'January 2021']);
        await goNextMonth('1', 3);

        testCalendarLabel('3', ['Apr 2021', 'April, 2021', 'April 2021']);
        await dragCalendar('1', 'right', 60, 2);

        testCalendarLabel('4', ['Feb 2021', 'February, 2021', 'February 2021']);
        await goYearListView('2');

        selectNewYearFromYearListView(t.elem, '2020');
        await forceUpdate(el);

        testCalendarLabel('5', ['Jan 2020', 'January, 2020', 'January 2020']);
        await goNextMonth('2', 2);
        testCalendarLabel('6', ['Mar 2020', 'March, 2020', 'March 2020']);

        await goPrevMonth('1', 2);
        testCalendarLabel('7', ['Jan 2020', 'January, 2020', 'January 2020']);
      });

      it(`resets 'style' attribute when dragging ends`, async () => {
        testCalendarLabel('1', ['Jan 2020', 'January, 2020', 'January 2020']);
        await dragCalendar('1', 'left', -60, 2);
        testCalendarLabel('2', ['Mar 2020', 'March, 2020', 'March 2020']);

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();

        isNotNull(calendarViewFullCalendarEl, `Calendar view full calendar not found`);
        strictEqual(calendarViewFullCalendarEl.style.minWidth, '', `'minWidth' not reset`);
        strictEqual(calendarViewFullCalendarEl.style.width, '', `'width' not reset`);
      });

      it(`updates full calendar's position when 'landscape' changes`, async () => {
        const getComputedWidth = (elem: HTMLElement) => {
          const width = elem.getBoundingClientRect().width;
          return makeNumberPrecise(width);
        };

        isTrue(el.landscape, `'landscape' not matched`);
        isTrue(el.hasAttribute('landscape'), `'landscape' attribute not set`);

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view full calendar not found`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Datepicker body calendar view not found`);

        strictEqual(
          calendarViewFullCalendarEl.style.transform,
          `translate3d(-${getComputedWidth(datepickerBodyCalendarViewEl)}px, 0px, 0px)`,
          `CSS 'transform' not matched`);

        el.landscape = false;
        await forceUpdate(el);

        isTrue(!el.landscape, `'landscape' not updated`);
        isTrue(!el.hasAttribute('landscape'), `'landscape' attribute not reset`);

        strictEqual(
          calendarViewFullCalendarEl.style.transform,
          `translate3d(-${getComputedWidth(datepickerBodyCalendarViewEl)}px, 0px, 0px)`,
          `CSS 'transform' not updated`);
      });

    });

    describe('multiple properties/ attributes', () => {
      let el: AppDatepickerDialog;
      let t: ReturnType<typeof queryInit>;

      const testCalendarLabel = (testName: string, e: string[]) => {
        const calendarLabelEl = t.getCalendarLabel();
        isNotNull(calendarLabelEl, `Calendar label ${testName} not found`);

        const calendarLabel = getShadowInnerHTML(calendarLabelEl);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          e.some(n => calendarLabel === n),
          `Calendar label ${testName} not ${
            testName === '1' ? 'matched' : 'updated'} (${calendarLabel})`);
      };
      const dragCalendar = async (
        testName: string,
        dir: 'left' | 'right',
        dx: number,
        times: number
      ) => {
        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(
          calendarViewFullCalendarEl, `Calendar view full calendar ${testName} not found`);

        for (let i = 0; i < times; i += 1) {
          const startingPoint = setupDragPoint(dir, t.elem);
          const dragOptions: OptionsDragTo = { ...startingPoint, dx };
          await dragTo(calendarViewFullCalendarEl, dragOptions);
          await t.waitForDragAnimationFinished();
        }
        await forceUpdate(el);
      };
      const goNextMonth = async (testName: string, times: number) => {
        const btnNextMonthSelectorEl = t.getBtnNextMonthSelector();
        isNotNull(btnNextMonthSelectorEl, `Next month button ${testName} not found`);

        for (let i = 0; i < times; i += 1) {
          triggerEvent(btnNextMonthSelectorEl, 'click');
          await t.waitForDragAnimationFinished();
        }
        await forceUpdate(el);
      };

      beforeEach(async () => {
        el = document.createElement(name) as AppDatepickerDialog;
        document.body.appendChild(el);

        el.locale = defaultLocale;
        el.startView = START_VIEW.CALENDAR;
        el.min = date13;
        el.value = date15;
        await forceUpdate(el);

        el.open();
        await forceUpdate(el);

        t = queryInit(el);
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`resets calendar when updating 'value' and 'firstDayOfWeek'`, async () => {
        strictEqual(el.value, '2020-01-15', `'value' not matched`);
        strictEqual(el.firstDayOfWeek, 0, `'firstDayOfWeek' not matched`);
        testCalendarLabel('1', ['Jan 2020', 'January, 2020', 'January 2020']);

        await goNextMonth('1', 1);
        await dragCalendar('1', 'left', -60, 2);
        await forceUpdate(el);

        testCalendarLabel('2', ['Apr 2020', 'April, 2020', 'April 2020']);

        el.firstDayOfWeek = 2;
        el.value = date13;
        await forceUpdate(el);

        strictEqual(t.elem.firstDayOfWeek, 2, `'firstDayOfWeek' not updated`);
        strictEqual(t.elem.value, '2020-01-13', `'value' not updated`);
        testCalendarLabel('3', ['Jan 2020', 'January, 2020', 'January 2020']);

        await goNextMonth('2', 2);
        await forceUpdate(el);

        testCalendarLabel('4', ['Mar 2020', 'March, 2020', 'March 2020']);
      });

      it(`resets calendar when 'value' and 'firstdayofweek' attributes are set`, async () => {
        strictEqual(el.value, '2020-01-15', `'value' not matched`);
        strictEqual(el.firstDayOfWeek, 0, `'firstDayOfWeek' not matched`);
        testCalendarLabel('1', ['Jan 2020', 'January, 2020', 'January 2020']);

        await goNextMonth('1', 1);
        await dragCalendar('1', 'left', -60, 2);
        await forceUpdate(el);

        testCalendarLabel('2', ['Apr 2020', 'April, 2020', 'April 2020']);

        el.setAttribute('firstdayofweek', '2');
        el.setAttribute('value', date13);
        await forceUpdate(el);

        strictEqual(el.firstDayOfWeek, 2, `'firstDayOfWeek' not updated`);
        strictEqual(el.value, '2020-01-13', `'value' not updated`);
        strictEqual(t.elem.firstDayOfWeek, 2, `Datepicker's 'firstDayOfWeek' not updated`);
        strictEqual(t.elem.value, '2020-01-13', `Datepicker's 'value' not updated`);
        testCalendarLabel('3', ['Jan 2020', 'January, 2020', 'January 2020']);

        await goNextMonth('2', 2);
        await forceUpdate(el);

        testCalendarLabel('4', ['Mar 2020', 'March, 2020', 'March 2020']);
      });

      it(`focuses new date when 'locale' is set`, async () => {
        strictEqual(el.value, '2020-01-15', `'value' not matched`);
        strictEqual(el.locale, defaultLocale, `'locale' not matched`);

        testCalendarLabel('1', ['Jan 2020', 'January, 2020', 'January 2020']);

        const focusedCalendarDay = t.getFocusedCalendarDay()!;
        isNotNull(focusedCalendarDay, `Focused day div not found`);
        strictEqual(getShadowInnerHTML(focusedCalendarDay), '15');

        el.locale = 'ja-JP';
        await forceUpdate(el);

        const selectableDateEl = t.getSelectableDate('2020年1月24日');
        isNotNull(selectableDateEl, `Selectable date not found`);

        triggerEvent(selectableDateEl, 'click');
        await forceUpdate(el);

        const focusedCalendarDay2 = t.getFocusedCalendarDay()!;
        isNotNull(focusedCalendarDay2, `Updated focused day div not found`);
        strictEqual(getShadowInnerHTML(focusedCalendarDay2), '24日');
      });

    });

  });
});
