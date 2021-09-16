import { expect } from '@open-wc/testing';

import { dateValidator } from '../../helpers/date-validator';
import { dispatchCustomEvent } from '../../helpers/dispatch-custom-event';
import type { SupportedCustomEvent } from '../../typings';
import { messageFormatter } from '../test-utils/message-formatter';

type A = [SupportedCustomEvent['changed'] | undefined, SupportedCustomEvent['changed'] | null];

describe(dateValidator.name, () => {
  const cases: A[] = [
    [undefined, null],
    [
      {
        isKeypress: true,
        value: '1',
      },
      {
        isKeypress: true,
        value: '1',
      },
    ],
  ];

  cases.forEach((a) => {
    it(
      messageFormatter('dispatches custom event (detail=%j)', a),
  async () => {
        const [testDetail, expected] = a;
        const testEventName: keyof SupportedCustomEvent = 'changed';

        const el = document.createElement('div');

        const done = new Promise<SupportedCustomEvent['changed']>((resolve) => {
          el.addEventListener(testEventName, (ev) => {
            resolve((ev as CustomEvent<SupportedCustomEvent['changed']>).detail);
          }, { once: true });
        });

        dispatchCustomEvent(el, testEventName, testDetail);

        const result = await done;

        expect(result).deep.equal(expected);
      }
    );
  });
});
