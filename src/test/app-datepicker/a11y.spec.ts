import { AppDatepicker, START_VIEW } from '../../app-datepicker';

import 'axe-core/axe';
import { axeReport } from 'pwa-helpers/axe-report';

import { defaultLocale } from '../test-config';
import { getYearListViewFullListEl } from './helpers';

const { isNotNull } = chai.assert;

describe('app-datepicker', () => {
  describe('a11y', () => {
    let el: AppDatepicker;

    beforeEach(async () => {
      el = document.createElement('app-datepicker') as AppDatepicker;
      el.locale = defaultLocale;
      el.startView = START_VIEW.CALENDAR;

      document.body.appendChild(el);

      await el.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`is accesible (calendar view)`, async () => axeReport(el));
    it(`is accesible (year list view)`, async () => {
      el.startView = START_VIEW.YEAR_LIST;
      await el.updateComplete;

      const yearListViewFullListEl = getYearListViewFullListEl(el);
      isNotNull(yearListViewFullListEl, `Year list view not found`);

      return axeReport(el);
    });
  });
});
