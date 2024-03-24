import { html } from 'lit';
import { describe, expect, it } from 'vitest';

import { MAX_DATE, MIN_DATE } from '../../constants.js';
import { MinMaxMixin } from '../../mixins/min-max-mixin.js';
import { RootElement } from '../../root-element/root-element.js';
import { createFixture } from '../__helpers__/create-fixture/create-fixture.js';

class TestComponent extends MinMaxMixin(RootElement) {
  protected override render() {
    const { _maxDate, _minDate } = this;

    return html`
    <input id=max value=${_maxDate?.toJSON()} />
    <input id=min value=${_minDate?.toJSON()} />
    `;
  }
}

describe(MinMaxMixin.name, () => {
  const maxJson = new Date(MAX_DATE).toJSON();
  const minJson = new Date(MIN_DATE).toJSON();
  const render = createFixture(
    () => TestComponent,
    {
       getMax(n) {
        return n.root.querySelector<HTMLInputElement>('input#max');
       },
       getMin(n) {
        return n.root.querySelector<HTMLInputElement>('input#min');
       },
    }
  );

  it('mixes with a superclass correctly', async () => {
    const {
      getMax,
      getMin,
    } = await render();

    expect(getMax()).toHaveValue(maxJson);
    expect(getMin()).toHaveValue(minJson);
  });

  it('updates max correctly', async () => {
    const max = '2020-02-02';

    const {
      element,
      getMax,
      getMin,
      updated,
    } = await render();

    element.max = max;
    await updated();

    expect(getMax()).toHaveValue(new Date(max).toJSON());
    expect(getMin()).toHaveValue(minJson);
  });

  it('updates min correctly', async () => {
    const min = '2020-02-02';

    const {
      element,
      getMax,
      getMin,
      updated,
    } = await render();

    element.min = min;
    await updated();

    expect(getMax()).toHaveValue(maxJson);
    expect(getMin()).toHaveValue(new Date(min).toJSON());
  });

  it('updates min & max correctly', async () => {
    const max = '2023-02-02';
    const min = '2020-02-02';

    const {
      element,
      getMax,
      getMin,
      updated,
    } = await render();

    element.max = max;
    element.min = min;
    await updated();

    expect(getMax()).toHaveValue(new Date(max).toJSON());
    expect(getMin()).toHaveValue(new Date(min).toJSON());
  });

});
