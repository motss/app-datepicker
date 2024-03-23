import type { SupportedKey } from '../../../../../types.js';

export interface ToNextYearInit {
  key: SupportedKey;
  max: Date;
  min: Date;
  year: number;
}
