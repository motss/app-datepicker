import { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
import { AppDatepicker } from '../../app-datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import { getProp } from '../helpers/get-prop.js';
import { queryEl } from '../helpers/query-el.js';
import { sanitizeText } from '../helpers/sanitize-text.js';
import {
  deepStrictEqual,
  strictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker-dialog';
const elementName2 = 'app-datepicker';

describe(`${elementName}::initial_render`, () => {
  describe('calendar view', () => {
    before(async () => {
      await browser.url(APP_INDEX_URL);
    });

    beforeEach(async () => {
      await browser.executeAsync(async (a, done) => {
        const el: AppDatepickerDialog = document.createElement(a);

        document.body.appendChild(el);

        await el.updateComplete;

        done();
      }, elementName);
    });

    afterEach(async () => {
      await browser.executeAsync((a, done) => {
        const el = document.body.querySelector(a)!;

        if (el) document.body.removeChild(el);

        done();
      }, elementName);
    });

    it(`takes snapshot`, async () => {
      const browserName = browser.capabilities.browserName;

      await browser.saveScreenshot(
        `./src/tests/snapshots/${elementName}/initial-render-calendar-view-${browserName}.png`
      );
    });

    it(`renders with accessibility-specific attributes`, async () => {
      type A = [string, string, string, string];

      const values: A = await browser.executeAsync(async (a, done) => {
        const n: AppDatepickerDialog = document.body.querySelector(a)!;

        done([
          n.getAttribute('role'),
          n.getAttribute('aria-label'),
          n.getAttribute('aria-modal'),
          n.getAttribute('aria-hidden'),
        ] as A);
      }, elementName);

      deepStrictEqual(values, [
        'dialog',
        'datepicker',
        'true',
        'true',
      ]);
    });

    it(`has 'display: none'`, async () => {
      const el = await queryEl(elementName);

      const displayValue = await el.getCSSProperty('display');

      strictEqual(displayValue.value, 'none');
    });

    it(`renders no <app-datepicker> and scrim is hidden`, async () => {
      type A = [boolean, boolean];

      const values: A = await browser.executeAsync(async (a, b, done) => {
        const n = document.body.querySelector<AppDatepickerDialog>(a)!;
        const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b);
        const n3 = n.shadowRoot!.querySelector<HTMLDivElement>('.scrim')!;

        done([
          n2 == null,
          getComputedStyle(n3).visibility === 'hidden',
        ] as A);
      }, elementName, elementName2);

      deepStrictEqual(values, [true, true]);
    });

    it(`renders today's date`, async () => {
      const now = new Date();
      const today = [
        now.getUTCFullYear(),
        `0${now.getUTCMonth() + 1}`.slice(-2),
        `0${now.getUTCDate()}`.slice(-2),
      ].join('-');

      const todayProp = await getProp<string>(elementName, 'value');

      strictEqual(todayProp, today);
    });

    it(`renders year list view`, async () => {
      const hasYearListView: boolean = await browser.executeAsync(async (a, b, done) => {
        const n = document.body.querySelector<AppDatepickerDialog>(a)!;

        n.startView = 'yearList';

        await n.open();
        await n.updateComplete;

        const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;

        done(
          n2.shadowRoot!.querySelector('.datepicker-body__year-list-view') == null
        );
      }, elementName, elementName2);

      strictEqual(hasYearListView, false);
    });

    it(`renders with scrim and action buttons when opened`, async () => {
      type A = [boolean, boolean, string[]];

      const values: A = await browser.executeAsync(async (a, done) => {
        const n = document.body.querySelector<AppDatepickerDialog>(a)!;

        await n.open();
        await n.updateComplete;

        const n2 = n.shadowRoot!.querySelector<HTMLDivElement>('.scrim')!;
        const n3s = Array.from(n.shadowRoot!.querySelectorAll<HTMLButtonElement>('mwc-button')!);

        const hasVisibleScrim = getComputedStyle(n2).visibility === 'visible';
        const hasActionButtons = n3s.length === 2;
        const actionLabels = n3s.map(o => o.textContent);

        done([
          hasVisibleScrim,
          hasActionButtons,
          actionLabels,
        ]);
      }, elementName);

      strictEqual(values[0], true);
      strictEqual(values[1], true);
      deepStrictEqual(values[2].map(n => sanitizeText(n)), ['cancel', 'ok']);
    });

  });

});
