import { toResolvedDate } from './helpers/to-resolved-date.js';
import { keyArrowDown, keyArrowLeft, keyArrowRight, keyArrowUp, keyEnd, keyEnter, keyHome, keyPageDown, keyPageUp, keySpace } from './key-values.js';

//#region constants
export const MAX_DATE = toResolvedDate('2100-12-31');
//#endregion constants

export const startViews = [
  'calendar',
  'yearGrid',
] as const;

export const DateTimeFormat = Intl.DateTimeFormat;

export const confirmKeySet = new Set([keyEnter, keySpace]);
export const navigationKeyListNext = [keyArrowDown, keyPageDown, keyEnd];
export const navigationKeyListPrevious = [keyArrowUp, keyPageUp, keyHome];
export const navigationKeySetDayNext = new Set([...navigationKeyListNext, keyArrowRight]);
export const navigationKeySetDayPrevious = new Set([...navigationKeyListPrevious, keyArrowLeft]);
export const navigationKeySetGrid = new Set([...navigationKeySetDayNext, ...navigationKeySetDayPrevious]);
