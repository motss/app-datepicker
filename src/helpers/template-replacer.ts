export function templateReplacer<
  const T extends boolean | number | string | symbol,
>(template: string, wordList: T[]): string {
  let i = 0;

  return template.replace(/%s/gi, () => String(wordList[i++]));
}
