import pretty from 'pretty';

export function prettyHtml(content: string | TemplateStringsArray): string {
  return pretty(
    (content as TemplateStringsArray).raw ?
      String.raw(content as TemplateStringsArray) :
      content as string,
    { ocd: true }
  );
}
