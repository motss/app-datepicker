# jv-datepicker

See the [component page](http://motss.github.io/jv-datepicker/components/jv-datepicker/) for more information.

An custom Polymer element created to provide a datepicker based on Google's Material Design that is more compelling and rich with features.

Example:

    <jv-datepicker><jv-datepicker>
    <jv-datepicker-dialog modal></jv-datepicker-dialog>

`jv-datepicker` provides a regular datepicker element.
While `jv-datepicker-dialog` has a `jv-datepicker` being wrapped inside a dialog.

### Event handling

`paper-swipe` will fire an event `format-date` whenever a date is being selected via user interaction and it is one of the ways which user can make use of to retrieve the value of the selected date.

Example:

    <jv-datepicker on-format-date="{{selectedDate}}"></jv-datepicker>

    <jv-datepicker-dialog modal on-format-date="{{selectedDate}}"></jv-datepicker-dialog>

## Demo
[Click here go the demo app](http://motss.github.io/jv-datepicker/components/jv-datepicker/demo/index.html)

### Attributes
<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<th>bindDate</th>
<td>String</td>
<td>2015-09-31</td>
<td>Return selected date via user interaction.</td>
</tr>
<tr>
<th>disableDays</th>
<td>Array</td>
<td>[]</td>
<td>Input any number from 0 (Sunday) to 6 (Saturday) to disable any day.</td>
</tr>
<tr>
<th>format</th>
<td>String</td>
<td>yyyy-mm-dd</td>
<td>Input date format string for the selected date.</td>
</tr>
<tr>
<th>startDay</th>
<td>Number</td>
<td>0</td>
<td>Input any number from 0 (Sunday) to 6 (Saturday) as the first day of the week.</td>
</tr>
</tbody>
</table>

## Getting Started

1. Install with bower  
`bower install --save jv-datepicker`

2. Load the web component and the dependencies

For `jv-datepicker`,

```html
<link rel="import" href="path-to-bower-components/jv-datepicker/jv-datepicker.html">
```
For `jv-datepicker-dialog`,

```html
<link rel="import" href="path-to-bower-components/jv-datepicker/jv-datepicker-dialog.html">
```

3. Markup with &lt;jv-datepicker&gt&lt;/jv-datepicker&gt or &lt;/jv-datepicker-dialog&gt;

4. Done

### Supported Browsers

[Same as Polymer](http://www.polymer-project.org/resources/compatibility.html)
