import { css } from 'lit';

import { includeScrollbarStyles, includeSeparatorStyles } from '../../styles.js';

export const dockedDatePickerStyles = css`
:host {
  --_b_h: 396px;
  --_b_mbe: 0px;
  --_b_mbs: 0px;
  --_h_pbs: 12px;
  --_h_pbe: 12px;
  --_h_pis: 4px;
  --_h_pie: 4px;
  --_ms_ipbe: 0px;
  --_ms_ipbs: 0px;

  --md-menu-surface-container-shape: 16px;
  --md-menu-surface-item-padding-block: var(--_ms_ipbs) var(--_ms_ipbe);
}
:host(:is([startview="monthMenu"],[startview="yearMenu"])) {
  --_b_h: 364px;
  --_b_mbs: 8px;
  --_h_pbs: 2px;
  --_h_pbe: 2px;
  --_ms_ipbe: 20px;
  --_ms_ipbs: 0px;

  --md-menu-surface-items-overflow: initial;
}
${includeSeparatorStyles(':host(:is([startview="monthMenu"],[startview="yearMenu"])) .header', 'end')}

.header {
  --_padding-block-start: var(--_h_pbs);
  --_padding-block-end: var(--_h_pbe);
  --_padding-inline-start: var(--_h_pis);
  --_padding-inline-end: var(--_h_pie);
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

${includeScrollbarStyles(':is(.monthMenu,.yearMenu) > .body')}

.appCalendar {
  --_padding-inline-start: 12px;
  --_padding-inline-end: 12px;

  margin-block: 0 4px;
}

.actions {
  display: flex;
  justify-content: end;
  gap: 0 8px;
  padding-block: 8px;
}
`;
