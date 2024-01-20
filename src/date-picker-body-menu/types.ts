export interface DatePickerBodyMenuProperties {
  menuLabel: string;
  menuText: string;
  nextIconButtonLabel: string;
  onMenuClick?(ev: MouseEvent): void;
  onNextClick?(ev: MouseEvent): void;
  onPrevClick?(ev: MouseEvent): void;
  prevIconButtonLabel: string;
}
