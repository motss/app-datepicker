# API References

## AppDatepicker

![AppDatepicker](https://user-images.githubusercontent.com/10607759/54127977-f8da5080-4445-11e9-8703-e38c3c2e7765.png)

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `firstDayOfWeek` | Number | `0` | First day of week |
| `showWeekNumber` | Boolean | `false` | If true, week number renders. |
| `weekNumberType` | String | `first-4-day-week` | Week number type. Possible values: `first-day-of-year`, `first-full-week`.
| `landscape` | Boolean | `false` | If true, datepicker renders in landscape mode. |
| `startView` | String | `calendar` | Initial view when datepicker renders. Possible values: `yearList`. |
| `min` | String | | Minimum date that is selectable/ focusable. Accepts [ISO 8601 date format][iso-8601-date-format-url], e.g. `2020-02-02`, `2020-02-02T00:00:00.000Z`, etc. |
| `max` | String | | Maximum date that is selectable/ focusable. Accepts [ISO 8601 date format][iso-8601-date-format-url], e.g. `2020-02-02`, `2020-02-02T00:00:00.000Z`, etc. |
| `value` | String | _<today's date>_ | Selected/ focused date in the format of `yyyy-MM-dd`, e.g. `2020-02-02`. |
| `locale` | String | _<System's default locale>_ | [ISO 639][iso-639-url] language code, e.g. `en-US`. |
| `disabledDays` | String | | Week days to be disabled for selection, e.g. `0,6` disables selection for dates that are weekends (Saturday, Sunday). |
| `disabledDates` | String | | Dates to be disabled for selection. Accepts [ISO 8601 date format][iso-8601-date-format-url], e.g. `2020-02-02`, `2020-02-02T00:00:00.000Z`. |
| `weekLabel` | String | `Wk` | Label for week number when `showWeekNumber` is true. |
| `dragRatio` | Number | `.15` | Minimum drag distance to switch between calendars of different months, e.g. `.15` of the total draggable distance of a calendar will trigger the switch. If the drag distance is too small, the drag will return to its initial state. |

### Methods

_None_

### Events

| Event | Description |
| --- | --- |
| `datepicker-first-updated` | Fires when datepicker first renders. Returns `{ firstFocusableElement, value }` where `firstFocusableElement` is of type [HTMLElement][htmlelement-mdn-url] and `value` is of type [string][string-mdn-url], e.g. `{ firstFocusableElement: <HTMLElement>, value: '2020-02-02' }`. |
| `datepicker-animation-finished` | Fires when drag animation finishes during the switch between calendars. Returns no value. |
| `datepicker-keyboard-selected` | Fires when datepicker updates its `value` via keyboard input (Enter or Space key). Returns `{ value }` where `value` is of type [string][string-mdn-url], e.g. `{ value: '2020-02-02' }`. |

### Custom properties

| Custom property | Default | Description |
| --- | --- | --- |
| `--app-datepicker-primary-color` | `#1a73e8` | Primary color. |
| `--app-datepicker-border-radius` | `8px` | Radius of outer border edge. |
| `--app-datepicker-border-top-left-radius` | `--app-datepicker-border-radius` | Radius of outer top-left border edge. |
| `--app-datepicker-border-top-right-radius` | `--app-datepicker-border-radius` | Radius of outer top-right border edge. |
| `--app-datepicker-border-bottom-right-radius` | `--app-datepicker-border-radius` | Radius of outer bottom-right border edge. |
| `--app-datepicker-border-bottom-left-radius` | `--app-datepicker-border-radius` | Radius of outer bottom-left border edge. |
___

## AppDatepickerDialog

![AppDatepickerDialog](https://user-images.githubusercontent.com/10607759/54127976-f8da5080-4445-11e9-94b6-8406f4f28212.png)

### Properties

| Property | Type | Default | Inherited | Description |
| --- | --- | --- | --- | --- |
| `firstDayOfWeek` | Number | `0` | [AppDatepicker][app-datepicker-url] | First day of week |
| `showWeekNumber` | Boolean | `false` | [AppDatepicker][app-datepicker-url] | If true, week number renders. |
| `weekNumberType` | String | `first-4-day-week` | [AppDatepicker][app-datepicker-url] | Week number type. Possible values: `first-day-of-year`, `first-full-week`.
| `landscape` | Boolean | `false` | [AppDatepicker][app-datepicker-url] | If true, datepicker renders in landscape mode. |
| `startView` | String | `calendar` | [AppDatepicker][app-datepicker-url] | Initial view when datepicker renders. Possible values: `yearList`. |
| `min` | String | | [AppDatepicker][app-datepicker-url] | Minimum date that is selectable/ focusable. Accepts [ISO 8601 date format][iso-8601-date-format-url], e.g. `2020-02-02`, `2020-02-02T00:00:00.000Z`, etc. |
| `max` | String | | [AppDatepicker][app-datepicker-url] | Maximum date that is selectable/ focusable. Accepts [ISO 8601 date format][iso-8601-date-format-url], e.g. `2020-02-02`, `2020-02-02T00:00:00.000Z`, etc. |
| `value` | String | _<today's date>_ | [AppDatepicker][app-datepicker-url] | Selected/ focused date in the format of `yyyy-MM-dd`, e.g. `2020-02-02`. |
| `locale` | String | _<System's default locale>_ | [AppDatepicker][app-datepicker-url] | [ISO 639][iso-639-url] language code, e.g. `en-US`. |
| `disabledDays` | String | | [AppDatepicker][app-datepicker-url] | Week days to be disabled for selection, e.g. `0,6` disables selection for dates that are weekends (Saturday, Sunday). |
| `disabledDates` | String | | [AppDatepicker][app-datepicker-url] | Dates to be disabled for selection. Accepts [ISO 8601 date format][iso-8601-date-format-url], e.g. `2020-02-02`, `2020-02-02T00:00:00.000Z`. |
| `weekLabel` | String | `Wk` | [AppDatepicker][app-datepicker-url] | Label for week number when `showWeekNumber` is true. |
| `dragRatio` | Number | `.15` | [AppDatepicker][app-datepicker-url] | Minimum drag distance to switch between calendars of different months, e.g. `.15` of the total draggable distance of a calendar will trigger the switch. If the drag distance is too small, the drag will return to its initial state. |
| `dismissLabel` | String | `cancel` | | Label of dismiss button. |
| `confirmLabel` | String | `ok` | | Label of confirm button. |
| `noFocusTrap` | Boolean | `false` | | If true, focus will be _trapped_ inside the datepicker dialog. |

### Methods

| Method | Description |
| --- | --- |
| `open()` | Open the datepicker dialog. |
| `close()` | Close the datepicker dialog. |

### Events

| Event | Inherited | Description |
| --- | --- | --- |
| `datepicker-first-updated` | [AppDatepicker][app-datepicker-url] | Fires when datepicker first renders. Returns `{ firstFocusableElement, value }` where `firstFocusableElement` is of type [HTMLElement][htmlelement-mdn-url] and `value` is of type [string][string-mdn-url], e.g. `{ firstFocusableElement: <HTMLElement>, value: '2020-02-02' }`. |
| `datepicker-animation-finished` | [AppDatepicker][app-datepicker-url] | Fires when drag animation finishes during the switch between calendars. Returns no value. |
| `datepicker-keyboard-selected` | [AppDatepicker][app-datepicker-url] | Fires when datepicker updates its `value` via keyboard input (Enter or Space key). Returns `{ value }` where `value` is of type [string][string-mdn-url], e.g. `{ value: '2020-02-02' }`. |
| `datepicker-dialog-first-updated` | | Fires when datepicker dialog first renders. Returns `{ value }` where `value` is of type [string][string-mdn-url], e.g. `{ value: '2020-02-02' }`. |
| `datepicker-dialog-opened` | | Fires when datepicker dialog opens. Returns `{ firstFocusableElement, opened, value }` where they are of type [HTMLElement][htmlelement-mdn-url], type [boolean][boolean-mdn-url], and type [string][string-mdn-url] respectively, e.g. `{ firstFocusableElement: <HTMLElement>, opened: true, value: '2020-02-02' }`. |
| `datepicker-dialog-closed` | | Fires when datepicker dialog closes. Returns `{ opened, value }` where `opened` is of type [boolean][boolean-mdn-url] and `value` is of type [string][string-mdn-url], e.g. `{ opened: false, value: '2020-02-02' }`. |

### Custom properties

| Custom property | Default | Inherited | Description |
| --- | --- | --- | --- |
| `--app-datepicker-primary-color` | `#1a73e8` | [AppDatepicker][app-datepicker-url] | Primary color. |
| `--app-datepicker-border-radius` | `8px` | [AppDatepicker][app-datepicker-url] | Radius of outer border edge. |
| `--app-datepicker-border-top-left-radius` | `--app-datepicker-border-radius` | [AppDatepicker][app-datepicker-url] | Radius of top-left border edge. |
| `--app-datepicker-border-top-right-radius` | `--app-datepicker-border-radius` | [AppDatepicker][app-datepicker-url] | Radius of top-right border edge. |
| `--app-datepicker-border-bottom-right-radius` | `--app-datepicker-border-radius` | [AppDatepicker][app-datepicker-url] | Radius of bottom-right border edge. |
| `--app-datepicker-border-bottom-left-radius` | `--app-datepicker-border-radius` | [AppDatepicker][app-datepicker-url] | Radius of bottom-left border edge. |
| `--app-datepicker-dialog-z-index` | `24` | | Stack order of datepicker dialog. |

<!-- References -->
[app-datepicker-url]: #appdatepicker
[iso-8601-date-format-url]: https://en.wikipedia.org/wiki/ISO_8601
[iso-639-url]: https://en.wikipedia.org/wiki/ISO_639

<!-- MDN -->
[htmlelement-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
