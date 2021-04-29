import { supportsPassiveEventListener } from '@material/mwc-base/utils.js';

type PointerType = MouseEvent | TouchEvent | PointerEvent | TouchInit;
interface ResolvedPointer {
  x: PointerEvent['pageX'];
  y: PointerEvent['pageY'];
  id: PointerEvent['pageY'] | Touch['identifier'];
}
interface FirstTouch {
  newPointer: ResolvedPointer;
  oldPointer: ResolvedPointer | null;
}
interface PointerHandler {
  handler(ev: PointerType): void;
}
export interface TrackerHandlers {
  down(startPointer: ResolvedPointer, ev: PointerType): void;
  move(startPointer: ResolvedPointer, oldPointer: ResolvedPointer, ev: PointerType): void;
  up(startPointer: ResolvedPointer, oldPointer: ResolvedPointer, ev: PointerType): void;
}

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

  return { x, y, id: id == null ? 0 : id };
}

function getFirstTouch(startPointer: ResolvedPointer | null, ev: PointerType): FirstTouch {
  const changedTouches = (ev as TouchEvent).changedTouches;

  if (changedTouches == null) return { newPointer: toPointer(ev), oldPointer: startPointer };

  const touches = Array.from(changedTouches, n => toPointer(n));
  const newPointer = startPointer == null
    ? touches[0]
    : touches.find(n => n.id === startPointer.id)!;

  return { newPointer, oldPointer: startPointer };
}

function addPassiveEventListener(
  node: HTMLElement,
  event: string,
  callback: unknown
): void {
  node.addEventListener(
    event,
    callback as EventListenerOrEventListenerObject,
    supportsPassiveEventListener ? { passive: true } : false
  );
}

export class Tracker {
  public disconnect: () => void;

  private _startPointer: ResolvedPointer | null = null;
  private readonly _move: PointerHandler['handler'];
  private readonly _up: PointerHandler['handler'];

  constructor(private _element: HTMLElement, handlers: TrackerHandlers) {
    const { down, move, up } = handlers;

    const _down = this._updatePointers('down', down);
    this._move = this._updatePointers('move', move);
    this._up = this._updatePointers('up', up);
    this.disconnect = () => {
      if (_element && _element.removeEventListener) {
        _element.removeEventListener('mousedown', _down);
        _element.removeEventListener('touchstart', _down);
        _element.removeEventListener('touchmove', this._move);
        _element.removeEventListener('touchend', this._up);
      }
    };

    if (_element && _element.addEventListener) {
      _element.addEventListener('mousedown', _down);

      addPassiveEventListener(_element, 'touchstart', _down);
      addPassiveEventListener(_element, 'touchmove', this._move);
      addPassiveEventListener(_element, 'touchend', this._up);
    }
  }

  private _updatePointers(
    type: keyof TrackerHandlers,
    cb: TrackerHandlers['down'] | TrackerHandlers['move'] | TrackerHandlers['up']
  ) {
    const element = this._element;

    return (ev: PointerType) => {
      const isUp = type === 'up';
      const startPointer = this._startPointer;
      const { newPointer, oldPointer } = getFirstTouch(startPointer, ev);

      if (type === 'down') {
        if (ev instanceof MouseEvent) {
          element.addEventListener('mousemove', this._move);
          element.addEventListener('mouseup', this._up);
          element.addEventListener('mouseleave', this._up);
        }

        (cb as TrackerHandlers['down'])(newPointer, ev);
      } else {
        if (isUp && ev instanceof MouseEvent) {
          element.removeEventListener('mousemove', this._move);
          element.removeEventListener('mouseup', this._up);
          element.removeEventListener('mouseleave', this._up);
        }

        (cb as TrackerHandlers['up'])(newPointer, oldPointer as ResolvedPointer, ev);
      }

      this._startPointer = isUp ? null : newPointer;
    };
  }
}
