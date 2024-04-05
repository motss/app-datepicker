import { html } from 'lit';
import { describe, expect, it } from 'vitest';

import { toDateString } from '../../helpers/to-date-string.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import { ValueMixin } from '../../mixins/value-mixin/value-mixin.js';
import { RootElement } from '../../root-element/root-element.js';
import { createFixture } from '../__helpers__/create-fixture.js';

class TestComponent extends ValueMixin(RootElement) {
  protected override render() {
    return html`
    <input id=value value=${this.value ?? ''} readonly />
    <input id=valueDate value=${this._valueDate.toJSON()} readonly />
    `;
  }
}

describe(ValueMixin.name, () => {
  const render = createFixture(() => TestComponent, {
    getValue(el) {
      return el.root.querySelector<HTMLInputElement>('input#value');
    },
    getValueDate(el) {
      return el.root.querySelector<HTMLInputElement>('input#valueDate');
    },
  });
  const todayDate = toResolvedDate();

  it('applies mixin correctly', async () => {
    const { getValue, getValueDate } = await render();

    expect(getValue()).toHaveValue(toDateString(toResolvedDate()));
    expect(getValueDate()).toHaveValue(todayDate.toJSON());
  });

  it(`resets to old value correctly when value set to ''`, async () => {
    const { element, getValue, getValueDate, updated } = await render();

    element.value = '';
    await updated();

    expect(getValue()).toHaveValue(toDateString(toResolvedDate()));
    expect(getValueDate()).toHaveValue(todayDate.toJSON());
  });

  it(`resets to old value correctly after updating value to '' from another value`, async () => {
    const testDate = '2020-02-20';

    const { element, getValue, getValueDate, updated } = await render();

    element.value = testDate;
    await updated();

    expect(getValue()).toHaveValue(toDateString(toResolvedDate(testDate)));
    expect(getValueDate()).toHaveValue(toResolvedDate(testDate).toJSON());

    element.value = '';
    await updated();

    expect(getValue()).toHaveValue(toDateString(toResolvedDate(testDate)));
    expect(getValueDate()).toHaveValue(toResolvedDate(testDate).toJSON());
  });

  it('updates value correctly', async () => {
    const testDate = '2020-02-20';

    const { element, getValue, getValueDate, updated } = await render();

    element.value = testDate;
    await updated();

    expect(getValue()).toHaveValue(toDateString(toResolvedDate(testDate)));
    expect(getValueDate()).toHaveValue(toResolvedDate(testDate).toJSON());
  });
});
