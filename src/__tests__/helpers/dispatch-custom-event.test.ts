import { expect } from '@open-wc/testing';

import { dispatchCustomEvent } from '../../helpers/dispatch-custom-event';
import type { SupportedCustomEventDetail } from '../../typings';
import { messageFormatter } from '../test-utils/message-formatter';

type A = [SupportedCustomEventDetail['year-updated'] | undefined, SupportedCustomEventDetail['year-updated'] | null];

describe(dispatchCustomEvent.name, () => {
  const cases: A[] = [
    [undefined, null],
    [
      {
        isKeypress: true,
        key: 'Enter',
        year: 2020,
      },
      {
        isKeypress: true,
        key: 'Enter',
        year: 2020,
      },
    ],
  ];

  cases.forEach((a) => {
    it(
      messageFormatter('dispatches custom event (detail=%j)', a),
  async () => {
        const [testDetail, expected] = a;
        const testEventName: keyof SupportedCustomEventDetail = 'year-updated';

        const el = document.createElement('div');

        const done = new Promise<SupportedCustomEventDetail['year-updated']>((resolve) => {
          el.addEventListener(testEventName, (ev) => {
            resolve((ev as CustomEvent<SupportedCustomEventDetail['year-updated']>).detail);
          }, { once: true });
        });

        dispatchCustomEvent(el, testEventName, testDetail);

        const result = await done;

        expect(result).deep.equal(expected);
      }
    );
  });

});
