import { START_VIEW } from '../../app-datepicker';

import 'axe-core/axe';
import { axeReport } from 'pwa-helpers/axe-report';

import { AppDatepickerDialog } from '../../app-datepicker-dialog';
import { defaultLocale } from '../test-config';
import { queryInit } from '../test-helpers';

const { isNotNull } = chai.assert;
const name = AppDatepickerDialog.is;

describe(name, () => {
  describe('a11y', () => {
    let el: AppDatepickerDialog;
    let t: ReturnType<typeof queryInit>;

    beforeEach(async () => {
      el = document.createElement(name) as AppDatepickerDialog;
      document.body.appendChild(el);

      el.locale = defaultLocale;
      el.startView = START_VIEW.CALENDAR;
      await el.updateComplete;

      t = queryInit(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`is accesible (calendar view)`, async () => axeReport(el));
    it(`is accesible (year list view)`, async () => {
      el.startView = START_VIEW.YEAR_LIST;
      await el.updateComplete;

      /**
       * FIXME(motss): Workaround to ensure child custom elements renders complete.
       * Related bug issue at `Polymer/lit-element#594`.
       */
      el.requestUpdate();
      await el.updateComplete;

      const yearListViewFullListEl = t.getYearListViewFullList();
      isNotNull(yearListViewFullListEl, `Year list view not found`);

      return axeReport(el);
    });

  });
});
