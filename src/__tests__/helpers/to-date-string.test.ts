import { expect } from '@open-wc/testing';

import { toDateString } from '../../helpers/to-date-string';

describe(toDateString.name, () => {
  it('returns date string', () => {
    const testDateStr = '2020-02-02';

    const result = toDateString(new Date(testDateStr));

    expect(result).equal(testDateStr);
  });

});
