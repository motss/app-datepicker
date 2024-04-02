import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { describe, expect, it } from 'vitest';

import { StartViewMixin } from '../../mixins/start-view-mixin/start-view-mixin.js';
import { RootElement } from '../../root-element/root-element.js';
import { createFixture } from '../__helpers__/create-fixture/create-fixture.js';

class TestComponent extends StartViewMixin(RootElement) {
  protected override render() {
    return html`
    <input id=startView value=${ifDefined(this.startView)} readonly />
    `;
  }
}

describe(StartViewMixin.name, () => {
  const render = createFixture(() => TestComponent, {
    getStartView(n) {
      return n.root.querySelector<HTMLInputElement>('input#startView');
    },
  });

  it('applies mixin correctly', async () => {
    const { getStartView } = await render();

    expect(getStartView()).toBeInTheDocument();
    expect(getStartView()).toHaveValue('calendar');
  });

  it('updates startView correctly', async () => {
    const { element, getStartView, updated } = await render();

    element.startView = 'yearGrid';
    await updated();

    expect(getStartView()).toBeInTheDocument();
    expect(getStartView()).toHaveValue('yearGrid');
  });
});
