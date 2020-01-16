import { AppDatepicker } from '../../app-datepicker.js';
import { PrepareOptions } from '../custom_typings.js';

// FIXME: Helper as a workaround until `browser.keys()` supports Alt
// on all browsers on local and CI.
const browserKeys = (elementName: string) =>
async (keyCode: number, altKey: boolean = false) => {
  return browser.executeAsync(async (a, b, c, d, done) => {
    const n = document.body.querySelector<AppDatepicker>(a)!;
    const n2 = n.shadowRoot!.querySelector<HTMLDivElement>(b)!;

    const opt: any = { keyCode: c, altKey: d };
    const ev = new CustomEvent('keyup', opt);

    Object.keys(opt).forEach((o) => {
      Object.defineProperty(ev, o, { value: opt[o] });
    });

    n2.dispatchEvent(ev);

    done();
  }, elementName, '.calendars-container', keyCode, altKey);
};

const clickElements = (elementName: string, isSafari: boolean) =>
async (classes: string[], prepareOptions?: PrepareOptions) => {
  if (prepareOptions) {
    await browser.executeAsync(async (a, b, done) => {
      const n = document.body.querySelector<AppDatepicker>(a)!;

      const { props, attrs }: PrepareOptions = b;

      if (props) {
        Object.keys(props).forEach((o) => {
          (n as any)[o] = (props as any)[o];
        });
      }

      if (attrs) {
        Object.keys(attrs).forEach((o) => {
          n.setAttribute(o.toLowerCase(), String((attrs as any)[o]));
        });
      }

      await n.updateComplete;

      done();
    }, elementName, prepareOptions);
  }

  /**
   * NOTE: [20191229] Due to a bug in Safari 13, Safari is not able
   * to recognize any clicks but it has yet to release the patch to
   * stable Safari and any older versions of Safari. As of writing,
   * only Safari TP has it fixed.
   *
   * Therefore, this helper is here to imperatively calling `.click()`
   * in the browser the tests run when it detects a Safari browser.
   *
   * @see https://bugs.webkit.org/show_bug.cgi?id=202589
   */
  for (const cls of classes) {
    if (isSafari) {
      await browser.executeAsync(async (a, b, done) => {
        const n = document.body.querySelector<AppDatepicker>(a)!;
        const n2: HTMLElement = n.shadowRoot!.querySelector(b)!;

        if (n2 instanceof HTMLButtonElement || n2.tagName === 'MWC-BUTTON') {
          n2.click();
        } else {
          // Simulate click event on non natively focusable elements.
          // This is for selecting new focused date in the table.
          ['touchstart', 'touchend'].forEach((o) => {
            n2.dispatchEvent(new CustomEvent(o, { bubbles: true, composed: true }));
          });
        }

        await n.updateComplete;

        done();
      }, elementName, cls);
    } else {
      const el = await $(elementName);
      const el2 = (await el.shadow$(cls)) as unknown as WebdriverIOAsync.Element;

      await el2.click();
    }
  }
};

const focusCalendarsContainer = (elementName: string) =>
async (prepareOptions?: PrepareOptions): Promise<string> => {
  return await browser.executeAsync(async (a, b, c, done) => {
    const a1 = document.body.querySelector<AppDatepicker>(a)!;

    if (c) {
      const { props, attrs }: PrepareOptions = c;

      if (props) {
        Object.keys(props).forEach((o) => {
          (a1 as any)[o] = (props as any)[o];
        });
      }

      if (attrs) {
        Object.keys(attrs).forEach((o) => {
          a1.setAttribute(o.toLowerCase(), String((attrs as any)[o]));
        });
      }
    }

    await a1.updateComplete;

    const b1 = a1.shadowRoot!.querySelector<HTMLElement>(b)!;

    b1.focus();

    await a1.updateComplete;
    await new Promise(y => setTimeout(() => y(b1.focus())));
    await a1.updateComplete;

    let activeElement = document.activeElement;

    while (activeElement?.shadowRoot) {
      activeElement = activeElement.shadowRoot.activeElement;
    }

    done(
      `.${Array.from(activeElement?.classList.values() ?? []).join('.')}`
    );
  }, elementName, '.calendars-container', prepareOptions);
};

export const interaction = (elementName: string, isSafari: boolean = false) => {
  return {
    browserKeys: browserKeys(elementName),
    clickElements: clickElements(elementName, isSafari),
    focusCalendarsContainer: focusCalendarsContainer(elementName),
  };
};
