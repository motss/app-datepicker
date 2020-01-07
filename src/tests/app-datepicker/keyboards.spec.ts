import { LitElement } from 'lit-element';
import { AppDatepicker } from '../../app-datepicker.js';
import { KEY_CODES_MAP } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { sanitizeText } from '../helpers/sanitize-text.js';
import { toSelector } from '../helpers/to-selector.js';
import {
  strictEqual,
} from '../helpers/typed-assert.js';

const elementName = 'app-datepicker';
const cleanHtml =
  (s: string, showToday: boolean = false) => prettyHtml(sanitizeText(s, showToday));

describe('keyboards', () => {
  const isMicrosoftEdge = 'MicrosoftEdge' === browser.capabilities.browserName;

  // #region helper
  type A = [string, string];
  type Keys = [
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'PageUp',
    'PageDown',
    'Home',
    'End',
  ];
  type PrepareOptions = Partial<
    Record<'props' | 'attrs', Partial<Omit<AppDatepicker, keyof LitElement>>>>;
  const focusCalendarsContainer = async (prepareOptions?: PrepareOptions): Promise<string> => {
    return await browser.executeAsync(async (a, b, c, done) => {
      const a1 = document.body.querySelector<AppDatepicker>(a)!;

      if (c) {
        const { props, attrs }: PrepareOptions = c;

        if (props) {
          Object.keys(props).forEach((o) => {
            (a1 as any)[o] = (props as any)[o];
          });
        }

        if (attrs) {
          Object.keys(attrs).forEach((o) => {
            a1.setAttribute(o.toLowerCase(), String((attrs as any)[o]));
          });
        }
      }

      const b1 = a1.shadowRoot!.querySelector<HTMLElement>(b)!;

      b1.focus();

      let activeElement = document.activeElement;

      while (activeElement?.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
      }

      done(
        `.${Array.from(activeElement?.classList.values() ?? []).join('.')}`
      );
    }, elementName, '.calendars-container', prepareOptions);
  };
  // FIXME: Helper as a workaround until `browser.keys()` supports Alt
  // on all browsers on local and CI.
  const browserKeysWithAltKey = async (keyCode: number) => {
    return browser.executeAsync(async (a, b, c, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;
      const n2 = n.shadowRoot!.querySelector<HTMLDivElement>(b)!;

      const opt: any = { keyCode: c, altKey: true };
      const ev = new CustomEvent('keyup', opt);

      Object.keys(opt).forEach((o) => {
        Object.defineProperty(ev, o, { value: opt[o] });
      });

      n2.dispatchEvent(ev);

      done();
    }, elementName, '.calendars-container', keyCode);
  };
  const getValues = async (
    cb: () => Promise<void>,
    prepareOptions?: PrepareOptions
  ): Promise<A> => {
    await focusCalendarsContainer(prepareOptions);
    await cb();

    const [prop, content]: A = await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      const focusedDate = n.shadowRoot!.querySelector<HTMLTableCellElement>(b)!;

      done([
        n.value,
        focusedDate.outerHTML,
      ] as A);
    }, elementName, toSelector('.day--focused'));

    return [prop, cleanHtml(content)];
  };
  const getValuesAfterKeys = async (
    keys: Keys[number][],
    prepareOptions?: PrepareOptions
  ): Promise<A> => {
    return getValues(async () => browser.keys(keys), prepareOptions);
  };
  const getValuesAfterKeysWithAlt = async (
    key: number,
    prepareOptions?: PrepareOptions
  ): Promise<A> => {
    return getValues(async () => browserKeysWithAltKey(key), prepareOptions);
  };
  // #endregion helper

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
      const el = document.body.querySelector<AppDatepicker>(a);

      if (el) document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`focuses date (ArrowLeft)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['ArrowLeft']);

    const expected = isMicrosoftEdge ? '18' : '19';

    strictEqual(prop, `2020-02-${expected}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowLeft + first focusable date + disabled date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['ArrowLeft'], {
      props: {
        disabledDates: '2020-02-19',
        value: '2020-02-20',
      },
    });

    const expected = isMicrosoftEdge ? '17' : '18';

    strictEqual(prop, `2020-02-${expected}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowRight)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['ArrowRight']);

    const expected = isMicrosoftEdge ? '22' : '21';

    strictEqual(prop, `2020-02-${expected}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowRight + first focusable date + disabled date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['ArrowRight'], {
      props: {
        disabledDates: '2020-02-21',
        value: '2020-02-20',
      },
    });

    const expected = isMicrosoftEdge ? 23 : '22';

    strictEqual(prop, `2020-02-${expected}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowUp)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['ArrowUp']);

    const expected = isMicrosoftEdge ? '6' : '13';

    strictEqual(prop, `2020-02-${expected.padStart(2, '0')}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowUp + first focusable date + disabled date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['ArrowUp'], {
      props: {
        disabledDates: '2020-02-13',
        value: '2020-02-20',
      },
    });

    const expected = isMicrosoftEdge ? '7' : '14';

    strictEqual(prop, `2020-02-${expected.padStart(2, '0')}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowDown)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['ArrowDown']);

    strictEqual(prop, isMicrosoftEdge ? '2020-03-05' : '2020-02-27');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Mar 5' : 'Feb 27'
    }, 2020">
      <div class="calendar-day">${isMicrosoftEdge ? '5' : '27'}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowDown + first focusable date + disabled date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['ArrowDown'], {
      props: {
        disabledDates: '2020-02-27',
        value: '2020-02-20',
      },
    });

    strictEqual(prop, isMicrosoftEdge ? '2020-03-04' : '2020-02-26');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Mar 4' : 'Feb 26'
    }, 2020">
      <div class="calendar-day">${isMicrosoftEdge ? '4' : '26'}</div>
    </td>
    `));
  });

  it(`focuses date (PageUp)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['PageUp']);

    strictEqual(prop, isMicrosoftEdge ? '2019-12-20' : '2020-01-20');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Dec 20, 2019' : 'Jan 20, 2020'
    }">
      <div class="calendar-day">20</div>
    </td>
    `));
  });

  it(`focuses date (PageUp + first focusable date + disabled date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['PageUp'], {
      props: {
        disabledDates: '2020-01-20',
        value: '2020-02-20',
      },
    });

    strictEqual(prop, isMicrosoftEdge ? '2019-12-21' : '2020-01-21');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Dec 21, 2019' : 'Jan 21, 2020'
    }">
      <div class="calendar-day">21</div>
    </td>
    `));
  });

  it(`focuses date (PageUp + first focusable date + disabled date + min date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['PageUp'], {
      props: {
        min: '2020-02-02',
        value: '2020-02-20',
      },
    });

    strictEqual(prop, '2020-02-02');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 2, 2020">
      <div class="calendar-day">2</div>
    </td>
    `);
  });

  it(`focuses date (PageDown)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['PageDown']);

    strictEqual(prop, isMicrosoftEdge ? '2020-04-20' : '2020-03-20');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Apr' : 'Mar'
    } 20, 2020">
      <div class="calendar-day">20</div>
    </td>
    `));
  });

  it(`focuses date (PageDown + first focusable date + disabled date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['PageDown'], {
      props: {
        disabledDates: '2020-03-20',
        value: '2020-02-20',
      },
    });

    strictEqual(prop, isMicrosoftEdge ? '2020-04-19' : '2020-03-19');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Apr' : 'Mar'
    } 19, 2020">
      <div class="calendar-day">19</div>
    </td>
    `));
  });

  it(`focuses date (PageDown + first focusable date + disabled date + max date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['PageDown'], {
      props: {
        max: '2020-02-27',
        value: '2020-02-20',
      },
    });

    strictEqual(prop, '2020-02-27');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 27, 2020">
      <div class="calendar-day">27</div>
    </td>
    `);
  });

  it(`focuses date (Home)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['Home']);

    strictEqual(prop, '2020-02-01');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb 1, 2020">
      <div class="calendar-day">1</div>
    </td>
    `));
  });

  it(`focuses date (Home + first focusable date + disabled date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['Home'], {
      props: {
        disabledDates: '2020-02-01',
        value: '2020-02-20',
      },
    });

    strictEqual(prop, '2020-02-02');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb 2, 2020">
      <div class="calendar-day">2</div>
    </td>
    `));
  });

  it(`focuses date (Home + first focusable date + disabled date + min date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['Home'], {
      props: {
        min: '2020-02-17',
        value: '2020-02-20',
      },
    });

    strictEqual(prop, '2020-02-17');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 17, 2020">
      <div class="calendar-day">17</div>
    </td>
    `);
  });

  it(`focuses date (End)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['End']);

    strictEqual(prop, '2020-02-29');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb 29, 2020">
      <div class="calendar-day">29</div>
    </td>
    `));
  });

  it(`focuses date (End + first focusable date + disabled date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['End'], {
      props: {
        disabledDates: '2020-02-29',
        value: '2020-02-20',
      },
    });

    strictEqual(prop, '2020-02-28');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb 28, 2020">
      <div class="calendar-day">28</div>
    </td>
    `));
  });

  it(`focuses date (End + first focusable date + disabled date + max date)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['End'], {
      props: {
        max: '2020-02-27',
        value: '2020-02-20',
      },
    });

    strictEqual(prop, '2020-02-27');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 27, 2020">
      <div class="calendar-day">27</div>
    </td>
    `);
  });

  it(`focuses date (Alt + PageUp)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeysWithAlt(KEY_CODES_MAP.PAGE_UP);

    strictEqual(prop, '2019-02-20');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb 20, 2019">
      <div class="calendar-day">20</div>
    </td>
    `));
  });

  it(
    `focuses date (Alt + PageUp + first focusable date + disabled date)`,
    async () => {
      const [prop, focusedDateContent] = await getValuesAfterKeysWithAlt(KEY_CODES_MAP.PAGE_UP, {
        props: {
          disabledDates: '2019-02-20',
          value: '2020-02-20',
        },
      });

      strictEqual(prop, '2019-02-21');
      strictEqual(focusedDateContent, prettyHtml(`
      <td class="full-calendar__day day--focused" aria-label="Feb 21, 2019">
        <div class="calendar-day">21</div>
      </td>
      `));
    }
  );

  it(
    `focuses date (Alt + PageUp + first focusable date + disabled date + min date)`,
    async () => {
      const [prop, focusedDateContent] = await getValuesAfterKeysWithAlt(KEY_CODES_MAP.PAGE_UP, {
        props: {
          min: '2019-02-27',
          value: '2020-02-20',
        },
      });

      strictEqual(prop, '2019-02-27');
      strictEqual(focusedDateContent, prettyHtml(`
      <td class="full-calendar__day day--focused" aria-label="Feb 27, 2019">
        <div class="calendar-day">27</div>
      </td>
      `));
    }
  );

  it(`focuses date (Alt + PageDown)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeysWithAlt(KEY_CODES_MAP.PAGE_DOWN);

    strictEqual(prop, '2021-02-20');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb 20, 2021">
      <div class="calendar-day">20</div>
    </td>
    `));
  });

  it(
    `focuses date (Alt + PageDown + first focusable date + disabled date)`,
    async () => {
      const [prop, focusedDateContent] = await getValuesAfterKeysWithAlt(
        KEY_CODES_MAP.PAGE_DOWN, {
          props: {
            disabledDates: '2021-02-20',
            value: '2020-02-20',
          },
        });

      strictEqual(prop, '2021-02-19');
      strictEqual(focusedDateContent, prettyHtml(`
      <td class="full-calendar__day day--focused" aria-label="Feb 19, 2021">
        <div class="calendar-day">19</div>
      </td>
      `));
    }
  );

  it(
    `focuses date (Alt + PageDown + first focusable date + disabled date + max date)`,
    async () => {
      const [prop, focusedDateContent] = await getValuesAfterKeysWithAlt(
        KEY_CODES_MAP.PAGE_DOWN, {
          props: {
            max: '2021-02-17',
            value: '2020-02-20',
          },
        });

      strictEqual(prop, '2021-02-17');
      strictEqual(focusedDateContent, prettyHtml(`
      <td class="full-calendar__day day--focused" aria-label="Feb 17, 2021">
        <div class="calendar-day">17</div>
      </td>
      `));
    }
  );

  it(`focuses last day of month when new date is invalid (PageDown)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['PageDown'], {
      props: {
        min: '2000-01-01',
        value: '2020-01-31',
      },
    });
    const [prop2, focusedDateContent2] = await getValuesAfterKeys(['PageDown'], {
      props: {
        value: '2020-03-31',
      },
    });

    strictEqual(prop, '2020-02-29');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 29, 2020">
      <div class="calendar-day">29</div>
    </td>
    `);

    strictEqual(prop2, '2020-04-30');
    strictEqual(focusedDateContent2, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Apr 30, 2020">
      <div class="calendar-day">30</div>
    </td>
    `);
  });

  it(`focuses last day of month when new date is invalid (PageUp)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeys(['PageUp'], {
      props: {
        min: '2000-01-01',
        value: '2020-03-31',
      },
    });
    const [prop2, focusedDateContent2] = await getValuesAfterKeys(['PageUp'], {
      props: {
        value: '2020-05-31',
      },
    });

    strictEqual(prop, '2020-02-29');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 29, 2020">
      <div class="calendar-day">29</div>
    </td>
    `);

    strictEqual(prop2, '2020-04-30');
    strictEqual(focusedDateContent2, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Apr 30, 2020">
      <div class="calendar-day">30</div>
    </td>
    `);
  });

  it(`focuses last day of month when new date is invalid (Alt + PageDown)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeysWithAlt(
      KEY_CODES_MAP.PAGE_DOWN, {
        props: {
          min: '2000-01-01',
          value: '2020-02-29',
        },
      });

    strictEqual(prop, '2021-02-28');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 28, 2021">
      <div class="calendar-day">28</div>
    </td>
    `);
  });

  it(`focuses last day of month when new date is invalid (Alt + PageUp)`, async () => {
    const [prop, focusedDateContent] = await getValuesAfterKeysWithAlt(
      KEY_CODES_MAP.PAGE_UP, {
        props: {
          min: '2000-01-01',
          value: '2020-02-29',
        },
      });

    strictEqual(prop, '2019-02-28');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 28, 2019">
      <div class="calendar-day">28</div>
    </td>
    `);
  });

});
