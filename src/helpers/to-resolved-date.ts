import type { MaybeDate } from './typings.js';

export function toResolvedDate(date?: MaybeDate): Date {
  /**
   * NOTE: Only allow undefined `date` so that calling function without any parameter will
   * always return today's date. Return `Invalid Date` object for all falsy values.
   *
   * Chrome returns valid date for new Date('0') while Firefox returns `Invalid Date`.
   * There's no problem parsing a number in both platforms. Try to parse input as number and
   * use that to construct date before proceeding to use original value.
   */
  const tryDate =
    typeof date === 'string' && !Number.isNaN(Number(date)) ?
      Number(date) :
      date;
  /**
   * FIXME(motss): Temporarily disabling the code coverage for this line as it is caused by
   * `wtr` not being able to generate the correct coverage report for this line which might be
   * caused by wrong sourcemap generated during the tests. But it is 100% covered by all the
   * written tests.
   */
  /* c8 ignore start */
  const dateDate = tryDate === undefined ?
  /* c8 ignore stop */
    new Date() :
    new Date(tryDate || NaN);
  const isUTCDateFormat = typeof tryDate === 'string' && (
    /^\d{4}-\d{2}-\d{2}$/.test(tryDate) ||
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:Z|\+00:00|-00:00)$/.test(tryDate));
  const isUnixTimestamp = typeof tryDate === 'number' &&
    tryDate > 0 &&
    isFinite(tryDate);

  let fy = dateDate.getFullYear();
  let m = dateDate.getMonth();
  let d = dateDate.getDate();

  /**
   * NOTE: Depends on the input date string, browser will interpret the Date object differently.
   * For instance, a simple date string `2020-01-03` will default to UTC timezone. In order to get
   * the correct expected date that is `3`, `.getUTCDate` is required as `.getDate` will return a
   * date value that is based on the local timezone after the date conversion by the browser. In PST
   * timezone, that will return `2`.
   *
   * ```ts
   * // In PST (UTC-08:00) timezone, the following code will output:
   * const dateString = '2020-01-03';
   * const dateDate = new Date(dateString); // UTC time is '2020-01-03T00:00:00.000+08:00'
   *
   * dateDate.getUTCDate(); // 3
   * dateDate.getDate(); // 2
   * ```
   */
  if (isUTCDateFormat || isUnixTimestamp) {
    fy = dateDate.getUTCFullYear();
    m = dateDate.getUTCMonth();
    d = dateDate.getUTCDate();
  }

  /**
   * NOTE: Converts local datetime to UTC by extracting only the values locally using `get*` methods
   * instead of the `getUTC*` methods.
   *
   * FWIW, there could be still cases where `get*` methods returns something different than what is
   * expected but that is acceptable since we're relying on browser to tell us the local datetime
   * and we just use those values and treated them as if they were datetime to UTC.
   */
  return new Date(Date.UTC(fy, m, d));
}
