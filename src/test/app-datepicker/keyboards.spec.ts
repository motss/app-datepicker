import { AppDatepicker } from '../../app-datepicker';
import {
  date13,
  date15,
  date17,
  defaultLocale,
} from '../test-config';
import {
  forceUpdate,
  getShadowInnerHTML,
  getTestName,
  queryInit,
  triggerEvent,
} from '../test-helpers';

import { START_VIEW } from '../../app-datepicker';
import { KEYCODES_MAP } from '../../datepicker-helpers';
import { KeyboardEventOptions } from '../test-helpers';

const {
  strictEqual,
  isNotNull,
} = chai.assert;
const name = AppDatepicker.is;

describe(getTestName(name), () => {
  describe('keyboards', () => {
    let el: AppDatepicker;
    let t: ReturnType<typeof queryInit>;

    beforeEach(async () => {
      el = document.createElement(name) as AppDatepicker;
      document.body.appendChild(el);

      el.locale = defaultLocale;
      el.startView = START_VIEW.CALENDAR;
      el.min = date13;
      el.value = date15;
      await forceUpdate(el);

      t = queryInit(el);
    });

    afterEach(() => {
      document.body.removeChild(el);
    });

    it(`focuses date by keyboard (Left)`, async () => {
      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = { keyCode: KEYCODES_MAP.ARROW_LEFT };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-14', `Focused date not updated`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        `Tue, Jan 14`,
        `Calendar selector label not updated`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      strictEqual(
        getShadowInnerHTML(newFocusedDateLabelEl!),
        '14',
        `Focused label not updated`);
    });

    it(`focuses date by keyboard (Left + first focusable date/ disabled date)`, async () => {
      const tasks = [
        async () => { el.value = date13; await forceUpdate(el); return 0; },
        async () => {
          el.value = date15;
          el.disabledDates = '2020-01-14';
          await forceUpdate(el); return 1;
        },
      ];

      for (const fn of tasks) {
        const val = await fn();
        if (!val) strictEqual(el.value, '2020-01-13', `'value' not updated`);
        if (val === 1) strictEqual(el.disabledDates, '2020-01-14', `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = { keyCode: KEYCODES_MAP.ARROW_LEFT };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, '2020-01-13', `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          `Mon, Jan 13`,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          '13',
          `Focused label not updated`);
      }
    });

    it(`focuses date by keyboard (Right)`, async () => {
      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.ARROW_RIGHT,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-16', `Focused date not updated`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        `Thu, Jan 16`,
        `Calendar selector label not updated`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      strictEqual(
        getShadowInnerHTML(newFocusedDateLabelEl!),
        '16',
        `Focused label not updated`);
    });

    it(`focuses date by keyboard (Right + last focusable date/ disabled date)`, async () => {
      el.min = '';
      el.max = date15;
      await forceUpdate(el);

      const tasks = [
        async () => { el.value = '2020-01-15'; await forceUpdate(el); return 0; },
        async () => {
          el.value = date13;
          el.disabledDates = '2020-01-14';
          await forceUpdate(el);
          return 1;
        },
      ];

      for (const fn of tasks) {
        const val = await fn();
        if (!val) strictEqual(el.value, '2020-01-15', `'value' not updated`);
        if (val === 1) strictEqual(el.disabledDates, '2020-01-14', `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.ARROW_RIGHT,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, '2020-01-15', `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          `Wed, Jan 15`,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          '15',
          `Focused label not updated`);
      }
    });

    it(`focuses date by keyboard (Up)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.ARROW_UP,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-15', `Focused date not updated`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        `Wed, Jan 15`,
        `Calendar selector label not updated`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      strictEqual(
        getShadowInnerHTML(newFocusedDateLabelEl!),
        '15',
        `Focused label not updated`);
    });

    it(`focuses date by keyboard (Up + first focusable date/ disabled date)`, async () => {
      el.min = date13;
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = date15;
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-01-15',
            e1: '2020-01-13',
            e2: 'Mon, Jan 13',
            e3: '13',
          };
        },
        async () => {
          el.value = '2020-01-22';
          el.disabledDates = '2020-01-15';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-01-15',
            e1: '2020-01-16',
            e2: 'Thu, Jan 16',
            e3: '16',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) strictEqual(el.value, e, `'value' not updated`);
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.ARROW_UP,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e1, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e2,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e3,
          `Focused label not updated`);
      }
    });

    it(`focuses date by keyboard (Down)`, async () => {
      el.min = date13;
      el.value = date15;
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.ARROW_DOWN,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-22', `Focused date not updated`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        `Wed, Jan 22`,
        `Calendar selector label not updated`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      strictEqual(
        getShadowInnerHTML(newFocusedDateLabelEl!),
        '22',
        `Focused label not updated`);
    });

    it(`focuses date by keyboard (Down + last focusable date/ disabled date)`, async () => {
      el.min = date13;
      el.max = '2020-01-24';
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-01-22',
            e1: '2020-01-24',
            e2: 'Fri, Jan 24',
            e3: '24',
          };
        },
        async () => {
          el.value = '2020-01-15';
          el.disabledDates = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-01-22',
            e1: '2020-01-21',
            e2: 'Tue, Jan 21',
            e3: '21',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) strictEqual(el.value, e, `'value' not updated`);
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.ARROW_DOWN,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e1, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e2,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e3,
          `Focused label not updated`);
      }
    });

    it(`focuses date by keyboard (PgUp)`, async () => {
      el.min = date13;
      el.value = '2020-02-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_UP,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-22', `Focused date not updated`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        `Wed, Jan 22`,
        `Calendar selector label not updated`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      strictEqual(
        getShadowInnerHTML(newFocusedDateLabelEl!),
        '22',
        `Focused label not updated`);
    });

    it(`focuses date by keyboard (PgUp + first focusable date/ disabled date)`, async () => {
      el.min = date13;
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-01-22',
            e1: '2020-01-13',
            e2: 'Mon, Jan 13',
            e3: '13',
          };
        },
        async () => {
          el.value = '2020-02-22';
          el.disabledDates = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-01-22',
            e1: '2020-01-23',
            e2: 'Thu, Jan 23',
            e3: '23',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) strictEqual(el.value, e, `'value' not updated`);
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_UP,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e1, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e2,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e3,
          `Focused label not updated`);
      }
    });

    it(`focuses date by keyboard (PgDown)`, async () => {
      el.min = date13;
      el.value = '2020-01-20';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_DOWN,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(el.value, '2020-02-20', `Focused date not updated`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        `Thu, Feb 20`,
        `Calendar selector label not updated`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      strictEqual(
        getShadowInnerHTML(newFocusedDateLabelEl!),
        '20',
        `Focused label not updated`);
    });

    it(`focuses date by keyboard (PgDown + last focusable date/ disabled date)`, async () => {
      el.min = date13;
      el.max = '2020-02-20',
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-02-20';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-02-20',
            e1: '2020-02-20',
            e2: 'Thu, Feb 20',
            e3: '20',
          };
        },
        async () => {
          el.value = '2020-01-17';
          el.disabledDates = '2020-02-17';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-02-17',
            e1: '2020-02-16',
            e2: 'Sun, Feb 16',
            e3: '16',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) strictEqual(el.value, e, `'value' not updated`);
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_DOWN,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e1, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e2,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e3,
          `Focused label not updated`);
      }
    });

    it(`focuses date by keyboard (Alt + PgUp)`, async () => {
      el.min = date13;
      el.value = '2021-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_UP,
        altKey: true,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-22', `Focused date not updated`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        `Wed, Jan 22`,
        `Calendar selector label not updated`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      strictEqual(
        getShadowInnerHTML(newFocusedDateLabelEl!),
        '22',
        `Focused label not updated`);
    });

    it(`focuses date by keyboard (Alt + PgUp + first focusable date/ disabled date)`, async () => {
      el.min = date13;
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2021-01-12';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2021-01-12',
            e1: '2020-01-13',
            e2: 'Mon, Jan 13',
            e3: '13',
          };
        },
        async () => {
          el.value = '2021-02-22';
          el.disabledDates = '2020-02-22';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-02-22',
            e1: '2020-02-23',
            e2: 'Sun, Feb 23',
            e3: '23',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) strictEqual(el.value, e, `'value' not updated`);
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_UP,
          altKey: true,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e1, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e2,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e3,
          `Focused label not updated`);
      }
    });

    it(`focuses date by keyboard (Alt + PgDown)`, async () => {
      el.max = '2021-01-25';
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_DOWN,
        altKey: true,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(el.value, '2021-01-22', `Focused date not updated`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        `Fri, Jan 22`,
        `Calendar selector label not updated`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      strictEqual(
        getShadowInnerHTML(newFocusedDateLabelEl!),
        '22',
        `Focused label not updated`);
    });

    it(`focuses date by keyboard (Alt + PgDown + last focusable date/ disabled date)`, async () => {
      el.max = '2021-01-22';
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2021-01-22';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2021-01-22',
            e1: '2021-01-22',
            e2: 'Fri, Jan 22',
            e3: '22',
          };
        },
        async () => {
          el.value = '2020-01-20';
          el.disabledDates = '2021-01-20';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2021-01-20',
            e1: '2021-01-19',
            e2: 'Tue, Jan 19',
            e3: '19',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) strictEqual(el.value, e, `'value' not updated`);
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_DOWN,
          altKey: true,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e1, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e2,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e3,
          `Focused label not updated`);
      }
    });

    it(`focuses date by keyboard (Home)`, async () => {
      el.min = date13;
      el.value = date17;
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.HOME,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-13', `Focused date not updated`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        `Mon, Jan 13`,
        `Calendar selector label not updated`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      strictEqual(
        getShadowInnerHTML(newFocusedDateLabelEl!),
        '13',
        `Focused label not updated`);
    });

    it(`focuses date by keyboard (Home + first focusable date/ disabled date)`, async () => {
      el.min = date13;
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = date13;
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-01-13',
            e1: '2020-01-13',
            e2: 'Mon, Jan 13',
            e3: '13',
          };
        },
        async () => {
          el.value = '2020-01-20';
          el.disabledDates = '2020-01-13';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-01-13',
            e1: '2020-01-14',
            e2: 'Tue, Jan 14',
            e3: '14',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) strictEqual(el.value, e, `'value' not updated`);
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.HOME,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e1, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e2,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e3,
          `Focused label not updated`);
      }
    });

    it(`focuses date by keyboard (End)`, async () => {
      el.max = '2020-01-22';
      el.value = date13;
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.END,
      };
      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-22', `Focused date not updated`);

      const btnCalendarSelectorEl = t.getBtnCalendarSelector();
      isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

      strictEqual(
        getShadowInnerHTML(btnCalendarSelectorEl),
        `Wed, Jan 22`,
        `Calendar selector label not updated`);

      const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
      isNotNull(newFocusedDateLabelEl, `New focused date not found`);

      strictEqual(
        getShadowInnerHTML(newFocusedDateLabelEl!),
        '22',
        `Focused label not updated`);
    });

    it(`focuses date by keyboard (End + last focusable date/ disabled date)`, async () => {
      el.max = '2020-01-22';
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-01-22',
            e1: '2020-01-22',
            e2: 'Wed, Jan 22',
            e3: '22',
          };
        },
        async () => {
          el.value = date15;
          el.disabledDates = '2020-01-22';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-01-22',
            e1: '2020-01-21',
            e2: 'Tue, Jan 21',
            e3: '21',
          };
        },
      ];

      for (const fn of tasks) {
        const { id, e, e1, e2, e3 } = await fn();
        if (!id) strictEqual(el.value, e, `'value' not updated`);
        if (id === 1) strictEqual(el.disabledDates, e, `'disabledDates' not updated`);

        const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
        isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.END,
        };
        triggerEvent(datepickerBodyCalendarViewEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e1, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e2,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e3,
          `Focused label not updated`);
      }
    });

    it(`fires 'datepicker-value-updated' event by keyboard (Enter)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.ARROW_LEFT });
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-21', `Focused date not updated`);

      const valueMatchedFromEvent = new Promise((yay) => {
        el.addEventListener('datepicker-value-updated', (ev) => {
          const { value } = (ev as CustomEvent).detail;

          strictEqual(value, '2020-01-21', `Updated value from event not matched`);
          yay();
        }, { once: true });
      });

      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.ENTER });
      await forceUpdate(el);
      await valueMatchedFromEvent;
    });

    it(`fires 'datepicker-value-updated' event by keyboard (Space)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const datepickerBodyCalendarViewEl = t.getDatepickerBodyCalendarView();
      isNotNull(datepickerBodyCalendarViewEl, `Calendar view not found`);

      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.ARROW_LEFT });
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-21', `Focused date not updated`);

      const valueMatchedFromEvent = new Promise((yay) => {
        el.addEventListener('datepicker-value-updated', (ev) => {
          const { value } = (ev as CustomEvent).detail;

          strictEqual(value, '2020-01-21', `Updated value from event not matched`);
          yay();
        }, { once: true });
      });

      triggerEvent(datepickerBodyCalendarViewEl, 'keyup', { keyCode: KEYCODES_MAP.SPACE });
      await forceUpdate(el);
      await valueMatchedFromEvent;
    });
  });
});
