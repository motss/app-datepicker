import type { ChangedProperties, Formatters, SupportedKey } from '../typings.js';

export interface ToNextSelectableYearInit {
  key: SupportedKey;
  max: Date;
  min: Date;
  year: number;
}

export type YearGridChangedProperties = ChangedProperties<YearGridProperties>;

export interface YearGridData {
  date: Date;
  formatters?: Formatters
  max: Date;
  min: Date;
}

export interface YearGridProperties {
  data?: YearGridData;
}

export interface YearGridRenderButtonInit extends Pick<YearGridData, 'date'> {
  focusingYear: number;
  label: string;
  year: number;
}
