import { prettyHtml } from './pretty-html.js';
import { sanitizeText } from './sanitize-text.js';

export async function cleanHtml(
  el: WebdriverIOAsync.Element | WebdriverIO.Element,
  showToday: boolean = false
): Promise<string> {
  const content: string = await el.getHTML();

  return prettyHtml(sanitizeText(content, showToday));
}
