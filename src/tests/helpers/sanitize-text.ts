export function sanitizeText(content: string): string {
  return content
      .replace(/<!---->/g, '') // lit-html template placeholder
      .replace(/\r?\n/gi, '') // new lines in text
      .replace(/\s?style-scope app-datepicker\s?/gi, '') // ShadyDOM specific classes
      .replace(/(\s?class=""|class=""\s?)/g, '') // empty `class` attribute set by ShadyDOM
      .replace(/(\s?style=""|style=""\s?)/g, ''); // Unknown `style` set by Firefox
}
