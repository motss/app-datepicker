import type { Dialog } from '@material/mwc-dialog';

import type { ChangedProperties, DatePickerProperties } from '../typings';

export type DatePickerDialogChangedProperties = ChangedProperties<DatePickerDialogProperties>;

export interface DatePickerDialogProperties extends DialogProperties, DatePickerProperties {
  confirmLabel: string;
  dismissLabel: string;
  hide(): void;
  resetLabel: string;
  show(): void;
}

export type DialogClosedEventDetail = DialogClosingEventDetail;

export interface DialogClosingEventDetail {
  action: DialogClosingEventDetailAction;
}

export type DialogClosingEventDetailAction = 'cancel' | 'reset' | 'set';

type DialogProperties = Pick<Dialog, 'open'>;
