# input[type="date"]

## Attributes (content attributes)

- `autocomplete`
- `list`
- `max`
- `min`
- `readonly`
- `required`
- `step`

## Properties (IDL attributes)

- `list`
- `value`
- `valueAsDate`
- `valueAsNumber`

## Methods (prototype)

- `select()`
- `stepDown()`
- `stepUp()`

## Events

- `input`
- `change`

## Forbidden attributes

- `accept`
- `alt`
- `checked`
- `dirname`
- `formaction`
- `formenctype`
- `formmethod`
- `formnovalidate`
- `formtarget`
- `height`
- `maxlength`
- `minlength`
- `multiple`
- `pattern`
- `placeholder`
- `size`
- `src`
- `width`

## Forbidden IDL attributes

- `checked`
- `selectionStart`
- `selectionEnd`
- `selectionDirection`

## Forbidden methods

- `setRangeText()`
- `setSelectionRange()`

## How `value` works

1. Must have a value that is **a valid date string**, if **specified and not empty**
2. **Set to empty string**, if the `value` is not a valid date string
3. `min` and `max` must be a **valid date string**
4. `step` attribute is expressed in days. _step scale factor_ is 86,400,000 milliseconds (1 day). Defaults to 1 day.
5. Round the element's value to nearest date when the element is suffering from a step mismatch.
6. **Convert a string to number** - Return an error if parsing a date from input results in an error, otherwise, return the number of milliseconds in UTC.
7. **Convert a number to string** - Return valid date string in UTC.
8. **Convert a string to Date object** - Return an error if parsing a date from input results in an error, otherwise, return UTC Date object.
9. **Convert a Date object to string** - REturn valid date string represents the date current at the time represented by input in UTC.
