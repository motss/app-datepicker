// import { MdIconButton } from '@material/web/iconbutton/icon-button.js';

// export class IconButton extends MdIconButton {
// }

import { MdIconButton } from '@material/web/iconbutton/icon-button.js';
// import type { RippleBase } from '@material/mwc-ripple/mwc-ripple-base.js';

export class IconButton extends MdIconButton {
  // public async layout() {
  //   const ripple = await this.ripple;

  //   /**
  //    * NOTE(motss): Workaround to force the ripple to update its layout.
  //    * See similar issue at https://github.com/material-components/material-web/issues/1054.
  //    */
  //   (ripple?.['mdcFoundation'] as RippleBase['mdcFoundation'])?.layout();

  //   await ripple?.updateComplete;
  //   await this.updateComplete;
  // }
}
