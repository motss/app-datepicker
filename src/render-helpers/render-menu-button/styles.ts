import { css } from 'lit';

export const renderMenuButtonStyle = css`
.menuButton {
  --md-text-button-icon-size: 18px;
}

.menuButton .icon {
  transition: transform 350ms cubic-bezier(0.05, 0.7, 0.1, 1.0);
  transform: rotateZ(var(--_state, 0deg));
  will-change: transform;
}
`;
