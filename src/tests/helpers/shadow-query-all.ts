export async function shadowQueryAll(
  el: WebdriverIOAsync.Element,
  selector: string[]
): Promise<WebdriverIOAsync.ElementArray> {
  const e = await el.shadow$$((Array.isArray ? selector : []).join(' '));

  return e as unknown as WebdriverIOAsync.ElementArray;
}
