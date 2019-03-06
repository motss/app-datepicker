import { START_VIEW } from '../../app-datepicker';

import { AppDatepicker } from '../../app-datepicker';
import { date13, date15, defaultLocale } from '../test-config';
import { getAllDateStrings } from './timezones';

const {
  strictEqual,
} = chai.assert;

describe('app-datepicker', () => {
  describe('timezones', () => {
    const allDateStrings = getAllDateStrings();
    const runTest = async (tz: string) => {
      strictEqual(el.value, date15, `Initial date not matched`);

      const { timezone, dates } = allDateStrings[tz];

      strictEqual(
        timezone,
        tz,
        `Timezone not matched. Expected '${tz}' but received '${timezone}'.`);

      for (const { date, value } of dates) {
        el.value = date;
        await el.updateComplete;

        strictEqual(
          el.value,
          value,
          `'value' not updated ('${date}'). Expected '${value}' but found ('${el.value}')`);
      }
    };

    let el: AppDatepicker;

    beforeEach(async () => {
      el = document.createElement('app-datepicker') as AppDatepicker;
      document.body.appendChild(el);

      el.locale = defaultLocale;
      el.startView = START_VIEW.CALENDAR;
      el.min = date13;
      el.value = date15;
      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`resolves to correct date in different timezones (-12:00)`, async () => runTest('-12:00'));
    it(`resolves to correct date in different timezones (-11:00)`, async () => runTest('-11:00'));
    it(`resolves to correct date in different timezones (-10:00)`, async () => runTest('-10:00'));
    it(`resolves to correct date in different timezones (-09:30)`, async () => runTest('-09:30'));
    it(`resolves to correct date in different timezones (-09:00)`, async () => runTest('-09:00'));
    it(`resolves to correct date in different timezones (-08:00)`, async () => runTest('-08:00'));
    it(`resolves to correct date in different timezones (-07:00)`, async () => runTest('-07:00'));
    it(`resolves to correct date in different timezones (-06:00)`, async () => runTest('-06:00'));
    it(`resolves to correct date in different timezones (-05:00)`, async () => runTest('-05:00'));
    it(`resolves to correct date in different timezones (-04:00)`, async () => runTest('-04:00'));
    it(`resolves to correct date in different timezones (-03:30)`, async () => runTest('-03:30'));
    it(`resolves to correct date in different timezones (-03:00)`, async () => runTest('-03:00'));
    it(`resolves to correct date in different timezones (-02:00)`, async () => runTest('-02:00'));
    it(`resolves to correct date in different timezones (-01:00)`, async () => runTest('-01:00'));
    it(`resolves to correct date in different timezones (-00:00)`, async () => runTest('-00:00'));
    it(`resolves to correct date in different timezones (+00:00)`, async () => runTest('+00:00'));
    it(`resolves to correct date in different timezones (+01:00)`, async () => runTest('+01:00'));
    it(`resolves to correct date in different timezones (+02:00)`, async () => runTest('+02:00'));
    it(`resolves to correct date in different timezones (+03:00)`, async () => runTest('+03:00'));
    it(`resolves to correct date in different timezones (+03:30)`, async () => runTest('+03:30'));
    it(`resolves to correct date in different timezones (+04:00)`, async () => runTest('+04:00'));
    it(`resolves to correct date in different timezones (+04:30)`, async () => runTest('+04:30'));
    it(`resolves to correct date in different timezones (+05:00)`, async () => runTest('+05:00'));
    it(`resolves to correct date in different timezones (+05:30)`, async () => runTest('+05:30'));
    it(`resolves to correct date in different timezones (+06:00)`, async () => runTest('+06:00'));
    it(`resolves to correct date in different timezones (+06:30)`, async () => runTest('+06:30'));
    it(`resolves to correct date in different timezones (+07:00)`, async () => runTest('+07:00'));
    it(`resolves to correct date in different timezones (+08:00)`, async () => runTest('+08:00'));
    it(`resolves to correct date in different timezones (+08:45)`, async () => runTest('+08:45'));
    it(`resolves to correct date in different timezones (+09:00)`, async () => runTest('+09:00'));
    it(`resolves to correct date in different timezones (+09:30)`, async () => runTest('+09:30'));
    it(`resolves to correct date in different timezones (+10:00)`, async () => runTest('+10:00'));
    it(`resolves to correct date in different timezones (+10:30)`, async () => runTest('+10:30'));
    it(`resolves to correct date in different timezones (+11:00)`, async () => runTest('+11:00'));
    it(`resolves to correct date in different timezones (+12:00)`, async () => runTest('+12:00'));
    it(`resolves to correct date in different timezones (+12:45)`, async () => runTest('+12:45'));
    it(`resolves to correct date in different timezones (+13:00)`, async () => runTest('+13:00'));
    it(`resolves to correct date in different timezones (+14:00)`, async () => runTest('+14:00'));

  });
});
