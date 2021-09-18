type SplitStringCallbackFn<ReturnType> = (
  element: string,
  index: number,
  array: string[]
) => ReturnType;

export function splitString<ReturnType = string>(
  source: string,
  splitFunction?: SplitStringCallbackFn<ReturnType>,
  separator: RegExp | string = /,\s*/
): ReturnType[] {
  const dateList = typeof source === 'string' && source.length > 0
    ? source.split(separator)
    : [];

  if (!dateList.length) return [];
  if (splitFunction == null) return dateList as unknown as ReturnType[];

  return dateList.map(
    (n, i, arr) =>
      splitFunction(n, i, arr)
  );
}
