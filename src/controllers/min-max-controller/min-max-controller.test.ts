import { elementUpdated, html } from '@open-wc/testing-helpers';
import type { TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { describe, expect, it } from 'vitest';

import { createControllerFixture } from '../../__tests__/create-controller-fixture/create-controller-fixture.js';
import { RootElement } from '../../root-element/root-element.js';
import { MinMaxController } from './min-max-controller.js';

interface TestComponentProperties extends RootElement {
  max?: string;
  min?: string;
}

class TestComponent extends RootElement implements TestComponentProperties {
  #minMax_ = new MinMaxController(this);

  @property() max?: string;
  @property() min?: string;

  protected override render(): TemplateResult {
    const {maxDate, minDate } = this.#minMax_;

    return html`<div>
      <input id=max value=${maxDate?.toJSON()} readonly />
      <input id=min value=${minDate?.toJSON()} readonly />
    </div>`;
  }
}

describe(MinMaxController.name, () => {
  const render = createControllerFixture(
    () => TestComponent,
    {
      getMax(el) {
        return el.root.querySelector<HTMLInputElement>('input#max');
      },
      getMin(el) {
        return el.root.querySelector<HTMLInputElement>('input#min');
      },
    }
  );

  it('returns min & max correctly', async () => {
    const { getMax, getMin } = await render();

    expect(getMax()).toHaveValue('');
    expect(getMin()).toHaveValue('');
  });

  it('returns max correctly when max is defined', async () => {
    const max = '2023-02-02';
    const { element, getMax, getMin } = await render();

    element.max = max;
    await elementUpdated(element);

    expect(getMin()).toHaveValue('');
    expect(getMax()).toHaveValue(new Date(max).toJSON());
  });

  it('returns min correctly when min is defined', async () => {
    const max = '2023-02-02';
    const { element, getMax, getMin } = await render();

    element.max = max;
    await elementUpdated(element);

    expect(getMin()).toHaveValue('');
    expect(getMax()).toHaveValue(new Date(max).toJSON());
  });

  it('returns min & max correctly when min & max are defined', async () => {
    const max = '2023-02-02';
    const min = '2020-02-02';
    const { element, getMax, getMin } = await render();

    element.max = max;
    element.min = min;
    await elementUpdated(element);

    expect(getMin()).toHaveValue(new Date(min).toJSON());
    expect(getMax()).toHaveValue(new Date(max).toJSON());
  });

});
