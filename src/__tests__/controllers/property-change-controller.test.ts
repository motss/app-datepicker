import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { describe, expect, it, vi } from 'vitest';

import { PropertyChangeController } from '../../controllers/property-change-controller/property-change-controller.js';
import { RootElement } from '../../root-element/root-element.js';
import { createFixture } from '../__helpers__/create-fixture.js';

type Init = Pick<
  ConstructorParameters<typeof PropertyChangeController>[1],
  'compare' | 'order'
>;

describe(PropertyChangeController.name, () => {
  const onUpdate = vi.fn();
  const onUpdated = vi.fn();
  const render = createFixture(
    (init?: Partial<Init>) => {
      class TestComponent extends RootElement {
        #handleInput: HTMLInputElement['oninput'] = (ev) => {
          const target = ev.currentTarget as HTMLInputElement;

          this.value = target.value;
        };

        @property() value = '';

        constructor() {
          super();

          new PropertyChangeController(this, {
            compare: init?.compare,
            onUpdate: (_, value) => {
              onUpdate(_, value);
            },
            onUpdated: (_, value) => {
              onUpdated(_, value);
            },
            order: init?.order ?? 'update',
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
    },
    {
      getValue(n) {
        return n.root.querySelector<HTMLInputElement>('input#value');
      },
    }
  );

  it('calls onUpdate correctly', async () => {
    const { element, getValue, updated } = await render();

    await updated();

    expect(getValue()).toHaveValue('');
    expect(element.value).toBe('');

    expect(onUpdated).toBeCalledTimes(0);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith(undefined, '');
  });

  it('calls onUpdate correctly when value changes', async () => {
    const value = 'abc';

    const { element, getValue, updated } = await render();

    element.value = value;
    await updated();

    expect(getValue()).toHaveValue(value);
    expect(element.value).toBe(value);

    expect(onUpdated).toBeCalledTimes(0);
    expect(onUpdate).toBeCalledTimes(2);
    expect(onUpdate).toBeCalledWith(undefined, '');
    expect(onUpdate).toBeCalledWith('', value);
  });

  it('calls onUpdate correctly when value changes to null', async () => {
    const { element, getValue, updated } = await render();

    // @ts-expect-error Test null
    element.value = null;
    await updated();

    expect(getValue()).toHaveValue('');
    expect(element.value).toBe(null);
    expect(element.value).not.toBe(
      ''
    ); /** note: in chrome, value becomes '' when .value = undefined */

    expect(onUpdated).toBeCalledTimes(0);
    expect(onUpdate).toBeCalledWith(undefined, '');
    expect(onUpdate).toBeCalledWith('', null);
  });

  it('calls onUpdate correctly when value changes to undefined', async () => {
    const { element, getValue, updated } = await render();

    // @ts-expect-error Test undefined
    element.value = undefined;
    await updated();

    expect(getValue()).toHaveValue('');
    expect(element.value).toBe(undefined);
    expect(element.value).not.toBe(
      'undefined'
    ); /** note: in chrome, value becomes 'undefined' when .value = undefined */

    expect(onUpdated).toBeCalledTimes(0);
    expect(onUpdate).toBeCalledWith(undefined, '');
    expect(onUpdate).toBeCalledWith('', undefined);
  });

  it('calls onUpdate correctly without comparing old value', async () => {
    const { element, getValue, updated } = await render({
      compare: false,
      order: 'update',
    });

    await updated();

    expect(getValue()).toHaveValue('');
    expect(element.value).toBe('');

    expect(onUpdated).toBeCalledTimes(0);
    expect(onUpdate).toBeCalledTimes(2);
    expect(onUpdate).toBeCalledWith(undefined, '');
  });

  it('calls onUpdate correctly without comparing old value when value gets updated', async () => {
    const value = 'abc';

    const { element, getValue, updated } = await render({
      compare: false,
      order: 'update',
    });

    element.value = value;
    await updated();

    expect(getValue()).toHaveValue(value);
    expect(element.value).toBe(value);

    expect(onUpdated).toBeCalledTimes(0);
    expect(onUpdate).toBeCalledTimes(3);
    expect(onUpdate).toBeCalledWith(undefined, '');
    expect(onUpdate).toBeCalledWith('', value);
  });

  it('calls onUpdated correctly during <host>.updated phase', async () => {
    const { element, getValue, updated } = await render({ order: 'updated' });

    await updated();

    expect(getValue()).toHaveValue('');
    expect(element.value).toBe('');

    expect(onUpdate).toBeCalledTimes(0);
    expect(onUpdated).toBeCalledTimes(1);
    expect(onUpdated).toBeCalledWith(undefined, '');
  });

  it('calls onUpdated correctly during <host>.updated phase without comparing old value', async () => {
    const { element, getValue, updated } = await render({
      compare: false,
      order: 'updated',
    });

    await updated();

    expect(getValue()).toHaveValue('');
    expect(element.value).toBe('');

    expect(onUpdate).toBeCalledTimes(0);
    expect(onUpdated).toBeCalledTimes(2);
    expect(onUpdated).toBeCalledWith(undefined, '');
  });

  it('calls onUpdated correctly during <host>.updated phase with value updated', async () => {
    const value = 'abc';

    const { element, getValue, updated } = await render({ order: 'updated' });

    element.value = value;
    await updated();

    expect(getValue()).toHaveValue(value);
    expect(element.value).toBe(value);

    expect(onUpdate).toBeCalledTimes(0);
    expect(onUpdated).toBeCalledTimes(2);
    expect(onUpdated).toBeCalledWith(undefined, '');
    expect(onUpdated).toBeCalledWith('', value);
  });

  it('calls onUpdated correctly during <host>.updated phase without comparing old value', async () => {
    const value = 'abc';

    const { element, getValue, updated } = await render({
      compare: false,
      order: 'updated',
    });

    element.value = value;
    await updated();

    expect(getValue()).toHaveValue(value);
    expect(element.value).toBe(value);

    expect(onUpdate).toBeCalledTimes(0);
    expect(onUpdated).toBeCalledTimes(3);
    expect(onUpdated).toBeCalledWith(undefined, '');
    expect(onUpdated).toBeCalledWith('', value);
  });
});
