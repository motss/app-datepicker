import { toResolvedDate } from './to-resolved-date.js';
import type { DateValidatorResult, MaybeDate } from './typings.js';

export function dateValidator(value: MaybeDate, defaultDate: Date): DateValidatorResult {
  const dateDate = toResolvedDate(value);
  const isValid = !(value == null || !(dateDate instanceof Date) || isNaN(+dateDate));

  return {
    date: isValid ? dateDate : defaultDate,
    isValid,
  };
}
