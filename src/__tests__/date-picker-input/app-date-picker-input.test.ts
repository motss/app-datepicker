import '../../date-picker/app-date-picker';
import '../../date-picker-input/app-date-picker-input';
import '../../date-picker-input-surface/app-date-picker-input-surface';

import type { Button } from '@material/mwc-button';
import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';

import { DateTimeFormat } from '../../constants';
import type { AppDatePicker } from '../../date-picker/app-date-picker';
import { appDatePickerName } from '../../date-picker/constants';
import type { DialogClosedEventDetail } from '../../date-picker-dialog/typings';
import type { AppDatePickerInput } from '../../date-picker-input/app-date-picker-input';
import { appDatePickerInputName, appDatePickerInputType } from '../../date-picker-input/constants';
import type { AppDatePickerInputSurface } from '../../date-picker-input-surface/app-date-picker-input-surface';
import { appDatePickerInputSurfaceName } from '../../date-picker-input-surface/constants';
import { iconClear } from '../../icons';
import { keyEnter, keyEscape, keySpace, keyTab } from '../../key-values';
import type { AppMonthCalendar } from '../../month-calendar/app-month-calendar';
import { appMonthCalendarName } from '../../month-calendar/constants';
import type { AppYearGrid } from '../../year-grid/app-year-grid';
import { appYearGridName } from '../../year-grid/constants';
import { eventOnce } from '../test-utils/event-once';
import { messageFormatter } from '../test-utils/message-formatter';
import { queryDeepActiveElement } from '../test-utils/query-deep-active-element';

