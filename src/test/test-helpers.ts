import { AppDatepicker } from '../app-datepicker';
import { AppDatepickerDialog } from '../app-datepicker-dialog';

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

export interface OptionsDragTo {
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

export const getinnerHTML =
  (target: HTMLElement) =>
    target && target.innerHTML && stripExpressionDelimiters(target.innerHTML!);

export const getOuterHTML =
  (target: HTMLElement) =>
    target && target.outerHTML && stripExpressionDelimiters(target.outerHTML!);

export const getComputedStylePropertyValue =
  (target: HTMLElement, property: string) =>
    getComputedStyle && getComputedStyle(target)[property as any];

export interface KeyboardEventOptions extends KeyboardEventInit {
  keyCode: number;
}
export function triggerEvent(
  n: HTMLElement,
  eventName: string,
  options?: PointerEvent | KeyboardEventOptions
) {
  const c = new CustomEvent(eventName, {
    composed: true,
    bubbles: true,
    ...options,
  });

  Object.keys(options || {}).forEach((o) => {
    Object.defineProperty(c, o, { value: (options as any)[o] });
  });

  n.dispatchEvent(c);
}

const simulateInputEvent =
  (n: HTMLElement, eventName: string, options?: PointerEvent) => {
    /**
     * NOTE: For all MS Edge < 16, `PointerEvent` has a bug where `pageX` is always < 10 and it can
     * neither be overridable nor configurable unlike other browsers. However, it works perfectly
     * well with real user gestures.
     *
     * To tackle such weird situation, `MouseEvent` will be used instead for all MS Edges as well as
     * IE11.
     */
    const isPointerEvent = /^pointer/i.test(eventName) &&
      !('MSPointerEvent' in window) &&
      !('MSGestureEvent' in window);
    const otherOptions = {
      /** NOTE: Making sure all events triggered bubbles and propagates across shadow boundary. */
      bubbles: true,
      ...options,
    };
    /**
     * NOTE: `otherOptions` might contain the following properties for a typical CustomEvent:
     *
     *   1. `bubbles`
     *   2. `cancelable`
     *   3. `composed`
     *   4. `detail`
     *
     * In IE11, `new PointerEvent(...)` is not prohibited in script or dev tools. In script, all
     * events except `PointerEvent` can be instantiated.
     *
     * Here, it accidentally becomes a working implementation: `new MouseEvent('pointerdown', ...)`,
     * which sounds ridiculous at first, but so far this is by far the _only_ way to trigger
     * animations when dragging/ swiping the calendar. `Event` and `CustomEvent` will skip running
     * the animations which is a good thing but worth to be documented here for future reference.
     */
    const ev = isPointerEvent ?
      new PointerEvent(eventName, otherOptions) :
      new MouseEvent(eventName, otherOptions);

    n.dispatchEvent(ev);
  };

export const dragTo =
  async (target: HTMLElement, { x, y, dx, dy, step, delay }: OptionsDragTo) => {
    const hasNativePointerEvent = 'PointerEvent' in window;
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

    try {
      const eachStep = step == null || step < 0 ? 20 : step;
      const eachDelay = delay == null || delay < 0 ? 8 : delay;
      const hasDx = typeof dx === 'number' && isFinite(dx) && dx !== 0;
      const hasDy = typeof dy === 'number' && isFinite(dy) && dy !== 0;

      if (!hasDx && !hasDy) {
        throw new TypeError(`Expected 'dx' or 'dy', but found none.`);
      }

      const rx = Math.round(x || 0);
      const ry = Math.round(y || 0);

      simulateInputEvent(
        target,
        hasNativePointerEvent ? 'pointerdown' : 'mousedown',
        toPointerEventOptions(rx, ry));

      const dd = hasDx && hasDy ? Math.max(dx!, dy!) : (hasDx ? dx! : dy!);
      const inc = Math.abs(dd / eachStep);
      const factor = dd < 0 ? -1 : 1;

      for (let i = 0; i < eachStep; i += inc) {
        const ni = i * inc * factor;
        const nx = Math.floor(x + (hasDx ? ni : 0));
        const ny = Math.floor(y + (hasDy ? ni : 0));

        simulateInputEvent(
          target,
          hasNativePointerEvent ? 'pointermove' : 'mousemove',
          toPointerEventOptions(nx, ny));
        await new Promise(yay => requestAnimationFrame(yay));
      }

      const tx = Math.floor(x + (hasDx ? dx! : 0));
      const ty = Math.floor(y + (hasDy ? dy! : 0));

      simulateInputEvent(
        target,
        hasNativePointerEvent ? 'pointerup' : 'mouseup',
        toPointerEventOptions(tx, ty));

      return Promise.resolve({
        done: true,
        value: {
          x: tx,
          y: ty,
          step: eachStep,
          delay: eachDelay,
        },
      });
    } catch (e) {
      throw e;
    }
  };

export const selectNewYearFromYearListView =
  (n: AppDatepicker, y: string) => {
    const allSelectableYearItems = shadowQueryAll<AppDatepicker, HTMLButtonElement>(
      n,
      '.year-list-view__list-item:not(.year--selected)');
    const matched =
      allSelectableYearItems.find(o => y === getShadowInnerHTML(o.querySelector('div')!));

    triggerEvent(matched!, 'click');
  };

type DragDirection = 'left' | 'right';
export const setupDragPoint = (direction: DragDirection, el: HTMLElement) => {
  const datepickerRect = el.getBoundingClientRect();
  const calendarRect = shadowQuery(el, '.calendar-view__full-calendar').getBoundingClientRect();

  const lFactor = 'left' === direction ? .78 : .22;
  const left = datepickerRect.left + (datepickerRect.width * lFactor);
  const top = calendarRect.top + (calendarRect.height * .22);

  return { x: left, y: top };
};

export const shadowQuery =
  <T extends HTMLElement, U extends HTMLElement>(target: T, selector: string) =>
    target.shadowRoot!.querySelector<U>(selector)!;
export const shadowQueryAll =
  <T extends HTMLElement, U extends HTMLElement>(target: T, selector: string) =>
    Array.from(target.shadowRoot!.querySelectorAll<U>(selector))!;

export const getShadowInnerHTML = (target: HTMLElement) => {
  const root = (target.shadowRoot || target);
  return root.innerHTML && stripExpressionDelimiters(root.innerHTML!);
};
export const queryInit = <T extends AppDatepicker | AppDatepickerDialog>(
  el: T
) => {
  const elem = ('APP-DATEPICKER-DIALOG' === el.tagName ?
    shadowQuery(el, AppDatepicker.is) : el) as AppDatepicker;

  const getSelectableDate = <U extends HTMLElement>(label: string) =>
    shadowQuery<typeof elem, U>(
      elem, `.calendar-container:nth-of-type(2) .full-calendar__day[aria-label="${label}"]`);

  const getAllDisabledDates = <U extends HTMLElement>() =>
    shadowQueryAll<typeof elem, U>(
      elem, '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled');

  const getFocusedDate = <U extends HTMLElement>() =>
    shadowQuery<typeof elem, U>(
      elem, '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');

  const getBtnNextMonthSelector = () =>
    shadowQuery(elem, '.btn__month-selector[aria-label="Next month"]');

  const getBtnPrevMonthSelector = () =>
    shadowQuery(elem, '.btn__month-selector[aria-label="Previous month"]');

  const getBtnYearSelector = () => shadowQuery(elem, '.btn__year-selector');

  const getBtnCalendarSelector = () => shadowQuery(elem, '.btn__calendar-selector');

  const getCalendarLabel = () =>
    shadowQuery(elem, '.calendar-container:nth-of-type(2) .calendar-label');

  const getYearListViewFullList = () =>
    shadowQuery(elem, '.year-list-view__full-list');

  const getYearListViewListItemYearSelected = () =>
    shadowQuery(elem, '.year-list-view__list-item.year--selected > div');

  const getDatepickerBodyCalendarView = () =>
    shadowQuery(elem, '.datepicker-body__calendar-view[tabindex="0"]');

  const getDatepickerBodyCalendarViewDayFocused = () =>
    shadowQuery(elem, '.calendar-container:nth-of-type(2)')
      .querySelector<HTMLElement>('.full-calendar__day:not(.day--disabled).day--focused > div');

  const waitForDragAnimationFinished = () => new Promise(yay =>
    requestAnimationFrame(() => setTimeout(() => yay(elem.updateComplete), 1e3)))

  return {
    elem,
    getSelectableDate,
    getAllDisabledDates,
    getFocusedDate,
    getBtnNextMonthSelector,
    getBtnPrevMonthSelector,
    getBtnYearSelector,
    getBtnCalendarSelector,
    getCalendarLabel,
    getYearListViewFullList,
    getYearListViewListItemYearSelected,
    getDatepickerBodyCalendarView,
    getDatepickerBodyCalendarViewDayFocused,

    waitForDragAnimationFinished,
  };
};
