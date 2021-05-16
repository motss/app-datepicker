export function toClosestTarget<Target extends HTMLElement, TargetEvent extends Event = Event>(
  event: TargetEvent,
  selector: string
): Target | undefined {
  const matchedTarget = (
    Array.from(event.composedPath()) as Target[]
  ).find((element => element.nodeType === Node.ELEMENT_NODE && element.matches(selector)));

  return matchedTarget;
}
