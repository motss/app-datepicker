import { html } from 'lit';
import { describe, expect, it } from 'vitest';

import {
  labelChooseMonth,
  labelChooseYear,
  labelNextMonth,
  labelPreviousMonth,
  labelSelectDate,
  labelSelectedDate,
  labelSelectedYearTemplate,
  labelShortWeek,
  labelToday,
  labelToyearTemplate,
  labelWeek,
  labelWeekNumberTemplate,
} from '../../constants.js';
import { DatePickerMixin } from '../../mixins/date-picker-mixin/date-picker-mixin.js';
import { RootElement } from '../../root-element/root-element.js';
import { createFixture } from '../__helpers__/create-fixture.js';

describe(DatePickerMixin.name, () => {
  const render = createFixture(
    () => {
      class TestComponent extends DatePickerMixin(RootElement) {
        protected override render() {
          const {
            chooseMonthLabel,
            chooseYearLabel,
            disabledDates,
            disabledDays,
            firstDayOfWeek,
            locale,
            nextMonthLabel,
            previousMonthLabel,
            selectDateLabel,
            selectedDateLabel,
            selectedYearTemplate,
            shortWeekLabel,
            showWeekNumber,
            todayLabel,
            toyearTemplate,
            weekLabel,
            weekNumberTemplate,
            weekNumberType,
          } = this;

          return html`
        <blockquote>${JSON.stringify({
          chooseMonthLabel,
          chooseYearLabel,
          disabledDates,
          disabledDays,
          firstDayOfWeek,
          locale,
          nextMonthLabel,
          previousMonthLabel,
          selectDateLabel,
          selectedDateLabel,
          selectedYearTemplate,
          shortWeekLabel,
          showWeekNumber,
          todayLabel,
          toyearTemplate,
          weekLabel,
          weekNumberTemplate,
          weekNumberType,
        })}</blockquote>
        `;
        }
      }

      return TestComponent;
    },
    {
      getBlockquote(n) {
        return n.root.querySelector<HTMLQuoteElement>('blockquote');
      },
    }
  );

  it('mixes with a superclass correctly', async () => {
    const { getBlockquote } = await render();

    expect(getBlockquote()).toBeInTheDocument();
    expect(getBlockquote()).toHaveTextContent(
      JSON.stringify({
        chooseMonthLabel: labelChooseMonth,
        chooseYearLabel: labelChooseYear,
        disabledDates: '',
        disabledDays: '',
        firstDayOfWeek: 0,
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
        nextMonthLabel: labelNextMonth,
        previousMonthLabel: labelPreviousMonth,
        selectDateLabel: labelSelectDate,
        selectedDateLabel: labelSelectedDate,
        selectedYearTemplate: labelSelectedYearTemplate,
        shortWeekLabel: labelShortWeek,
        showWeekNumber: false,
        todayLabel: labelToday,
        toyearTemplate: labelToyearTemplate,
        weekLabel: labelWeek,
        weekNumberTemplate: labelWeekNumberTemplate,
        weekNumberType: 'first-4-day-week',
      })
    );
  });

  it('mixes with a superclass correctly', async () => {
    const { element, getBlockquote, updated } = await render();

    element.chooseMonthLabel = 'test';
    element.chooseYearLabel = 'test';
    element.disabledDates = '2020-02-02';
    element.disabledDays = '2020-02-02';
    element.firstDayOfWeek = 2;
    element.locale = 'en-GB';
    element.nextMonthLabel = 'test';
    element.previousMonthLabel = 'test';
    element.selectDateLabel = 'test';
    element.selectedDateLabel = 'test';
    element.selectedYearTemplate = 'test %s';
    element.shortWeekLabel = 'test';
    element.showWeekNumber = true;
    element.todayLabel = 'test';
    element.toyearTemplate = 'test %s';
    element.weekLabel = 'test';
    element.weekNumberTemplate = 'test %s';
    element.weekNumberType = 'first-day-of-year';
    await updated();

    expect(getBlockquote()).toBeInTheDocument();
    expect(getBlockquote()).toHaveTextContent(
      JSON.stringify({
        chooseMonthLabel: 'test',
        chooseYearLabel: 'test',
        disabledDates: '2020-02-02',
        disabledDays: '2020-02-02',
        firstDayOfWeek: 2,
        locale: 'en-GB',
        nextMonthLabel: 'test',
        previousMonthLabel: 'test',
        selectDateLabel: 'test',
        selectedDateLabel: 'test',
        selectedYearTemplate: 'test %s',
        shortWeekLabel: 'test',
        showWeekNumber: true,
        todayLabel: 'test',
        toyearTemplate: 'test %s',
        weekLabel: 'test',
        weekNumberTemplate: 'test %s',
        weekNumberType: 'first-day-of-year',
      })
    );
  });
});
