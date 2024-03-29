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
  if (source.length) {
    const list = source.split(separator);

    if (splitFunction == null) {
      return list as ReturnType[];
    }

    return list.map((n, i, arr) => splitFunction(n, i, arr));
  }

  return [];
}
