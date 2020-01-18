export function sanitizeText(content: string, showToday: boolean = false): string {
  return (
    showToday
      ? content
      : content.replace(/(\s?day--today|day--today\s?)/gi, '') // .day--today class
  )
    .replace(/<!---->/g, '') // lit-html template placeholder
    .replace(/\r?\n/gi, '') // new lines in text
    .replace(/(\s?style-scope app-datepicker\s?)/gi, '') // ShadyDOM specific classes
    .replace(/(\s?class=""|class=""\s?)/g, '') // empty `class` attribute set by ShadyDOM
    .replace(/(\s?style=""|style=""\s?)/g, ''); // Unknown `style` set by Firefox
}
