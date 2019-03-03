import { START_VIEW } from '../../app-datepicker';
import { AppDatepickerDialog } from '../../app-datepicker-dialog';

import 'axe-core/axe';
import { axeReport } from 'pwa-helpers/axe-report';

import { getYearListViewFullListEl } from '../app-datepicker/helpers';
import { defaultLocale } from '../test-config';
import { getAppDatepickerEl } from './helpers';

const { isNotNull } = chai.assert;

describe('app-datepicker-dialog', () => {
  describe('a11y', () => {
    let el: AppDatepickerDialog;

    beforeEach(async () => {
      el = document.createElement('app-datepicker-dialog') as AppDatepickerDialog;
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

      const yearListViewFullListEl = getYearListViewFullListEl(getAppDatepickerEl(el));
      isNotNull(yearListViewFullListEl, `Year list view not found`);

      return axeReport(el);
    });
  });
});
