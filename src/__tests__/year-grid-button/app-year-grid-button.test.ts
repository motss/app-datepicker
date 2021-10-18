import '../../year-grid-button/app-year-grid-button';

import { expect, fixture, html } from '@open-wc/testing';

import { appYearGridName } from '../../year-grid-button/constants';

describe(appYearGridName, () => {
  it('renders', async () => {
    const el = await fixture(
      html`<app-year-grid-button label="test"></app-year-grid-button>`
    );

    expect(el.shadowRoot?.querySelector(`button[aria-label="test"]`)).exist;
  });

});
