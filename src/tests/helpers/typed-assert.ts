import {
  deepStrictEqual as dse,
  ok as ok2,
  strictEqual as se,
} from 'assert';

export function deepStrictEqual<T>(
  actual: T,
  expected: T,
  message?: string | Error | undefined
): void {
  return dse(actual, expected, message);
}

export function strictEqual<T>(
  actual: T,
  expected: T,
  message?: string | Error | undefined
): void {
  return se(actual, expected, message);
}

export function ok<T>(
  value: T,
  message?: string | Error | undefined
): void {
  return ok2(value, message);
}

export function allStrictEqual<T>(
  values: T[],
  expected: T,
  message?: string | Error | undefined
) {
  return ok2(values.every(n => n === expected), message);
}
