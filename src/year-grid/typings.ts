import type { ChangedProperties, DatePickerProperties, Formatters, SupportedKey } from '../typings.js';

type PickDatePickerProperties = Pick<DatePickerProperties, 'selectedYearLabel' | 'todayYearLabel'>;
type PickYearGridData = Pick<YearGridData, 'date' | keyof PickDatePickerProperties>;

export interface ToNextSelectableYearInit {
  key: SupportedKey;
  max: Date;
  min: Date;
  year: number;
}

export type YearGridChangedProperties = ChangedProperties<YearGridProperties>;

export interface YearGridData extends PickDatePickerProperties {
  date: Date;
  formatters?: Formatters
  max: Date;
  min: Date;
}

export interface YearGridProperties {
  data?: YearGridData;
}

export interface YearGridRenderButtonInit extends Omit<HTMLElement, 'part'>, PickYearGridData {
  focusingYear: number;
  label: string;
  part: string;
  year: number;
}
