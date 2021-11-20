import { css } from 'lit';

export const absoluteHidden = css`[hidden] { display: none !important; }`;

export const baseStyling = css`
:host {
  --base-focus-color: #b5b5b5;
  --base-hover-color: #b5b5b5;
  --base-primary-color: #000;
  --base-selected-background-color: #1d1d1d;
  --base-selected-color: #fff;
  --base-text-color: #000;
  --base-today-color: #000;
  --base-weekday-color: #8c8c8c;
}
`;

export const resetAnchor = css`
a {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  position: relative;
  display: inline-block;
  background: initial;
  color: inherit;
  font: inherit;
  text-transform: inherit;
  text-decoration: none;
  outline: none;
}
a:focus,
a:focus.page-selected {
  text-decoration: underline;
}
`;

export const resetButton = css`
button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  background: none; /** NOTE: IE11 fix */
  color: inherit;
  border: none;
  font: inherit;
  text-align: left;
  text-transform: inherit;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
`;

export const resetShadowRoot = css`
:host {
  display: block;
}

* {
  box-sizing: border-box;
}
`;

export const resetSvgIcon = css`
svg {
  display: block;
  min-width: var(--svg-icon-min-width, 24px);
  min-height: var(--svg-icon-min-height, 24px);
  fill: var(--svg-icon-fill, currentColor);
  pointer-events: none;
}
`;

export const webkitScrollbarStyling = css`
/**
 * NOTE: Webkit-specific scrollbar styling
 */
::-webkit-scrollbar {
  width: 8px;
  background: none;
}
::-webkit-scrollbar-thumb {
  width: inherit;
  background-color: #cdcdcd;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, .35);
}
::-webkit-scrollbar-thumb:active {
  background-color: rgba(0, 0, 0, .55);
}
@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-thumb {
    background-color: #686868;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #494949;
  }
  ::-webkit-scrollbar-thumb:active {
    background-color: #5a5a5a;
  }
}
`;