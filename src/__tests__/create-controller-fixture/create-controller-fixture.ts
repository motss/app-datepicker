import { defineCE, fixture } from '@open-wc/testing-helpers';

import type { RootElement } from '../../root-element/root-element.js';
import type { Constructor } from '../../utility.types.js';

type GetFnTemplate = `get${Capitalize<string>}${string}`;

type InputHelpers<T extends RootElement> = {
  [key: GetFnTemplate]: (element: T) => unknown;
};

type OutputHelpers<H> = {
  [K in keyof H as K extends GetFnTemplate ? K : never]: () => unknown;
};

type Result<T extends RootElement, H extends InputHelpers<T>> = {
  readonly element: T;
} & OutputHelpers<H>;

export function createControllerFixture<
  T extends RootElement = RootElement,
  H extends InputHelpers<T> = InputHelpers<T>,
>(templateFn: () => Constructor<T>, maybHelpers?: H): () => Promise<Result<T, H>> {
  let registered = false;
  let testComponentName = '';

  async function render(): Promise<Result<T, H>> {
    if (!registered) {
      registered = true;
      const TestComponent = templateFn();
      testComponentName = defineCE(TestComponent);
    }

    const element = await fixture<T>(`<${testComponentName}></${testComponentName}>`);
    const helpers = Object.fromEntries(
      Object.entries(maybHelpers ?? {}).map(
        ([k, v]) => {
          return [k, () => v(element)];
        }
      )
    ) as OutputHelpers<H>;

    const result: Result<T, H> = {
      element,
      ...helpers,
    };

    return result;
  }

  return render;
}