describe(appDatePickerInputName, () => {
  const elementSelectors = {
    calendarDay: (label: string) => `td.calendar-day[aria-label="${label}"]`,
    datePicker: appDatePickerName,
    datePickerInputSurface: appDatePickerInputSurfaceName,
    mdcFloatingLabel: '.mdc-floating-label',
    mdcTextField: '.mdc-text-field',
    mdcTextFieldIconTrailing: '.mdc-text-field__icon--trailing',
    mdcTextFieldInput: '.mdc-text-field__input',
    monthCalendar: appMonthCalendarName,
    yearDropdown: '.year-dropdown',
    yearGridButton: '.year-grid-button',
    yearGrid: appYearGridName,
  } as const;
  const formatter = DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const label = 'DOB';
  const max = '2100-12-31';
  const min = '1970-01-01';
  const placeholder = 'Select your date of birth';
  const value = '2020-02-02';

  type CaseValue = [
    value: string | undefined | null,
    expectedValue: string,
    expectedValueAsDate: Date | null,
    expectedValueAsNumber: number
  ];
  const casesValue: CaseValue[] = [
    ['', '', null, NaN],
    [undefined, '', null, NaN],
    [null, '', null, NaN],
    [value, value, new Date(value), +new Date(value)],
  ];
  casesValue.forEach((a) => {
    const [testValue, expectedValue, expectedValueAsDate, expectedValueAsNumber] = a;

    it(
      messageFormatter('renders (value=%s)', a),
      async () => {
        const el = await fixture<AppDatePickerInput>(
          html`<app-date-picker-input
            .label=${label}
            .max=${max}
            .min=${min}
            .placeholder=${placeholder}
            .value=${testValue}
          ></app-date-picker-input>`
        );

        const mdcTextField = el.query(elementSelectors.mdcTextField);
        const mdcFloatingLabel = el.query(elementSelectors.mdcFloatingLabel);
        const mdcTextFieldInput = el.query<HTMLInputElement>(elementSelectors.mdcTextFieldInput);
        const mdcTextFieldIconTrailing = el.query(elementSelectors.mdcTextFieldIconTrailing);

        expect(mdcTextField).exist;
        expect(mdcFloatingLabel).exist;
        expect(mdcTextFieldInput).exist;
        expect(mdcTextFieldIconTrailing).exist;

        expect(el.type).equal(appDatePickerInputType);
        expect(el.value).equal(expectedValue);
        expect(el.valueAsDate).deep.equal(expectedValueAsDate);
        expect(el.valueAsNumber).deep.equal(expectedValueAsNumber);

        expect(mdcFloatingLabel).text(label);
        expect(mdcTextFieldInput?.getAttribute('aria-labelledby')).equal('label');
        expect(mdcTextFieldInput?.placeholder).equal(placeholder);
        expect(mdcTextFieldIconTrailing).lightDom.equal(iconClear.strings.toString());
      }
    );
  });

  type CaseOptionalLocale = [
    locale: string | undefined | null,
    expectedLocale: string
  ];
  const casesOptionalLocale: CaseOptionalLocale[] = [
    ['zh-TW', 'zh-TW'],
    [null, 'en-US'],
    [undefined, 'en-US'],
  ];
  casesOptionalLocale.forEach(a => {
    const [testLocale, expectedLocale] = a;
    it(
      messageFormatter('renders with optional locale (%s)', testLocale),
      async () => {
        const el = await fixture<AppDatePickerInput>(
          html`<app-date-picker-input
            .label=${label}
            .locale=${testLocale as unknown as string}
            .max=${max}
            .min=${min}
            .placeholder=${placeholder}
            .value=${value}
          ></app-date-picker-input>`
        );

        expect(el.locale).equal(expectedLocale);
      }
    );
  });

  it('renders with optional properties', async () => {
    const testAutocapitalize = 'words';
    const testName = 'dob';
    const testValidationMessage = 'test validation message';

    const el = await fixture<AppDatePickerInput>(
      html`<app-date-picker-input
        .autocapitalize=${testAutocapitalize}
        .max=${max}
        .min=${min}
        .name=${testName}
        .placeholder=${placeholder}
        .validationMessage=${testValidationMessage}
        .value=${value}
      ></app-date-picker-input>`
    );

    const openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent<unknown>>(el, 'opened');

    el.showPicker();
    const opened = await openedTask;
    await el.updateComplete;

    expect(opened).not.undefined;

    const mdcTextFieldInput = el.query<HTMLInputElement>(elementSelectors.mdcTextFieldInput);

    // FIXME: FF94 returns undefined whereas FF96 will return the correct value.
    // expect(mdcTextFieldInput?.autocapitalize).equal(testAutocapitalize);

    expect(mdcTextFieldInput).exist;
    expect(mdcTextFieldInput?.getAttribute('autocapitalize')).equal(testAutocapitalize);
    expect(mdcTextFieldInput?.getAttribute('aria-labelledby')).null;
    expect(mdcTextFieldInput?.name).equal(testName);
  });

  it('opens date picker with .showPicker() and closes with .closePicker()', async () => {
    const el = await fixture<AppDatePickerInput>(
      html`<app-date-picker-input
        .label=${label}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .value=${value}
      ></app-date-picker-input>`
    );

    const openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent<unknown>>(el, 'opened');

    el.showPicker();
    const opened = await openedTask;
    await el.updateComplete;

    let datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
    let datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);
    const yearDropdown = datePicker?.query<Button>(elementSelectors.yearDropdown);

    /**
     * NOTE: Webkit requires more time to await `datePicker` and `datePickerInputSurface` to complete
     * their updates before it can find the active element in the document.
     */
    await datePicker?.updateComplete;
    await datePickerInputSurface?.updateComplete;

    const activeElement = queryDeepActiveElement();

    expect(datePickerInputSurface).exist;
    expect(datePicker).exist;

    expect(opened?.detail).null;
    expect(datePickerInputSurface?.open).true;
    expect(yearDropdown).shadowDom.equal(activeElement?.outerHTML);

    el.closePicker();
    await el.updateComplete;

    datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
    datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

    expect(datePickerInputSurface).exist;
    expect(datePicker).exist;
  });

  type CaseCloseDatePickerByTriggerType = [
    _message: string,
    triggerType: 'click' | 'escape' | 'tab'
  ];
  const casesCloseDatePickerByTriggerType: CaseCloseDatePickerByTriggerType[] = [
    ['clicking outside of date picker input', 'click'],
    ['pressing Escape key', 'escape'],
    ['tabbing outside of date picker input', 'tab'],
  ];
  casesCloseDatePickerByTriggerType.forEach((a) => {
    const [, testTriggerType] = a;

    it(
      messageFormatter('closes date picker by %s', a),
      async () => {
        const el = await fixture<AppDatePickerInput>(
          html`<app-date-picker-input
            .label=${label}
            .max=${max}
            .min=${min}
            .placeholder=${placeholder}
            .value=${value}
          ></app-date-picker-input>`
        );

        const openedTask = eventOnce<
          typeof el,
          'opened',
          CustomEvent<unknown>>(el, 'opened');

        el.showPicker();
        const opened = await openedTask;
        await el.updateComplete;

        expect(opened).not.undefined;

        let datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
        let datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

        expect(datePickerInputSurface).exist;
        expect(datePicker).exist;
        expect(datePickerInputSurface?.open).true;

        const closedTask = eventOnce<
          typeof el,
          'closed',
          CustomEvent<DialogClosedEventDetail>>(el, 'closed');

        switch (testTriggerType) {
          case 'click': {
            document.body.click();
            break;
          }
          case 'escape': {
            await sendKeys({ down: keyEscape });
            await sendKeys({ up: keyEscape });
            break;
          }
          case 'tab': {
            const yearDropdown = datePicker?.query(elementSelectors.yearDropdown);

            expect(yearDropdown).exist;

            yearDropdown?.focus();
            for (const _ of Array(4)) await sendKeys({ press: keyTab });
            break;
          }
          default:
        }

        const closed = await closedTask;
        await el.updateComplete;

        expect(closed).not.undefined;

        datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
        datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

        expect(datePickerInputSurface).exist;
        expect(datePicker).exist;
      }
    );
  });

  type CaseOpenDatePickerWithKeyboard = typeof keyEnter | typeof keySpace;
  const casesOpenDatePickerWithKeyboard: CaseOpenDatePickerWithKeyboard[] = [
    keyEnter,
    keySpace,
  ];
  casesOpenDatePickerWithKeyboard.forEach((a) => {
    const testKey = a;

    it(
      messageFormatter('opens date picker with keyboard (key=%s)', testKey),
      async () => {
        const el = await fixture<AppDatePickerInput>(
          html`<app-date-picker-input
            .label=${label}
            .max=${max}
            .min=${min}
            .placeholder=${placeholder}
            .value=${value}
          ></app-date-picker-input>`
        );

        const openedTask = eventOnce<
          typeof el,
          'opened',
          CustomEvent<unknown>>(el, 'opened');

        el.focus();
        await sendKeys({ down: testKey });
        await sendKeys({ up: testKey });

        const opened = await openedTask;
        await el.updateComplete;

        expect(opened).not.undefined;

        const datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
        const datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

        expect(datePickerInputSurface).exist;
        expect(datePicker).exist;
      }
    );
  });

  type CaseResetValue = [
    _message: string,
    triggerType: 'reset' | 'click'
  ];
  const casesResetValue: CaseResetValue[] = [
    ['calls .reset()', 'reset'],
    ['clicks clear icon button', 'click'],
  ];
  casesResetValue.forEach((a) => {
    const [_, testTriggerType] = a;

    it(
      messageFormatter('%s to reset value', a),
      async () => {
        const el = await fixture<AppDatePickerInput>(
          html`<app-date-picker-input
            .label=${label}
            .max=${max}
            .min=${min}
            .placeholder=${placeholder}
            .value=${value}
          ></app-date-picker-input>`
        );

        let mdcTextFieldInput =
          el.query<HTMLInputElement>(elementSelectors.mdcTextFieldInput);
        const mdcTextFieldIconTrailing =
          el.query<Button>(elementSelectors.mdcTextFieldIconTrailing);

        expect(mdcTextFieldInput).exist;
        expect(mdcTextFieldIconTrailing).exist;

        const expectedValue = formatter.format(new Date(value));

        expect(mdcTextFieldInput).value(expectedValue);

        if (testTriggerType === 'click') {
          mdcTextFieldIconTrailing?.click();
        } else {
          el.reset();
        }

        await el.updateComplete;

        mdcTextFieldInput = el.query<HTMLInputElement>(elementSelectors.mdcTextFieldInput);

        expect(mdcTextFieldInput).value('');
        expect(el.value).equal('');
        expect(el.valueAsDate).equal(null);
        expect(el.valueAsNumber).deep.equal(NaN);
      }
    );
  });

  type CaseSelectNewDateWithKeyboard = typeof keyEnter | typeof keySpace;
  const casesSelectNewDateWithKeyboard: CaseSelectNewDateWithKeyboard[] = [
    keyEnter,
    keySpace,
  ];
  casesSelectNewDateWithKeyboard.forEach((a) => {
    const testKey = a;

    it(
      messageFormatter('selects new date with keyboard (key=%s)', testKey),
      async () => {
        const el = await fixture<AppDatePickerInput>(
          html`<app-date-picker-input
            .label=${label}
            .max=${max}
            .min=${min}
            .placeholder=${placeholder}
            .value=${value}
          ></app-date-picker-input>`
        );

        const openedTask = eventOnce<
          typeof el,
          'opened',
          CustomEvent<unknown>>(el, 'opened');

        el.showPicker();
        const opened = await openedTask;
        await el.updateComplete;

        expect(opened).not.undefined;

        const datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);
        const monthCalendar = datePicker?.query<AppMonthCalendar>(elementSelectors.monthCalendar);

        const valueDate = new Date(value);
        const newSelectedDateDate = new Date(valueDate.setUTCDate(valueDate.getUTCDate() + 1));
        const newSelectedDateLabel = formatter.format(newSelectedDateDate);
        const newSelectedDate = monthCalendar?.query<HTMLTableCellElement>(elementSelectors.calendarDay(newSelectedDateLabel));

        expect(newSelectedDate).exist;

        const closedTask = eventOnce<
          typeof el,
          'closed',
          CustomEvent<DialogClosedEventDetail>>(el, 'closed');

        newSelectedDate?.focus();
        await sendKeys({ down: testKey });
        await sendKeys({ up: testKey });

        await closedTask;
        await el.updateComplete;

        // FIXME: Webkit returns undefined even `closed` event is fired
        // expect(closed).not.undefined;
      }
    );
  });

  it('selects new date with mouse click', async () => {
    const el = await fixture<AppDatePickerInput>(
      html`<app-date-picker-input
        .label=${label}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .value=${value}
      ></app-date-picker-input>`
    );

    const openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent<unknown>>(el, 'opened');

    el.showPicker();
    const opened = await openedTask;
    await el.updateComplete;

    expect(opened).not.undefined;

    const datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);
    const monthCalendar = datePicker?.query<AppMonthCalendar>(elementSelectors.monthCalendar);

    const valueDate = new Date(value);
    const newSelectedDateDate = new Date(valueDate.setUTCDate(valueDate.getUTCDate() + 1));
    const newSelectedDateLabel = formatter.format(newSelectedDateDate);
    const newSelectedDate = monthCalendar?.query<HTMLTableCellElement>(elementSelectors.calendarDay(newSelectedDateLabel));

    expect(newSelectedDate).exist;

    const closedTask = eventOnce<
      typeof el,
      'closed',
      CustomEvent<DialogClosedEventDetail>>(el, 'closed');

    newSelectedDate?.focus();
    newSelectedDate?.click();

    const closed = await closedTask;
    await el.updateComplete;

    expect(closed).not.undefined;
  });

  it('always re-opens in calendar view', async () => {
    const el = await fixture<AppDatePickerInput>(
      html`<app-date-picker-input
        .label=${label}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .startView=${'yearGrid'}
        .value=${value}
      ></app-date-picker-input>`
    );

    // show picker
    let openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent<unknown>>(el, 'opened');

    el.showPicker();
    let opened = await openedTask;
    await el.updateComplete;

    expect(opened).not.undefined;

    let datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);
    let yearGrid = datePicker?.query<AppYearGrid>(elementSelectors.yearGrid);

    // ensure year grid view when it first opens
    expect(yearGrid).exist;

    const closedTask = eventOnce<
      typeof el,
      'closed',
      CustomEvent<DialogClosedEventDetail>>(el, 'closed');

    // close picker
    el.closePicker();
    const closed = await closedTask;

    expect(closed).not.undefined;

    // show picker again
    openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent<unknown>>(el, 'opened');

    el.showPicker();
    opened = await openedTask;
    await el.updateComplete;

    expect(opened).not.undefined;

    datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);
    yearGrid = datePicker?.query<AppYearGrid>(elementSelectors.yearGrid);
    const monthCalendar = datePicker?.query<AppMonthCalendar>(elementSelectors.monthCalendar);

    // ensure calendar view when it re-opens
    expect(monthCalendar).exist;
  });

});
