import { IconButton as BaseIconButton } from '@material/mwc-icon-button';
import type { RippleBase } from '@material/mwc-ripple/mwc-ripple-base.js';

export class IconButton extends BaseIconButton {
  public async layout() {
    const ripple = await this.ripple;

    /**
     * NOTE(motss): Workaround to force the ripple to update its layout.
     * See similar issue at https://github.com/material-components/material-web/issues/1054.
     */
    (ripple?.['mdcFoundation'] as RippleBase['mdcFoundation'])?.layout();

    await ripple?.updateComplete;
    await this.updateComplete;
  }
}
