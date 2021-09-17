import { expect, fixture, html } from '@open-wc/testing';

import { focusElement } from '../../helpers/focus-element';

describe(focusElement.name, () => {
  it('focuses element', async () => {
    const el = await fixture<HTMLButtonElement>(html`<button>Focus me</button>`);

    const focusedElement = await focusElement(Promise.resolve(el));

    expect(document.activeElement).dom.equal(focusedElement);
  });

  it('focuses element with optional callback', async () => {
    const el = await fixture<HTMLButtonElement>(html`<button>Focus me</button>`);

    const focusedElement = await new Promise(async (resolve) => {
      await focusElement(Promise.resolve(el), (n => {
        resolve(n);
      }));
    });

    expect(document.activeElement).dom.equal(focusedElement);
  });
});
