import type { AppDatepicker } from '../../app-datepicker.js';
import type { PrepareOptions } from '../custom_typings.js';
import { toSelector } from './to-selector.js';

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

interface OptionsDragTo {
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  dx2?: number;
  dy2?: number;
  step?: number;
  type?: 'mouse' | 'touch';
}
export interface DragOptions extends Partial<Omit<OptionsDragTo, 'dx' | 'dy' | 'dx2' | 'dy2'>> {
  x2?: number;
  y2?: number;
}
interface ComputeStepsOpts {
  ix: number;
  iy: number;
  xn: number;
  yn: number;
  stepN: number;
}
const dragCalendarsContainer = (elementName: string, elementName2?: string) => {
  return async (
    options: DragOptions,
    prepareOptions?: PrepareOptions
  ): Promise<string> => {
    return browser.executeAsync(async (a, b, c, d, e, f, done) => {
      try {
        const simulateInputEvent = (n: HTMLElement, eventName: string, opts?: PointerEvent) => {
          /**
           * NOTE: For all MS Edge < 16, `PointerEvent` has a bug where
           * `pageX` is always < 10 and it can neither be override-able nor configurable
           * unlike other browsers. However, it works perfectly well with real user gestures.
           *
           * To tackle such weird situation, `MouseEvent` will be used instead
           * for all MS Edges as well as IE11.
           */
          const isPointerEvent = /^pointer/i.test(eventName) &&
            !('MSPointerEvent' in window) &&
            !('MSGestureEvent' in window);
          const otherOptions = {
            /**
             * NOTE: Making sure all events triggered bubbles and
             * propagates across shadow boundary.
             */
            bubbles: true,
            ...opts,
          };
          /**
           * NOTE: `otherOptions` might contain the following properties for a typical CustomEvent:
           *
           *   1. `bubbles`
           *   2. `cancelable`
           *   3. `composed`
           *   4. `detail`
           *
           * In IE11, `new PointerEvent(...)` is not prohibited in script or dev tools.
           * In script, all events except `PointerEvent` can be instantiated.
           *
           * Here, it accidentally becomes a working implementation:
           * `new MouseEvent('pointerdown', ...)`, which sounds ridiculous at first,
           * but so far this is by far the _only_ way to trigger animations when
           * dragging/ swiping the calendar. `Event` and `CustomEvent` will skip running
           * the animations which is a good thing but worth to be documented here for
           * future reference.
           */
          const ev = isPointerEvent ?
            new PointerEvent(eventName, otherOptions) :
            new MouseEvent(eventName, otherOptions);

          n.dispatchEvent(ev);
        };
        const dragTo = async (target: HTMLElement, dragOpts: OptionsDragTo) => {
          const {
            x = 0,
            y = 0,
            dx = 0,
            dy = 0,
            dx2 = 0,
            dy2 = 0,
            step = 0,
            type = 'mouse',
          }: OptionsDragTo = dragOpts ?? {};
          const isMouse = type === 'mouse';

          const toPointerEventOptions = (px: number, py: number) => {
            return {
              clientX: px,
              pageX: px,
              offsetX: px,
              x: px,

              clientY: py,
              pageY: py,
              offsetY: py,
              y: py,
            } as PointerEvent;
          };
          const computeSteps = (computeStepsOpts: ComputeStepsOpts) => {
            const {
              ix,
              iy,
              xn,
              yn,
              stepN,
            }: ComputeStepsOpts = computeStepsOpts ?? {};

            const hasX = typeof xn === 'number' && isFinite(xn) && xn !== 0;
            const hasY = typeof yn === 'number' && isFinite(yn) && yn !== 0;

            if (!hasX && !hasY) return { x: ix, y: iy, steps: [] };

            let fx = ix;
            let fy = iy;

            const nn = hasX && hasY ? Math.max(xn, yn) : (hasX ? xn : yn);
            const maxX = ix + nn;
            const maxY = iy + nn;
            const total = Math.ceil(Math.abs(nn) / stepN);
            const factor = nn < 0 ? -1 : 1;
            const temp: [number, number][] = [];

            for (let i = 0; i <= total; i += 1) {
              const ni = i * stepN * factor;
              const mathFn = factor < 0 ? Math.max : Math.min;
              const nx = hasX ? mathFn(maxX, Math.floor(fx + ni)) : 0;
              const ny = hasY ? mathFn(maxY, Math.floor(fy + ni)) : 0;

              if (i === total) {
                fx = nx;
                fy = ny;
              }

              temp.push([nx, ny]);
            }

            return { x: fx, y: fy, steps: temp };
          };

          const eachStep = step == null || step <= 0 ? 20 : step;

          let lastX = x;
          let lastY = y;
          let steps: [number, number][] = [];

          for (const [nx, ny] of [
            [dx, dy],
            [dx2, dy2],
          ]) {
            // Simulate pause before starting subsequent dragging sequences
            await new Promise(yay => setTimeout(yay, 500));

            const results = computeSteps({
              ix: lastX,
              iy: lastY,
              xn: nx,
              yn: ny,
              stepN: eachStep,
            });

            if (!results.steps.length) continue;

            lastX = results.x;
            lastY = results.y;
            steps = steps.concat(results.steps);
          }

          simulateInputEvent(
            target,
            isMouse ? 'mousedown' : 'touchstart',
            toPointerEventOptions(x, y));

          for (const [nx, ny] of steps) {
            simulateInputEvent(
              target,
              isMouse ? 'mousemove' : 'touchmove',
              toPointerEventOptions(nx, ny));

            await new Promise(yay => requestAnimationFrame(yay));
          }

          simulateInputEvent(
            target,
            isMouse ? 'mouseup' : 'touchend',
            toPointerEventOptions(lastX, lastY));

          return {
            done: true,
            value: {
              x: lastX,
              y: lastY,
              step: eachStep,
            },
          };
        };

        const a1 = document.body.querySelector<AppDatepicker>(a)!;
        const a2 = b == null ?
          a1 :
          a1.shadowRoot!.querySelector<AppDatepicker>(b)!;
        const root = a2.shadowRoot!;

        if (f) {
          const { props, attrs }: PrepareOptions = f ?? {};

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

        if (b) await a2.updateComplete;
        await a1.updateComplete;

        const b1 = root.querySelector<HTMLElement>(c)!;

        // Setup drag point
        const a1Rect = a1.getBoundingClientRect();
        const b1Rect = b1.getBoundingClientRect();
        const left = a1Rect.left + (b1Rect.width * (e.x < 0 ? .78 : .22));
        const right = a1Rect.top + (b1Rect.height * .22);

        const transitionComplete = new Promise((yay) => {
          const timer = setTimeout(() => yay(false), 10e3);

          const handler = () => {
            clearTimeout(timer);
            yay(true);
            a1.removeEventListener('datepicker-animation-finished', handler);
          };
          a1.addEventListener('datepicker-animation-finished', handler);
        });

        await dragTo(b1, {
          ...e,
          x: left,
          y: right,
          dx: e?.x ?? 0,
          dy: e?.y ?? 0,
          dx2: e?.x2 ?? 0,
          dy2: e?.y2 ?? 0,
        });
        await transitionComplete;
        await a1.updateComplete;

        done(root.querySelector<HTMLDivElement>(d)!.textContent);
      } catch (err) {
        done(err.stack);
      }
    },
    elementName,
    elementName2,
    '.calendars-container',
    toSelector('.calendar-label'),
    options,
    prepareOptions
    );
  };
};

export interface InteractionOption {
  elementName: string;
  elementName2?: string;
  isSafari?: boolean;
}
export const interaction = (options: InteractionOption) => {
  const {
    elementName,
    elementName2,
    isSafari,
  }: InteractionOption = options ?? {};

  return {
    browserKeys: browserKeys(elementName),
    clickElements: clickElements(elementName, isSafari ?? false),
    dragCalendarsContainer: dragCalendarsContainer(elementName, elementName2),
    focusCalendarsContainer: focusCalendarsContainer(elementName),
  };
};
