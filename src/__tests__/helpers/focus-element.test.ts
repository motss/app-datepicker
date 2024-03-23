import { fixture, html } from '@open-wc/testing-helpers';
import { describe, expect, it } from 'vitest';

import { focusElement } from '../../helpers/focus-element';

describe(focusElement.name, () => {
  it('focuses element', async () => {
    const el = await fixture<HTMLButtonElement>(
      html`<button>Focus me</button>`
    );

    const focusedElement = await focusElement(Promise.resolve(el));

    expect(focusedElement.outerHTML).toBe('<button>Focus me</button>');
    // fixme: learn more at https://github.com/vitest-dev/vitest/issues/2327
    // expect(document.activeElement).toMatchInlineSnapshot(focusedElement);
  });

  it('focuses element with optional callback', async () => {
    const el = await fixture<HTMLButtonElement>(
      html`<button>Focus me</button>`
    );

    const { resolve } = Promise.withResolvers();
    const focusedElement = await focusElement(Promise.resolve(el), (n) => {
      resolve(n);
    });

    expect(focusedElement.outerHTML).toBe('<button>Focus me</button>');
    // fixme: learn more at https://github.com/vitest-dev/vitest/issues/2327
    // expect(focusedElement.outerHTML).toMatchInlineSnapshot('"<button>Focus me</button>"');
  });
});
