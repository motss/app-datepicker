import 'axe-core/axe.min.js';
import { axeReport } from 'pwa-helpers/axe-report';

import { START_VIEW } from '../../app-datepicker';
import { AppDatepickerDialog } from '../../app-datepicker-dialog';
import { defaultLocale } from '../test-config';
import {
  forceUpdate,
  getTestName,
  queryInit,
} from '../test-helpers';

const { isNotNull } = chai.assert;
const name = AppDatepickerDialog.is;

describe(getTestName(name), () => {
  describe('a11y', () => {
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

    it(`is accesible (calendar view)`, async () => axeReport(el));
    it(`is accesible (year list view)`, async () => {
      el.startView = START_VIEW.YEAR_LIST;
      await forceUpdate(el);

      const yearListViewFullListEl = t.getYearListViewFullList();
      isNotNull(yearListViewFullListEl, `Year list view not found`);

      return axeReport(el);
    });

  });
});
