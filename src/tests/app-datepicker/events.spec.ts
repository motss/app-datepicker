import { AppDatepicker } from '../../app-datepicker.js';
import { KEY_CODES_MAP } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import {
  deepStrictEqual,
  strictEqual,
} from '../helpers/typed-assert.js';

describe('events', () => {
  const elementName = 'app-datepicker';

  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepicker = document.createElement(a);

      // Reset `min` and `value` here before running tests
      el.min = '2000-01-01';
      el.value = '2020-02-20';

      document.body.appendChild(el);

      await el.updateComplete;

      done();
    }, elementName);
  });

  afterEach(async () => {
    await browser.executeAsync((a, done) => {
      const el = document.body.querySelector(a);

      if (el) document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`fires 'datepicker-first-updated'`, async () => {
    const result = await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.createElement(a)!;

      const firstUpdated = new Promise((yay) => {
        let timer = -1;

        function handler() {
          clearTimeout(timer);
          yay(true);
          n.removeEventListener('datepicker-first-updated', handler);
        }
        n.addEventListener('datepicker-first-updated', handler);

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

  it(`fires 'datepicker-keyboard-selected' event (Enter, Space)`, async () => {
    const results = [
      KEY_CODES_MAP.ENTER,
      KEY_CODES_MAP.SPACE,
    ].map(async (k) => {
      return browser.executeAsync(async (a, b, done) => {
        const domTriggerKey = (root: HTMLElement, keyCode: number) => {
          const ev = new CustomEvent('keyup', { keyCode } as any);

          Object.defineProperty(ev, 'keyCode', { value: keyCode });

          root.dispatchEvent(ev);
        };

        const n = document.body.querySelector<AppDatepicker>(a)!;
        const n2 = n.shadowRoot!.querySelector<HTMLElement>('.calendars-container')!;

        n.min = '2000-01-01';
        n.value = '2020-02-20';

        await n.updateComplete;

        domTriggerKey(n2, KEY_CODES_MAP.ARROW_LEFT);

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

        domTriggerKey(n2, b);

        await n.updateComplete;

        done((await enteredValue) === '2020-02-19');
      }, elementName, k);
    });

    deepStrictEqual(
      await Promise.all(results),
      [true, true]
    );
  });

});
