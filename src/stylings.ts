import { css } from 'lit';

export const absoluteHidden = css`[hidden] { display: none !important; }`;

export const baseStyling = css`
:host {
  /* --_focus: var(--app-focus, #000);
  --_hover: var(--app-hover, #6200ee);
  --_on-disabled: var(--app-on-disabled, rgba(0, 0, 0, .38));
  --_on-focus: var(--app-on-focus, #000);
  --_on-hover: var(--app-on-hover, #000);
  --_on-primary: var(--app-on-primary, #fff);
  --_on-surface: var(--app-on-surface, #000);
  --_on-today: var(--app-on-today, #000);
  --_on-week-number: var(--app-on-week-number, #8c8c8c);
  --_on-weekday: var(--app-on-weekday, #8c8c8c);
  --_primary: var(--app-primary, #6200ee);
  --_selected-focus: var(--app-selected-focus, #000);
  --_selected-hover: var(--app-selected-hover, #6200ee);
  --_selected-on-focus: var(--app-selected-on-focus, #fff);
  --_selected-on-hover: var(--app-selected-on-hover, #fff);
  --_shape: var(--app-shape, 4px);
  --_surface: var(--app-surface, #fff);
  --_today: var(--app-today, #000); */

  --_day-size: 48px;
  --_padding: 0px;

  display: block;
  width: calc(var(--_day-size) * var(--_cols, 7) + var(--_side, var(--_padding)) * 2);
  padding-inline: var(--_padding);
  background-color: var(--md-sys-color-surface-container-high);
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
a:focus:not(:focus-visible) {
  text-decoration: none;
}
a:focus-visible {
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
  position: relative;
}

* {
  box-sizing: border-box;
}
`;

export const resetTableStyle = css`
table,
thead,
tbody,
tfoot,
tr,
th,
td {
  position: relative;
  margin: 0;
  padding: 0;
  background: inherit;
  color: inherit;
  border: none;
  border-collapse: collapse;
  border-spacing: 0;
  box-shadow: none;
  font: inherit;
  -webkit-tap-highlight-color: rgb(0 0 0 / 0);
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

export const visuallyHiddenStyle = css`
.sr-only {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  user-select: none;
  width: 1px;
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
