type SplitStringFn<T> = (n: string, i: number, a: string[]) => T;

export function splitString(dateString: string | undefined): string[];
export function splitString<T>(dateString: string | undefined, cb: SplitStringFn<T>): T[];
export function splitString<T, U extends string | undefined = string | undefined>(
  dateString: U,
  cb?: SplitStringFn<T>
): any[] {
  const dateList = typeof dateString === 'string' && dateString.length > 0
    ? dateString.split(/,\s*/i)
    : [];

  if (!dateList.length) return [];

  return typeof cb === 'function' ? dateList.map<T>(cb) : dateList;
}
