interface ShadyCSS {
  nativeCss: boolean;
  nativeShadow: boolean;
  styleElement(host: Element, overrideProps?: {[key: string]: string}): void;
  prepareTemplateDom(template: Element, elementName: string): void;
  prepareTemplateStyles(
      template: Element, elementName: string, typeExtension?: string): void;
  getComputedStyleValue(template: Element, property: string): void;
}

interface ShadyDOM {
  inUse: boolean;
}

interface OptionsDragTo {
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  step?: number;
  delay?: number;
}

declare global {
  interface Window {
    ShadyCSS?: ShadyCSS;
    ShadyDOM?: ShadyDOM;
    ShadowRoot: new() => ShadowRoot;
  }
}

/** Allows code to check `instanceof ShadowRoot`. */
declare type ShadowRootConstructor = new() => ShadowRoot;
export declare const ShadowRoot: ShadowRootConstructor;

export const stripExpressionDelimiters = (html: string) => html.replace(/<!---->/g, '');

export const nextFrame = () => new Promise(yay => requestAnimationFrame(yay));

export const getComputedStyleValue = (element: Element, property: string) =>
  window.ShadyCSS
    ? window.ShadyCSS!.getComputedStyleValue(element, property)
  : getComputedStyle(element).getPropertyValue(property);

export const shadowQuery =
  (target: Element | HTMLElement, selector: string) =>
    target.shadowRoot!.querySelector<HTMLElement>(selector)!;

export const shadowQueryAll =
  (target: Element | HTMLElement, selector: string) =>
    Array.from(target.shadowRoot!.querySelectorAll<HTMLElement>(selector))!;

export const getShadowInnerHTML = (target: Element | HTMLElement) => {
  const root = (target.shadowRoot || target);
  return root.innerHTML && stripExpressionDelimiters(root.innerHTML!);
};

export const getOuterHTML =
  (target: Element | HTMLElement) =>
    target && target.outerHTML && stripExpressionDelimiters(target.outerHTML!);

export const getComputedStylePropertyValue =
  (target: Element | HTMLElement, property: string) =>
    getComputedStyle && getComputedStyle(target)[property as any];

export const dispatchEvent =
  (n: HTMLElement, eventName: string, options: PointerEvent) => {
    const { clientX, clientY, pageX, pageY, ...otherOptions } = options || {} as PointerEvent;
    /**
     * NOTE: `otherOptions` might contain the following properties for a typical CustomEvent:
     *
     *   1. `bubbles`
     *   2. `cancelable`
     *   3. `composed`
     *   4. `detail`
     */
    const ev = new CustomEvent(eventName, otherOptions);

    (ev as any).clientX = clientX;
    (ev as any).clientY = clientY;

    (ev as any).pageX = pageX;
    (ev as any).pageY = pageY;

    n.dispatchEvent(ev);
  };

export const dragTo =
  async (target: HTMLElement, { x, y, dx, dy, step, delay }: OptionsDragTo) => {
    const eachStep = step == null || step < 0 ? 20 : step;
    const eachDelay = delay == null || delay < 0 ? 8 : delay;
    const hasDx = typeof dx === 'number' && Number.isFinite(dx) && dx !== 0;
    const hasDy = typeof dy === 'number' && Number.isFinite(dy) && dy !== 0;

    if (!hasDx && !hasDy) {
      throw new TypeError(`Expected 'dx' or 'dy', but found none.`);
    }

    dispatchEvent(
      target,
      'pointerdown',
      { clientX: x, pageX: x, clientY: y, pageY: y } as PointerEvent);

    const dd = hasDx && hasDy ? Math.max(dx!, dy!) : (hasDx ? dx! : dy!);
    const inc = Math.abs(dd / eachStep);
    const isNeg = dd < 0;

    for (let i = 0; i < eachStep; i += inc) {
      const ni = i * inc * (isNeg ? -1 : 1);
      const nx = x + (hasDx ? ni : 0);
      const ny = y + (hasDy ? ni : 0);
      const eventOptions = { clientX: nx, clientY: ny, pageX: nx, pageY: ny } as PointerEvent;

      dispatchEvent(target, 'pointermove', eventOptions);
      await new Promise(yay => requestAnimationFrame(yay));
    }

    const tx = x + (hasDx ? dx! : 0);
    const ty = y + (hasDy ? dy! : 0);

    dispatchEvent(
      target,
      'pointerup',
      { clientX: tx, pageX: tx, clientY: ty, pageY: ty } as PointerEvent);

    return Promise.resolve({
      done: true,
      value: {
        x: tx,
        y: ty,
        step: eachStep,
        delay: eachDelay,
      },
    });
  };
