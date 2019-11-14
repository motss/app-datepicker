import { FocusTrap, KEYCODES_MAP } from '../custom_typings.js';
import { findShadowTarget } from './find-shadow-target.js';

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
      return;
    }

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
  };
  const disconnectCallback = () => {
    target.removeEventListener('keydown', keydownCallback);
  };

  target.addEventListener('keydown', keydownCallback);

  return { disconnect: disconnectCallback };
}
