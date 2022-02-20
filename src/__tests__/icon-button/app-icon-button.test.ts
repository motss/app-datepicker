import '../../icon-button/app-icon-button';

import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';

import type { AppIconButton } from '../../icon-button/app-icon-button';
import { appIconButtonName } from '../../icon-button/constants';

describe(appIconButtonName, () => {
  it('renders', async () => {
    const el = await fixture<AppIconButton>(html`
      <app-icon-button></app-icon-button>
    `);

    expect(await el.ripple).not.exist;

    el.focus();

    /**
     * NOTE(motss): `.click()` and `.focus()` does not render any ripple.
     * So we need to actually focus with keypress or mouse click.
     */
    await sendKeys({ press: 'Enter' });

    // Force layout
    await el.layout();

    expect(await el.ripple).exist;
  });
});
