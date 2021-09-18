import { expect, fixture, html } from '@open-wc/testing';

import { toClosestTarget } from '../../helpers/to-closest-target';
import { messageFormatter } from '../test-utils/message-formatter';

describe(toClosestTarget.name, () => {
  type A = [string, unknown, string | undefined];

  const cases: A[] = [
    ['button', HTMLButtonElement, 'Click me'],
    ['input', undefined, undefined],
  ];

  cases.forEach((a) => {
    const [testSelector, testElementNode, testTextContext] = a;

    it(
      messageFormatter('returns closest target (selector=%s)', a),
      async () => {
        let resolver: NonNullable<Parameters<PromiseConstructor['prototype']['then']>['0']>;
        const task = new Promise<HTMLButtonElement | null>(
          (resolve) => resolver = resolve
        );
        const onClick: EventListenerObject = {
          handleEvent(ev) {
            const closest = toClosestTarget(ev, testSelector);

            resolver(closest);
          },
        };
        const el = await fixture(
          html`
            <div @click=${onClick} @keyup=${onClick}>
              <button>${testTextContext}</button>
            </div>
          `
        );

        const buttonEl = el.querySelector<HTMLButtonElement>('button');

        buttonEl?.click();

        const closest = await task;

        testElementNode ?
          expect(closest).instanceOf(testElementNode) :
          expect(closest).equal(testElementNode);

        expect(closest?.textContent).equal(testTextContext);
      }
    );
  });
});
