import { AppDatepicker } from '../../app-datepicker.js';
import { DatepickerValueUpdatedEvent, KEY_CODES_MAP } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import { toSelector } from '../helpers/to-selector.js';
import {
  allStrictEqual,
  deepStrictEqual,
  strictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker';

describe('events', () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  it(`fires 'datepicker-first-updated'`, async () => {
    const result = await browser.executeAsync(async (a, done) => {
      const n: AppDatepicker = document.createElement(a)!;

      const firstUpdated = new Promise((yay) => {
        let timer = -1;

        n.addEventListener( 'datepicker-first-updated', function handler() {
          clearTimeout(timer);
          yay(true);
          n.removeEventListener('datepicker-first-updated', handler);
        });

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

  it(`fires 'datepicker-value-selected' event (Enter, Space)`, async () => {
    const keys = [
      KEY_CODES_MAP.ENTER,
      KEY_CODES_MAP.SPACE,
    ];
    const results: boolean[] = [];

    for (const k of keys) {
      const result: boolean = await browser.executeAsync(async (a, b, done) => {
        const domTriggerKey = (root: HTMLElement, keyCode: number) => {
          const ev = new CustomEvent('keyup', { keyCode } as any);

          Object.defineProperty(ev, 'keyCode', { value: keyCode });

          root.dispatchEvent(ev);
        };

        const n: AppDatepicker = document.createElement(a);

        n.min = '2000-01-01';
        n.value = '2020-02-20';

        document.body.appendChild(n);

        await n.updateComplete;

        const n2 = n.shadowRoot!.querySelector<HTMLElement>('.calendars-container')!;

        domTriggerKey(n2, KEY_CODES_MAP.ARROW_LEFT);

        const enteredValue = new Promise((yay) => {
          let timer = -1;

          n.addEventListener(
            'datepicker-value-updated',
            function handler(ev: CustomEvent<DatepickerValueUpdatedEvent>) {
              const { isKeypress, keyCode, value } = ev.detail;
              const selectedValue = isKeypress && (
                keyCode === KEY_CODES_MAP.ENTER || keyCode === KEY_CODES_MAP.SPACE
              ) ? value : '';

              clearTimeout(timer);
              yay(selectedValue);
              n.removeEventListener('datepicker-value-updated', handler);
            }
          );

          timer = window.setTimeout(() => yay(''), 15e3);
        });

        domTriggerKey(n2, b);

        await n.updateComplete;

        document.body.removeChild(n);

        done((await enteredValue) === '2020-02-19');
      }, elementName, k);

      results.push(result);
    }

    deepStrictEqual(results, [true, true]);
  });

  it(`fires 'datepicker-value-updated' when clicks to select new date`, async () => {
    type A = [string, boolean, string];

    const [
      prop,
      isKeypressVal,
      selectedVal,
    ]: A = await browser.executeAsync(async (a, b, done) => {
      const n: AppDatepicker = document.createElement(a);

      n.min = '2000-01-01';
      n.value = '2020-02-02';

      document.body.appendChild(n);

      await n.updateComplete;

      const valueUpdated = new Promise<DatepickerValueUpdatedEvent | null>((yay) => {
        let timer = -1;

        n.addEventListener(
          'datepicker-value-updated',
          function handler(ev: CustomEvent<DatepickerValueUpdatedEvent>) {
            clearTimeout(timer);
            yay(ev.detail);
            n.removeEventListener('datepicker-value-updated', handler);
          }
        );

        timer = window.setTimeout(() => yay(null), 15e3);
      });

      const n2 = n.shadowRoot!.querySelector<HTMLElement>(b)!;

      if (n2 instanceof HTMLButtonElement || n2.tagName === 'MWC-BUTTON') {
        n2.click();
      } else {
        // Simulate click event on non natively focusable elements.
        // This is for selecting new focused date in the table.
        ['touchstart', 'touchend'].forEach((o) => {
          n2.dispatchEvent(new CustomEvent(o, { bubbles: true, composed: true }));
        });
      }

      await n.updateComplete;
      const { isKeypress, value } = (await valueUpdated) ?? {} as DatepickerValueUpdatedEvent;

      document.body.removeChild(n);

      done([
        n.value,
        isKeypress,
        value,
      ] as A);
    },
    elementName,
    toSelector(`.full-calendar__day[aria-label="Feb 13, 2020"]`));

    allStrictEqual([prop, selectedVal], '2020-02-13');
    strictEqual(isKeypressVal, false);
  });

});
