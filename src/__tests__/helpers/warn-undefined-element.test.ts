import { describe, expect, it, vi } from 'vitest';

import { warnUndefinedElement } from '../../helpers/warn-undefined-element';
import { RootElement } from '../../root-element/root-element';

const warn = vi.spyOn(window.console, 'warn');

describe(warnUndefinedElement.name, () => {
  const elementName = 'test-element' as const;
  const elementName2 = 'test-element-2' as const;

  it('does not warn defined element', () => {
    globalThis.customElements.define(
      elementName,
      class A extends RootElement {}
    );

    warnUndefinedElement(elementName);

    expect(warn).not.toBeCalled();
  });

  it('warns undefined element', () => {
    warnUndefinedElement(elementName2);

    expect(warn).toBeCalledWith(`${elementName2} is required`);
  });
});
