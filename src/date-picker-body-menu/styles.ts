import { css } from 'lit';

export const bodyMenuStyle = css`
.bodyMenu {
  display: grid;
  grid-template-areas: 'menuButton . prevIconButton nextIconButton';
  grid-template-columns: minmax(1px, auto) 1fr repeat(2, minmax(1px, auto));
  grid-template-rows: 40px;
}

.menuButton {
  --_icon-size: 24px;

  grid-area: menuButton;
}

.prevIconButton {
  grid-area: prevIconButton;
}

.nextIconButton {
  grid-area: nextIconButton;
}
`;
