import { expect, fixture, html } from '@open-wc/testing';

import { toClosestTarget } from '../../helpers/to-closest-target';
import { messageFormatter } from '../test-utils/message-formatter';

describe(toClosestTarget.name, () => {
  type CaseToClosestTarget = [
    selector: string,
    elementNode: unknown,
    textContext: string | undefined
  ];

  const casesToClosestTarget: CaseToClosestTarget[] = [
    ['button', HTMLButtonElement, 'Click me'],
    ['input', undefined, undefined],
  ];
  casesToClosestTarget.forEach((a) => {
    const [testSelector, expectedElementNode, expectedTextContext] = a;

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
              <button>${expectedTextContext}</button>
            </div>
          `
        );

        const buttonEl = el.querySelector<HTMLButtonElement>('button');

        buttonEl?.click();

        const closest = await task;

        expectedElementNode ?
          expect(closest).instanceOf(expectedElementNode) :
          expect(closest).equal(expectedElementNode);

        expect(closest?.textContent).equal(expectedTextContext);
      }
    );
  });

});
