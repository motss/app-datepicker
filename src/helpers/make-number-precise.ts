export function makeNumberPrecise(num: number) {
  /**
   * NOTE(motss): Different browser will use different precision in CSS `transform`:
   *
   * * Edge 17/ FF63 - use 2 decimals
   * * Safari 10.1/ Chrome 41 - use as many decimals as possible
   * * Chrome 70 - use 3 decimals
   *
   */
  return (num - Math.floor(num)) > 0 ? +num.toFixed(3) : num;
}
