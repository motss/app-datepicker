export interface SanitizeTextOptions {
  showFocused?: boolean;
  showPart?: boolean;
  showRole?: boolean;
  showTabindex?: boolean;
  showToday?: boolean;
  showType?: boolean;
}

export function sanitizeText(content: string, options?: SanitizeTextOptions): string {
  const {
    showFocused,
    showPart,
    showRole,
    showTabindex,
    showToday,
    showType,
  } = options ?? {};

  let content2 = content;

  if (!(showFocused ?? true)) {
    content2 = content2.replace(/(\s?day--focused|day--focused\s?)/gi, ''); // .day--focused class
  }

  if (!(showPart ?? false)) {
    content2 = content2.replace(/(\s?part=".+?"|part=".+?"\s?)/gi, ''); // part attribute
  }

  if (!(showRole ?? false)) {
    content2 = content2.replace(/(\s?role=".+?"|role=".+?"\s?)/gi, ''); // role attribute
  }

  if (!(showTabindex ?? false)) {
    // tabindex attribute
    content2 = content2.replace(/(\s?tabindex=".+?"|tabindex=".+?"\s?)/gi, '');
  }

  if (!(showToday ?? false)) {
    content2 = content2.replace(/(\s?day--today|day--today\s?)/gi, ''); // .day--today class
  }

  if (!(showType ?? false)) {
    content2 = content2.replace(/(\s?type=".+?"|type=".+?"\s?)/gi, ''); // type attribute
  }

  return content2
    .replace(
      /(?:aria-selected="(.+?)").*?(?:aria-label="(.+?)")/gi,
      (_, p1, p2) => `aria-label="${p2}" aria-selected="${p1}"`
    ) // Swap aria-selected and aria-label of td in MS Edge
    .replace(
      /(?:aria-label="(.+?)").*?(?:abbr="(.+?)")/gi,
      (_, p1, p2) => `abbr="${p2}" aria-label="${p1}"`
    ) // Swap abbr and aria-label of th in MS Edge
    .replace(/<!--\?lit\$[0-9]+\$-->|<!--\??-->/g, '') // lit expression comments
    .replace(/<!--\?lit\$[0-9]+\$-->|<!--\??-->|lit\$[0-9]+\$/g, '') // lit expression markers
    .replace(/<!---->/g, '') // lit-html template placeholder
    .replace(/\r?\n/gi, '') // new lines in text
    .replace(/(\s?style-scope app-datepicker\s?)/gi, '') // ShadyDOM specific classes
    .replace(/(\s?scope="row"|scope="row"\s?)/g, '') // scope="row" attribute in all week labels
    .replace(/(\s?class=""|class=""\s?)/g, '') // empty `class` attribute set by ShadyDOM
    .replace(/(\s?style=""|style=""\s?)/g, '') // Unknown `style` set by Firefox
    .replace(/class="(.+?)"/gi, (_, s) => `class="${s.trim()}"`) // lit classMap
    ;
}
