import { prettyHtml } from './pretty-html.js';

export async function cleanHtml(
  el: WebdriverIO.Element | WebdriverIOAsync.Element
): Promise<string> {
  const content: string = await el.getHTML();

  return prettyHtml(
    content
      .replace(/<!---->/g, '')
      .replace(/\s?style-scope app-datepicker\s?/gi, '')
  );
}
