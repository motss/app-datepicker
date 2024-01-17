import { nothing } from 'lit';

import { toResolvedDate } from './helpers/to-resolved-date.js';
import { keyArrowDown, keyArrowLeft, keyArrowRight, keyArrowUp, keyEnd, keyEnter, keyHome, keyPageDown, keyPageUp, keySpace } from './key-values.js';

export const confirmKeySet = new Set([keyEnter, keySpace]);
export const DateTimeFormat = Intl.DateTimeFormat;
export const labelChooseMonth = 'Choose month' as const;
export const labelChooseYear = 'Choose year' as const;
export const labelNextMonth = 'Next month' as const;
export const labelPreviousMonth = 'Previous month' as const;
export const labelSelectDate = 'Select date' as const;
export const labelSelectedDate = 'Selected date' as const;
export const labelSelectedYear = 'Selected year' as const;
export const labelShortWeek = 'Wk' as const;
export const labelToday = 'Today' as const;
export const labelToyear = 'Toyear' as const;
export const labelWeek = 'Week' as const;
export const MAX_DATE = toResolvedDate('2100-12-31');
export const navigationKeyListNext = [keyArrowDown, keyPageDown, keyEnd];
export const navigationKeyListPrevious = [keyArrowUp, keyPageUp, keyHome];
export const navigationKeySetDayNext = new Set([...navigationKeyListNext, keyArrowRight]);
export const navigationKeySetDayPrevious = new Set([...navigationKeyListPrevious, keyArrowLeft]);
export const navigationKeySetGrid = new Set([...navigationKeySetDayNext, ...navigationKeySetDayPrevious]);
export const startViews = ['calendar', 'yearGrid'] as const;
export const weekNumberTemplate = 'Week %s' as const;
export const noop = () => { /** no-op */ };
export const renderNoop: () => typeof nothing = () => nothing;
