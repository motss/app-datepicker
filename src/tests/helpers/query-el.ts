interface QueryEl {
  cb(done: () => void): void;
}

export async function queryEl(
  selector: string,
  cb: QueryEl['cb']
): Promise<WebdriverIOAsync.Element> {
  await browser.executeAsync(cb);

  return $(selector);
}
