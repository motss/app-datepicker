import { isValidDate } from './is-valid-date.js';
import { toResolvedDate } from './to-resolved-date.js';
import type { DateValidatorResult, MaybeDate } from './typings.js';

export function dateValidator(value: MaybeDate, defaultDate: Date): DateValidatorResult {
  const date = toResolvedDate(value);
  const isValid = isValidDate(value, date);

  return {
    date: isValid ? date : defaultDate,
    isValid,
  };
}
