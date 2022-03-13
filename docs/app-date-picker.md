# AppDatePicker

![date-pickers-in-different-themes](https://user-images.githubusercontent.com/10607759/158053308-b43cb0e1-f510-4f0e-9804-827a349d5fc7.png)



## Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `chooseMonthLabel` | [String] | `Choose month` | Text label that is used in the tooltip when mouse hovering the dropdown icon button next to the current month and date in the `yearGrid` view. |
| `chooseMonthLabel` | [String] | `Choose month` | Text label that is used in the tooltip when mouse hovering the dropdown icon button next to the current month and date in the `yearGrid` view. |
| `chooseYearLabel` | [String] | `Choose year` | Text label that is used in the tooltip when mouse hovering the dropdown icon button next to the current month and date in the `calendar` view. |
| `disabledDates` | [String] | | Comma separated string consisting of all disabled dates. It prefers the [ISO 8601 date and time format], e.g. `2020-02-02,2020-12-12`, `2020-02-02T00:00:00.000Z,2020-12-12T00:00:00.000Z`. |
| `disabledDays` | [String] | | Comma separated string consisting of all disabled days. It accepts any values in between `0` and `6` (inclusive), e.g. `0,2,4` |
| `firstDayOfWeek` | [Number] | `0` | First day of the week in a calendar. It accepts any values in between `0` and `6` (inclusive). |
| `landscape` | [Boolean] | `false` | When it is in `landscape` mode, the picker is rendered with a double sided layout where the current month and year is on the left and the calendar is on the right. |
| `locale` | [String] | `<system_default_locale>` | [ISO 639] language code, e.g. `en-US`. |
| `max` | [String] | | Maximum date that is used to construct the date range internally for all displayable dates in the calendar. When it is not set or set to `undefined`, it is set to `MAX_DATE` which is `2100-12-31`. It prefers the [ISO 8601 date and time format], e.g. `2020-02-02`, `2020-02-02T00:00:00.000Z`. |
| `min` | [String] | | Minimum date that is used to construct the date range internally for all displayable dates in the calendar. When it is not set or set to `undefined`, it is set to `MIN_DATE` which is [1970-01-01]. It prefers the [ISO 8601 date and time format], e.g. `2020-02-02`, `2020-02-02T00:00:00.000Z`. |
| `nextMonthLabel` | [String] | `Next month` | Text label that is used in the tooltip when mouse hovering the chevron right (`>`) icon button to navigate to the next calendar month if available. |
| `previousMonthLabel` | [String] | `Previous month` | Text label that is used in the tooltip when mouse hovering the chevron left (`<`) icon button to navigate to the previous calendar month if available. |
| `selectedDateLabel` | [String] | `Selected date` | Text label that is used in the tooltip when mouse hovering the selected date (`20`) in the calendar. |
| `selectedYearLabel` | [String] | `Selected year` | Text label that is used in the tooltip when mouse hovering the selected year (`2020`) in the year grid. |
| `shortWeekLabel` | [String] | `Wk` | Text label that is used in displaying the header of the week numbers column when `showWeekNumber` is set to `true`. |
| `showWeekNumber` | [Boolean] | `false` | When it is set to `true`, a column of week numbers with a short week label defined by the value of `shortWeekLabel` will be displayed on the very left side of the calendar. |
| `startView` | [String] | `calendar` | It is used to render the initial view of the picker. It accepts either `calendar` or `yearGrid`. |
| `todayDateLabel` | [String] | `Today date` | Text label used in the tooltip when mouse hovering today's date in the calendar. |
| `todayYearLabel` | [String] | `Today year` | Text label used in the tooltip when mouse hovering today's year in the year grid. |
| `value` | [String] | `<today_date>` | Selected date in the format of `yyyy-MM-dd`, e.g. `2020-02-02`. It can also be used as an input to select a date in the calendar with a string date that is in the [ISO 8601 date and time format], e.g. `2020-02-02T00:00:00.000Z`. |
| `weekLabel` | [String] | `Week` | Text label used in the tooltip when mouse hovering the header of the week numbers column defined by the value of `shortWeekLabel` in the calendar with `showWeekNumber` being set to true. |
| `weekNumberTemplate` | [String] | `Week %s` | Text label used in the tooltip when mouse hovering a week number in the calendar with `showWeekNumber` being set to true, e.g. `Week 7` when mouse hovering week number `7`. |
| `weekNumberType` | [String] | `first-4-day-week` | It is used to configure how week number is calculated. The accepted values are `first-4-day-week`, `first-day-of-year`, and `first-full-week`. |
| `valueAsDate` | [Date] | `<today_date>` | Selected date represented by the JavaScript [Date] object, e.g. `new Date('2020-02-02')`. |
| `valueAsNumber` | [Number] | `<today_date>` | Selected date in milliseconds since the [ECMAScript epoch], e.g. `1580601600000`. |



## Methods

_None_



## Events

<table role="table">
  <thead>
    <tr>
      <th>Event</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>date-updated</code></td>
<td>Fires when the selected date changes. Returned an object of <br /><br />

```ts
interface DateUpdated {
  isKeypress: boolean;
  value: string;
  valueAsDate: Date;
  valueAsNumber: number;
}
```

via the read-only `detail` property.
</td>
    </tr>
    <tr>
      <td><code>first-updated</code></td>
<td>Fires when the picker first rendered. Returned an object of <br /><br />

```ts
interface FirstUpdated {
  focusableElement: HTMLElement[];
  value: string;
  valueAsDate: Date;
  valueAsNumber: number;
}
```

via the read-only `detail` property.
</td>
    </tr>
    <tr>
      <td><code>year-updated</code></td>
<td>Fires when the selected year changes. Returned an object of <br /><br />

```ts
interface YearUpdated {
  year: number;
}
```

via the read-only `detail` property.
</td>
    </tr>
  </tbody>
</table>



## CSS Custom Properties

### Base properties used for all elements

| Property | Default | Description |
| --- | --- | --- |
| `--app-focus` | `#000` | Border color for all focus state. |
| `--app-hover` | `#6200ee` | Border color for all hover state. |
| `--app-on-disabled` | `rgba(0, 0, 0, .38)` | Text color for all disable state. |
| `--app-on-focus` | `#000` | Text color for all focus state. |
| `--app-on-hover` | `#000` | Text color for all hover state. |
| `--app-on-primary` | `#fff` | Primary text color. |
| `--app-on-surface` | `#000` | Surface text color. |
| `--app-on-today` | `#000` | Today text color. |
| `--app-on-weekday` | `#8c8c8c` | Weekday text color. |
| `--app-primary` | `#6200ee` | Primary background color. |
| `--app-selected-focus` | `#000` | Border color for all focus state when selected. |
| `--app-selected-hover` | `#6200ee` | Border color for all hover state when selected. |
| `--app-selected-on-focus` | `#fff` | Text color for all focus state when selected. |
| `--app-selected-on-hover` | `#fff` | Text color for all hover state when selected. |
| `--app-shape` | `8px` | Border radius of the picker. |
| `--app-surface` | `#fff` | Background color of the picker surface. |
| `--app-today` | `#000` | Border color of today date. |

### `app-date-picker` specific properties

| Property | Default | Description |
| --- | --- | --- |
| `--date-picker-max-height` | `calc(52px + 4px + (32px * 7))` | Maximum height of the picker. |
| `--date-picker-min-height` | `calc(52px + 4px + (32px * 7))` | Minimum height of the picker. |
| `--date-picker-min-width` | `calc((16px * 2) + (32px * 7))` | Minimum width of the picker. |
| `--date-picker-mx-width` | `calc((16px * 2) + (32px * 7))` | Maximum width of the picker. |



## CSS Shadow Parts

| Part | Description |
| --- | --- |
| `body` | Picker body, might contain `calendar` or `year-grid`. |
| `calendar-day` | Calendar day. |
| `calendar` | Calendar. |
| `caption` | Calendar caption. |
| `header` | Picker header. |
| `table` | Calendar table. |
| `week-number` | Calendar week number. |
| `weekday-value` | Calendar weekday. |
| `weekday` | Calendar weekday which contains `weekday-value`. |
| `weekdays` | Calendar weekdays. |
| `year-grid` | Year grid. |
| `year` | Year grid button. |



<!-- References -->
[ISO 8601 date and time format]: https://en.wikipedia.org/wiki/ISO_8601
[1970-01-01]: https://en.wikipedia.org/wiki/Epoch_(computing)
[ISO 639]: https://en.wikipedia.org/wiki/ISO_639
[ECMAScript epoch]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps

<!-- MDN references -->
[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
