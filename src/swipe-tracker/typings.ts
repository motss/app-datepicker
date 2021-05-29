export interface FirstTouch {
  newPointer: ResolvedPointer;
  oldPointer: ResolvedPointer | null;
}

export type PointerHandler = (ev: PointerType) => void;

export type PointerType = MouseEvent | TouchEvent | PointerEvent | TouchInit;

export interface ResolvedPointer {
  x: PointerEvent['pageX'];
  y: PointerEvent['pageY'];
  id: PointerEvent['pageY'] | Touch['identifier'];
}

export type SupportedEventKey =
  | 'mousedown'
  | 'mousemove'
  | 'mouseup'
  | 'mouseleave'
  | 'touchstart'
  | 'touchmove'
  | 'touchend';

export interface TrackerHandlers {
  down(startPointer: ResolvedPointer, ev: PointerType): void;
  move(startPointer: ResolvedPointer, oldPointer: null | ResolvedPointer, ev: PointerType): void;
  up(startPointer: ResolvedPointer, oldPointer: null | ResolvedPointer, ev: PointerType): void;
}

