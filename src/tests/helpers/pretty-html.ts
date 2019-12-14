import pretty from 'pretty';

export function prettyHtml(content: string | TemplateStringsArray): string {
  const rawContent = (content as TemplateStringsArray).raw ?
    String.raw(content as TemplateStringsArray) :
    content as string;

  return pretty(
    rawContent.replace(/<!---->/g, '').replace(/\s?style-scope app-datepicker\s/gi, ''),
    { ocd: true }
  );
}
