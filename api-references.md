# API References

## AppDatepicker

![app-datepicker](https://user-images.githubusercontent.com/10607759/67633824-ce170c80-f8ef-11e9-8d20-856eb0e62409.jpg)

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
| `inline` | Boolean | `false` | If true, datepicker renders in inline mode without datepicker header. |
| `weekLabel` | String | `Wk` | Label for week number when `showWeekNumber` is true. |

<!-- | `dragRatio` | Number | `.15` | Minimum drag distance to switch between calendars of different months, e.g. `.15` of the total draggable distance of a calendar will trigger the switch. If the drag distance is too small, the drag will return to its initial state. | -->

### Methods

_None_

### Events

| Event | Description |
| --- | --- |
| `datepicker-first-updated` | Fires when datepicker first renders. Returns an object of type [DatepickerFirstUpdated]. |
| `datepicker-animation-finished` | Fires when drag animation finishes during the switch between calendars. Returns no value. |
| `datepicker-value-updated` | Fires when datepicker updates its `value` via keyboard input (Enter or Space key) or mouse clicks. Returns an object of type [DatepickerValueUpdated]. |

### Custom properties

| Custom property | Default | Description |
| --- | --- | --- |
| `--app-datepicker-accent-color` | `#1a73e8` | Accent color. |
| `--app-datepicker-bg-color` | `#fff` | Background color. |
| `--app-datepicker-border-bottom-left-radius` | `8px` | Radius of outer bottom-left border edge. |
| `--app-datepicker-border-bottom-right-radius` | `8px` | Radius of outer bottom-right border edge. |
| `--app-datepicker-border-top-left-radius` | `8px` | Radius of outer top-left border edge. |
| `--app-datepicker-border-top-right-radius` | `8px` | Radius of outer top-right border edge. |
| `--app-datepicker-color` | `#000` | Text color. |
| `--app-datepicker-disabled-day-color` | `rgba(0, 0, 0, .35)` | Text color of disabled day. |
| `--app-datepicker-focused-day-color` | `#fff` | Text color of focused day. |
| `--app-datepicker-selector-color` | `rgba(0, 0, 0, .55)` | Text color of selector buttons. |
| `--app-datepicker-separator-color` | `#ddd` | Separator color between selector and calendar. |
| `--app-datepicker-weekday-color` | `rgba(0, 0, 0, .55)` | Text color of weekday. |
___

## AppDatepickerDialog

![app-datepicker-dialog](https://user-images.githubusercontent.com/10607759/67633823-ce170c80-f8ef-11e9-9e21-e670b2acbed2.jpg)

It inherits all the properties, events, and custom properties from [AppDatepicker] by default.

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `dismissLabel` | String | `cancel` | Label of dismiss button. |
| `confirmLabel` | String | `ok` | Label of confirm button. |
| `noFocusTrap` | Boolean | `false` | If true, focus will be _trapped_ inside the datepicker dialog. |

<!-- | `dragRatio` | Number | `.15` | [AppDatepicker] | Minimum drag distance to switch between calendars of different months, e.g. `.15` of the total draggable distance of a calendar will trigger the switch. If the drag distance is too small, the drag will return to its initial state. | -->

### Methods

| Method | Description |
| --- | --- |
| `open()` | Open the datepicker dialog. |
| `close()` | Close the datepicker dialog. |

### Events

| Event | Description |
| --- | --- |
| `datepicker-dialog-first-updated` | Fires when datepicker dialog first renders. Returns an object of type [DatepickerFirstUpdated]. |
| `datepicker-dialog-opened` | Fires when datepicker dialog opens. Returns an object of type [DatepickerDialogOpened]. |
| `datepicker-dialog-closed` | Fires when datepicker dialog closes. Returns an object of type [DatepickerDialogClosed]. |

### Custom properties

| Custom property | Default | Description |
| --- | --- | --- | --- |
| `--app-datepicker-dialog-border-radius` | `8px` | Radius of outer border edge. |
| `--app-datepicker-dialog-scrim-bg-color` | `rgba(0, 0, 0, .55)` | Background color of dialog's scrim. |
| `--app-datepicker-dialog-z-index` | `24` | Stack order of datepicker dialog. |

## Interfaces

### KEY_CODES_MAP

```ts
enum KEY_CODES_MAP {
  ESCAPE = 27,
  SHIFT = 16,
  TAB = 9,
  ENTER = 13,
  SPACE = 32,
  PAGE_UP = 33,
  PAGE_DOWN = 34,
  END = 35,
  HOME = 36,
  ARROW_LEFT = 37,
  ARROW_UP = 38,
  ARROW_RIGHT = 39,
  ARROW_DOWN = 40,
}
```

### DatepickerFirstUpdated

```ts
interface DatepickerFirstUpdated {
  firstFocusableElement: HTMLElement;
  value: string;
}
```

### DatepickerValueUpdated

```ts
interface DatepickerValueUpdated {
  isKeypress: boolean;
  keyCode?: number; // See KEY_CODE_MAP enum.
  value: string;
}
```

### DatepickerDialogClosed

```ts
interface DatepickerDialogClosed {
  opened: boolean;
  value: string;
}
```

### DatepickerDialogOpened

```ts
interface DatepickerDialogOpened {
  firstFocusableElement: HTMLElement,
  opened: boolean;
  value: string;
}
```

<!-- References -->
[AppDatepicker]: #appdatepicker
[iso-8601-date-format-url]: https://en.wikipedia.org/wiki/ISO_8601
[iso-639-url]: https://en.wikipedia.org/wiki/ISO_639
[DatepickerFirstUpdated]: #datepickerfirstupdated
[DatepickerValueUpdated]: #datepickervalueupdated
[DatepickerDialogClosed]: #datepickerdialogclosed
[DatepickerDialogOpened]: #datepickerdialogopened

<!-- MDN -->
[htmlelement-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
