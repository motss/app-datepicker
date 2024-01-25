import { css } from 'lit';

export const modalDatePickerFooter_footerStyle = css`
:host {
  --_side: 12px;
}

.footer {
  display: grid;
  grid-template-areas: '. denyText confirmText';
  grid-template-rows: 40px;
  grid-template-columns: minmax(1px, 1fr) repeat(2, minmax(1px, auto));
  gap: 0 8px;
  justify-items: end;

  padding: 8px var(--_side) 12px;
}
`;

export const modalDatePickerFooter_denyTextStyle = css`
.denyText {
  grid-area: denyText;
}
`;

export const modalDatePickerFooter_confirmTextStyle = css`
.confirmText {
  grid-area: confirmText;
}
`;
