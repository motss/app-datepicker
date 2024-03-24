import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { describe, expect, it, vi } from 'vitest';

import { PropertyChangeController } from '../../controllers/property-change-controller/property-change-controller.js';
import { RootElement } from '../../root-element/root-element.js';
import { createFixture } from '../__helpers__/create-fixture/create-fixture.js';

describe(PropertyChangeController.name, () => {
  const onChange = vi.fn();
  const toTestComponent = (compare = true) => {
    class TestComponent extends RootElement {
      #handleInput: HTMLInputElement['oninput'] = (ev) => {
        const target = ev.currentTarget as HTMLInputElement;

        this.value = target.value;
      };

      @property() value = '';

      constructor() {
        super();

        new PropertyChangeController(this, {
          compare,
          onChange: (_, value) => {
            onChange(_, value);
          },
          property: 'value',
        });
      }

      protected override render() {
        return html`
        <input id=value @input=${this.#handleInput} value=${this.value} />
        `;
      }
    }

    return TestComponent;
  };
  const helpers = {
    getValue(n) {
      return n.root.querySelector<HTMLInputElement>('input#value');
    },
  } satisfies Parameters<typeof createFixture>[1];
  const render = createFixture(toTestComponent, helpers);

  it('calls onChange correctly', async () => {
    const { element, getValue, updated } = await render();

    await updated();

    expect(getValue()).toHaveValue('');
    expect(element.value).toBe('');

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(undefined, '');
  });

  it('calls onChange correctly when value changes', async () => {
    const value = 'abc';

    const { element, getValue, updated } = await render();

    element.value = value;
    await updated();

    expect(getValue()).toHaveValue(value);
    expect(element.value).toBe(value);

    expect(onChange).toBeCalledTimes(2);
    expect(onChange).toBeCalledWith(undefined, '');
    expect(onChange).toBeCalledWith('', value);
  });

  it('calls onChange correctly when value changes to null', async () => {
    const { element, getValue, updated } = await render();

    // @ts-expect-error Test null
    element.value = null;
    await updated();

    expect(getValue()).toHaveValue('');
    expect(element.value).toBe(null);
    expect(element.value).not.toBe(
      ''
    ); /** note: in chrome, value becomes '' when .value = undefined */

    expect(onChange).toBeCalledWith(undefined, '');
    expect(onChange).toBeCalledWith('', null);
  });

  it('calls onChange correctly when value changes to undefined', async () => {
    const { element, getValue, updated } = await render();

    // @ts-expect-error Test undefined
    element.value = undefined;
    await updated();

    expect(getValue()).toHaveValue('');
    expect(element.value).toBe(undefined);
    expect(element.value).not.toBe(
      'undefined'
    ); /** note: in chrome, value becomes 'undefined' when .value = undefined */

    expect(onChange).toBeCalledWith(undefined, '');
    expect(onChange).toBeCalledWith('', undefined);
  });

  it('calls onChange correctly without comparing old value', async () => {
    const { element, getValue, updated } = await createFixture(
      () => toTestComponent(false),
      helpers
    )();

    await updated();

    expect(getValue()).toHaveValue('');
    expect(element.value).toBe('');

    expect(onChange).toBeCalledTimes(2);
    expect(onChange).toBeCalledWith(undefined, '');
  });

  it('calls onChange correctly without comparing old value', async () => {
    const value = 'abc';

    const { element, getValue, updated } = await createFixture(
      () => toTestComponent(false),
      helpers
    )();

    element.value = value;
    await updated();

    expect(getValue()).toHaveValue(value);
    expect(element.value).toBe(value);

    expect(onChange).toBeCalledTimes(3);
    expect(onChange).toBeCalledWith(undefined, '');
    expect(onChange).toBeCalledWith('', value);
  });
});
