
import { AppDatepicker } from '../../app-datepicker.js';
import '../../app-datepicker.js';
import { KEYCODES_MAP } from '../../datepicker-helpers.js';
import {
  date13,
  defaultLocale,
} from '../test-config.js';
import {
  forceUpdate,
  getShadowInnerHTML,
  getTestName,
  KeyboardEventOptions,
  queryInit,
  triggerEvent,
} from '../test-helpers.js';

const {
  isTrue,
  strictEqual,
  isNotNull,
} = chai.assert;
const name = AppDatepicker.is;

describe(getTestName(name), () => {
  describe('custom events', () => {
    const runCustomEventDispatcherTimer = (eventName: string, timeout: number = 10e3) => {
      return setTimeout(() => {
        throw new Error(`Custom event '${eventName}' takes too long to be dispatched`);
      }, timeout);
    };

    describe('first updated', () => {
      let el: AppDatepicker;

      afterEach(() => {
        if (el) document.body.removeChild(el);
      });

      it(`dispatches 'datepicker-first-updated'`, async () => {
        el = document.createElement('app-datepicker') as AppDatepicker;

        const eventName = 'datepicker-first-updated';
        const didTestPass = new Promise<HTMLElement>((yay, nah) => {
          let timer = -1;
          try {
            el.addEventListener('datepicker-first-updated', (ev) => {
              try {
                clearTimeout(timer);

                const { firstFocusableElement } = ev.detail;

                yay(firstFocusableElement);
              } catch (e) {
                nah(e);
              }
            });
            timer = runCustomEventDispatcherTimer(eventName);
          } catch (e) {
            nah(e);
          }
        });

        document.body.appendChild(el);
        await forceUpdate(el);

        const firstFocusableEl = await didTestPass;
        isNotNull(firstFocusableEl, `First focusable element not found`);
        isTrue(
          firstFocusableEl.classList.contains('btn__year-selector'),
          `First focusable element's classList not matched`);
        strictEqual(
          firstFocusableEl.getAttribute('data-view'),
          'yearList',
          `First focusable element's 'data-view' attribute not matched`);
      });
    });

    describe('other custom events', () => {
      let el: AppDatepicker;
      let t: ReturnType<typeof queryInit>;

      const testCalendarLabel = (testName: string, e: string[]) => {
        const calendarLabelEl = t.getCalendarLabel();
        isNotNull(calendarLabelEl, `Calendar label ${testName} not found`);

        const calendarLabel = getShadowInnerHTML(calendarLabelEl);
        /** NOTE: [(Safari 9), (Win10 IE 11), (Others)] */
        isTrue(
          e.some(n => calendarLabel === n),
          `Calendar label ${testName} not ${
            testName === '1' ? 'matched' : 'updated'} (${calendarLabel})`);
      };
      const goNextMonth = async (testName: string, times: number) => {
        const btnNextMonthSelectorEl = t.getBtnNextMonthSelector();
        isNotNull(btnNextMonthSelectorEl, `Next month button ${testName} not found`);

        for (let i = 0; i < times; i += 1) {
          triggerEvent(btnNextMonthSelectorEl, 'click');
          await t.waitForDragAnimationFinished();
        }
        await forceUpdate(el);
      };
      const testBtnCalendarSelector = (testName: string, e: string) => {
        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector button ${testName} not found`);
        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e,
          `Calendar selector button's label ${testName} not ${
            testName === '1' ? 'matched' : 'updated'}`);
      };

      beforeEach(async () => {
        el = document.createElement(name) as AppDatepicker;
        el.min = '2020-01-01';
        el.locale = defaultLocale;
        document.body.appendChild(el);

        await forceUpdate(el);

        t = queryInit(el);
      });

      afterEach(() => {
        document.body.removeChild(el);
      });

      it(`dispatches 'datepicker-animation-finished'`, async () => {
        el.value = date13;
        await forceUpdate(el);

        const eventName = 'datepicker-animation-finished';
        const didTestPass = new Promise((yay, nah) => {
          let timer = -1;
          try {
            el.addEventListener('datepicker-animation-finished', () => {
              clearTimeout(timer);
              yay(true);
            });
            timer = runCustomEventDispatcherTimer(eventName);
          } catch (e) {
            nah(e);
          }
        });

        testCalendarLabel('1', ['Jan 2020', 'January, 2020', 'January 2020']);
        await goNextMonth('1', 2);

        isTrue(await didTestPass, `'${eventName}' does not dispatch`);
        testCalendarLabel('1', ['Mar 2020', 'March, 2020', 'March 2020']);
      });

      it(`dispatches 'datepicker-keyboard-selected'`, async () => {
        el.min = '2020-01-01';
        el.value = date13;
        await forceUpdate(el);

        const eventName = 'datepicker-keyboard-selected';
        const didTestPass = new Promise<string>((yay, nah) => {
          let timer = -1;

          try {
            el.addEventListener('datepicker-keyboard-selected', (ev) => {
              clearTimeout(timer);

              const { value } = ev.detail;
              yay(value);
            });
            timer = runCustomEventDispatcherTimer(eventName);
          } catch (e) {
            nah(e);
          }
        });

        strictEqual(el.value, '2020-01-13', `'value' not matched`);
        testBtnCalendarSelector('1', 'Mon, Jan 13');
        testCalendarLabel('', ['Jan 2020', 'January, 2020', 'January 2020']);

        const allCalendarTables = t.getAllCalendarTables();
        isTrue(
          Array.isArray(allCalendarTables) && allCalendarTables.length > 0,
          `No calendar table found`);

        const focusedCalendarTableEl = allCalendarTables[1];
        isNotNull(focusedCalendarTableEl, `Focused calendar table is null`);

        for (let i = 0; i < 2; i += 1) {
          const keyboardEventOptions: KeyboardEventOptions = {
            keyCode: KEYCODES_MAP.ARROW_RIGHT,
          };
          triggerEvent(focusedCalendarTableEl, 'keyup', keyboardEventOptions);
          await forceUpdate(el);
        }

        triggerEvent(focusedCalendarTableEl, 'keyup', { keyCode: KEYCODES_MAP.ENTER });
        await forceUpdate(el);

        const selectedValue = await didTestPass;
        strictEqual(selectedValue, '2020-01-15', `Keyboard selected 'value' not matched`);
        strictEqual(el.value, '2020-01-15', `'value' not updated`);
        testBtnCalendarSelector('2', 'Wed, Jan 15');
      });

    });

  });

});
