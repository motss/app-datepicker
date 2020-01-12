import { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
import { AppDatepicker } from '../../app-datepicker.js';
import { KEY_CODES_MAP } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import {
  deepStrictEqual, strictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker-dialog';
const elementName2 = 'app-datepicker';

describe(`${elementName}::events`, () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  it(`fires 'datepicker-keyboard-selected' event (Enter, Space)`, async () => {
    const keys = [
      KEY_CODES_MAP.ENTER,
      KEY_CODES_MAP.SPACE,
    ];
    const results: boolean[] = [];

    for (const k of keys) {
      const result: boolean = await browser.executeAsync(async (a, b, c, done) => {
        const domTriggerKey = (root: HTMLElement, keyCode: number) => {
          const ev = new CustomEvent('keyup', { keyCode } as any);

          Object.defineProperty(ev, 'keyCode', { value: keyCode });

          root.dispatchEvent(ev);
        };

        const n: AppDatepickerDialog = document.createElement(a);

        n.min = '2000-01-01';
        n.value = '2020-02-20';

        document.body.appendChild(n);

        await n.open();
        await n.updateComplete;

        const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;
        const n3 = n2.shadowRoot!.querySelector<HTMLDivElement>('.calendars-container')!;

        domTriggerKey(n3, KEY_CODES_MAP.ARROW_LEFT);

        const enteredValue = new Promise((yay) => {
          let timer = -1;

          function handler(ev: CustomEvent) {
            clearTimeout(timer);
            yay(ev.detail.value);
            n.removeEventListener('datepicker-keyboard-selected', handler);
          }
          n.addEventListener('datepicker-keyboard-selected', handler);

          timer = window.setTimeout(() => yay(''), 15e3);
        });

        domTriggerKey(n3, c);

        await n.updateComplete;

        document.body.removeChild(n);

        done((await enteredValue) === '2020-02-19');
      }, elementName, elementName2, k);

      results.push(result);
    }

    deepStrictEqual(results, [true, true]);
  });

  it(`fires 'datepicker-dialog-first-updated'`, async () => {
    const result = await browser.executeAsync(async (a, done) => {
      const n: AppDatepickerDialog = document.createElement(a);

      const firstUpdated = new Promise((yay) => {
        let timer = -1;

        function handler() {
          clearTimeout(timer);
          yay(true);
          n.removeEventListener('datepicker-dialog-first-updated', handler);
        }
        n.addEventListener('datepicker-dialog-first-updated', handler);

        timer = window.setTimeout(() => yay(false), 15e3);
      });

      document.body.appendChild(n);

      await n.updateComplete;

      const firstUpdatedResult = await firstUpdated;

      document.body.removeChild(n);

      done(firstUpdatedResult);
    }, elementName);

    strictEqual(result, true);
  });

  it(`fires 'datepicker-dialog-opened'`, async () => {
    const result = await browser.executeAsync(async (a, done) => {
      const n: AppDatepickerDialog = document.createElement(a)!;

      const dialogOpened = new Promise((yay) => {
        let timer = -1;

        function handler() {
          clearTimeout(timer);
          yay(true);
          n.removeEventListener('datepicker-dialog-opened', handler);
        }
        n.addEventListener('datepicker-dialog-opened', handler);

        timer = window.setTimeout(() => yay(false), 15e3);
      });

      document.body.appendChild(n);

      await n.open();
      await n.updateComplete;

      const dialogOpenedResult = await dialogOpened;

      document.body.removeChild(n);

      done(dialogOpenedResult);
    }, elementName);

    strictEqual(result, true);
  });

  it(`fires 'datepicker-dialog-closed'`, async () => {
    const result = await browser.executeAsync(async (a, done) => {
      const n: AppDatepickerDialog = document.createElement(a)!;

      const dialogClosed = new Promise((yay) => {
        let timer = -1;

        function handler() {
          clearTimeout(timer);
          yay(true);
          n.removeEventListener('datepicker-dialog-closed', handler);
        }
        n.addEventListener('datepicker-dialog-closed', handler);

        timer = window.setTimeout(() => yay(false), 15e3);
      });

      document.body.appendChild(n);

      await n.open();
      await n.updateComplete;

      await n.close();
      await n.updateComplete;

      const dialogClosedResult = await dialogClosed;

      document.body.removeChild(n);

      done(dialogClosedResult);
    }, elementName);

    strictEqual(result, true);
  });

});
