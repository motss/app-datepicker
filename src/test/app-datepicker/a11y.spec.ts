import 'axe-core/axe.min.js';
import { axeReport } from 'pwa-helpers/axe-report.js';

import { AppDatepicker } from '../../app-datepicker.js';
import { defaultLocale } from '../test-config.js';
import { forceUpdate, getTestName, queryInit } from '../test-helpers.js';

const { isNotNull } = chai.assert;
const name = AppDatepicker.is;

describe(getTestName(name), () => {
  describe('a11y', () => {
    let el: AppDatepicker;
    let t: ReturnType<typeof queryInit>;

    beforeEach(async () => {
      el = document.createElement(name) as AppDatepicker;
      document.body.appendChild(el);

      el.locale = defaultLocale;
      el.startView = 'calendar';
      await forceUpdate(el);

      t = queryInit(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`is accessible (calendar view)`, async () => axeReport(el));
    it(`is accessible (year list view)`, async () => {
      el.startView = 'yearList';
      await forceUpdate(el);

      const yearListViewFullListEl = t.getYearListViewFullList();
      isNotNull(yearListViewFullListEl, `Year list view not found`);

      return axeReport(el);
    });
  });
});
