import { DATEPICKER_NAME } from '../../constants.js';
import type { DatepickerFirstUpdated, DatepickerValueUpdated } from '../../custom_typings.js';
import { KEY_CODES_MAP } from '../../custom_typings.js';
import type { Datepicker } from '../../datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import { toSelector } from '../helpers/to-selector.js';
import {
  allStrictEqual,
  deepStrictEqual,
  strictEqual,
} from '../helpers/typed-assert.js';

describe('events', () => {
  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  it(`fires 'datepicker-first-updated'`, async () => {
    type A = [string, string, string];

    const resultValues: string[] = [];
    const resultContents: string[] = [];
    let todayDateValue: string = '';

    /**
     * This ensures the datepicker returns the correct first focusable element
     * when it renders in inline mode and in normal mode.
     */
    for (const inlineVal of [true, false]) {
      const [val, todayVal, content]: A = await browser.executeAsync(async (a, b, done) => {
        const n: Datepicker = document.createElement(a)!;

        /**
         * NOTE: Get the today's date from the browser instead of
         * from the environment where the testing command is run.
         */
        const now = new Date();
        const today = [`${now.getFullYear()}`]
          .concat([1 + now.getMonth(), now.getDate()].map(o => `0${o}`.slice(-2)))
          .join('-');

        const firstUpdated: Promise<A> = new Promise((yay) => {
          let timer = -1;

          n.addEventListener('datepicker-first-updated', function handler(
            ev: CustomEvent<DatepickerFirstUpdated>
          ) {
            const { firstFocusableElement, value } = ev.detail;
            const elementTag = firstFocusableElement.localName;
            const selectorCls =
              Array.from(firstFocusableElement.classList).find(o => o.indexOf('selector') >= 0);

            clearTimeout(timer);
            yay([
              value,
              today,
              `${elementTag}${selectorCls ? `.${selectorCls}` : ''}`,
            ] as A);
            n.removeEventListener('datepicker-first-updated', handler);
          });

          timer = window.setTimeout(() => yay(['', '', '']), 15e3);
        });

        n.locale = 'en-US';
        n.min = '2000-01-01';
        n.inline = b;

        document.body.appendChild(n);

        await n.updateComplete;

        const firstUpdatedResult = await firstUpdated;

        document.body.removeChild(n);

        done(firstUpdatedResult);
      }, DATEPICKER_NAME, inlineVal);

      resultValues.push(val);
      resultContents.push(content);
      todayDateValue = todayVal;
    }

    allStrictEqual(resultValues, todayDateValue);
    deepStrictEqual(resultContents, [
      `button.btn__month-selector`,
      `button.btn__year-selector`,
    ]);
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

        const n: Datepicker = document.createElement(a);

        n.locale = 'en-US';
        n.min = '2000-01-01';
        n.value = '2020-02-20';

        document.body.appendChild(n);

        await n.updateComplete;

        const n2 = n.shadowRoot!.querySelector('.calendars-container') as unknown as HTMLElement;

        domTriggerKey(n2, KEY_CODES_MAP.ARROW_LEFT);

        const enteredValue = new Promise((yay) => {
          let timer = -1;

          n.addEventListener(
            'datepicker-value-updated',
            function handler(ev: CustomEvent<DatepickerValueUpdated>) {
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
      }, DATEPICKER_NAME, k);

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
      const n: Datepicker = document.createElement(a);

      n.locale = 'en-US';
      n.min = '2000-01-01';
      n.value = '2020-02-02';

      document.body.appendChild(n);

      await n.updateComplete;

      const valueUpdated = new Promise<DatepickerValueUpdated | null>((yay) => {
        let timer = -1;

        n.addEventListener(
          'datepicker-value-updated',
          function handler(ev: CustomEvent<DatepickerValueUpdated>) {
            clearTimeout(timer);
            yay(ev.detail);
            n.removeEventListener('datepicker-value-updated', handler);
          }
        );

        timer = window.setTimeout(() => yay(null), 15e3);
      });

      const n2 = n.shadowRoot!.querySelector(b) as HTMLElement;

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
      const { isKeypress, value } = (await valueUpdated) ?? {} as DatepickerValueUpdated;

      document.body.removeChild(n);

      done([
        n.value,
        isKeypress,
        value,
      ] as A);
    },
    DATEPICKER_NAME,
    toSelector(`.full-calendar__day[aria-label="Feb 13, 2020"]`));

    allStrictEqual([prop, selectedVal], '2020-02-13');
    strictEqual(isKeypressVal, false);
  });

});
