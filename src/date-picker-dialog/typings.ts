import type { Dialog } from '@material/mwc-dialog';

export interface DatePickerDialogProperties extends DialogProperties {
  confirmLabel: string;
  dismissLabel: string;
  resetLabel: string;
  show(): void;
}

export interface DialogClosingEventDetail {
  action: DialogClosingEventDetailAction;
}

export type DialogClosingEventDetailAction = 'cancel' | 'reset' | 'set';

type DialogProperties = Pick<Dialog, 'open'>;
