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

const supportsPassive = (() => {
  let supportsPassiveFlag = false;

  try {
    const noop = () => void 0;
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        supportsPassiveFlag = true;
      },
    });
    window.addEventListener('testPassive' as any, noop, opts);
    window.removeEventListener('testPassive' as any, noop, opts);

    return supportsPassiveFlag;
  } catch (_) {
    return supportsPassiveFlag;
  }
})();

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
    supportsPassive ? { passive: true } : false
  );
}

export class Tracker {
  private _startPointer: ResolvedPointer | null = null;
  // private _started: boolean = false;
  private readonly _down: PointerHandler['handler'];
  private readonly _move: PointerHandler['handler'];
  private readonly _up: PointerHandler['handler'];

  constructor(private _element: HTMLElement, handlers: TrackerHandlers) {
    const { down, move, up } = handlers;

    this._down = this._onDown(down);
    this._move = this._onMove(move);
    this._up = this._onUp(up);

    if (_element && _element.addEventListener) {
      _element.addEventListener('mousedown', this._down);

      addPassiveEventListener(_element, 'touchstart', this._down);
      addPassiveEventListener(_element, 'touchmove', this._move);
      addPassiveEventListener(_element, 'touchend', this._up);
    }
  }

  public disconnect() {
    const rootEl = this._element;

    if (rootEl && rootEl.removeEventListener) {
      rootEl.removeEventListener('mousedown', this._down);
      rootEl.removeEventListener('touchstart', this._down);
      rootEl.removeEventListener('touchmove', this._move);
      rootEl.removeEventListener('touchend', this._up);
    }
  }

  private _onDown(down: TrackerHandlers['down']) {
    return (ev: PointerType) => {
      if (ev instanceof MouseEvent) {
        this._element.addEventListener('mousemove', this._move);
        this._element.addEventListener('mouseup', this._up);
      }

      const { newPointer } = getFirstTouch(this._startPointer, ev);

      down(newPointer, ev);
      this._startPointer = newPointer;
    };
  }

  private _onMove(move: TrackerHandlers['move']) {
    return (ev: PointerType) => {
      this._updatePointers(move, ev);
    };
  }

  private _onUp(up: TrackerHandlers['up']) {
    return (ev: PointerType) => {
      this._updatePointers(up, ev, true);
    };
  }

  private _updatePointers(cb: (...args: any[]) => void, ev: PointerType, shouldReset?: boolean) {
    if (shouldReset && ev instanceof MouseEvent) {
      this._element.removeEventListener('mousemove', this._move);
      this._element.removeEventListener('mouseup', this._up);
    }

    const { newPointer, oldPointer } = getFirstTouch(this._startPointer, ev);

    cb(newPointer, oldPointer, ev);

    this._startPointer = shouldReset ? null : newPointer;
  }
}
