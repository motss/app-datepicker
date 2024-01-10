<<<<<<< Updated upstream
import '../../date-picker-input-surface/app-date-picker-input-surface';
import '../../date-picker-input/app-date-picker-input';
import '../../date-picker/app-date-picker';
=======
import '../../date-picker-input-surface/app-date-picker-input-surface.js';
import '../../date-picker-input-2/app-date-picker-input.js';
import '../../date-picker/app-date-picker.js';
>>>>>>> Stashed changes

import { stripExpressionComments } from '@lit-labs/testing';
import type { MdOutlinedButton } from '@material/web/button/outlined-button.js';
import { fixture, html } from '@open-wc/testing-helpers';
import { describe, expect, it } from 'vitest';

import { DateTimeFormat } from '../../constants';
import type { AppDatePicker } from '../../date-picker/app-date-picker';
import { appDatePickerName } from '../../date-picker/constants';
import type { DialogClosedEventDetail } from '../../date-picker-dialog/typings';
import type { AppDatePickerInput } from '../../date-picker-input-2/app-date-picker-input.js';
import { appDatePickerInputName, appDatePickerInputType } from '../../date-picker-input-2/constants.js';
import type { DatePickerInputProperties } from '../../date-picker-input-2/typings.js';
import type { AppDatePickerInputSurface } from '../../date-picker-input-surface/app-date-picker-input-surface';
import { appDatePickerInputSurfaceName } from '../../date-picker-input-surface/constants';
import { iconClear } from '../../icons';
import { keyEnter, keyEscape, keySpace, keyTab } from '../../key-values';
import type { AppMonthCalendar } from '../../month-calendar/app-month-calendar';
import { appMonthCalendarName } from '../../month-calendar/constants';
import type { AppYearGrid } from '../../year-grid/app-year-grid';
import { appYearGridName } from '../../year-grid/constants';
import { eventOnce } from '../test-utils/event-once';
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
    yearGrid: appYearGridName,
    yearGridButton: '.year-grid-button',
  } as const;
  const formatter = DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const label = 'DOB';
  const max = '2100-12-31';
  const min = '1970-01-01';
  const placeholder = 'Select your date of birth';
  const value = '2020-02-02';

  it.each<{
    $_value: string;
    $_valueAsDate: Date | null;
    $_valueAsNumber: number;
    value: null | string | undefined;
  }>([
    {
      $_value: '',
      $_valueAsDate: null,
      $_valueAsNumber: NaN,
      value: '',
    },
    {
      $_value: '',
      $_valueAsDate: null,
      $_valueAsNumber: NaN,
      value: undefined,
    },
    {
      $_value: '',
      $_valueAsDate: null,
      $_valueAsNumber: NaN,
      value: null,
    },
    {
      $_value: value,
      $_valueAsDate: new Date(value),
      $_valueAsNumber: new Date(value).getTime(),
      value: value,
    },
  ])('renders (value=%s)', async ({
    $_value,
    $_valueAsDate,
    $_valueAsNumber,
    value,
  }) => {
    const el = await fixture<AppDatePickerInput>(
      html`<app-date-picker-input
        .label=${label}
        .max=${max}
        .min=${min}
        .value=${value}
      ></app-date-picker-input>`
    );

    const mdcTextField = el.query(elementSelectors.mdcTextField);
    const mdcFloatingLabel = el.query(elementSelectors.mdcFloatingLabel);
    const mdcTextFieldInput = el.query<HTMLInputElement>(elementSelectors.mdcTextFieldInput);
    const mdcTextFieldIconTrailing = el.query(elementSelectors.mdcTextFieldIconTrailing);

    expect(mdcTextField).toBeInTheDocument();
    expect(mdcFloatingLabel).toBeInTheDocument();
    expect(mdcTextFieldInput).toBeInTheDocument();
    expect(mdcTextFieldIconTrailing).toBeInTheDocument();

    expect(el.type).toBe(appDatePickerInputType);
    expect(el.value).toBe($_value);
    expect(el.valueAsDate).toEqual($_valueAsDate);
    expect(el.valueAsNumber).toBe($_valueAsNumber);

    expect(mdcFloatingLabel).toHaveTextContent(label);
    expect(mdcTextFieldInput).toHaveAttribute('aria-labelledby', 'label');
    expect(mdcTextFieldInput?.placeholder).toBe('');
    expect(stripExpressionComments(mdcTextFieldIconTrailing?.innerHTML ?? '').trim()).toBe(iconClear.strings.toString());
  });

  it.each<{
    $_locale: string;
    locale: null | string | undefined;
  }>([
    { $_locale: 'zh-TW', locale: 'zh-TW' },
    { $_locale: 'en-US', locale: null },
    { $_locale: 'en-US', locale: undefined },
  ])('renders with optional locale ($locale)', async ({
    $_locale,
    locale,
  }) => {
    const el = await fixture<AppDatePickerInput>(
      html`<app-date-picker-input
        .label=${label}
        .locale=${locale as unknown as string}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .value=${value}
      ></app-date-picker-input>`
    );

    expect(el.locale).toBe($_locale);
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

    expect(mdcTextFieldInput).toBeInTheDocument();
    expect(mdcTextFieldInput).toHaveAttribute('autocapitalize', testAutocapitalize);
    expect(mdcTextFieldInput).not.toHaveAttribute('aria-labelledby');
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
    const yearDropdown = datePicker?.query<MdOutlinedButton>(elementSelectors.yearDropdown);

    /**
     * NOTE: Webkit requires more time to await `datePicker` and `datePickerInputSurface` to complete
     * their updates before it can find the active element in the document.
     */
    await datePicker?.updateComplete;
    await datePickerInputSurface?.updateComplete;

    const activeElement = queryDeepActiveElement();
    const $_activeElement = yearDropdown?.shadowRoot?.querySelector('button') as HTMLButtonElement;

    expect(datePickerInputSurface).toBeInTheDocument();
    expect(datePicker).toBeInTheDocument();

    expect(opened?.detail).null;
    expect(datePickerInputSurface?.open).true;
    expect(activeElement?.isEqualNode($_activeElement)).true;

    el.closePicker();
    await el.updateComplete;

    datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
    datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

    expect(datePickerInputSurface).toBeInTheDocument();
    expect(datePicker).not.toBeInTheDocument();
  });

  it.skip.each<{
    _message: string,
    triggerType: 'click' | 'escape' | 'tab';
  }>([
    { _message: 'clicking outside of date picker input', triggerType: 'click' },
    { _message: 'pressing Escape key', triggerType: 'escape' },
    { _message: 'tabbing outside of date picker input', triggerType: 'tab' },
  ])('closes date picker by $_message', async ({
    triggerType,
  }) => {
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

    expect(datePickerInputSurface).toBeInTheDocument();
    expect(datePicker).toBeInTheDocument();
    expect(datePickerInputSurface?.open).true;

    const closedTask = eventOnce<
      typeof el,
      'closed',
      CustomEvent<DialogClosedEventDetail>>(el, 'closed');

    switch (triggerType) {
      case 'click': {
        document.body.click();
        break;
      }
      case 'escape': {
        // fixme: use native browser keypress when vitest supports it
        document.body.dispatchEvent(new KeyboardEvent('keypress', { key: keyEscape }));
        break;
      }
      case 'tab': {
        const yearDropdown = datePicker?.query(elementSelectors.yearDropdown);

        expect(yearDropdown).toBeInTheDocument();

        yearDropdown?.focus();

        for (const _ of Array(4)) {
          // fixme: use native browser keypress when vitest supports it
          document.body.dispatchEvent(new KeyboardEvent('keypress', { key: keyTab }));
        }

        break;
      }
      default:
    }

    const closed = await closedTask;
    await el.updateComplete;

    expect(closed).not.undefined;

    datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
    datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

    expect(datePickerInputSurface).toBeInTheDocument();
    expect(datePicker).not.toBeInTheDocument();
  });

  it.skip.each<typeof keyEnter | typeof keySpace>([
    keyEnter,
    keySpace,
  ])('opens date picker with keyboard (key=%s)', async (key) => {
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
    // fixme: use native browser keypress when vitest supports it
    document.body.dispatchEvent(new KeyboardEvent('keypress', { key }));

    const opened = await openedTask;
    await el.updateComplete;

    expect(opened).not.undefined;

    const datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
    const datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

    expect(datePickerInputSurface).toBeInTheDocument();
    expect(datePicker).toBeInTheDocument();
  });

  it.each<{
    _message: string;
    triggerType: 'click' | 'reset';
  }>([
    { _message: 'calls .reset()', triggerType: 'reset' },
    { _message: 'clicks clear icon button', triggerType: 'click' },
  ])('$_message to reset value', async ({
    triggerType,
  }) => {
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
      el.query<MdOutlinedButton>(elementSelectors.mdcTextFieldIconTrailing);

    expect(mdcTextFieldInput).toBeInTheDocument();
    expect(mdcTextFieldIconTrailing).toBeInTheDocument();

    const expectedValue = formatter.format(new Date(value));

    expect(mdcTextFieldInput).toHaveValue(expectedValue);

    if (triggerType === 'click') {
      mdcTextFieldIconTrailing?.click();
    } else {
      el.reset();
    }

    await el.updateComplete;

    mdcTextFieldInput = el.query<HTMLInputElement>(elementSelectors.mdcTextFieldInput);

    expect(mdcTextFieldInput).toHaveValue('');
    expect(el.value).toBe('');
    expect(el.valueAsDate).toBe(null);
    expect(el.valueAsNumber).toBe(NaN);
  });

  it.each<typeof keyEnter | typeof keySpace>([
    keyEnter,
    keySpace,
  ])('selects new date with keyboard (key=%s)', async (key) => {
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

    expect(newSelectedDate).toBeInTheDocument();

    const closedTask = eventOnce<
      typeof el,
      'closed',
      CustomEvent<DialogClosedEventDetail>>(el, 'closed');

    newSelectedDate?.focus();
    // fixme: use native browser keypress when vitest supports it
    document.body.dispatchEvent(new KeyboardEvent('keypress', { key }));

    await closedTask;
    await el.updateComplete;

    // FIXME: Webkit returns undefined even `closed` event is fired
    // expect(closed).not.undefined;
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

    expect(newSelectedDate).toBeInTheDocument();

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

  it('always reopens with the correct startView', async () => {
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
    expect(yearGrid).toBeInTheDocument();

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

    /**
     * NOTE: Year view should render when it reopens because `.startView=${'yearGrid'}` is set
     */
    expect(monthCalendar).not.toBeInTheDocument();
    expect(yearGrid).toBeInTheDocument();
  });

  it.skip.each<keyof Pick<DatePickerInputProperties, 'disabled' | 'readOnly'>>([
    'disabled',
    'readOnly',
  ])(`renders correctly and does not trigger anything event handler when '%s' is set to true`, async (key) => {
    const el = await fixture<AppDatePickerInput>(
      html`<app-date-picker-input
        .label=${label}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .startView=${'yearGrid'}
        .value=${value}
        .disabled=${key === 'disabled' ? true : false}
        .readOnly=${key === 'readOnly' ? true : false}
      ></app-date-picker-input>`
    );

    await el.updateComplete;

    const initialValue = el.value;
    const initialValueText = el.query<HTMLInputElement>(elementSelectors.mdcTextFieldInput)?.value;

    const tasks = [
      async () => {
        /**
         * Call `.showPicker()`
         */
        el.showPicker();
      },
      async () => {
        // Trigger key event to open date picker
        const input = el.query<HTMLInputElement>(elementSelectors.mdcTextFieldInput);

        input?.click();
        input?.focus();
        /* 
         * fixme: use native browser keypress when vitest supports it
         */
        document.body.dispatchEvent(new KeyboardEvent('keypress', { key: keyEnter }));
      },
      async () => {
        // Trigger click event to open date picker
        el.focus();
        el.click();
      },
      async () => {
        /**
         * note: Trigger key event to close date picker
         * 
         * fixme: use native browser keypress when vitest supports it
         */
        document.body.dispatchEvent(new KeyboardEvent('keypress', { key: keyEscape }));
      },
      () => {
        // Click reset icon button to reset value
        const mdcTextFieldIconTrailing =
          el.query<MdOutlinedButton>(elementSelectors.mdcTextFieldIconTrailing);

        mdcTextFieldIconTrailing?.focus();
        mdcTextFieldIconTrailing?.click();
      },
      () => {
        /**
         * Call `.reset()`
         */
        el.reset();
      },
    ] as const;
    for (const task of tasks) {
      const openedTask = eventOnce<
        typeof el,
        'opened',
        CustomEvent<unknown>>(el, 'opened');

      await task();
      await openedTask;
      await el.updateComplete;

      const datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
      const updatedValueText = el.query<HTMLInputElement>(elementSelectors.mdcTextFieldInput)?.value;

      expect(datePickerInputSurface).not.toBeInTheDocument();
      expect(el.value).toBe(initialValue);
      expect(updatedValueText).toBe(initialValueText);
    }
  });
});
