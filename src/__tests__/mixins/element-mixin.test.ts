import { html } from 'lit';
import { describe, expect, it } from 'vitest';

import { ElementMixin } from '../../mixins/element-mixin/element-mixin.js';
import { RootElement } from '../../root-element/root-element.js';
import { createFixture } from '../__helpers__/create-fixture/create-fixture.js';
import { eventOnce } from '../test-utils/event-once.js';

class TestComponent extends ElementMixin(RootElement) {
  protected override render() {
    return html`
    <p>1</p>
    <p>2</p>
    `;
  }
}

describe(ElementMixin.name, () => {
  const render = createFixture(() => TestComponent);

  it('applies mixin correctly', async () => {
    const { element } = await render();

    expect(element.root).toBeDefined();
    expect(element.fire).toEqual(expect.any(Function));
    expect(element.query).toEqual(expect.any(Function));
    expect(element.queryAll).toEqual(expect.any(Function));

    expect(element.root).toEqual(element.shadowRoot);
  });

  it('fires an event correctly', async () => {
    const testEvent = 'test';

    const { element } = await render();

    const task = eventOnce(element, testEvent);

    element.fire({
      detail: {},
      type: testEvent,
    });

    expect((await task)?.detail).toEqual({});
  });

  it('queries an element correctly', async () => {
    const { element } = await render();

    expect(element.query('p')).toBeInTheDocument();
  });

  it('queries multiple elements correctly', async () => {
    const { element } = await render();

    expect(element.queryAll('p')).toHaveLength(2);
    expect(element.queryAll('p').map((n) => n.textContent)).toEqual(['1', '2']);
  });

  it('queries multiple non-existent elements correctly', async () => {
    const { element } = await render();

    expect(element.queryAll('button')).toEqual([]);
    expect(element.queryAll('button')).toHaveLength(0);
  });
});
