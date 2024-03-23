import { type CSSResult, unsafeCSS } from 'lit';

interface MdTypescaleTokens {
  lineHeight: CSSResult;
  size: CSSResult;
  weight: CSSResult;
}

export const mdRefTypefaceBrand = (defaultFont: string) =>
  unsafeCSS(`var(--md-ref-typeface-brand, ${defaultFont})`);

export const mdRefTypefacePlain = (defaultFont: string) =>
  unsafeCSS(`var(--md-ref-typeface-plain, ${defaultFont})`);

export const mdSysTypescaleDisplaySmall = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-display-small-line-height, 2.75rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-display-small-size, 2.25rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-display-small-weight, var(--md-ref-typeface-weight-regular, 400))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleDisplaySmallProminent =
  mdSysTypescaleDisplaySmall satisfies MdTypescaleTokens;

export const mdSysTypescaleDisplayMedium = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-display-medium-line-height, 3.25rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-display-medium-size, 2.8125rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-display-medium-weight, var(--md-ref-typeface-weight-regular, 400))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleDisplayMediumProminent = mdSysTypescaleDisplayMedium;

export const mdSysTypescaleDisplayLarge = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-display-large-line-height, 4rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-display-large-size, 3.5625rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-display-large-weight, var(--md-ref-typeface-weight-regular, 400))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleDisplayLargeProminent = mdSysTypescaleDisplayLarge;

export const mdSysTypescaleHeadlineSmall = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-headline-small-line-height, 2rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-headline-small-size, 1.5rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleHeadlineSmallProminent = mdSysTypescaleHeadlineSmall;

export const mdSysTypescaleHeadlineMedium = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-headline-medium-line-height, 2.25rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-headline-medium-size, 1.75rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-headline-medium-weight, var(--md-ref-typeface-weight-regular, 400))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleHeadlineMediumProminent =
  mdSysTypescaleHeadlineMedium;

export const mdSysTypescaleHeadlineLarge = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-headline-large-line-height, 2.5rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-headline-large-size, 2rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-headline-large-weight, var(--md-ref-typeface-weight-regular, 400))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleHeadlineLargeProminent = mdSysTypescaleHeadlineLarge;

export const mdSysTypescaleTitleSmall = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-title-small-line-height, 1.25rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-title-small-size, 0.875rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-title-small-weight, var(--md-ref-typeface-weight-medium, 500))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleTitleSmallProminent = mdSysTypescaleTitleSmall;

export const mdSysTypescaleTitleMedium = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-title-medium-line-height, 1.5rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-title-medium-size, 1rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-title-medium-weight, var(--md-ref-typeface-weight-medium, 500))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleTitleMediumProminent = mdSysTypescaleTitleMedium;

export const mdSysTypescaleTitleLarge = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-title-large-line-height, 1.75rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-title-large-size, 1.375rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-title-large-weight, var(--md-ref-typeface-weight-regular, 400))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleTitleLargeProminent = mdSysTypescaleTitleLarge;

export const mdSysTypescaleBodySmall = {
  lineHeight: unsafeCSS('var(--md-sys-typescale-body-small-line-height, 1rem)'),
  size: unsafeCSS('var(--md-sys-typescale-body-small-size, 0.75rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleBodySmallProminent = mdSysTypescaleBodySmall;

export const mdSysTypescaleBodyMedium = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-body-medium-line-height, 1.25rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-body-medium-size, 0.875rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleBodyMediumProminent = mdSysTypescaleBodyMedium;

export const mdSysTypescaleBodyLarge = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-body-large-line-height, 1.5rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-body-large-size, 1rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleBodyLargeProminent = mdSysTypescaleBodyLarge;

export const mdSysTypescaleLabelSmall = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-label-small-line-height, 1rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-label-small-size, 0.6875rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleLabelSmallProminent = mdSysTypescaleLabelSmall;

export const mdSysTypescaleLabelMedium = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-label-medium-line-height, 1rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-label-medium-size, 0.75rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-label-medium-weight, var(--md-ref-typeface-weight-medium, 500))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleLabelMediumProminent = mdSysTypescaleLabelMedium;

export const mdSysTypescaleLabelLarge = {
  lineHeight: unsafeCSS(
    'var(--md-sys-typescale-label-large-line-height, 1.25rem)'
  ),
  size: unsafeCSS('var(--md-sys-typescale-label-large-size, 0.875rem)'),
  weight: unsafeCSS(
    'var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500))'
  ),
} satisfies MdTypescaleTokens;
export const mdSysTypescaleLabelLargeProminent = mdSysTypescaleLabelLarge;
