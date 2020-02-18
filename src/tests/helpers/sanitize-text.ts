export interface SanitizeTextOptions {
  showFocused?: boolean;
  showPart?: boolean;
  showToday?: boolean;
}

export function sanitizeText(content: string, options?: SanitizeTextOptions): string {
  const { showFocused, showPart, showToday } = options ?? {};

  let content2 = content;

  if (!(showFocused ?? true)) {
    content2 = content2.replace(/(\s?day--focused|day--focused\s?)/gi, ''); // .day--focused class
  }

  if (!(showPart ?? false)) {
    content2 = content2.replace(/(\s?part=".+?"|part=".+?"\s?)/gi, ''); // part attribute
  }

  if (!(showToday ?? false)) {
    content2 = content2.replace(/(\s?day--today|day--today\s?)/gi, ''); // .day--today class
  }

  return content2
    .replace(/<!---->/g, '') // lit-html template placeholder
    .replace(/\r?\n/gi, '') // new lines in text
    .replace(/(\s?style-scope app-datepicker\s?)/gi, '') // ShadyDOM specific classes
    .replace(/(\s?class=""|class=""\s?)/g, '') // empty `class` attribute set by ShadyDOM
    .replace(/(\s?style=""|style=""\s?)/g, ''); // Unknown `style` set by Firefox
}
