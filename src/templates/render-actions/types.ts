import type { MdTextButton } from '@material/web/button/text-button.js';

export interface RenderActionsInit {
  confirmText: string;
  denyText: string;
  formId?: string;
  onConfirm?: MdTextButton['onclick'];
  onDeny?: MdTextButton['onclick'];
  slot?: string;
}
