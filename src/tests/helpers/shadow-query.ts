export async function shadowQuery(
  el: WebdriverIOAsync.Element,
  selector: string[]
): Promise<WebdriverIOAsync.Element> {
  const e = await el.shadow$((Array.isArray ? selector : []).join(' '));

  return e as unknown as WebdriverIOAsync.Element;
}
