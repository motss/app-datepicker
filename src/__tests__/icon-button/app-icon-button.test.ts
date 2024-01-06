import '../../icon-button/app-icon-button';

import { fixture, html } from '@open-wc/testing-helpers';
import { describe, expect, it } from 'vitest';

import type { AppIconButton } from '../../icon-button/app-icon-button';
import { appIconButtonName } from '../../icon-button/constants';

describe(appIconButtonName, () => {
  it('renders', async () => {
    const el = await fixture<AppIconButton>(html`
      <app-icon-button></app-icon-button>
    `);

    expect(await el.ripple).not.toBeInTheDocument();

    el.focus();

    /**
     * NOTE(motss): `.click()` and `.focus()` does not render any ripple.
     * So we need to actually focus with keypress or mouse click.
     * 
     * fixme: use native browser keypress when vitest supports it.
     */
    el.dispatchEvent(new KeyboardEvent('keypress', {
      key: 'Enter',
    }));

    // Force layout
    await el.layout();

    expect(await el.ripple).toBeInTheDocument();
  });
});
