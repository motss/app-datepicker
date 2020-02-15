import {
  deepStrictEqual as dse,
  ok as ok2,
  strictEqual as se,
} from 'assert';

type Message = string | Error | undefined;

function formatErrorMessage(actual: any, expected: any, message?: Message) {
  return message ??
    `\nExpected:\n${JSON.stringify(expected)}\n\nActual:\n${JSON.stringify(actual)}`;
}

function formatErrorMessageForOk(value: any, message?: Message) {
  return message ?? `\nNot all values are the same: \n\n${JSON.stringify(value)}`;
}

export function allStrictEqual<T>(
  values: T[],
  expected: T,
  message?: Message
) {
  return ok2(values.every(n => n === expected), formatErrorMessage(values, expected, message));
}

export function deepStrictEqual<T>(
  actual: T,
  expected: T,
  message?: Message
): void {
  return dse(actual, expected, formatErrorMessage(actual, expected, message));
}

export function ok<T>(
  value: T,
  message?: Message
): void {
  return ok2(value, formatErrorMessageForOk(value, message));
}

export function strictEqual<T>(
  actual: T,
  expected: T,
  message?: Message
): void {
  return se(actual, expected, formatErrorMessage(actual, expected, message));
}
