import type { SupportedKey } from '../../../../../types.js';

export interface ToNextYearInit {
  key: SupportedKey;
  maxDate: Date;
  minDate: Date;
  year: number;
}
