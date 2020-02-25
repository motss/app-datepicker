import { INTL_DATE_TIME_FORMAT } from '../constants.js';

export function getResolvedLocale() {
  return (
    INTL_DATE_TIME_FORMAT &&
    INTL_DATE_TIME_FORMAT().resolvedOptions &&
    INTL_DATE_TIME_FORMAT().resolvedOptions().locale
  ) || 'en-US';
}
