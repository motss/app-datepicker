import { start } from 'repl';

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

// declare type AllPointerType = MouseEvent | PointerEvent | TouchEvent;
// function toPointer(ev: MouseEvent | PointerEvent | Touch) {
//   const pointerId = (ev as PointerEvent).pointerId;

//   return {
//     pageX: ev.pageX,
//     pageY: ev.pageY,
//     id: ev instanceof MouseEvent
//       ? 0
//       : pointerId == null
//           ? (ev as Touch).identifier
//           : pointerId,
//   };
// }
// function getFirstPointer(firstPointer: any, ev: AllPointerType) {
//   if ('TouchEvent' in window && ev instanceof TouchEvent) {
//     const filteredTouches = Array.from(ev.changedTouches, n => toPointer(n));

//     if (firstPointer == null) {
//       return filteredTouches[0];
//     }

//     return filteredTouches.find(n => n.id === firstPointer.id);
//   }

//   return toPointer(ev as PointerEvent);
// }
// export function trackHandler(element: HTMLElement, handlers) {
//   const hasNativePointerEvent = 'PointerEvent' in window;
//   const { down, move, up } = handlers;

//   let pointerStarted = false;
//   let startPointer: any = null;

//   const downCallback = (ev: AllPointerType) => {
//     if (pointerStarted) return;
//     if (ev instanceof MouseEvent && ev.button !== 0) return;

//     startPointer = getFirstPointer(startPointer, ev);
//     pointerStarted = down(startPointer);
//   };
//   const moveCallback = (ev: AllPointerType) => {
//     if (!pointerStarted) return;

//     const changedPointer = getFirstPointer(startPointer, ev);
//     pointerStarted = move(changedPointer, startPointer);
//   };
//   const upCallback = (ev: AllPointerType) => {
//     if (!pointerStarted) return;

//     const changedPointer = getFirstPointer(startPointer, ev);
//     up(changedPointer, startPointer);

//     startPointer = null;
//     pointerStarted = false;
//   };

//   if (hasNativePointerEvent) {
//     element.addEventListener('pointerdown', downCallback);
//     element.addEventListener('pointermove', moveCallback);
//     element.addEventListener('pointerup', upCallback);
//   } else {
//     element.addEventListener('mousedown', downCallback);
//     element.addEventListener('mousemove', moveCallback);
//     element.addEventListener('mouseup', upCallback);

//     element.addEventListener('touchstart', downCallback);
//     element.addEventListener('touchmove', moveCallback);
//     element.addEventListener('touchend', upCallback);
//   }
// }
