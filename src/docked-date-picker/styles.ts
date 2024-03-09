import { css } from 'lit';

export const dockedDatePickerStyles = css`
:host {
  --_p: 12px;
}

.actions {
  display: flex;
  justify-content: end;
  gap: 0 8px;
  padding-block: 8px 4px;
}

.header {
  --_padding-block: 0 10px;
  --_padding-inline: var(--_p);
}

.body {
  --_hm: 356px;
  --_w: 360px;

  max-width: var(--_w);
  min-width: var(--_w);
  width: 100%;
  max-height: var(--_h, var(--_hm));
  min-height: var(--_h, var(--_hm));
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.body.calendar {
  --_h: 400px;
}

.calendar,
.menuList {
  width: 100%;
}

.calendar {
  --_padding: var(--_p);
}

.menuList {
  --md-list-container-color: var(--md-sys-color-surface-container-high);
}
`;
