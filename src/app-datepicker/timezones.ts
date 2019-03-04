interface OptionsToDateString {
  year: string;
  month: string;
  day: string;
  hour: string;
  timezone: string;
}

import { arrayFilled, toFormattedDateString } from '../../datepicker-helpers';

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
const hours = arrayFilled(24).map((_, i) => i);
const toDateString = (options: OptionsToDateString) => {
  const {
    year,
    month,
    day,
    hour,
    timezone,
  }: OptionsToDateString = options || {};
  return `${year}-${month}-${day}T${hour}:00:00.000${timezone}`;
};

// function getNewDateWithTimezone(dateString: string, timezone: string) {
//   const sign = timezone.slice(0, 1);
//   const [hour, minute] = timezone.slice(1).split(':');
//   const hour2 = dateString.replace(/^\d{4}-\d{2}-\d{2}T(\d{2}).+/i, '$1');
//   const minute2 = dateString.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:(\d{2}).+/i, '$1');
//   const time = ((+hour * 3600) + +minute) * ('+' === sign ? -1 : 1);
//   const time2 = +hour2 * 3600 + +minute2;
//   const isSameDay = (time + time2) < 86400;
//   const isPreviousDay = (time + time2) < 0;
//   const shortDateString = dateString.replace(/^(.+)T.+/i, '$1');

//   if (isSameDay && !isPreviousDay) return shortDateString;

//   const [fy, m, d] = shortDateString.split('-').map(parseFloat);
//   return [fy, `0${m}`.slice(-2), `0${d + (isPreviousDay ? -1 : 1)}`.slice(-2)].join('-');
// }

export interface DateString {
  date: string;
  value: string;
}
interface GetAllDateStrings {
  timezone: string;
  dates: DateString[];
}
export function getAllDateStrings() {
  const fy = '2020';
  const m = '02';
  const d = '02';

  const tzObj: Record<string, GetAllDateStrings> = {};

  for (const tz of timezones) {
    const dateStringsList = hours.map((h) => {
      const dateString = toDateString({
        year: fy,
        month: m,
        day: d,
        hour: `0${h}`.slice(-2),
        timezone: tz,
      });

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
      return {
        date: new Date(dateString).toJSON(),
        value: toFormattedDateString(new Date(dateString)),
      };
    });

    tzObj[tz] = { timezone: tz, dates: dateStringsList };
  }

  return tzObj;
}
