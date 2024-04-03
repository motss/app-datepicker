import { html } from 'lit';
import { describe, expect, it } from 'vitest';

import { RootElement } from '../../root-element/root-element.js';
import { createFixture } from '../__helpers__/create-fixture/create-fixture.js';
import { eventOnce } from '../test-utils/event-once.js';

class TestComponent extends RootElement {
  protected override render() {
    return html`
    <p>1</p>
    <p>2</p>
    `;
  }
}

describe(RootElement.name, () => {
  const render = createFixture(() => TestComponent, {
    getP(n) {
      return n.root.querySelector<HTMLButtonElement>('button');
    },
  });

  it('renders correctly', async () => {
    const { element } = await render();

    expect(element.fire).toEqual(expect.any(Function));
    expect(element.query).toEqual(expect.any(Function));
    expect(element.queryAll).toEqual(expect.any(Function));
    expect(element.root).toEqual(element.shadowRoot);
  });

  it('fires event correctly', async () => {
    const { element } = await render();

    const task = eventOnce(element, 'test');

    element.fire({
      detail: {},
      type: 'test',
    });

    const ev = await task;

    expect(ev?.detail).toEqual({});
    expect(ev?.type).toEqual('test');
  });

  it('queries single element correctly', async () => {
    const { element } = await render();

    expect(element.query('p')).toBeInTheDocument();
    expect(element.query('p')).toHaveTextContent('1');
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
