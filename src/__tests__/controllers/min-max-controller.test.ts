import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { describe, expect, it } from 'vitest';

import { MAX_DATE, MIN_DATE } from '../../constants.js';
import { MinMaxController } from '../../controllers/min-max-controller/min-max-controller.js';
import type { MinMaxProperties } from '../../mixins/types.js';
import { RootElement } from '../../root-element/root-element.js';
import { createFixture } from '../__helpers__/create-fixture/create-fixture.js';

interface TestComponentProperties extends RootElement, MinMaxProperties {}

class TestComponent extends RootElement implements TestComponentProperties {
  #minMax_ = new MinMaxController(this);

  @property() max?: string;
  @property() min?: string;

  protected override render(): TemplateResult {
    const { maxDate, minDate } = this.#minMax_;

    return html`<div>
      <input id=max value=${maxDate?.toJSON()} readonly />
      <input id=min value=${minDate?.toJSON()} readonly />
    </div>`;
  }
}

describe(MinMaxController.name, () => {
  const maxJson = new Date(MAX_DATE).toJSON();
  const minJson = new Date(MIN_DATE).toJSON();
  const render = createFixture(() => TestComponent, {
    getMax(el) {
      return el.root.querySelector<HTMLInputElement>('input#max');
    },
    getMin(el) {
      return el.root.querySelector<HTMLInputElement>('input#min');
    },
  });

  it('returns min & max correctly', async () => {
    const { getMax, getMin } = await render();

    expect(getMax()).toHaveValue(maxJson);
    expect(getMin()).toHaveValue(minJson);
  });

  it('returns max correctly when max is defined', async () => {
    const max = '2023-02-02';
    const { element, getMax, getMin, updated } = await render();

    element.max = max;
    await updated();

    expect(getMax()).toHaveValue(new Date(max).toJSON());
    expect(getMin()).toHaveValue(minJson);
  });

  it('returns min correctly when min is defined', async () => {
    const max = '2023-02-02';
    const { element, getMax, getMin, updated } = await render();

    element.max = max;
    await updated();

    expect(getMax()).toHaveValue(new Date(max).toJSON());
    expect(getMin()).toHaveValue(minJson);
  });

  it('returns min & max correctly when min & max are defined', async () => {
    const max = '2023-02-02';
    const min = '2020-02-02';
    const { element, getMax, getMin, updated } = await render();

    element.max = max;
    element.min = min;
    await updated();

    expect(getMax()).toHaveValue(new Date(max).toJSON());
    expect(getMin()).toHaveValue(new Date(min).toJSON());
  });
});
