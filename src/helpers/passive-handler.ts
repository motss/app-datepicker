export function passiveHandler(cb: (...params: any[]) => any) {
  return { passive: true, handleEvent: cb };
}
