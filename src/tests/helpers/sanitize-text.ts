export interface SanitizeTextOptions {
  showToday?: boolean;
  showFocused?: boolean;
}

export function sanitizeText(content: string, options?: SanitizeTextOptions): string {
  const { showFocused, showToday } = options ?? {};

  const content1 = (
    (showFocused ?? true)
      ? content
      : content.replace(/(\s?day--focused|day--focused\s?)/gi, '') // .day--focused class
  );
  const content2 = (
    (showToday ?? false)
      ? content1
      : content1.replace(/(\s?day--today|day--today\s?)/gi, '') // .day--today class
  );

  return content2
    .replace(/<!---->/g, '') // lit-html template placeholder
    .replace(/\r?\n/gi, '') // new lines in text
    .replace(/(\s?style-scope app-datepicker\s?)/gi, '') // ShadyDOM specific classes
    .replace(/(\s?class=""|class=""\s?)/g, '') // empty `class` attribute set by ShadyDOM
    .replace(/(\s?style=""|style=""\s?)/g, ''); // Unknown `style` set by Firefox
}
