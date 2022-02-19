import { expect } from '@open-wc/testing';

import { splitString } from '../../helpers/split-string';
import { messageFormatter } from '../test-utils/message-formatter';

describe(splitString.name, () => {
  const str = 'hello, world, everyone';
  const expected = str.split(/,\s*/);

  type CaseSplitString = [
    source: string,
    expected: string[]
  ];
  const casesSplitString: CaseSplitString[] = [
    ['', []],
    [str, expected],
  ];
  casesSplitString.forEach((a) => {
    it(
      messageFormatter('splits string (%s)', a),
      () => {
        const [testSource, expected] = a;
        const result = splitString(testSource);

        expect(result).deep.equal(expected);
      }
    );
  });

  type CaseSplitStringWithOptionalCallbackAndSeparator = [
    separator?: RegExp
  ];
  const casesSplitStringWithOptionalCallback: CaseSplitStringWithOptionalCallbackAndSeparator[] = [
    [],
    [/,\s/],
  ];
  casesSplitStringWithOptionalCallback.forEach((a) => {
    it(
      messageFormatter('splits string with optional callback and optional separator (%s)', a),
      () => {
        const [testSeparator] = a;

        const result = splitString<[string]>(
          str,
          (n) => [n],
          testSeparator
        );

        expect(result).deep.equal(expected.map(n => [n]));
      }
    );
  });

});
