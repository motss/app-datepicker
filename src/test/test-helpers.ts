import { Button } from '@material/mwc-button';

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

export const getComputedStyleValue = (element: Element, property: string) => window.ShadyCSS ?
  window.ShadyCSS!.getComputedStyleValue(element, property) :
  getComputedStyle(element).getPropertyValue(property);

export const getOuterHTML = (target: HTMLElement) =>
  target && target.outerHTML && stripExpressionDelimiters(target.outerHTML!);

export const getComputedStylePropertyValue = (target: HTMLElement, property: string) =>
  getComputedStyle && getComputedStyle(target)[property as any];

export interface KeyboardEventOptions extends KeyboardEventInit {
  keyCode: number;
}
export function triggerEvent<T extends HTMLElement>(
  n: T,
  eventName: string,
  options?: PointerEvent | KeyboardEventOptions
) {
  /** Reference about creating and triggering events: https://mzl.la/1APSl8U */
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
export const setupDragPoint = (direction: DragDirection, el: AppDatepicker) => {
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

export const forceUpdate = async (el: AppDatepicker|AppDatepickerDialog) => {
  await el.updateComplete;
  /**
   * FIXME(motss): Workaround to ensure child custom elements renders complete.
   * Related bug issue at `Polymer/lit-element#594`.
   */
  return el.requestUpdate();
};
// const waitForNextRender = (target: AppDatepicker, waitFor?: number) => {
//   // const numWaitFor = null == waitFor ? ('mediaDevices' in navigator ? 1e3 : 5e3) : +waitFor;
//   const numWaitFor = waitFor || 5e3;
//   return new Promise(yay =>
//     requestAnimationFrame(() => setTimeout(() => yay(target.requestUpdate()), numWaitFor)));
// };

export const queryInit = <T extends AppDatepicker | AppDatepickerDialog>(el: T) => {
  const isDatepickerDialog = 'APP-DATEPICKER-DIALOG' === el.tagName;
  const elem = (isDatepickerDialog ? shadowQuery(el, AppDatepicker.is) : el) as AppDatepicker;

  const getAllDisabledDates = () =>
    shadowQueryAll<typeof elem, HTMLTableCellElement>(
      elem, '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled');

  const getAllCalendarDays = () =>
    shadowQueryAll<typeof elem, HTMLTableCellElement>(
      elem, '.calendar-container:nth-of-type(2) .full-calendar__day');

  const getAllWeekdays = () =>
  shadowQueryAll<typeof elem, HTMLTableCellElement>(
    elem, '.calendar-container:nth-of-type(2) .calendar-weekdays > th');

  const getAllCalendarTables = () => shadowQueryAll<typeof elem, HTMLTableElement>(
    elem, '.calendar-table');

  const getAllYearListViewListItems = () => shadowQueryAll<typeof elem, HTMLButtonElement>(
    elem, '.year-list-view__list-item');

  const getBtnNextMonthSelector = () =>
    shadowQuery<typeof elem, HTMLButtonElement>(
      elem, '.btn__month-selector[aria-label="Next month"]');

  const getBtnPrevMonthSelector = () =>
    shadowQuery<typeof elem, HTMLButtonElement>(
      elem, '.btn__month-selector[aria-label="Previous month"]');

  const getBtnYearSelector = () =>
    shadowQuery<typeof elem, HTMLButtonElement>(elem, '.btn__year-selector');

  const getBtnCalendarSelector = () =>
    shadowQuery<typeof elem, HTMLButtonElement>(elem, '.btn__calendar-selector');

  const getWeekLabel = () =>
    shadowQuery<typeof elem, HTMLTableCellElement>(elem, 'th[aria-label="Week"]');
  const getCalendarLabel = () =>
    shadowQuery(elem, '.calendar-container:nth-of-type(2) .calendar-label');

  const getFirstWeekdayLabel = <U extends HTMLTableCellElement>() =>
    shadowQuery<typeof elem, U>(elem, '.calendar-container:nth-of-type(2) .weekday-label');

  const getSelectableDate = (label: string) =>
    shadowQuery<typeof elem, HTMLTableCellElement>(
      elem, `.calendar-container:nth-of-type(2) .full-calendar__day[aria-label="${label}"]`);

  const getTodayDay = () => shadowQuery<typeof elem, HTMLTableCellElement>(elem, '.day--today');

  const getHighlightedDayDiv = () =>
    shadowQuery<typeof elem, HTMLDivElement>(
      elem,
      '.calendar-container:nth-of-type(2) .day--today.day--focused > .calendar-day');

  const getYearListViewFullList = () =>
    shadowQuery(elem, '.year-list-view__full-list');

  const getYearListViewListItemYearSelected = () =>
    shadowQuery<typeof elem, HTMLButtonElement>(
      elem, '.year-list-view__list-item.year--selected');

  const getYearListViewListItemYearSelectedDiv = () =>
    shadowQuery<typeof elem, HTMLDivElement>(
      elem, '.year-list-view__list-item.year--selected > div');

  const getCalendarViewFullCalendar = () =>
    shadowQuery<typeof elem, HTMLDivElement>(elem, '.calendar-view__full-calendar');

  const getDatepickerBodyCalendarView = () =>
    shadowQuery(elem, '.datepicker-body__calendar-view[tabindex="0"]');

  const getDatepickerBodyYearListView = () =>
    shadowQuery(elem, '.datepicker-body__year-list-view');

  const getDatepickerBodyCalendarViewDay = (label?: string) =>
    shadowQuery(elem, '.calendar-container:nth-of-type(2)')
      .querySelector<HTMLTableCellElement>(
        `.full-calendar__day:not(.day--disabled)${
          !label ? '' : `[aria-label="${label}"]`}`);

  const getDatepickerBodyCalendarViewDayDiv = (label?: string) =>
    shadowQuery(elem, '.calendar-container:nth-of-type(2)')
      .querySelector<HTMLTableCellElement>(
        `.full-calendar__day:not(.day--disabled)${
          !label ? '' : `[aria-label="${label}"]`} > div`);

  const getDatepickerBodyCalendarViewDayFocused = (label?: string) =>
    shadowQuery(elem, '.calendar-container:nth-of-type(2)')
      .querySelector<HTMLTableCellElement>(
        `.full-calendar__day:not(.day--disabled)${
          !label ? '' : `[aria-label="${label}"]`}.day--focused`);

  const getDatepickerBodyCalendarViewDayFocusedDiv = (label?: string) =>
    shadowQuery(elem, '.calendar-container:nth-of-type(2)')
      .querySelector<HTMLTableCellElement>(
        `.full-calendar__day:not(.day--disabled)${
          !label ? '' : `[aria-label="${label}"]`}.day--focused > div`);

  const getDialogScrim = () =>
    shadowQuery<typeof el, HTMLDivElement>(el, '.scrim');

  const getDialogActionsContainer = () =>
    shadowQuery<typeof el, HTMLDivElement>(el, '.actions-container');

  const getDialogActionButtons = () =>
    shadowQueryAll<typeof el, Button>(el, '.actions-container > mwc-button');

  const getDialogConfirmActionButton = () =>
    shadowQuery<typeof el, Button>(el, '.actions-container > mwc-button[dialog-confirm]');

  const getDialogDismissActionButton = () =>
    shadowQuery<typeof el, Button>(el, '.actions-container > mwc-button[dialog-dismiss]');

  return {
    elem,

    getAllDisabledDates,
    getAllCalendarDays,
    getAllWeekdays,
    getAllCalendarTables,
    getAllYearListViewListItems,

    getBtnNextMonthSelector,
    getBtnPrevMonthSelector,
    getBtnYearSelector,
    getBtnCalendarSelector,

    getWeekLabel,
    getCalendarLabel,
    getFirstWeekdayLabel,

    getSelectableDate,
    getTodayDay,
    getHighlightedDayDiv,

    getYearListViewFullList,
    getYearListViewListItemYearSelected,
    getYearListViewListItemYearSelectedDiv,

    getCalendarViewFullCalendar,

    getDatepickerBodyCalendarView,
    getDatepickerBodyYearListView,
    getDatepickerBodyCalendarViewDay,
    getDatepickerBodyCalendarViewDayDiv,
    getDatepickerBodyCalendarViewDayFocused,
    getDatepickerBodyCalendarViewDayFocusedDiv,

    getDialogScrim,
    getDialogActionsContainer,
    getDialogActionButtons,
    getDialogConfirmActionButton,
    getDialogDismissActionButton,

    waitForDragAnimationFinished: async () => new Promise((yay, nah) => {
      setTimeout(() => nah('datepicker animation takes too long to finish'), 10e3);

      const animationFinished = () => {
        yay(elem.requestUpdate());
        elem.removeEventListener('datepicker-animation-finished', animationFinished);
      };

      elem.addEventListener('datepicker-animation-finished', animationFinished);
    }),
    // waitForNextRender(elem, waitFor),
  };
};

export const getTestName = (name: string) => `${name}${new URL(window.location.href).search}`;
