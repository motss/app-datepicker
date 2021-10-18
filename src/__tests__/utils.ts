// import type { Context, Test } from 'uvu';
// import { test as testBase } from 'uvu';
// import * as assert from 'uvu/assert';

// import { messageFormatter } from './test-utils/message-formatter';

// function eachFn<T>(
//   groups: T[]
// ) {
//   return (
//     message: string,
//     cb: Parameters<Test<Context & { group: T }>>['1']
//   ) => {
//     groups.forEach((group) => {
//       testBase(
//         messageFormatter(message, group),
//         (ctx) =>
//           cb({ ...ctx, group } as never)
//       );
//     });
//   };
// }

// Object.assign(testBase, {
//   each: eachFn,
// });

// interface A extends Test<Context> {
//   each: typeof eachFn;
// }

// const test = testBase as A;

// export { assert, test };
