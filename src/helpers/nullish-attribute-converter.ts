import type { ComplexAttributeConverter } from 'lit';

export const nullishAttributeConverter: ComplexAttributeConverter<unknown>['toAttribute'] =
  <T = string>(value: T) => value || undefined;