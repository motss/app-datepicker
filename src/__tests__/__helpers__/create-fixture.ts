import { defineCE, elementUpdated, fixture } from '@open-wc/testing-helpers';

import type { RootElement } from '../../root-element/root-element.js';
import type { Constructor } from '../../utility.types.js';

type GetFnTemplate = `get${Capitalize<string>}${string}`;

type InputHelpers<T extends RootElement> = {
  [key: GetFnTemplate]: (element: T) => unknown;
};

type OutputHelpers<H> = {
  [K in keyof H as K extends GetFnTemplate ? K : never]: () => H[K] extends (
    ...args: infer _Args
  ) => infer R
    ? R
    : never;
};

type Result<T extends RootElement, H extends InputHelpers<T>> = {
  readonly element: T;
  updated(): Promise<void>;
} & OutputHelpers<H>;

export function createFixture<
  T extends RootElement = RootElement,
  H extends InputHelpers<T> = InputHelpers<T>,
  I extends object = object,
>(
  templateFn: (init?: Partial<I>) => Constructor<T>,
  maybeHelpers?: H
): (init?: Partial<I>) => Promise<Result<T, H>> {
  async function render(init?: Partial<I>): Promise<Result<T, H>> {
    const templateClass = templateFn(init);
    const testComponentName = defineCE(
      class TestComponent extends templateClass {}
    );

    const element = await fixture<T>(
      `<${testComponentName}></${testComponentName}>`
    );

    const helpers = Object.fromEntries(
      Object.entries(maybeHelpers ?? {}).map(([k, v]) => {
        return [k, () => v(element)];
      })
    ) as OutputHelpers<H>;

    const result: Result<T, H> = {
      element,
      async updated() {
        await elementUpdated(element);
      },
      ...helpers,
    };

    return result;
  }

  return render;
}
