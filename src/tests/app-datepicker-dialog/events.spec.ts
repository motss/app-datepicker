import { AppDatepickerDialog } from '../../app-datepicker-dialog.js';
import { AppDatepicker } from '../../app-datepicker.js';
import { KEY_CODES_MAP } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import {
  deepStrictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker-dialog';
const elementName2 = 'app-datepicker';

describe('events', () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepickerDialog = document.createElement(a);

      // Reset `min` and `value` here before running tests
      el.min = '2000-01-01';
      el.value = '2020-02-20';

      document.body.appendChild(el);

      await el.open();
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

  it(`fires 'datepicker-keyboard-selected' event (Enter, Space)`, async () => {
    const results = [
      KEY_CODES_MAP.ENTER,
      KEY_CODES_MAP.SPACE,
    ].map(async (k) => {
      return browser.executeAsync(async (a, b, c, done) => {
        const domTriggerKey = (root: HTMLElement, keyCode: number) => {
          const ev = new CustomEvent('keyup', { keyCode } as any);

          Object.defineProperty(ev, 'keyCode', { value: keyCode });

          root.dispatchEvent(ev);
        };
        const n = document.body.querySelector<AppDatepickerDialog>(a)!;
        const n2 = n.shadowRoot!.querySelector<AppDatepicker>(b)!;
        const n3 = n2.shadowRoot!.querySelector<HTMLDivElement>('.calendars-container')!;

        n.min = '2000-01-01';
        n.value = '2020-02-20';

        await n.updateComplete;

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

        domTriggerKey(n3, b);

        await n.updateComplete;

        done((await enteredValue) === '2020-02-19');
      }, elementName, elementName2, k);
    });

    deepStrictEqual(
      await Promise.all(results),
      [true, true]
    );
  });

});
