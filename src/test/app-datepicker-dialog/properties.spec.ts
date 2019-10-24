import { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
import { START_VIEW } from '../../app-datepicker.js';
import { WEEK_NUMBER_TYPE } from '../../calendar.js';
import {
  date13,
  date15,
  date17,
  defaultLocale,
} from '../test-config.js';
import {
  forceUpdate,
  getTestName,
  queryInit,
} from '../test-helpers.js';

const {
  isTrue,
  strictEqual,
} = chai.assert;
const name = AppDatepickerDialog.is;

describe(getTestName(name), () => {
  describe('properties', () => {
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

    it(`renders with predefined properties`, async () => {
      strictEqual(el.locale, defaultLocale, `'locale' not matched`);
      strictEqual(el.value, date15, `'value' not matched`);

      strictEqual(el.startView, START_VIEW.CALENDAR, `'startView' not matched`);
      strictEqual(
        el.getAttribute('startview'), START_VIEW.CALENDAR, `'startview' attribute not matched`);

      strictEqual(el.min, date13, `'min' not matched`);
      strictEqual(el.getAttribute('min'), date13, `'min' attribute not matched`);
    });

    it(`renders with correct 'min'`, async () => {
      const newVal = date15;
      el.min = newVal;
      await forceUpdate(el);

      strictEqual(el.min, newVal, `'min' not updated`);
      strictEqual(el.getAttribute('min'), newVal, `'min' attribute not set`);

      strictEqual(t.elem.min, newVal, `datepicker's 'min' not updated`);
      strictEqual(t.elem.getAttribute('min'), newVal, `datepicker's 'min' attribute not set`);
    });

    it(`renders with correct 'max'`, async () => {
      const newVal = date17;
      el.max = newVal;
      await forceUpdate(el);

      strictEqual(el.max, newVal, `'max' not updated`);
      strictEqual(el.getAttribute('max'), newVal, `'max' attribute not set`);

      strictEqual(t.elem.max, newVal, `datepicker's 'max' not updated`);
      strictEqual(t.elem.getAttribute('max'), newVal, `datepicker's 'max' attribute not set`);
    });

    it(`renders with correct 'value'`, async () => {
      const newVal = date17;
      el.value = newVal;
      await forceUpdate(el);

      strictEqual(el.value, newVal, `'value' not updated`);
      strictEqual(t.elem.value, newVal, `datepicker's 'value' not updated`);
    });

    it(`renders with correct 'startView'`, async () => {
      const newVal = START_VIEW.YEAR_LIST;
      el.startView = newVal;
      await forceUpdate(el);

      strictEqual(el.startView, newVal, `'startView' not updated`);
      strictEqual(
        el.getAttribute('startview'), newVal, `'startview' attribute not set`);

      strictEqual(
        t.elem.startView, newVal, `datepicker's 'startView' not updated`);
      strictEqual(
        t.elem.getAttribute('startview'),
        newVal,
        `datepicker's 'startview' attribute not set`);
    });

    it(`renders with correct 'firstdayofweek'`, async () => {
      const newVal = '1';
      el.firstDayOfWeek = +newVal;
      await forceUpdate(el);

      strictEqual(el.firstDayOfWeek, +newVal, `'firstDayOfWeek' not updated`);
      strictEqual(
        el.getAttribute('firstdayofweek'),
        newVal,
        `'firstdayofweek' attribute not set`);

      strictEqual(
        t.elem.firstDayOfWeek, +newVal, `datepicker's 'firstDayOfWeek' not updated`);
      strictEqual(
        t.elem.getAttribute('firstdayofweek'),
        newVal,
        `datepicker's 'firstdayofweek' attribute not set`);
    });

    it(`renders with correct 'showweeknumber'`, async () => {
      el.showWeekNumber = true;
      await forceUpdate(el);

      strictEqual(el.showWeekNumber, true, `'showWeekNumber' not updated`);
      isTrue(el.hasAttribute('showweeknumber'), `'showweeknumber' attribute not set`);

      strictEqual(t.elem.showWeekNumber, true, `datepicker's 'showWeekNumber' not updated`);
      isTrue(
        t.elem.hasAttribute('showweeknumber'),
        `datepicker's 'showweeknumber' attribute not set`);
    });

    it(`renders with correct 'weekNumberType'`, async () => {
      const newVal = WEEK_NUMBER_TYPE.FIRST_DAY_OF_YEAR;
      el.weekNumberType = newVal;
      await forceUpdate(el);

      strictEqual(
        el.weekNumberType, newVal, `'weekNumberType' not updated`);
      strictEqual(
        el.getAttribute('weeknumbertype'),
        newVal,
        `'weeknumbertype' attribute not set`);

      strictEqual(
        t.elem.weekNumberType,
        newVal,
        `datepicker's 'weekNumberType' not updated`);
      strictEqual(
        t.elem.getAttribute('weeknumbertype'),
        newVal,
        `datepicker's 'weeknumbertype' attribute not set`);
    });

    it(`renders with correct 'landscape'`, async () => {
      el.landscape = true;
      await forceUpdate(el);

      strictEqual(el.landscape, true, `'landscape' not updated`);
      isTrue(el.hasAttribute('landscape'), `'landscape' attribute not set`);

      strictEqual(t.elem.landscape, true, `datepicker's 'landscape' not updated`);
      isTrue(t.elem.hasAttribute('landscape'), `datepicker's 'landscape' attribute not set`);
    });

    it(`renders with correct 'locale'`, async () => {
      const newVal = 'ja-JP';
      el.locale = newVal;
      await forceUpdate(el);

      strictEqual(el.locale, newVal, `'locale' not updated`);
      strictEqual(t.elem.locale, newVal, `datepicker's 'locale' not updated`);
    });

    it(`renders with correct 'disabledDays'`, async () => {
      const newVal = '0,6';
      el.disabledDays = newVal;
      await forceUpdate(el);

      strictEqual(el.disabledDays, newVal, `'disabledDays' not updated`);
      strictEqual(t.elem.disabledDays, newVal, `datepicker's 'disabledDays' not updated`);
    });

    it(`renders with correct 'disabledDates'`, async () => {
      const newVal = '2020-01-20, 2020-01-20T00:00:00.00Z';
      el.disabledDates = newVal;
      await forceUpdate(el);

      strictEqual(el.disabledDates, newVal, `'disabledDates' not updated`);
      strictEqual(t.elem.disabledDates, newVal, `datepicker's 'disabledDates' not updated`);
    });

    it(`renders with correct 'weekLabel'`, async () => {
      const newVal = '周';
      el.weekLabel = newVal;
      await forceUpdate(el);

      strictEqual(el.weekLabel, newVal, `'weekLabel' not updated`);
      strictEqual(t.elem.weekLabel, newVal, `datepicker's 'weekLabel' not updated`);
    });

    it(`renders with correct 'dragRatio'`, async () => {
      const newVal = .25;
      el.dragRatio = newVal;
      await forceUpdate(el);

      strictEqual(el.dragRatio, newVal, `'dragRatio' not updated`);
      strictEqual(t.elem.dragRatio, newVal, `datepicker's 'dragRatio' not updated`);
    });

  });
});
