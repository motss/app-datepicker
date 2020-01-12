import { prettyHtml } from './pretty-html.js';
import { sanitizeText } from './sanitize-text.js';

export function cleanHtml(s: string, showToday: boolean = false) {
  return prettyHtml(sanitizeText(s, showToday));
}
