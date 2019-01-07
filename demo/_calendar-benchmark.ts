import { calendar } from './calendar';

const locale = 'en-US';
const dayFormatterFn = Intl.DateTimeFormat(locale, { day: 'numeric' }).format;
const fullDateFormatterFn = Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}).format;
const longWeekdayFormatterFn = Intl.DateTimeFormat(locale, { weekday: 'long' }).format;
const narrowWeekdayFormatterFn = Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format;
const selectedDate = new Date(Date.UTC(2018, 0, 1));
const benchmarksTime: number[] = [];

for (let i = 0, len = 1e3; i < len; i += 1) {
  const startAt = window.performance.now();
  calendar({
    dayFormatterFn,
    fullDateFormatterFn,
    longWeekdayFormatterFn,
    narrowWeekdayFormatterFn,

    locale,
    selectedDate,
    firstDayOfWeek: 0,
    idOffset: 0,
    showWeekNumber: true,
    weekNumberType: null,
  });
  benchmarksTime.push(window.performance.now() - startAt);
}

const avgTime = (benchmarksTime.reduce((p, n) => p + n, 0) / benchmarksTime.length).toFixed(3);

console.info(`${benchmarksTime.length} calendar rendering takes ${avgTime}ms on average`);
