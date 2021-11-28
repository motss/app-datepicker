import { expect } from '@open-wc/testing';
import { stubMethod } from 'hanbi';

import { warnUndefinedElement } from '../../helpers/warn-undefined-element';
import { RootElement } from '../../root-element/root-element';

const warn = stubMethod(console, 'warn');

describe(warnUndefinedElement.name, () => {
  const elementName = 'test-element' as const;
  const elementName2 = 'test-element-2' as const;

  afterEach(() => {
    warn.reset();
  });

  it('does not warn defined element', () => {
    globalThis.customElements.define(elementName, class A extends RootElement {});

    warnUndefinedElement(elementName);

    expect(warn.called).false;
  });

  it('warns undefined element', () => {
    warnUndefinedElement(elementName2);

    expect(warn.lastCall?.args).deep.equal([`${elementName2} is required`]);
  });
});
