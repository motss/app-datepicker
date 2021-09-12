// import type { Test } from 'uvu';
import { test } from 'uvu';
import * as assert from 'uvu/assert';

// function eachFn<T>(
//   groups: T[],
//   message: string,
//   cb: Parameters<Test<T>>['1']
// ) {
//   groups.forEach((group) => {
//     test(message, (ctx) => cb<{ group: T }>({ ...ctx, group }));
//   });
// }

// Object.assign(test, {
//   each: eachFn,
// });

// export const test = () => testBase<{ group: T }>();

export { assert, test };
