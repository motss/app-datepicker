import { supportsPassiveEventListener } from '@material/mwc-base/utils.js';

import type { FirstTouch, PointerHandler, PointerType, ResolvedPointer, SupportedEventKey, TrackerHandlers } from './typings.js';

function toPointer(ev: PointerType): ResolvedPointer {
  const { clientX, clientY, pageX, pageY } = ev as PointerEvent;
  /**
   * NOTE: For MS Edge < 16, `PointerEvents` triggered by unit tests always fail to set defined
   * `pageX` and `pageY`. Those values are overridden by the browser but the values are incorrect as
   * they are less than 10.
   *
   * Therefore, we are finding the max values between `pageX` and `clientX`. Perhaps `client*`
   * properties can be used instead. For code safety during typical situation/ testing, this seems
   * like the best of both worlds.
   */
  const x = Math.max(pageX, clientX);
  const y = Math.max(pageY, clientY);
  const id = (ev as TouchInit).identifier || (ev as PointerEvent).pointerId;

  return { id: id ?? 0, x, y };
}

function getFirstTouch(oldPointer: ResolvedPointer | null, ev: PointerType): FirstTouch {
  const changedTouches = (ev as TouchEvent).changedTouches;

  if (changedTouches == null) return { newPointer: toPointer(ev), oldPointer };

  const touches = Array.from(changedTouches, n => toPointer(n));
  const newPointer = touches.find(n => n.id === oldPointer?.id) ?? touches[0];

  return { newPointer, oldPointer };
}

function addPassiveEventListener<T extends Extract<keyof HTMLElementEventMap, SupportedEventKey>>(
  node: HTMLElement,
  event: T,
  callback: PointerHandler
): void {
  node.addEventListener<T>(
    event,
    callback,
    supportsPassiveEventListener ? { passive: true } : false
  );
}

export class SwipeTracker {
  #element: HTMLElement;
  #move: PointerHandler;
  #up: PointerHandler;
  #startPointer: ResolvedPointer | null = null;

  public disconnect: () => void;

  public constructor(element: HTMLElement, handlers: TrackerHandlers) {
    const { down, move, up } = handlers;
    const onDown = this._updatePointers('down', down);
    const onMove = this._updatePointers('move', move);
    const onUp = this._updatePointers('up', up);

    if (element?.addEventListener) {
      element.addEventListener('mousedown', onDown);

      addPassiveEventListener(element, 'touchstart', onDown);
      addPassiveEventListener(element, 'touchmove', onMove);
      addPassiveEventListener(element, 'touchend', onUp);
    }

    this.#element = element;
    this.#move = onMove
    this.#up = onUp;
    this.disconnect = (): void => {
      if (element?.removeEventListener) {
        element.removeEventListener('mousedown', onDown);
        element.removeEventListener('touchstart', onDown);
        element.removeEventListener('touchmove', onMove);
        element.removeEventListener('touchend', onUp);
      }

    };
  }

  private _updatePointers(
    type: keyof TrackerHandlers,
    cb: TrackerHandlers['down'] | TrackerHandlers['move'] | TrackerHandlers['up']
  ): PointerHandler {
    const element = this.#element;
    const isDown = type === 'down';
    const isUp = type === 'up';
    const move = this.#move;
    const up = this.#up;

    return (ev) => {
      const { newPointer, oldPointer } = getFirstTouch(this.#startPointer, ev);

      if (isDown) {
        if (ev instanceof MouseEvent) {
          element.addEventListener('mousemove', move);
          element.addEventListener('mouseup', up);
          element.addEventListener('mouseleave', up);
        }

        (cb as TrackerHandlers['down'])(newPointer, ev);
      } else {
        if (isUp) {
          if (ev instanceof MouseEvent) {
            element.removeEventListener('mousemove', move);
            element.removeEventListener('mouseup', up);
            element.removeEventListener('mouseleave', up);
          }
        }

        (cb as TrackerHandlers['move'])(newPointer, oldPointer, ev);
      }

      this.#startPointer = isUp ? null : newPointer;
    };
  }
}
