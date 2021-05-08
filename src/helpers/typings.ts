export interface DateValidatorResult {
  date: Date;
  isValid: boolean;
}

export type MaybeDate = Date | null | number | string;
