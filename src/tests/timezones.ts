const timezones = [
  '-12:00',
  '-11:00',
  '-10:00',
  '-09:30',
  '-09:00',
  '-08:00',
  '-07:00',
  '-06:00',
  '-05:00',
  '-04:00',
  '-03:30',
  '-03:00',
  '-02:00',
  '-01:00',
  '-00:00',
  '+00:00',
  '+01:00',
  '+02:00',
  '+03:00',
  '+03:30',
  '+04:00',
  '+04:30',
  '+05:00',
  '+05:30',
  '+05:45',
  '+06:00',
  '+06:30',
  '+07:00',
  '+08:00',
  '+08:45',
  '+09:00',
  '+09:30',
  '+10:00',
  '+10:30',
  '+11:00',
  '+12:00',
  '+12:45',
  '+13:00',
  '+14:00',
];

interface DateStringVal {
  date: string;
  value: string;
}
export type DateString = [string, DateStringVal];
export function getAllDateStrings(): DateString[] {
  const fullYear = '2020';
  const month = '02';
  const date = '02';

  const timezonesSet: Map<string, DateStringVal> = new Map();
  const hours = Array.from(Array(24), (_, i) => i);

  /**
   * NOTE: Different date string with specified timezone will render the date output to be
   * different if the local is on another timezone which is also different from the specified
   * timezone from the date string. To avoid that, by normalizing the date output to be in UTC
   * timezone will most likely mimic the expected behavior as if the date string was the date
   * returned by the local browser.
   *
   * e.g. `2020-02-02T00:00:00.000-12:00` will have different output:
   *
   * 1. `2020-02-02T02:00:00.000+14:00` in GMT+14 timezone == `2020-02-01T12:00:00.000Z`
   * 2. `2020-02-02T00:00:00.000-12:00` in GMT-12 timezone == `2020-02-02T12:00:00.000Z`
   *
   * There is a clear difference between the 2 different timezone.
   */
  for (const timezone of timezones) {
    for (const hour of hours) {
      const isoDateString =
        `${fullYear}-${month}-${date}T${`0${hour}`.slice(-2)}:00:00.000${timezone}`;
      const jsonDate = new Date(isoDateString).toJSON();

      if (timezonesSet.has(jsonDate)) continue;

      timezonesSet.set(jsonDate, {
        date: jsonDate,
        value: jsonDate.replace(/^(.+)T.+/i, '$1'),
      });
    }
  }

  return Array.from(timezonesSet);
}
