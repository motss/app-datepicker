import { AppDatepicker } from '../../app-datepicker.js';
import { APP_INDEX_URL } from '../constants.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { getProp } from '../helpers/get-prop.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { queryEl } from '../helpers/query-el.js';
import { shadowQuery } from '../helpers/shadow-query.js';
import {
  strictEqual,
} from '../helpers/typed-assert.js';

describe('keyboards', () => {
  const elementName = 'app-datepicker';
  const isMicrosoftEdge = 'MicrosoftEdge' === browser.capabilities.browserName;
  // const isChrome = browser.isChrome;
  const focusCalendarsContainer = async (): Promise<string> => {
    return await browser.executeAsync(async (a, b, done) => {
      const a1: AppDatepicker = document.body.querySelector(a)!;
      const b1: HTMLElement = a1.shadowRoot!.querySelector(b)!;

      b1.focus();

      let activeElement = document.activeElement;

      while (activeElement?.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
      }

      done(
        `.${Array.from(activeElement?.classList.values() ?? []).join('.')}`
      );
    }, elementName, '.calendars-container');
  };

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
      const el = document.body.querySelector(a)!;

      document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`takes snapshot`, async () => {
    const browserName = browser.capabilities.browserName;

    await browser.saveScreenshot(`./src/tests/snapshots/timezones-${browserName}.png`);
  });

  it(`focuses date (ArrowLeft)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['ArrowLeft']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    const expected = isMicrosoftEdge ? '18' : '19';

    strictEqual(valueProp, `2020-02-${expected}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowLeft + first focusable date + disabled date)`, async () => {
    await queryEl(elementName, async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.disabledDates = '2020-02-19';
      n.value = '2020-02-20';

      await n.updateComplete;

      done();
    });
    await focusCalendarsContainer();
    await browser.keys(['ArrowLeft']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    const expected = isMicrosoftEdge ? '17' : '18';

    strictEqual(valueProp, `2020-02-${expected}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowRight)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['ArrowRight']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    const expected = isMicrosoftEdge ? '22' : '21';

    strictEqual(valueProp, `2020-02-${expected}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowRight + first focusable date + disabled date)`, async () => {
    await queryEl(elementName, async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.disabledDates = '2020-02-21';
      n.value = '2020-02-20';

      await n.updateComplete;

      done();
    });
    await focusCalendarsContainer();
    await browser.keys(['ArrowRight']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    const expected = isMicrosoftEdge ? 23 : '22';

    strictEqual(valueProp, `2020-02-${expected}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowUp)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['ArrowUp']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    const expected = isMicrosoftEdge ? '6' : '13';

    strictEqual(valueProp, `2020-02-${expected.padStart(2, '0')}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowUp + first focusable date + disabled date)`, async () => {
    await queryEl(elementName, async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.disabledDates = '2020-02-13';
      n.value = '2020-02-20';

      await n.updateComplete;

      done();
    });
    await focusCalendarsContainer();
    await browser.keys(['ArrowUp']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    const expected = isMicrosoftEdge ? '7' : '14';

    strictEqual(valueProp, `2020-02-${expected.padStart(2, '0')}`);
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="Feb ${expected}, 2020">
      <div class="calendar-day">${expected}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowDown)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['ArrowDown']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, isMicrosoftEdge ? '2020-03-05' : '2020-02-27');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Mar 5' : 'Feb 27'
    }, 2020">
      <div class="calendar-day">${isMicrosoftEdge ? '5' : '27'}</div>
    </td>
    `));
  });

  it(`focuses date (ArrowDown + first focusable date + disabled date)`, async () => {
    await queryEl(elementName, async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.disabledDates = '2020-02-27';
      n.value = '2020-02-20';

      await n.updateComplete;

      done();
    });
    await focusCalendarsContainer();
    await browser.keys(['ArrowDown']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, isMicrosoftEdge ? '2020-03-04' : '2020-02-26');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Mar 4' : 'Feb 26'
    }, 2020">
      <div class="calendar-day">${isMicrosoftEdge ? '4' : '26'}</div>
    </td>
    `));
  });

  it(`focuses date (PageUp)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['PageUp']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, isMicrosoftEdge ? '2019-12-20' : '2020-01-20');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Dec 20, 2019' : 'Jan 20, 2020'
    }">
      <div class="calendar-day">20</div>
    </td>
    `));
  });

  it(`focuses date (PageUp + first focusable date + disabled date)`, async () => {
    await queryEl(elementName, async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.disabledDates = '2020-01-20';
      n.value = '2020-02-20';

      await n.updateComplete;

      done();
    });
    await focusCalendarsContainer();
    await browser.keys(['PageUp']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, isMicrosoftEdge ? '2019-12-21' : '2020-01-21');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Dec 21, 2019' : 'Jan 21, 2020'
    }">
      <div class="calendar-day">21</div>
    </td>
    `));
  });

  it(`focuses date (PageUp + first focusable date + disabled date + min date)`, async () => {
    await queryEl(elementName, async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.min = '2020-02-02';
      n.value = '2020-02-20';

      await n.updateComplete;

      done();
    });
    await focusCalendarsContainer();
    await browser.keys(['PageUp']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, '2020-02-02');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 2, 2020">
      <div class="calendar-day">2</div>
    </td>
    `);
  });

  it(`focuses date (PageDown)`, async () => {
    await focusCalendarsContainer();
    await browser.keys(['PageDown']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, isMicrosoftEdge ? '2020-04-20' : '2020-03-20');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Apr' : 'Mar'
    } 20, 2020">
      <div class="calendar-day">20</div>
    </td>
    `));
  });

  it(`focuses date (PageDown + first focusable date + disabled date)`, async () => {
    await queryEl(elementName, async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.disabledDates = '2020-03-20';
      n.value = '2020-02-20';

      await n.updateComplete;

      done();
    });
    await focusCalendarsContainer();
    await browser.keys(['PageDown']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, isMicrosoftEdge ? '2020-04-19' : '2020-03-19');
    strictEqual(focusedDateContent, prettyHtml(`
    <td class="full-calendar__day day--focused" aria-label="${
      isMicrosoftEdge ? 'Apr' : 'Mar'
    } 19, 2020">
      <div class="calendar-day">19</div>
    </td>
    `));
  });

  it(`focuses date (PageDown + first focusable date + disabled date + min date)`, async () => {
    await queryEl(elementName, async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.max = '2020-02-27';
      n.value = '2020-02-20';

      await n.updateComplete;

      done();
    });
    await focusCalendarsContainer();
    await browser.keys(['PageDown']);

    const el = await $(elementName);

    const focusedDate = await shadowQuery(el, ['.day--focused']);
    const focusedDateContent = await cleanHtml(focusedDate);

    const valueProp = await getProp<string>(elementName, 'value');

    strictEqual(valueProp, '2020-02-27');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Feb 27, 2020">
      <div class="calendar-day">27</div>
    </td>
    `);
  });

  // it(`focuses date (Alt + PageUp)`, async () => {
  //   await focusCalendarsContainer();

  //   await new Promise(y => setTimeout(y, 3e3));
  //   await browser.keys(['Alt', 'PageUp']);

  //   await new Promise(y => setTimeout(y, 3e3));

  //   const el = await $(elementName);

  //   const focusedDate = await shadowQuery(el, ['.day--focused']);
  //   const focusedDateContent = await cleanHtml(focusedDate);

  //   const valueProp = await getProp<string>(elementName, 'value');

  //   strictEqual(valueProp, isChrome ? '2019-02-20' : '2020-01-20');
  //   strictEqual(focusedDateContent, prettyHtml(`
  //   <td class="full-calendar__day day--focused" aria-label="${
  //     isChrome ? 'Feb' : 'Dec'
  //   } 20, 2019">
  //     <div class="calendar-day">20</div>
  //   </td>
  //   `));
  //   await browser.keys(['Alt']);
  // });

  // it(
  //   `focuses date (Alt + PageUp + first focusable date + disabled date)`,
  //   async () => {
  //     await browser.executeAsync(async (done) => {
  //       const n = document.body.querySelector('app-datepicker')!;

  //       n.disabledDates = '2019-02-20';
  //       n.value = '2020-02-20';

  //       await n.updateComplete;

  //       done();
  //     });
  //     await focusCalendarsContainer();
  //     // await browser.keys(['Alt', 'PageUp']);

  //     // const el = await $(elementName);

  //     // const focusedDate = await shadowQuery(el, ['.day--focused']);
  //     // const focusedDateContent = await cleanHtml(focusedDate);

  //     const valueProp = await getProp<string>(elementName, 'value');

  //     strictEqual(valueProp, `2019-${isMicrosoftEdge ? '12-20' : '02-21'}`);
  //     // strictEqual(focusedDateContent, prettyHtml(`
  //     // <td class="full-calendar__day day--focused" aria-label="${
  //     //   isMicrosoftEdge ? 'Dec 20' : 'Feb 21'
  //     // }, 2019">
  //     //   <div class="calendar-day">${isMicrosoftEdge ? '20' : '21'}</div>
  //     // </td>
  //     // `));
  //     // await browser.keys(['Alt']);
  //   }
  // );

  // it(
  //   `focuses date (Alt + PageUp + first focusable date + disabled date + min date)`,
  //   async () => {
  //     await browser.executeAsync(async (done) => {
  //       const n = document.body.querySelector('app-datepicker')!;

  //       n.min = '2019-02-27';
  //       n.value = '2020-02-20';

  //       await n.updateComplete;

  //       done();
  //     });
  //     await focusCalendarsContainer();
  //     await browser.keys(['Alt', 'PageUp']);

  //     const el = await $(elementName);

  //     const focusedDate = await shadowQuery(el, ['.day--focused']);
  //     const focusedDateContent = await cleanHtml(focusedDate);

  //     const valueProp = await getProp<string>(elementName, 'value');

  //     strictEqual(valueProp, `2019-${isMicrosoftEdge ? '12-20' : '02-27'}`);
  //     strictEqual(focusedDateContent, prettyHtml(`
  //     <td class="full-calendar__day day--focused" aria-label="${
  //       isMicrosoftEdge ? 'Dec 20' : 'Feb 27'
  //     }, 2019">
  //       <div class="calendar-day">${isMicrosoftEdge ? '20' : '27'}</div>
  //     </td>
  //     `));
  //     await browser.keys(['Alt']);
  //   }
  // );

});
