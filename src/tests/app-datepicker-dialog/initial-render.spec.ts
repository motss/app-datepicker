import { DATEPICKER_DIALOG_NAME, DATEPICKER_NAME } from '../../constants.js';
import type { HTMLElementPart } from '../../custom_typings.js';
import type { DatepickerDialog } from '../../datepicker-dialog.js';
import type { Datepicker } from '../../datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import { sanitizeText } from '../helpers/sanitize-text.js';
import {
  allStrictEqual,
  deepStrictEqual,
  strictEqual,
} from '../helpers/typed-assert.js';

describe(`${DATEPICKER_DIALOG_NAME}::initial_render`, () => {
  describe('calendar view', () => {
    before(async () => {
      await browser.url(APP_INDEX_URL);
    });

    beforeEach(async () => {
      await browser.executeAsync(async (a, done) => {
        const el: DatepickerDialog = document.createElement(a);

        document.body.appendChild(el);

        await el.updateComplete;

        done();
      }, DATEPICKER_DIALOG_NAME);
    });

    afterEach(async () => {
      await browser.executeAsync((a, done) => {
        const el = document.body.querySelector<DatepickerDialog>(a)!;

        if (el) document.body.removeChild(el);

        done();
      }, DATEPICKER_DIALOG_NAME);
    });

    it(`takes snapshot`, async () => {
      const browserName = browser.capabilities.browserName;

      await browser.executeAsync(async (a, done) => {
        const n = document.body.querySelector<DatepickerDialog>(a)!;

        await n.open();
        await n.updateComplete;

        done();
      }, DATEPICKER_DIALOG_NAME);

      await browser.saveScreenshot(
        `./src/tests/snapshots/${DATEPICKER_DIALOG_NAME}/initial-render-calendar-view-${browserName}.png`
      );
    });

    it(`renders with accessibility-specific attributes`, async () => {
      type A = [string, string, string, string];

      const values: A = await browser.executeAsync(async (a, done) => {
        const n = document.body.querySelector<DatepickerDialog>(a)!;

        done([
          n.getAttribute('role'),
          n.getAttribute('aria-label'),
          n.getAttribute('aria-modal'),
          n.getAttribute('aria-hidden'),
        ] as A);
      }, DATEPICKER_DIALOG_NAME);

      deepStrictEqual(values, [
        'dialog',
        'datepicker',
        'true',
        'true',
      ]);
    });

    it(`has 'display: none'`, async () => {
      const el = await $(DATEPICKER_DIALOG_NAME);

      const displayValue = await el.getCSSProperty('display');

      strictEqual(displayValue.value, 'none');
    });

    it(`renders no <app-datepicker> and scrim is hidden`, async () => {
      type A = [boolean, boolean];

      const values: A = await browser.executeAsync(async (a, b, done) => {
        const n = document.body.querySelector<DatepickerDialog>(a)!;
        const n2 = n.shadowRoot!.querySelector<Datepicker>(b);
        const n3 = n.shadowRoot!.querySelector<HTMLDivElement>('.scrim')!;

        done([
          n2 == null,
          getComputedStyle(n3).visibility === 'hidden',
        ] as A);
      }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);

      allStrictEqual(values, true);
    });

    it(`renders today's date`, async () => {
      type A = [string, string];

      const [
        prop,
        todayValue,
      ]: A = await browser.executeAsync(async (a, done) => {
        const n = document.body.querySelector<DatepickerDialog>(a)!;

        /**
         * NOTE: Get the today's date from the browser instead of
         * from the environment where the testing command is run.
         */
        const now = new Date();
        const today = [`${now.getFullYear()}`]
          .concat([1 + now.getMonth(), now.getDate()].map(o => `0${o}`.slice(-2)))
          .join('-');

        done([
          n.value,
          today,
        ] as A);
      }, DATEPICKER_DIALOG_NAME);

      strictEqual(prop, todayValue);
    });

    it(`renders year list view`, async () => {
      const hasYearListView: boolean = await browser.executeAsync(async (a, b, done) => {
        const n = document.body.querySelector<DatepickerDialog>(a)!;

        n.startView = 'yearList';

        await n.open();
        await n.updateComplete;

        const n2 = n.shadowRoot!.querySelector<Datepicker>(b)!;

        done(
          n2.shadowRoot!.querySelector('.datepicker-body__year-list-view') == null
        );
      }, DATEPICKER_DIALOG_NAME, DATEPICKER_NAME);

      strictEqual(hasYearListView, false);
    });

    it(`renders with scrim and action buttons when opened`, async () => {
      type A = [boolean, boolean, string[]];

      const [
        hasVisibleScrim,
        hasActionButtons,
        actionLabels,
      ]: A = await browser.executeAsync(async (a, done) => {
        const n = document.body.querySelector<DatepickerDialog>(a)!;

        await n.open();
        await n.updateComplete;

        const root = n.shadowRoot!;
        const n2 = root.querySelector<HTMLDivElement>('.scrim')!;
        const n3s = Array.from(root.querySelectorAll<HTMLButtonElement>('mwc-button')!);

        done([
          getComputedStyle(n2).visibility === 'visible',
          n3s.length === 3,
          n3s.map(o => o.textContent),
        ]);
      }, DATEPICKER_DIALOG_NAME);

      allStrictEqual([hasVisibleScrim, hasActionButtons], true);
      deepStrictEqual(actionLabels.map(n => sanitizeText(n)), ['clear', 'cancel', 'set']);
    });

    it(`has contents with 'part' attributes`, async () => {
      type A = boolean;

      const results: A[] = [];
      const parts = [
        [['scrim'], false],
        [
          [
            'actions',
            'clear',
            'confirm',
            'dialog-content',
            'dismiss',
            'scrim',
          ],
          true,
        ],
      ] as [HTMLElementPart[], boolean][];

      for (const part of parts) {
        const result: A = await browser.executeAsync(async (a, [b, c], done) => {
          const n = document.body.querySelector<DatepickerDialog>(a)!;

          if (c) {
            await n.open();
            await n.updateComplete;
          }

          const partContents =
            (b as HTMLElementPart[]).map(o => n.shadowRoot!.querySelector(`[part="${o}"]`));

          done(partContents.every(o => o instanceof HTMLElement) as A);
        }, DATEPICKER_DIALOG_NAME, part);

        results.push(result);
      }

      allStrictEqual(results, true);
    });

  });

});
