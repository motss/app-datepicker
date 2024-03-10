import { css } from 'lit';

import { includeScrollbarStyle } from '../stylings.js';

export const dockedDatePickerStyles = css`
:host {
  --_p: 12px;

  --md-menu-surface-container-shape: 16px;
  --md-menu-surface-item-padding-block: 0;
}

.header {
  --_padding-block: var(--_p);
  --_padding-inline: 4px;
}

.body {
  --_hm: 364px;
  --_w: 360px;

  max-width: var(--_w);
  min-width: var(--_w);
  width: 100%;
  max-height: calc(var(--_h, var(--_hm)) - var(--_mbs) - var(--_mbe));
  min-height: calc(var(--_h, var(--_hm)) - var(--_mbs) - var(--_mbe));
  height: 100%;
  margin-block: var(--_mbs) var(--_mbe);
  overflow-y: auto;
  overscroll-behavior: contain;
}

${includeScrollbarStyle(':is(.monthMenu,.yearMenu) > .body')}
:is(.monthMenu,.yearMenu) > .body {
  --_mbs: 8px;
  --_mbe: 20px;
}

:is(.monthMenu,.yearMenu) > .header {
  --_padding-block: 2px;
}
:is(.monthMenu,.yearMenu) > .header::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--md-sys-color-outline-variant);
}

.calendar > .body {
  --_h: 364px;
}

.appCalendar {
  --_padding: var(--_p);

  margin-block: 0 4px;
}

.actions {
  display: flex;
  justify-content: end;
  gap: 0 8px;
  padding-block: 8px;
}
`;
