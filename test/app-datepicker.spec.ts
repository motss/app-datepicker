import { LitElement } from 'lit-element';

import '../src/app-datepicker.js';
import { stripExpressionDelimiters } from './test-helpers';

const assert = chai.assert;

describe('app-datepicker', () => {
  let element: LitElement;

  beforeEach(async () => {
    element = document.createElement('app-datepicker') as LitElement;
    document.body.appendChild(element);

    await element.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('renders initial content', async () => {
    await element.updateComplete;

    const elHTML = stripExpressionDelimiters(element.innerHTML);
    assert.strictEqual(elHTML, '', 'innerHTML not matched');
  });

});
