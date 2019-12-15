import { strictEqual  } from 'assert';

import { AppDatepicker } from '../../app-datepicker.js';
import { cleanHtml } from '../helpers/clean-html.js';
import { getProp } from '../helpers/get-prop.js';
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
    const minVal = await getProp<string>('app-datepicker', 'min');

    strictEqual(minVal, '2020-01-15');
    strictEqual(await el.getAttribute('min'), '2020-01-15');
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

  it(`renders with defined 'max'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.value = '2020-01-15';
      n.min = '2000-01-01';
      n.setAttribute('max', '2020-01-17');
      await n.updateComplete;

      done();
    });

    const disabledDates = await el.shadow$$('.day--disabled');
    const firstDisabledDate = disabledDates[0];
    const firstDisabledDateContent = await cleanHtml(firstDisabledDate);

    const focusedDate = await el.shadow$('.day--focused');
    const focusedDateContent = await cleanHtml(focusedDate);
    const maxVal = await getProp<string>('app-datepicker', 'max');

    strictEqual(maxVal, '2020-01-17');
    strictEqual(await el.getAttribute('max'), '2020-01-17');
    strictEqual(firstDisabledDateContent, prettyHtml`
    <td class="full-calendar__day day--disabled" aria-label="Jan 18, 2020">
      <div class="calendar-day">18</div>
    </td>
    `);
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
  });

  it(`renders with defined 'value'`, async () => {
    const el = await queryEl('app-datepicker', async (done) => {
      const n = document.body.querySelector('app-datepicker')!;

      n.min = '2000-01-01';
      n.max = '2020-12-31';
      n.setAttribute('value', '2020-01-15');
      await n.updateComplete;

      done();
    });

    const focusedDate = await el.shadow$('.day--focused');
    const focusedDateContent = await cleanHtml(focusedDate);
    const valueVal = await getProp<string>('app-datepicker', 'value');
    const valueAttr = await el.getAttribute('value');

    strictEqual(valueVal, '2020-01-15');
    strictEqual(valueAttr, '2020-01-15');
    strictEqual(focusedDateContent, prettyHtml`
    <td class="full-calendar__day day--focused" aria-label="Jan 15, 2020">
      <div class="calendar-day">15</div>
    </td>
    `);
  });

});
