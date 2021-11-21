import '../../date-picker-input-surface/app-date-picker-input-surface';

import { expect, fixture, html } from '@open-wc/testing';

import { appDatePickerInputSurfaceName } from '../../date-picker-input-surface/constants';
import type { DatePickerInputSurface } from '../../date-picker-input-surface/date-picker-input-surface';
import { promiseTimeout } from '../constants';

describe(appDatePickerInputSurfaceName, () => {
  const elementSelectors = {
    mdcMenuSurface: '.mdc-menu-surface',
  } as const;

  it('renders', async () => {


    const el = await new Promise<DatePickerInputSurface>(async (resolve) => {
      const element = await fixture<DatePickerInputSurface>(
        html`<app-date-picker-input-surface .open=${true} @opened=${() => resolve(element)}>
          <h1 class=test>Test</h1>
        </app-date-picker-input-surface>`
      );
    });

    const mdcMenuSurface = el.query(elementSelectors.mdcMenuSurface);

    expect(mdcMenuSurface).exist;
  });

  it('closes when clicking outside of surface', async () => {
    const el = await new Promise<DatePickerInputSurface>(async (resolve) => {
      const element = await fixture<DatePickerInputSurface>(
        html`<app-date-picker-input-surface .open=${true} @opened=${() => resolve(element)}>
          <h1 class=test>Test</h1>
        </app-date-picker-input-surface>`
      );
    });

    const mdcMenuSurface = el.query(elementSelectors.mdcMenuSurface);

    expect(mdcMenuSurface).exist;

    const closedTask = new Promise<boolean>((resolve) => {
      el.addEventListener('closed', () => {
        resolve(true);

        globalThis.setTimeout(() => resolve(false), promiseTimeout);
      }, { once: true });
    });

    document.body.click();

    const closed = await closedTask;

    expect(closed).true;
    expect(el.open).false;
    expect(mdcMenuSurface).exist;
  });
});
