export async function queryEl(
  selector: string,
  cb?: (...args: any[]) => Promise<void>,
  ...args: any[]
): Promise<WebdriverIOAsync.Element> {
  if (cb) await browser.executeAsync(cb, ...args);

  return $(selector);
}
