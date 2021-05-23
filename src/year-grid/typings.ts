import type { ChangedProperties, Formatters, SupportedKeyCode } from '../typings.js';

export interface ToNextSelectableYearInit {
  year: number;
  keyCode: SupportedKeyCode;
  max: Date;
  min: Date;
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
