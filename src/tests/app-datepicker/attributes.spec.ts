import { strictEqual } from 'assert';

import { AppDatepicker } from '../../app-datepicker.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { prettyHtml } from '../helpers/pretty-html.js';
import { queryEl } from '../helpers/query-el.js';

describe('attributes', () => {
  before(async () => {
    await browser.url(`http://localhost:3000/src/tests/index.html`);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (done) => {
      const el: AppDatepicker = document.createElement('app-datepicker');

      document.body.appendChild(el);
      await el.updateComplete;

      done();
    });
  });

  afterEach(async () => {
    await browser.executeAsync((done) => {
      const el = document.body.querySelector('app-datepicker')!;

      document.body.removeChild(el);

      done();
    });
  });

  it(`takes snapshot`, async () => {
    const browserName = browser.capabilities.browserName;

    await browser.saveScreenshot(`./src/tests/snapshots/attributes-0-${browserName}.png`);

    await browser.executeAsync(async (done) => {
      const el = document.body.querySelector('app-datepicker')!;

      el.min = '2020-01-15';
      el.value = '2020-01-17';
      await el.updateComplete;

      done();
    });

    $('app-datepicker');

    await browser.saveScreenshot(`./src/tests/snapshots/attributes-1-${browserName}.png`);
  });

  it(`renders with defined 'min'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.value = '2020-01-17';
      n.setAttribute('min', '2020-01-15');
      await n.updateComplete;

      done();
    });

    const disabledDates = await el.shadow$$('.day--disabled');
    const lastDisabledDate = disabledDates[disabledDates.length - 1];
    const lastDisabledDateContent = await cleanHtml(lastDisabledDate);

    const focusedDate = await el.shadow$('.day--focused');
    const focusedDateContent = await cleanHtml(focusedDate);

    strictEqual(lastDisabledDateContent, prettyHtml`
    <td class="full-calendar__day day--disabled" aria-label="Jan 14, 2020">
      <div class="calendar-day">14</div>
    </td>
    `);
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 17, 2020">
      <div class="calendar-day">17</div>
    </td>
    `);
  });

});
