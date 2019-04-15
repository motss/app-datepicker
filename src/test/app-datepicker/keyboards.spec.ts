import { AppDatepicker, START_VIEW } from '../../app-datepicker';
import { KEYCODES_MAP } from '../../datepicker-helpers';
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
  KeyboardEventOptions,
  queryInit,
  triggerEvent,
} from '../test-helpers';

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

    it(`focuses date (Left)`, async () => {
      const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = { keyCode: KEYCODES_MAP.ARROW_LEFT };
      triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Left + first focusable date/ disabled date)`, async () => {
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

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = { keyCode: KEYCODES_MAP.ARROW_LEFT };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Right)`, async () => {
      const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.ARROW_RIGHT,
      };
      triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Right + last focusable date/ disabled date)`, async () => {
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

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.ARROW_RIGHT,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Up)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.ARROW_UP,
      };
      triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Up + first focusable date/ disabled date)`, async () => {
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

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.ARROW_UP,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Down)`, async () => {
      el.min = date13;
      el.value = date15;
      await forceUpdate(el);

      const calendarViewFullCalendar = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendar, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.ARROW_DOWN,
      };
      triggerEvent(calendarViewFullCalendar, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Down + last focusable date/ disabled date)`, async () => {
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

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.ARROW_DOWN,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (PgUp)`, async () => {
      el.min = date13;
      el.value = '2020-02-22';
      await forceUpdate(el);

      const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_UP,
      };
      triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (PgUp + first focusable date/ disabled date)`, async () => {
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

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_UP,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (PgDown)`, async () => {
      el.min = date13;
      el.value = '2020-01-20';
      await forceUpdate(el);

      const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_DOWN,
      };
      triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (PgDown + last focusable date/ disabled date)`, async () => {
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

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_DOWN,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Alt + PgUp)`, async () => {
      el.min = date13;
      el.value = '2021-01-22';
      await forceUpdate(el);

      const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_UP,
        altKey: true,
      };
      triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Alt + PgUp + first focusable date/ disabled date)`, async () => {
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

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_UP,
          altKey: true,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Alt + PgDown)`, async () => {
      el.max = '2021-01-25';
      el.value = '2020-01-22';
      await forceUpdate(el);

      const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.PAGE_DOWN,
        altKey: true,
      };
      triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Alt + PgDown + last focusable date/ disabled date)`, async () => {
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

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_DOWN,
          altKey: true,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Home)`, async () => {
      el.min = date13;
      el.value = date17;
      await forceUpdate(el);

      const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.HOME,
      };
      triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (Home + first focusable date/ disabled date)`, async () => {
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

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.HOME,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (End)`, async () => {
      el.max = '2020-01-22';
      el.value = date13;
      await forceUpdate(el);

      const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

      const keyboardEventOptions: KeyboardEventOptions = {
        keyCode: KEYCODES_MAP.END,
      };
      triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`focuses date (End + last focusable date/ disabled date)`, async () => {
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

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.END,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
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

    it(`fires 'datepicker-value-updated' event (Enter)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

      triggerEvent(calendarViewFullCalendarEl, 'keyup', { keyCode: KEYCODES_MAP.ARROW_LEFT });
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-21', `Focused date not updated`);

      const valueMatchedFromEvent = new Promise((yay) => {
        el.addEventListener('datepicker-value-updated', (ev) => {
          const { value } = (ev as CustomEvent).detail;

          strictEqual(value, '2020-01-21', `Updated value from event not matched`);
          yay();
        }, { once: true });
      });

      triggerEvent(calendarViewFullCalendarEl, 'keyup', { keyCode: KEYCODES_MAP.ENTER });
      await forceUpdate(el);
      await valueMatchedFromEvent;
    });

    it(`fires 'datepicker-value-updated' event (Space)`, async () => {
      el.min = date13;
      el.value = '2020-01-22';
      await forceUpdate(el);

      const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
      isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

      triggerEvent(calendarViewFullCalendarEl, 'keyup', { keyCode: KEYCODES_MAP.ARROW_LEFT });
      await forceUpdate(el);

      strictEqual(el.value, '2020-01-21', `Focused date not updated`);

      const valueMatchedFromEvent = new Promise((yay) => {
        el.addEventListener('datepicker-value-updated', (ev) => {
          const { value } = (ev as CustomEvent).detail;

          strictEqual(value, '2020-01-21', `Updated value from event not matched`);
          yay();
        }, { once: true });
      });

      triggerEvent(calendarViewFullCalendarEl, 'keyup', { keyCode: KEYCODES_MAP.SPACE });
      await forceUpdate(el);
      await valueMatchedFromEvent;
    });

    it(`focuses last day of month when new date is invalid (PgDown)`, async () => {
      el.min = '2000-01-01';
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-01-31';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-02-29',
            e1: 'Sat, Feb 29',
            e2: '29',
          };
        },
        async () => {
          el.value = '2020-03-31';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-04-30',
            e1: 'Thu, Apr 30',
            e2: '30',
          };
        },
      ];

      for (const n of tasks) {
        const { e, e1, e2 } = await n();

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_DOWN,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e1,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e2,
          `Focused label not updated`);
      }

    });

    it(`focuses last day of month when new date is invalid (Alt + PgDown)`, async () => {
      el.min = '2000-01-01';
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-02-29';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2021-02-28',
            e1: 'Sun, Feb 28',
            e2: '28',
          };
        },
        async () => {
          el.value = '2020-03-31';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2021-03-31',
            e1: 'Wed, Mar 31',
            e2: '31',
          };
        },
      ];

      for (const n of tasks) {
        const { e, e1, e2 } = await n();

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          altKey: true,
          keyCode: KEYCODES_MAP.PAGE_DOWN,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e1,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e2,
          `Focused label not updated`);
      }

    });

    it(`focuses last day of month when new date is invalid (PgUp)`, async () => {
      el.min = '2000-01-01';
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-03-31';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2020-02-29',
            e1: 'Sat, Feb 29',
            e2: '29',
          };
        },
        async () => {
          el.value = '2020-05-31';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2020-04-30',
            e1: 'Thu, Apr 30',
            e2: '30',
          };
        },
      ];

      for (const n of tasks) {
        const { e, e1, e2 } = await n();

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          keyCode: KEYCODES_MAP.PAGE_UP,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e1,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e2,
          `Focused label not updated`);
      }

    });

    it(`focuses last day of month when new date is invalid (Alt + PgUp)`, async () => {
      el.min = '2000-01-01';
      await forceUpdate(el);

      const tasks = [
        async () => {
          el.value = '2020-02-29';
          await forceUpdate(el);
          return {
            id: 0,
            e: '2019-02-28',
            e1: 'Thu, Feb 28',
            e2: '28',
          };
        },
        async () => {
          el.value = '2020-05-31';
          await forceUpdate(el);
          return {
            id: 1,
            e: '2019-05-31',
            e1: 'Fri, May 31',
            e2: '31',
          };
        },
      ];

      for (const n of tasks) {
        const { e, e1, e2 } = await n();

        const calendarViewFullCalendarEl = t.getCalendarViewFullCalendar();
        isNotNull(calendarViewFullCalendarEl, `Calendar view not found`);

        const keyboardEventOptions: KeyboardEventOptions = {
          altKey: true,
          keyCode: KEYCODES_MAP.PAGE_UP,
        };
        triggerEvent(calendarViewFullCalendarEl, 'keyup', keyboardEventOptions);
        await forceUpdate(el);

        strictEqual(el.value, e, `Focused date not updated`);

        const btnCalendarSelectorEl = t.getBtnCalendarSelector();
        isNotNull(btnCalendarSelectorEl, `Calendar selector not found`);

        strictEqual(
          getShadowInnerHTML(btnCalendarSelectorEl),
          e1,
          `Calendar selector label not updated`);

        const newFocusedDateLabelEl = t.getDatepickerBodyCalendarViewDayFocusedDiv();
        isNotNull(newFocusedDateLabelEl, `New focused date not found`);

        strictEqual(
          getShadowInnerHTML(newFocusedDateLabelEl!),
          e2,
          `Focused label not updated`);
      }

    });

  });
});
