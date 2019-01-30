type PointerType = MouseEvent | TouchEvent | PointerEvent;
interface ResolvedPointer {
  x: PointerEvent['pageX'];
  y: PointerEvent['pageY'];
  id: PointerEvent['pageY'] | Touch['identifier'];
}
interface FirstTouch {
  newPointer: ResolvedPointer;
  oldPointer: ResolvedPointer | null;
}
type DownCallback = (startPointer: ResolvedPointer, ev: PointerType) => void;
type UpdateCallback =
  (changedPointer: ResolvedPointer, oldPointer: ResolvedPointer, ev: PointerType) => void;
interface TrackerHandlers {
  down: DownCallback;
  move: UpdateCallback;
  up: UpdateCallback;
}

function toPointer(ev): ResolvedPointer {
  const x = ev.pageX;
  const y = ev.pageY;
  const id = ev.identifier || ev.pointerId;

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

export class Tracker {
  private _startPointer: ResolvedPointer | null = null;
  private _started: boolean = false;
  // private readonly _element: HTMLElement;
  private readonly _down: DownCallback;
  private readonly _move: UpdateCallback;
  private readonly _up: UpdateCallback;

  constructor(private _element: HTMLElement, handlers: TrackerHandlers) {
    const { down, move, up } = handlers;

    this._down = down;
    this._move = move;
    this._up = up;

    this._onDown = this._onDown.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);
    this._isMouseEvent = this._isMouseEvent.bind(this);

    if ('PointerEvent' in window) {
      _element.addEventListener('pointerdown', this._onDown);
      _element.addEventListener('pointermove', this._onMove);
      _element.addEventListener('pointerup', this._onUp);
    } else {
      _element.addEventListener('mousedown', this._onDown);
      _element.addEventListener('touchstart', this._onDown);
      _element.addEventListener('touchmove', this._onMove);
      _element.addEventListener('touchend', this._onUp);
    }
  }

  private _onDown(ev: PointerType) {
    ev.preventDefault();

    if (this._started) return;

    if (this._isMouseEvent(ev)) {
      this._element.addEventListener('mousemove', this._onMove);
      this._element.addEventListener('mouseup', this._onUp);
    }

    const { newPointer } = getFirstTouch(this._startPointer, ev);

    this._down(newPointer, ev);
    this._startPointer = newPointer;
    this._started = true;
  }

  private _onMove(ev: PointerType) {
    this._updatePointers(this._move, ev);
  }

  private _onUp(ev: PointerType) {
    this._updatePointers(this._up, ev, true);
    this._started = false;
  }

  private _updatePointers(cb: (...args) => void, ev: PointerType, shouldReset?: boolean) {
    ev.preventDefault();

    if (!this._started) return;

    if (shouldReset && this._isMouseEvent(ev)) {
      this._element.removeEventListener('mousemove', this._onMove);
      this._element.removeEventListener('mouseup', this._onUp);
    }

    const { newPointer, oldPointer } = getFirstTouch(this._startPointer, ev);

    cb(newPointer, oldPointer, ev);

    this._startPointer = shouldReset ? null : newPointer;
  }

  private _isMouseEvent(ev: PointerType) {
    return ev instanceof MouseEvent;
  }
}
