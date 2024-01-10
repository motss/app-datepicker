export interface FirstTouch {
  newPointer: ResolvedPointer;
  oldPointer: ResolvedPointer | null;
}

export type PointerHandler = (ev: PointerType) => void;

export type PointerType = MouseEvent | PointerEvent | TouchEvent | TouchInit;

export interface ResolvedPointer {
  id: PointerEvent['pageY']  ;
  x: PointerEvent['pageX'];
  y: PointerEvent['pageY'];
}

export type SupportedEventKey =
  | 'mousedown'
  | 'mouseleave'
  | 'mousemove'
  | 'mouseup'
  | 'touchend'
  | 'touchmove'
  | 'touchstart';

export interface TrackerHandlers {
  down(startPointer: ResolvedPointer, ev: PointerType): void;
  move(startPointer: ResolvedPointer, oldPointer: ResolvedPointer | null, ev: PointerType): void;
  up(startPointer: ResolvedPointer, oldPointer: ResolvedPointer | null, ev: PointerType): void;
}
