import type { ComplexAttributeConverter } from 'lit';

export const nullishAttributeConverter: NonNullable<ComplexAttributeConverter<unknown>['toAttribute']> =
  <T = string>(value: T) => value || undefined;
