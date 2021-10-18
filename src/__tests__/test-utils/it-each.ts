import { messageFormatter } from './message-formatter';

type Params = Parameters<Mocha.TestFunction>;

function eachFn<T>(groups: T[]) {
  return (...args: Params) => {
    const [title, cb] = args;

    groups.forEach((group) => {
      it(
        messageFormatter<T>(title, group),
        cb?.bind(group as never)
      );
    });
  };
}

globalThis.it && Object.assign(globalThis.it, {
  each: eachFn,
});

interface TestFunction extends Mocha.TestFunction {
  each: typeof eachFn;
}

const it = globalThis.it as TestFunction;

export { it };
