import '../../year-grid-button/app-year-grid-button';

import { expect, fixture, html } from '@open-wc/testing';

import { APP_YEAR_GRID_BUTTON_NAME } from '../../year-grid-button/constants.js';

describe(APP_YEAR_GRID_BUTTON_NAME, () => {
  it('renders', async () => {
    const el = await fixture(
      html`<app-year-grid-button label="test"></app-year-grid-button>`
    );

    expect(el.shadowRoot?.querySelector(`button[aria-label="test"]`)).exist;
  });
});
