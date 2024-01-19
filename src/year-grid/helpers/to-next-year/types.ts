import type { SupportedKey } from '../../../typings.js';

export interface ToNextYearInit {
  key: SupportedKey;
  max: Date;
  min: Date;
  year: number;
}
