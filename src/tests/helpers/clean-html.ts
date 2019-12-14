import { prettyHtml } from './pretty-html.js';

export async function cleanHtml(
  el: WebdriverIO.Element | WebdriverIOAsync.Element
): Promise<string> {
  const content = await el.getHTML();

  return prettyHtml(content);
}
