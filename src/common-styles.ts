import { html } from '@polymer/lit-element';

export const resetButton = html`
  <style>
    button {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;

      position: relative;
      display: block;
      margin: 0;
      padding: 0;
      background: inherit;
      color: inherit;
      border: none;
      font: inherit;
      text-align: left;
      text-transform: inherit;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
  </style>
`;
export const resetAnchor = html`
  <style>
    a {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

      position: relative;
      display: inline-block;
      background: inherit;
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
  </style>
`;
export const resetSvgIcon = html`
  <style>
    svg {
      display: block;
      min-width: var(--svg-icon-min-width, 24px);
      min-height: var(--svg-icon-min-height, 24px);
      fill: var(--svg-icon-fill, currentColor);
      pointer-events: none;
    }
  </style>
`;
export const absoluteHidden = html`<style>[hidden] { display: none !important; }</style>`;
