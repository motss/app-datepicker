import '../../year-grid/app-year-grid';

import { fixture, html } from '@open-wc/testing-helpers';
import { customElement, state } from 'lit/decorators.js';
import { unsafeStatic } from 'lit/static-html.js';
import { describe, expect, it } from 'vitest';

import { type confirmKeySet, labelSelectedYear, labelToyear } from '../../constants';
import { toFormatters } from '../../helpers/to-formatters';
import { toResolvedDate } from '../../helpers/to-resolved-date';
import { RootElement } from '../../root-element/root-element';
import type { CustomEventDetail, InferredFromSet } from '../../typings';
import type { AppYearGrid } from '../../year-grid/app-year-grid';
import { appYearGridName } from '../../year-grid/constants';
import type { YearGridData } from '../../year-grid/typings';

describe(appYearGridName, () => {
  const data: YearGridData = {
    date: new Date('2020-02-02'),
    formatters: toFormatters('en-US'),
    max: new Date('2021-03-03'),
    min: new Date('2019-01-01'),
    selectedYearLabel: labelSelectedYear,
    toyearLabel: labelToyear,
  };
  const elementSelectors = {
    selectedYear: '.year-grid-button[aria-selected="true"]',
    todayYear: '.year-grid-button.year--today',
    yearGrid: '.year-grid',
    yearGridButton: '.year-grid-button',
  };

  it('renders', async () => {
    const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${data}></app-year-grid>`);

    const yearGridButtonAttrsList = Array.from(
      el.queryAll(elementSelectors.yearGridButton) ?? []
    ).map<[string, string, string, string]>(n => [
      n.getAttribute('data-year') ?? '',
      n.getAttribute('aria-label') ?? '',
      n.getAttribute('tabindex') ?? '',
      n.getAttribute('aria-selected') ?? '',
    ]);

    expect(el.query(elementSelectors.yearGrid)).toBeInTheDocument();
    expect(yearGridButtonAttrsList).toEqual([
      ['2019', '2019', '-1', 'false'],
      ['2020', '2020', '0', 'true'],
      ['2021', '2021', '-1', 'false'],
    ]);
  });

  it('renders nothing', async () => {
    const el = await fixture<AppYearGrid>(
      html`<app-year-grid></app-year-grid>`
    );

    expect(el.query(elementSelectors.yearGrid)).not.toBeInTheDocument();
  });

  it.skip('focuses new year with keyboard', async () => {
    const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${data}></app-year-grid>`);

    const newSelectedYear = el.query<HTMLButtonElement>(
      `${elementSelectors.yearGridButton}[data-year="${data.date.getUTCFullYear()}"]`
    );

    newSelectedYear?.focus();

    // fixme: use native browser keypress when vitest supports it
    el.query('.year-grid')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown '}));
    el.query('.year-grid')?.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown '}));

    await el.updateComplete;
    debugger;

    const yearGridButtonAttrsList = Array.from(
      el.queryAll(elementSelectors.yearGridButton) ?? []
    ).map<[string, string, string, string]>(n => [
      n.getAttribute('data-year') ?? '',
      n.getAttribute('aria-label') ?? '',
      n.getAttribute('tabindex') ?? '',
      n.getAttribute('aria-selected') ?? '',
    ]);

    expect(yearGridButtonAttrsList).toEqual([
      ['2019', '2019', '-1', 'false'],
      ['2020', '2020', '-1', 'true'],
      ['2021', '2021', '0', 'false'],
    ]);
  });

  it.skip.each<{
    eventType: 'click' | 'keyup';
    key: InferredFromSet<typeof confirmKeySet>;
    newSelectedYear: number;
  }>([
    { eventType: 'click', key: ' ', newSelectedYear: data.date.getUTCFullYear() },
    { eventType: 'keyup', key: ' ', newSelectedYear: data.date.getUTCFullYear() },
    { eventType: 'keyup', key: 'Enter', newSelectedYear: data.date.getUTCFullYear() },
  ])('selects new year (event.type=$eventType, key=$key)', async ({
    eventType,
    key,
    newSelectedYear,
  }) => {
    const testCustomElementName = `test-${window.crypto.randomUUID()}`;
    
    @customElement(testCustomElementName)
    class Test extends RootElement {
      #updateData = async ({
        detail: {
          year,
        },
      }: CustomEvent<CustomEventDetail['year-updated']['detail']>) => {
        this.newYear = String(year);

        await this.updateComplete;

        this.fire({
          detail: { year },
          type: 'done',
        });
      };

      @state() newYear: string = '';

      override render() {
        const newData: YearGridData = {
          ...data,
          ...(this.newYear ? { date: new Date(`${this.newYear}-01-01`) } : {}),
        };

        console.debug('done', this.newYear);

        return html`
          <app-year-grid .data=${newData} @year-updated=${this.#updateData}></app-year-grid>
        `;
      }
    }

    const renderWithWrapper = async (): Promise<{
      el: AppYearGrid;
      root: Test;
    }> => {
      const root = await fixture<Test>(
        // eslint-disable-next-line lit/binding-positions, lit/no-invalid-html
        html`<${unsafeStatic(testCustomElementName)}></${unsafeStatic(testCustomElementName)}>`
      );

      return {
        el: root.query('app-year-grid') as AppYearGrid,
        root,
      };
    };

    const { el, root } = await renderWithWrapper();

    const yearUpdatedEventTask = new Promise((resolve) => {
      function fn(ev: Event) {
        resolve((ev as CustomEvent<CustomEventDetail['year-updated']['detail']>).detail);
      }

      root.addEventListener('done', fn, { once: true });
    });

    const newSelectedYearEl = el.query<HTMLButtonElement>(
      `${elementSelectors.yearGridButton}[data-year="${newSelectedYear}"]`
    );

    if (eventType === 'click') {
      newSelectedYearEl?.focus();
      newSelectedYearEl?.click();
    } else {
      const yearGridEl = el.query('.year-grid');

      console.debug(yearGridEl);

      // fixme: use native browser keypress when vitest supports it
      yearGridEl?.focus();
      yearGridEl?.dispatchEvent(new KeyboardEvent('keydown', { key }));
      yearGridEl?.dispatchEvent(new KeyboardEvent('keyup', { key }));
      yearGridEl?.dispatchEvent(new KeyboardEvent('keypress', { key }));
    }

    await el.updateComplete;
    const yearUpdatedEvent = await yearUpdatedEventTask;

    const yearGridButtonAttrsList = Array.from(
      el.queryAll(elementSelectors.yearGridButton) ?? []
    ).map<[string, string, string, string]>(n => [
      n.getAttribute('data-year') ?? '',
      n.getAttribute('aria-label') ?? '',
      n.getAttribute('tabindex') ?? '',
      n.getAttribute('aria-selected') ?? '',
    ]);
    const expectedYearUpdatedEvent: CustomEventDetail['year-updated']['detail'] = {
      year: data.max.getUTCFullYear(),
    };

    expect(yearGridButtonAttrsList).toEqual([
      ['2019', '2019', '-1', 'false'],
      ['2020', '2020', '-1', 'true'],
      ['2021', '2021', '0', 'false'],
    ]);
    expect(yearUpdatedEvent).toEqual(expectedYearUpdatedEvent);
  });

  it('does not focus/ select new year when click on irrelevant element', async () => {
    const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${data}></app-year-grid>`);

    const newSelectedYear = el.query<HTMLButtonElement>(
      elementSelectors.yearGrid
    );

    newSelectedYear?.focus();
    newSelectedYear?.click();

    await el.updateComplete;

    const yearGridButtonAttrsList = Array.from(
      el.queryAll(elementSelectors.yearGridButton) ?? []
    ).map<[string, string, string, string]>(n => [
      n.getAttribute('data-year') ?? '',
      n.getAttribute('aria-label') ?? '',
      n.getAttribute('tabindex') ?? '',
      n.getAttribute('aria-selected') ?? '',
    ]);

    expect(yearGridButtonAttrsList).toEqual([
      ['2019', '2019', '-1', 'false'],
      ['2020', '2020', '0', 'true'],
      ['2021', '2021', '-1', 'false'],
    ]);
  });

  it('renders correct attributes for selected today year', async () => {
    const todayDate = toResolvedDate();
    const max = new Date(new Date(todayDate).setUTCFullYear(todayDate.getUTCFullYear() + 2));
    const min = new Date(new Date(todayDate).setUTCFullYear(todayDate.getUTCFullYear() - 2));

    const testData: YearGridData = {
      ...data,
      date: todayDate,
      max,
      min,
    };
    const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${testData}></app-year-grid>`);

    const selectedYear = el.query<HTMLButtonElement>(elementSelectors.selectedYear);
    const todayYear = el.query<HTMLButtonElement>(elementSelectors.todayYear);

    expect(selectedYear).toBeInTheDocument();
    expect(todayYear).toBeInTheDocument();
    expect(selectedYear?.isEqualNode(todayYear)).true;

    expect(selectedYear).toHaveAttribute('title', labelSelectedYear);
    expect(todayYear).toHaveAttribute('title', labelSelectedYear);

    expect(todayYear?.part.contains('toyear')).true;
  });

  it.each<{
    $_selectedYearLabel: string | undefined;
    $_todayYearLabel: string | undefined;
    selectedYearLabel: string | undefined;
    todayYearLabel: string | undefined;
  }>([
    { $_selectedYearLabel:  undefined, $_todayYearLabel: undefined, selectedYearLabel: undefined, todayYearLabel: undefined },
    { $_selectedYearLabel: '',  $_todayYearLabel: '',  selectedYearLabel: '', todayYearLabel:'' },
    { $_selectedYearLabel:  labelSelectedYear, $_todayYearLabel: labelToyear, selectedYearLabel: labelSelectedYear, todayYearLabel: labelToyear },
  ])('renders correct title (selectedYearLabel=$selectedYearLabel, todayYearLabel=$todayYearLabel)', async ({
    $_selectedYearLabel,
    $_todayYearLabel,
    selectedYearLabel,
    todayYearLabel,
  }) => {
    const dataMax = new Date(data.max);
    const dataMin = new Date(data.min);
    const todayFullYear = toResolvedDate().getUTCFullYear();

    const min = new Date(dataMin.setUTCFullYear(todayFullYear - 2));
    const testData: YearGridData = {
      ...data,
      date: min,
      max: new Date(dataMax.setUTCFullYear(todayFullYear + 1)),
      min,
      selectedYearLabel: selectedYearLabel as string,
      toyearLabel: todayYearLabel as string,
    };

    const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${testData}></app-year-grid>`);

    const selectedYear = el.query<HTMLButtonElement>(elementSelectors.selectedYear);
    const todayYear = el.query<HTMLButtonElement>(elementSelectors.todayYear);

    expect(selectedYear).toBeInTheDocument();
    expect(todayYear).toBeInTheDocument();

    if ($_selectedYearLabel == null && $_todayYearLabel == null) {
      expect(selectedYear).not.toHaveAttribute('title');
      expect(todayYear).not.toHaveAttribute('title');
    } else {
      expect(selectedYear).toHaveAttribute('title', $_selectedYearLabel);

      expect(todayYear).toHaveAttribute('title', $_todayYearLabel);
    }
  });

});
