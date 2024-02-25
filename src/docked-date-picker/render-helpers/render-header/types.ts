interface FnInit {
  date: Date;
  type: RenderHeaderClickType;
}

export type RenderHeaderClickType = 'dec' | 'inc' | 'menu';

export interface RenderHeaderInit {
  date: Date;
  locale: string;
  max: Date;
  min: Date;
  nextMonthButtonLabel: string;
  nextYearButtonLabel: string;
  onMonthClick?(init: FnInit): void;
  onYearClick?(init: FnInit): void;
  prevMonthButtonLabel: string;
  prevYearButtonLabel: string;
}
