type SplitStringCallbackFn<ReturnType> = (
  element: ReturnType,
  index: number,
  array: ReturnType[]
) => ReturnType;

export type splitString = {
  (source: string): string[];
  <ReturnType>(source: string, callbackFn: SplitStringCallbackFn<ReturnType>): ReturnType[];
}

export function splitString<SourceType extends string = string, ReturnType = string>(
  source: SourceType,
  callbackFn?: SplitStringCallbackFn<ReturnType>,
  separator: RegExp | string = /,\s*/
): ReturnType[] {
  const dateList = typeof source === 'string' && source.length > 0
    ? source.split(separator) as unknown as ReturnType[]
    : [];

  if (!dateList.length) return [];
  if (callbackFn == null) return dateList;

  return dateList.map(callbackFn);
}
