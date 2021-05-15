import type { Formatters } from '../typings.js';

export interface YearGridData {
  date: Date;
  formatters?: Formatters
  max: Date;
  min: Date;
}

export interface YearGridProperties {
  data?: YearGridData;
}
