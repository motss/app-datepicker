import { sanitizeText } from './sanitize-text.js';

export async function cleanText(
  el: WebdriverIOAsync.Element | WebdriverIO.Element
): Promise<string> {
  const textContent = await el.getText();

  return sanitizeText(textContent);
}
