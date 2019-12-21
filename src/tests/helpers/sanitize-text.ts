export function sanitizeText(content: string): string {
  return content
      .replace(/<!---->/g, '')
      .replace(/\r?\n/gi, '')
      .replace(/\s?style-scope app-datepicker\s?/gi, '')
      .replace(/(\s?class=""|class=""\s?)/g, '');
}
