import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { describe, expect, it } from 'vitest';

import { ValueController } from '../../controllers/value-controller/value-controller.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import { ValueMixin } from '../../mixins/value-mixin/value-mixin.js';
import { RootElement } from '../../root-element/root-element.js';
import { createFixture } from '../__helpers__/create-fixture/create-fixture.js';

class TestComponent extends RootElement {
  #value_ = new ValueController(this, {
    onChange: (_, value) => {
      this.value = value;
    },
  });

  @property() value?: string;

  protected override render() {
    const { valueDate } = this.#value_;

    return html`
    <input id=value value=${valueDate.toJSON()} readonly />
    `;
  }
}

describe(ValueMixin.name, () => {
  const render = createFixture(() => TestComponent, {
    getValue(n) {
      return n.root.querySelector('input#value');
    },
  });

  it('returns value correctly', async () => {
    const { element, getValue, updated } = await render();

    await updated();

    expect(getValue()).toHaveValue(toResolvedDate().toJSON());
    expect(element.value).toBeUndefined();
  });

  it('returns value correctly when value changes', async () => {
    const value = '2020-02-02';

    const { element, getValue, updated } = await render();

    element.value = value;
    await updated();

    expect(getValue()).toHaveValue(new Date(value).toJSON());
    expect(element.value).toBe(value);
  });
});
