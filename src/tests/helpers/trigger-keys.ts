import { AppDatepicker } from '../../app-datepicker.js';

export interface KeyboardEventOptions extends KeyboardEventInit {
  keyCode: number;
  rootOnly?: boolean;
}

export async function triggerKeys(
  rootSelector: string,
  selector: string,
  options: KeyboardEventOptions,
  eventName?: 'keydown' | 'keyup' | 'click' | 'mousedown' | 'mouseup'
) {
  const { rootOnly } = options ?? {};
  /**
   * This is so much better than using buggy `browser.keys()`.
   */
  await browser.executeAsync(async (a, b, c, d, e, done) => {
    const n: AppDatepicker = document.body.querySelector(a)!;
    const n2: HTMLElement = e ? null : n.shadowRoot?.querySelector(b)!;
    const ne2 = new CustomEvent(d ?? 'keyup', {
      composed: true,
      bubbles: true,
      ...c,
    } as KeyboardEventOptions);

    Object.keys(c).forEach((o) => {
      if (o !== 'rootOnly') Object.defineProperty(ne2, o, { value: c[o] });
    });

    (e ? n : n2).dispatchEvent(ne2);

    await n.updateComplete;

    done();
  }, rootSelector, selector, options, eventName, rootOnly);
}
