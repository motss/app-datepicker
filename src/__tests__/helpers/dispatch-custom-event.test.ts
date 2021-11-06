import { expect } from '@open-wc/testing';

import { dispatchCustomEvent } from '../../helpers/dispatch-custom-event';
import type { SupportedCustomEventDetail } from '../../typings';
import { messageFormatter } from '../test-utils/message-formatter';

type A = [SupportedCustomEventDetail['changed'] | undefined, SupportedCustomEventDetail['changed'] | null];

describe(dispatchCustomEvent.name, () => {
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
        const testEventName: keyof SupportedCustomEventDetail = 'changed';

        const el = document.createElement('div');

        const done = new Promise<SupportedCustomEventDetail['changed']>((resolve) => {
          el.addEventListener(testEventName, (ev) => {
            resolve((ev as CustomEvent<SupportedCustomEventDetail['changed']>).detail);
          }, { once: true });
        });

        dispatchCustomEvent(el, testEventName, testDetail);

        const result = await done;

        expect(result).deep.equal(expected);
      }
    );
  });

});
