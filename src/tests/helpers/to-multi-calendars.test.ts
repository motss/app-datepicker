import { expect } from '@open-wc/testing';

import { toFormatters } from '../../helpers/to-formatters';
import { toMultiCalendars } from '../../helpers/to-multi-calendars';
import type { ToMultiCalendarsInit } from '../../helpers/typings';
import { messageFormatter } from '../test-utils/message-formatter';

describe(toMultiCalendars.name, () => {
  const locale = 'en-US';
  const {
    dayFormat,
    fullDateFormat,
    longWeekdayFormat,
    narrowWeekdayFormat,
  } = toFormatters(locale);
  const defaultInit: ToMultiCalendarsInit = {
    currentDate: new Date('2020-02-02'),
    dayFormat,
    fullDateFormat,
    locale,
    longWeekdayFormat,
    narrowWeekdayFormat,
  };

  type A = [Partial<ToMultiCalendarsInit>, number];

  const cases: A[] = [
    [
      {},
      1,
    ],
    [
      {
        count: 2,
      },
      3,
    ],
  ];

  cases.forEach((a) => {
    const [testPartialInit, expected] = a;

    it(
      messageFormatter('returns calendar with optional count (%j)', a),
      () => {
        const result = toMultiCalendars({
          ...defaultInit,
          ...testPartialInit,
        });

        expect(result.calendars).have.length(expected);
        expect(result.disabledDatesSet.size).equal(0);
        expect(result.disabledDaysSet.size).equal(0);
      }
    );
  });

  type A1 = [Partial<ToMultiCalendarsInit>, number, number[]];

  const cases1: A1[] = [
    [
      {
        min: new Date('2020-01-01'),
      },
      1,
      [6],
    ],
    [
      {
        max: new Date('2020-03-03'),
      },
      1,
      [6],
    ],
    [
      {
        min: new Date('2020-01-01'),
        max: new Date('2020-03-03'),
      },
      1,
      [6],
    ],
    [
      {
        min: new Date('2020-03-03'),
      },
      1,
      [0],
    ],
    [
      {
        max: new Date('2020-01-01'),
      },
      1,
      [0],
    ],
  ];

  cases1.forEach((a) => {
    const [testPartialInit, expectedCalendars, expectedMonthRows] = a;

    it(
      messageFormatter('returns calendar with optional min, max (%j)', a),
      () => {
        const result = toMultiCalendars({
          ...defaultInit,
          ...testPartialInit,
        });

        expect(result.calendars).have.length(expectedCalendars);
        expect(
          result.calendars.map(n => n.calendar.length)
        ).deep.equal(expectedMonthRows);
        expect(result.disabledDatesSet.size).equal(0);
        expect(result.disabledDaysSet.size).equal(0);
      }
    );
  });

  type A2 = [Partial<ToMultiCalendarsInit>, number, number];

  const cases2: A2[] = [
    [
      {
        disabledDates: [new Date('2020-02-01'), new Date('2020-02-10')],
      },
      2,
      0,
    ],
    [
      {
        disabledDays: [0, 2],
      },
      8,
      2,
    ],
  ];

  cases2.forEach((a) => {
    const [testPartialInit, expectedDisabledDates, expectedDisabledDays] = a;

    it(
      messageFormatter('returns calendar with optional disabled dates, days (partialInit=%j)', a),
      () => {
        const result = toMultiCalendars({
          ...defaultInit,
          ...testPartialInit,
        });

        expect(result.disabledDatesSet.size).equal(expectedDisabledDates);
        expect(result.disabledDaysSet.size).equal(expectedDisabledDays);
      }
    );
  });
});
