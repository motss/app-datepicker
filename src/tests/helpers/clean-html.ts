import { prettyHtml } from './pretty-html.js';
import { sanitizeText, SanitizeTextOptions } from './sanitize-text.js';

export function cleanHtml(s: string, options?: SanitizeTextOptions) {
  return prettyHtml(sanitizeText(s, options));
}
