import type { TemplateResult } from 'lit';

export interface ModalDatePickerHeaderProperties {
  headline: string;
  iconButton: TemplateResult | string;
  onIconButtonClick?(ev: MouseEvent): unknown;
  supportingText: string;
}
