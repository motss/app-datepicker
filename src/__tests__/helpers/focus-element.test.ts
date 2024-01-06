import { fixture, html } from '@open-wc/testing-helpers';
import { describe, expect, it } from 'vitest';

import { focusElement } from '../../helpers/focus-element';

describe(focusElement.name, () => {
  it('focuses element', async () => {
    const el = await fixture<HTMLButtonElement>(html`<button>Focus me</button>`);

    const focusedElement = await focusElement(Promise.resolve(el));

    expect(document.activeElement).toMatchInlineSnapshot(focusedElement);
  });

  it('focuses element with optional callback', async () => {
    const el = await fixture<HTMLButtonElement>(html`<button>Focus me</button>`);

    const focusedElement = await new Promise<HTMLButtonElement>(async (resolve) => {
      await focusElement(Promise.resolve(el), (n => {
        resolve(n);
      }));
    });

    expect(document.activeElement).toMatchInlineSnapshot(focusedElement);
  });

});
