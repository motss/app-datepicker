import { updateFormatters } from '../datepicker-helpers';

/**
 * NOTE: Set a default locale instead of reading default locale locally from the browser for
 * testings due to the fact that SauceLabs might run certain browsers that returns different locale.
 * That breaks tests obviously and this is unpredictable unfortunately to see tests broken because
 * of SauceLabs's configurations.
 */
export const defaultLocale = 'en-US';
/**
 * NOTE: This is not a random/ magic date selected for the testing. It's been selected for a reason
 * which has explained in detail at https://github.com/motss/app-datepicker/issues/128.
 */
export const date13 = '2020-01-13';
export const date15 = '2020-01-15';
export const date17 = '2020-01-17';
export const {
  dateFormatter,
  dayFormatter,
  fullDateFormatter,
  yearFormatter,
} = updateFormatters(defaultLocale);
