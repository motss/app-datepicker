import { toResolvedDate } from './to-resolved-date.js';
import type { DateValidatorResult, MaybeDate } from './types.js';

export function dateValidator(
  value: MaybeDate,
  defaultDate: Date
): DateValidatorResult {
  const dateDate = toResolvedDate(value);
  const isValid = !Number.isNaN(+dateDate);

  return {
    date: isValid ? dateDate : defaultDate,
    isValid,
  };
}
