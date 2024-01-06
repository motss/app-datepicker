import { fixture, html } from '@open-wc/testing-helpers';
import { describe, expect, it } from 'vitest';

import { toClosestTarget } from '../../helpers/to-closest-target';

describe(toClosestTarget.name, () => {
  it.each<{
    $_elementNode: typeof HTMLButtonElement | undefined;
    $_textContent: string | undefined;
    selector: string;
  }>([
    {
      $_elementNode: HTMLButtonElement,
      $_textContent: 'Click me',
      selector: 'button',
    },
    {
      $_elementNode: undefined,
      $_textContent: undefined,
      selector: 'input',
    },
  ])('returns closest target (selector=$selector)', async ({
    $_elementNode,
    $_textContent,
    selector,
  }) => {
    // todo: refactor with Promise.withResolvers
    let resolver: NonNullable<Parameters<PromiseConstructor['prototype']['then']>['0']>;
    const task = new Promise<HTMLButtonElement | null>(
      (resolve) => resolver = resolve
    );
    const onClick: EventListenerObject = {
      handleEvent(ev) {
        const closest = toClosestTarget(ev, selector);

        resolver(closest);
      },
    };
    const el = await fixture(
      html`
        <div @click=${onClick} @keyup=${onClick}>
          <button>${$_textContent}</button>
        </div>
      `
    );

    const buttonEl = el.querySelector<HTMLButtonElement>('button');

    buttonEl?.click();

    const closest = await task;

    $_elementNode ?
      expect(closest).instanceOf($_elementNode) :
      expect(closest).toEqual($_elementNode);

    expect(closest?.textContent).toEqual($_textContent);
  });

});
