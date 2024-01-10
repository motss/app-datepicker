import { describe, expect, it } from 'vitest';

import { toFormatters } from '../../helpers/to-formatters';
import { toMultiCalendars } from '../../helpers/to-multi-calendars';
import type { ToMultiCalendarsInit } from '../../helpers/typings';

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

  it.each<{
    $_value: number;
    partialInit: Partial<ToMultiCalendarsInit>;
  }>([
    {
      $_value: 1,
      partialInit: {},
    },
    {
      $_value: 3,
      partialInit: { count: 2 },
    },
  ])('returns calendar with optional count ($partiaInit)', ({
    $_value,
    partialInit,
  }) => {
    const result = toMultiCalendars({
      ...defaultInit,
      ...partialInit,
    });

    expect(result.calendars).toHaveLength($_value);
    expect(result.disabledDatesSet.size).toBe(0);
    expect(result.disabledDaysSet.size).toBe(0);
  });

  it.each<{
    $_calendarLen: number;
    $_monthRowLen: number[];
    partialInit: Partial<ToMultiCalendarsInit>;
  }>([
    {
      $_calendarLen: 1,
      $_monthRowLen: [6],
      partialInit: {
        min: new Date('2020-01-01'),
      },
    },
    {
      $_calendarLen: 1,
      $_monthRowLen: [6],
      partialInit: {
        max: new Date('2020-03-03'),
      },
    },
    {
      $_calendarLen: 1,
      $_monthRowLen: [6],
      partialInit: {
        max: new Date('2020-03-03'),
        min: new Date('2020-01-01'),
      },
    },
    {
      $_calendarLen: 1,
      $_monthRowLen:[0],
      partialInit: {
        min: new Date('2020-03-03'),
      },
    },
    {
      $_calendarLen: 1,
      $_monthRowLen: [0],
      partialInit: {
        max: new Date('2020-01-01'),
      },
    },
  ])('returns calendar with optional min, max ($partialInit)', ({
    $_calendarLen,
    $_monthRowLen,
    partialInit,
  }) => {
    const result = toMultiCalendars({
      ...defaultInit,
      ...partialInit,
    });

    expect(result.calendars).toHaveLength($_calendarLen);
    expect(result.calendars.map(n => n.calendar.length)).toEqual($_monthRowLen);
    expect(result.disabledDatesSet.size).toBe(0);
    expect(result.disabledDaysSet.size).toBe(0);
  });

  it.each<{
    $_disabledDates: number;
    $_disabledDays: number;
    partialInit: Partial<ToMultiCalendarsInit>;
  }>([
    {
      $_disabledDates: 2,
      $_disabledDays: 0,
      partialInit: {
        disabledDates: [new Date('2020-02-01'), new Date('2020-02-10')],
      },
    },
    {
      $_disabledDates: 8,
      $_disabledDays: 2,
      partialInit: {
        disabledDays: [0, 2],
      },
    },
  ])('returns calendar with optional disabled dates, days (partialInit=$partialInit)', ({
    $_disabledDates,
    $_disabledDays,
    partialInit,
  }) => {
    const result = toMultiCalendars({
      ...defaultInit,
      ...partialInit,
    });

    expect(result.disabledDatesSet.size).toEqual($_disabledDates);
    expect(result.disabledDaysSet.size).toEqual($_disabledDays);
  });

});
