import '../../date-picker-input/app-date-picker-input';

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
import { iconClose } from '../../icons';
import { keyEnter, keySpace } from '../../key-values';
import type { AppMonthCalendar } from '../../month-calendar/app-month-calendar';
import { appMonthCalendarName } from '../../month-calendar/constants';
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

  it('renders', async () => {
    const el = await fixture<AppDatePickerInput>(
      html`<app-date-picker-input
        .label=${label}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .value=${value}
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
    expect(mdcFloatingLabel).text(label);
    expect(mdcTextFieldInput?.getAttribute('aria-labelledby')).equal('label');
    expect(mdcTextFieldInput?.placeholder).equal(placeholder);
    expect(mdcTextFieldIconTrailing).lightDom.equal(iconClose.strings.toString());
  });

  type A1 = [string | undefined | null, string];
  const cases1: A1[] = [
    ['zh-TW', 'zh-TW'],
    [null, 'en-US'],
    [undefined, 'en-US'],
  ];
  cases1.forEach(a => {
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
    await openedTask;
    await el.updateComplete;

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

  it('closes date picker by clicking outside of input surface', async () => {
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
    await openedTask;
    await el.updateComplete;

    let datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
    let datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

    expect(datePickerInputSurface).exist;
    expect(datePicker).exist;
    expect(datePickerInputSurface?.open).true;

    const closedTask = eventOnce<
      typeof el,
      'closed',
      CustomEvent<DialogClosedEventDetail>>(el, 'closed');

    document.body.click();
    await closedTask;
    await el.updateComplete;

    datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
    datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

    expect(datePickerInputSurface).exist;
    expect(datePicker).exist;
  });

  type A2 = typeof keyEnter | typeof keySpace;
  const cases2: A2[] = [
    keyEnter,
    keySpace,
  ];
  cases2.forEach((a) => {
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

        await openedTask;
        await el.updateComplete;

        const datePickerInputSurface = el.query<AppDatePickerInputSurface>(elementSelectors.datePickerInputSurface);
        const datePicker = el.query<AppDatePicker>(elementSelectors.datePicker);

        expect(datePickerInputSurface).exist;
        expect(datePicker).exist;
      }
    );
  });

  it('clears value', async () => {
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

    mdcTextFieldIconTrailing?.click();
    await el.updateComplete;

    mdcTextFieldInput = el.query<HTMLInputElement>(elementSelectors.mdcTextFieldInput);

    expect(mdcTextFieldInput).value('');
    expect(el).value('');
  });

  type A3 = typeof keyEnter | typeof keySpace;
  const cases3: A3[] = [
    keyEnter,
    keySpace,
  ];
  cases3.forEach((a) => {
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
        await openedTask;
        await el.updateComplete;

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
    await openedTask;
    await el.updateComplete;

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

    await closedTask;
    await el.updateComplete;
  });

});
