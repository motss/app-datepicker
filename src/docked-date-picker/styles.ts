import { css } from 'lit';

import { includeScrollbarStyle } from '../stylings.js';

export const dockedDatePickerStyles = css`
:host {
  --_p: 12px;

  --_b_h: 396px;
  --_b_hpb: var(--_p);
  --_b_mbe: 0px;
  --_b_mbs: 0px;
  --_ms_ipbe: 0px;
  --_ms_ipbs: 0px;

  --md-menu-surface-container-shape: 16px;
  --md-menu-surface-item-padding-block: var(--_ms_ipbs) var(--_ms_ipbe);
}
:host(:is([startview="monthMenu"],[startview="yearMenu"])) {
  --_b_h: 364px;
  --_b_hpb: 2px;
  --_b_mbs: 8px;
  --_ms_ipbe: 20px;
  --_ms_ipbs: 0px;

  --md-menu-surface-items-overflow: initial;
}
:host(:is([startview="monthMenu"],[startview="yearMenu"])) .header::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--md-sys-color-outline-variant);
}

.header {
  --_padding-block: var(--_b_hpb);
  --_padding-inline: 4px;
}

.body {
  --_w: 360px;

  max-width: var(--_w);
  min-width: var(--_w);
  width: 100%;
  max-height: calc(var(--_b_h) - var(--_b_mbs) - var(--_b_mbe) - var(--_ms_ipbs) - var(--_ms_ipbe));
  min-height: calc(var(--_b_h) - var(--_b_mbs) - var(--_b_mbe) - var(--_ms_ipbs) - var(--_ms_ipbe));
  height: 100%;
  margin-block: var(--_b_mbs) var(--_b_mbe);
  overflow-y: auto;
  overscroll-behavior: contain;
}

${includeScrollbarStyle(':is(.monthMenu,.yearMenu) > .body')}

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
