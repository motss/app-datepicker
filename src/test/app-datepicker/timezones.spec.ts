import { AppDatepicker, START_VIEW } from '../../app-datepicker.js';
import { date13, date15, defaultLocale } from '../test-config.js';
import { forceUpdate, getTestName } from '../test-helpers.js';
import { getAllDateStrings } from './timezones.js';

const {
  strictEqual,
} = chai.assert;
const name = AppDatepicker.is;

describe(getTestName(name), () => {
  describe('timezones', () => {
    const allDateStrings = getAllDateStrings();
    const runTest = async (tz: string) => {
      strictEqual(el.value, date15, `Initial date not matched`);

      const { timezone, dates } = allDateStrings[tz];

      strictEqual(timezone, tz, `Timezone not matched`);

      for (const { date, value } of dates) {
        el.value = date;
        await forceUpdate(el);

        strictEqual(el.value, value, `'value' not updated ('${date}')`);
      }
    };

    let el: AppDatepicker;

    beforeEach(async () => {
      el = document.createElement(name) as AppDatepicker;
      document.body.appendChild(el);

      el.locale = defaultLocale;
      el.startView = START_VIEW.CALENDAR;
      el.min = date13;
      el.value = date15;
      await forceUpdate(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`resolves to correct date in different timezones (-12:00)`, () => runTest('-12:00'));
    it(`resolves to correct date in different timezones (-11:00)`, () => runTest('-11:00'));
    it(`resolves to correct date in different timezones (-10:00)`, () => runTest('-10:00'));
    it(`resolves to correct date in different timezones (-09:30)`, () => runTest('-09:30'));
    it(`resolves to correct date in different timezones (-09:00)`, () => runTest('-09:00'));
    it(`resolves to correct date in different timezones (-08:00)`, () => runTest('-08:00'));
    it(`resolves to correct date in different timezones (-07:00)`, () => runTest('-07:00'));
    it(`resolves to correct date in different timezones (-06:00)`, () => runTest('-06:00'));
    it(`resolves to correct date in different timezones (-05:00)`, () => runTest('-05:00'));
    it(`resolves to correct date in different timezones (-04:00)`, () => runTest('-04:00'));
    it(`resolves to correct date in different timezones (-03:30)`, () => runTest('-03:30'));
    it(`resolves to correct date in different timezones (-03:00)`, () => runTest('-03:00'));
    it(`resolves to correct date in different timezones (-02:00)`, () => runTest('-02:00'));
    it(`resolves to correct date in different timezones (-01:00)`, () => runTest('-01:00'));
    it(`resolves to correct date in different timezones (-00:00)`, () => runTest('-00:00'));
    it(`resolves to correct date in different timezones (+00:00)`, () => runTest('+00:00'));
    it(`resolves to correct date in different timezones (+01:00)`, () => runTest('+01:00'));
    it(`resolves to correct date in different timezones (+02:00)`, () => runTest('+02:00'));
    it(`resolves to correct date in different timezones (+03:00)`, () => runTest('+03:00'));
    it(`resolves to correct date in different timezones (+03:30)`, () => runTest('+03:30'));
    it(`resolves to correct date in different timezones (+04:00)`, () => runTest('+04:00'));
    it(`resolves to correct date in different timezones (+04:30)`, () => runTest('+04:30'));
    it(`resolves to correct date in different timezones (+05:00)`, () => runTest('+05:00'));
    it(`resolves to correct date in different timezones (+05:30)`, () => runTest('+05:30'));
    it(`resolves to correct date in different timezones (+06:00)`, () => runTest('+06:00'));
    it(`resolves to correct date in different timezones (+06:30)`, () => runTest('+06:30'));
    it(`resolves to correct date in different timezones (+07:00)`, () => runTest('+07:00'));
    it(`resolves to correct date in different timezones (+08:00)`, () => runTest('+08:00'));
    it(`resolves to correct date in different timezones (+08:45)`, () => runTest('+08:45'));
    it(`resolves to correct date in different timezones (+09:00)`, () => runTest('+09:00'));
    it(`resolves to correct date in different timezones (+09:30)`, () => runTest('+09:30'));
    it(`resolves to correct date in different timezones (+10:00)`, () => runTest('+10:00'));
    it(`resolves to correct date in different timezones (+10:30)`, () => runTest('+10:30'));
    it(`resolves to correct date in different timezones (+11:00)`, () => runTest('+11:00'));
    it(`resolves to correct date in different timezones (+12:00)`, () => runTest('+12:00'));
    it(`resolves to correct date in different timezones (+12:45)`, () => runTest('+12:45'));
    it(`resolves to correct date in different timezones (+13:00)`, () => runTest('+13:00'));
    it(`resolves to correct date in different timezones (+14:00)`, () => runTest('+14:00'));

  });
});
