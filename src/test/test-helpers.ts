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

export const dispatchPointerEvent =
  (n: HTMLElement, eventName: string, options: PointerEvent) => {
    const {
      clientX,
      clientY,
      pageX,
      pageY,
      detail = {} as CustomEventInit,
    } = options || {} as PointerEvent;
    const ev = new CustomEvent(eventName, detail as CustomEventInit);

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
    const hasDx = typeof dx === 'number' && Number.isFinite(dx);
    const hasDy = typeof dy === 'number' && Number.isFinite(dy);

    if (!hasDx && !hasDy) {
      throw new TypeError(`Expected 'dx' or 'dy', but found none.`);
    }

    dispatchPointerEvent(
      target,
      'pointerdown',
      { clientX: x, pageX: x, clientY: y, pageY: y } as PointerEvent);

    const dd = hasDx && hasDy ? (hasDx ? dx! : dy!) : Math.max(dx!, dy!);
    const len = Math.ceil(dd / eachStep);

    for (let i = 0, ni = dd * i; i < len; i += 1) {
      const nx = x + (hasDx ? ni : 0);
      const ny = y + (hasDy ? ni : 0);
      const eventOptions = {
        clientX: nx,
        clientY: ny,
        pageX: nx,
        pageY: ny,
      } as PointerEvent;

      dispatchPointerEvent(target, 'pointermove', eventOptions);

      await new Promise(yay => setTimeout(yay, eachDelay));
    }

    const tx = x + (hasDx ? dx! : 0);
    const ty = y + (hasDy ? dy! : 0);
    dispatchPointerEvent(
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
        totalRun: len,
      },
    });
  };
