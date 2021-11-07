import '../../year-grid/app-year-grid';

import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';

import type { confirmKeySet } from '../../constants';
import { toFormatters } from '../../helpers/to-formatters';
import type { InferredFromSet, YearUpdatedEvent } from '../../typings';
import type { AppYearGrid } from '../../year-grid/app-year-grid';
import { appYearGridName } from '../../year-grid/constants';
import type { YearGridData } from '../../year-grid/typings';
import { messageFormatter } from '../test-utils/message-formatter';

describe(appYearGridName, () => {
  const data: YearGridData = {
    date: new Date('2020-02-02'),
    formatters: toFormatters('en-US'),
    max: new Date('2021-03-03'),
    min: new Date('2019-01-01'),
  };
  const elementSelectors = {
    yearGrid: '.year-grid',
    yearGridButton: '.year-grid-button',
  };

  it('renders', async () => {
    const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${data}></app-year-grid>`);

    const yearGridButtonAttrsList = Array.from(
      el.shadowRoot?.querySelectorAll(elementSelectors.yearGridButton) ?? []
    ).map<[string, string, string, string]>(n => [
      n.getAttribute('data-year') ?? '',
      n.getAttribute('aria-label') ?? '',
      n.getAttribute('tabindex') ?? '',
      n.getAttribute('aria-selected') ?? '',
    ]);

    expect(el.shadowRoot?.querySelector(elementSelectors.yearGrid)).exist;
    expect(yearGridButtonAttrsList).deep.equal([
      ['2019', '2019', '-1', 'false'],
      ['2020', '2020', '0', 'true'],
      ['2021', '2021', '-1', 'false'],
    ]);
  });

  it('renders nothing', async () => {
    const el = await fixture<AppYearGrid>(
      html`<app-year-grid></app-year-grid>`
    );

    expect(el.shadowRoot?.querySelector(elementSelectors.yearGrid)).not.exist;
  });

  it('focuses new year with keyboard', async () => {
    const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${data}></app-year-grid>`);

    const newSelectedYear = el.shadowRoot?.querySelector<HTMLButtonElement>(
      `${elementSelectors.yearGridButton}[data-year="${data.date.getUTCFullYear()}"]`
    );

    newSelectedYear?.focus();

    await sendKeys({
      down: 'ArrowDown',
    });

    await el.updateComplete;

    const yearGridButtonAttrsList = Array.from(
      el.shadowRoot?.querySelectorAll(elementSelectors.yearGridButton) ?? []
    ).map<[string, string, string, string]>(n => [
      n.getAttribute('data-year') ?? '',
      n.getAttribute('aria-label') ?? '',
      n.getAttribute('tabindex') ?? '',
      n.getAttribute('aria-selected') ?? '',
    ]);

    expect(yearGridButtonAttrsList).deep.equal([
      ['2019', '2019', '-1', 'false'],
      ['2020', '2020', '-1', 'true'],
      ['2021', '2021', '0', 'false'],
    ]);
  });

  type A2 = ['click' | 'keyup', InferredFromSet<typeof confirmKeySet>, number];
  const cases2: A2[] = [
    ['click', ' ', data.max.getUTCFullYear()],
    ['keyup', ' ', data.date.getUTCFullYear()],
    ['keyup', 'Enter', data.date.getUTCFullYear()],
  ];
  cases2.forEach(a => {
    const [testEventType, testKey, testNewSelectedYear] = a;

    it(
      messageFormatter('selects new year (event.type=%s, key=%s)', a),
      async () => {
        const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${data}></app-year-grid>`);

        const yearUpdatedEventTask = new Promise((resolve) => {
          function fn(ev: Event) {
            resolve((ev as CustomEvent<YearUpdatedEvent>).detail);
            el.removeEventListener('year-updated', fn);
          }

          el.addEventListener('year-updated', fn);
        });

        const newSelectedYear = el.shadowRoot?.querySelector<HTMLButtonElement>(
          `${elementSelectors.yearGridButton}[data-year="${testNewSelectedYear}"]`
        );

        newSelectedYear?.focus();

        if (testEventType === 'click') {
          newSelectedYear?.click();
        } else {
          await sendKeys({
            down: 'ArrowDown',
          });

          // keypress triggers click event
          await sendKeys({
            press: testKey,
          });
        }

        await el.updateComplete;
        const yearUpdatedEvent = await yearUpdatedEventTask;

        const yearGridButtonAttrsList = Array.from(
          el.shadowRoot?.querySelectorAll(elementSelectors.yearGridButton) ?? []
        ).map<[string, string, string, string]>(n => [
          n.getAttribute('data-year') ?? '',
          n.getAttribute('aria-label') ?? '',
          n.getAttribute('tabindex') ?? '',
          n.getAttribute('aria-selected') ?? '',
        ]);
        const expectedYearUpdatedEvent: YearUpdatedEvent = {
          year: data.max.getUTCFullYear(),
        };

        expect(yearGridButtonAttrsList).deep.equal([
          ['2019', '2019', '-1', 'false'],
          ['2020', '2020', '-1', 'true'],
          ['2021', '2021', '0', 'false'],
        ]);
        expect(yearUpdatedEvent).deep.equal(expectedYearUpdatedEvent);
      }
    );
  });

  it('does not focus/ select new year when click on irrelevant element', async () => {
    const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${data}></app-year-grid>`);

    const newSelectedYear = el.shadowRoot?.querySelector<HTMLButtonElement>(
      elementSelectors.yearGrid
    );

    newSelectedYear?.focus();
    newSelectedYear?.click();

    await el.updateComplete;

    const yearGridButtonAttrsList = Array.from(
      el.shadowRoot?.querySelectorAll(elementSelectors.yearGridButton) ?? []
    ).map<[string, string, string, string]>(n => [
      n.getAttribute('data-year') ?? '',
      n.getAttribute('aria-label') ?? '',
      n.getAttribute('tabindex') ?? '',
      n.getAttribute('aria-selected') ?? '',
    ]);

    expect(yearGridButtonAttrsList).deep.equal([
      ['2019', '2019', '-1', 'false'],
      ['2020', '2020', '0', 'true'],
      ['2021', '2021', '-1', 'false'],
    ]);
  });

});
