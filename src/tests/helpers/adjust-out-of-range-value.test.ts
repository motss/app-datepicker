import { adjustOutOfRangeValue } from '../../helpers/adjust-out-of-range-value';
import { assert, test } from '../utils';

const cases: ([...Parameters<typeof adjustOutOfRangeValue>, ReturnType<typeof adjustOutOfRangeValue>])[] = [
  [
    new Date('2020-02-02'),
    new Date('2020-02-12'),
    new Date('2020-01-01'),
    new Date('2020-02-02'),
  ],
  [
    new Date('2020-02-02'),
    new Date('2020-02-12'),
    new Date('2020-02-15'),
    new Date('2020-02-12'),
  ],
  [
    new Date('2020-02-02'),
    new Date('2020-02-12'),
    new Date('2020-02-08'),
    new Date('2020-02-08'),
  ],
];

cases.forEach(([
  testMin,
  testMax,
  testDate,
  expected,
]) => {
  test('returns adjusted date (min=%s, max=%s, date=%s)', () => {
    const result = adjustOutOfRangeValue(testMin, testMax, testDate);

    assert.equal(result, expected);
  });
});

test.run();
