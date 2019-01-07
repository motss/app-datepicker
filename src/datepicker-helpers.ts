export interface FocusTrap {
  disconnect: () => void;
}
type AnyEventType = CustomEvent | KeyboardEvent | MouseEvent | PointerEvent;

export const KEYCODES_MAP = {
  // CTRL: 17,
  // ALT: 18,
  ESCAPE: 27,
  SHIFT: 16,
  TAB: 9,
  ENTER: 13,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
};

export function getResolvedTodayDate() {
  const dateDate = new Date();
  const fy = dateDate.getUTCFullYear();
  const m = dateDate.getUTCMonth();
  const d = dateDate.getUTCDate();

  return new Date(Date.UTC(fy, m, d));
}

export function getResolvedLocale() {
  return (Intl
    && Intl.DateTimeFormat
    && Intl.DateTimeFormat().resolvedOptions
    && Intl.DateTimeFormat().resolvedOptions().locale)
    || 'en-US';
}

export function computeThreeCalendarsInARow(selectedDate: Date) {
  const dateDate = new Date(selectedDate);
  const fy = dateDate.getUTCFullYear();
  const m = dateDate.getUTCMonth();
  const d = dateDate.getUTCDate();

  return [
    new Date(Date.UTC(fy, m - 1, d)),
    dateDate,
    new Date(Date.UTC(fy, m + 1, d)),
  ];
}

export function toFormattedDateString(date: Date) {
  return date.toJSON().replace(/^(.+)T.+/i, '$1');
}

export function computeNewFocusedDateWithKeyboard({
  min,
  max,
  selectedDate,
  fy,
  m,
  d,
  isMonthYearUpdate,
}) {
  let newFocusedDate = new Date(Date.UTC(fy, m, d));
  let dayInNewFocusedDate = newFocusedDate.getUTCDate();

  /**
   * NOTE: Check if new focused date exists in that new month. e.g. Feb 30. This should fallback to
   * last day of the month (Feb), that is, Feb 28. Then if Feb 28 happens to fall in the disabled
   * date range, the next step can take care of that.
   */
  if (isMonthYearUpdate && d !== dayInNewFocusedDate) {
    const newAdjustedDate = new Date(Date.UTC(fy, m + 1, 0));

    dayInNewFocusedDate = newAdjustedDate.getUTCDate();
    newFocusedDate = newAdjustedDate;
  }

  /**
   * NOTE: Clipping new focused date to `min` or `max` when it falls into the range of disabled
   * dates.
   */
  const isLessThanMin = +newFocusedDate < +min;
  const isMoreThanMax = +newFocusedDate > +max;
  if (isLessThanMin || isMoreThanMax) {
    /** Set to `min` date */
    if (isLessThanMin) {
      return { shouldUpdateDate: false, date: min };
    }

    /** Set to `max` date */
    if (isMoreThanMax) {
      return { shouldUpdateDate: false, date: max };
    }

    /** FIXME: Then when this happen? */
    return { shouldUpdateDate: false, date: null };
  }

  const shouldUpdateDate = newFocusedDate.getUTCMonth() !== selectedDate.getUTCMonth()
    || newFocusedDate.getUTCFullYear() !== selectedDate.getUTCFullYear();

  return { shouldUpdateDate, date: newFocusedDate };
}

export function findShadowTarget(ev: AnyEventType, callback: (n: HTMLElement) => boolean) {
  return ev.composedPath().find((n: HTMLElement) => {
    if (n instanceof HTMLElement) return callback(n);
    return false;
  });
}

export function dispatchCustomEvent<T = CustomEvent['defaultPrevented']>(
  target: HTMLElement,
  eventName: string,
  detail: T
) {
  return target.dispatchEvent(new CustomEvent(eventName, {
    detail,
    bubbles: true,
    composed: true,
  }));
}

export function setFocusTrap(
  target: HTMLElement,
  focusableElements: HTMLElement[]
): FocusTrap | null {
  if (target == null || focusableElements == null) return null;

  const [firstEl, lastEl] = focusableElements;
  const keydownCallback = (ev: KeyboardEvent) => {
    const isTabKey = ev.keyCode === KEYCODES_MAP.TAB;
    const isShiftTabKey = ev.shiftKey && isTabKey;

    if (!isTabKey && !isShiftTabKey) return;

    // const focusedTarget = ev.target as HTMLElement;
    const isFocusingLastEl = findShadowTarget(ev, n => n.isEqualNode(lastEl)) != null;

    if (isFocusingLastEl && !isShiftTabKey) {
      ev.preventDefault();
      ev.stopImmediatePropagation();

      // focusedTarget.blur();
      firstEl.focus();
    } else {
      const isFocusingFirstEl = findShadowTarget(ev, n => n.isEqualNode(firstEl)) != null;

      if (isFocusingFirstEl && isShiftTabKey) {
        ev.preventDefault();
        ev.stopImmediatePropagation();

        // focusedTarget.blur();
        /**
         * NOTE: `.focus()` native `<button>` element inside `<MwcButton>`
         */
        lastEl.shadowRoot!.querySelector('button')!.focus();
      }
    }
  };
  const disconnectCallback = () => {
    target.removeEventListener('keydown', keydownCallback);
  };

  target.addEventListener('keydown', keydownCallback);

  return { disconnect: disconnectCallback };
}
