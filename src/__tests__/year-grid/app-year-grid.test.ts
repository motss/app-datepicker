import '../../year-grid/app-year-grid';

import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';

import type { confirmKeySet} from '../../constants';
import { labelSelectedYear, labelTodayYear } from '../../constants';
import { toFormatters } from '../../helpers/to-formatters';
import { toResolvedDate } from '../../helpers/to-resolved-date';
import type { CustomEventDetail, InferredFromSet } from '../../typings';
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
    selectedYearLabel: labelSelectedYear,
    todayYearLabel: labelTodayYear,
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

    expect(el.query(elementSelectors.yearGrid)).exist;
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

    expect(el.query(elementSelectors.yearGrid)).not.exist;
  });

  it('focuses new year with keyboard', async () => {
    const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${data}></app-year-grid>`);

    const newSelectedYear = el.query<HTMLButtonElement>(
      `${elementSelectors.yearGridButton}[data-year="${data.date.getUTCFullYear()}"]`
    );

    newSelectedYear?.focus();

    await sendKeys({
      down: 'ArrowDown',
    });

    await el.updateComplete;

    const yearGridButtonAttrsList = Array.from(
      el.queryAll(elementSelectors.yearGridButton) ?? []
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

  type CaseSelectNewYear = [
    eventType: 'click' | 'keyup',
    key: InferredFromSet<typeof confirmKeySet>,
    newSelectedYear: number
  ];
  const casesSelectNewYear: CaseSelectNewYear[] = [
    ['click', ' ', data.max.getUTCFullYear()],
    ['keyup', ' ', data.date.getUTCFullYear()],
    ['keyup', 'Enter', data.date.getUTCFullYear()],
  ];
  casesSelectNewYear.forEach(a => {
    const [testEventType, testKey, testNewSelectedYear] = a;

    it(
      messageFormatter('selects new year (event.type=%s, key=%s)', a),
      async () => {
        const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${data}></app-year-grid>`);

        const yearUpdatedEventTask = new Promise((resolve) => {
          function fn(ev: Event) {
            resolve((ev as CustomEvent<CustomEventDetail['year-updated']['detail']>).detail);
            el.removeEventListener('year-updated', fn);
          }

          el.addEventListener('year-updated', fn);
        });

        const newSelectedYear = el.query<HTMLButtonElement>(
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

    expect(yearGridButtonAttrsList).deep.equal([
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

    expect(selectedYear).exist;
    expect(todayYear).exist;
    expect(selectedYear?.isEqualNode(todayYear)).true;

    expect(selectedYear).attr('title', labelSelectedYear);
    expect(todayYear).attr('title', labelSelectedYear);

    expect(todayYear?.part.contains('toyear')).true;
  });

  type CaseSelectedYearLabelAndTodayYearLabel = [
    selectedYearLabel: string | undefined,
    todayYearLabel: string | undefined,
    expectedSelectedYearLabel: string | undefined,
    expectedTodayYearLabel: string | undefined
  ];
  const casesSelectedYearLabelAndTodayYearLabel: CaseSelectedYearLabelAndTodayYearLabel[] = [
    [undefined, undefined, undefined, undefined],
    ['', '', '', ''],
    [labelSelectedYear, labelTodayYear, labelSelectedYear, labelTodayYear],
  ];
  casesSelectedYearLabelAndTodayYearLabel.forEach(a => {
    const [
      testSelectedYearLabel,
      testTodayYearLabel,
      expectedSelectedYearLabel,
      expectedTodayYearLabel,
    ] = a;

    it(
      messageFormatter('renders correct title (selectedYearLabel=%s, todayYearLabel=%s)', a),
      async () => {
        const dataMax = new Date(data.max);
        const dataMin = new Date(data.min);
        const todayFullYear = toResolvedDate().getUTCFullYear();

        const min = new Date(dataMin.setUTCFullYear(todayFullYear - 2));
        const testData: YearGridData = {
          ...data,
          max: new Date(dataMax.setUTCFullYear(todayFullYear + 1)),
          min,
          date: min,
          selectedYearLabel: testSelectedYearLabel as string,
          todayYearLabel: testTodayYearLabel as string,
        };

        const el = await fixture<AppYearGrid>(html`<app-year-grid .data=${testData}></app-year-grid>`);

        const selectedYear = el.query<HTMLButtonElement>(elementSelectors.selectedYear);
        const todayYear = el.query<HTMLButtonElement>(elementSelectors.todayYear);

        expect(selectedYear).exist;
        expect(todayYear).exist;

        if (expectedSelectedYearLabel == null && expectedTodayYearLabel == null) {
          expect(selectedYear).not.attr('title');
          expect(todayYear).not.attr('title');
        } else {
          expect(selectedYear).attr('title', expectedSelectedYearLabel);

          expect(todayYear).attr('title', expectedTodayYearLabel);
        }
      }
    );
  });

});
