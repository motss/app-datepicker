[![GitHub version](https://badge.fury.io/gh/motss%2Fjv-datepicker.svg)](http://badge.fury.io/gh/motss%2Fjv-datepicker)

# jv-datepicker
![light-themed-jv-datepicker-v1](https://cloud.githubusercontent.com/assets/10607759/10119266/ce6d5b0e-64c3-11e5-843d-1310de755315.png)
![dark-themed-jv-datepicker-v3](https://cloud.githubusercontent.com/assets/10607759/10119265/c9ad900c-64c3-11e5-937e-338a770eebea.png)
<!-- ![jv-datepicker-landscape](https://cloud.githubusercontent.com/assets/10607759/9871233/c9e33d04-5bc4-11e5-8af9-d93d080d8815.PNG) -->
<!-- ![jv-datepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/9871234/cacf33c6-5bc4-11e5-833a-96cbd3dbf440.PNG) -->
<!-- ![dark-themed-jv-datepicker](https://cloud.githubusercontent.com/assets/10607759/10106751/1bec71c0-63e9-11e5-93f2-ee197d2ba0f2.png) -->

See the [component page](http://motss.github.io/jv-datepicker/components/jv-datepicker/) for more information.

An custom Polymer element built from scratch to provide a datepicker based on Google's Material Design that is more compelling and rich with features.

Example:

    <jv-datepicker><jv-datepicker>
    <jv-datepicker-dialog modal></jv-datepicker-dialog>
    <jv-datepicker-dialog with-backdrop></jv-datepicker-dialog>
    <jv-datepicker-dialog></jv-datepicker-dialog>

`jv-datepicker` provides a regular datepicker element.
While `jv-datepicker-dialog` has a `jv-datepicker` being wrapped inside a dialog.

### Event handling

`jv-datepicker` or `jv-datepicker-dialog` will fire an event `format-date` whenever a date is being selected via user interaction and it is one of the ways which user can make use of to retrieve the value of the selected date.

Example:

    <jv-datepicker on-format-date="{{selectedDate}}"></jv-datepicker>

    <jv-datepicker-dialog modal on-format-date="{{selectedDate}}"></jv-datepicker-dialog>

## Demo
[Click here go the demo app + code boilerplate generator](http://motss.github.io/jv-datepicker/components/jv-datepicker/demo/index.html)

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
<tr>
<th>resetDate</th>
<td>Boolean</td>
<td>false</td>
<td>Reset calendar to current month and year.</td>
</tr>
</tbody>
</table>

### Styling
Now with mixins, head over to the [component page](http://motss.github.io/jv-datepicker/components/jv-datepicker/) for more details.

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

3. Markup with &lt;jv-datepicker&gt;&lt;/jv-datepicker&gt; or &lt;jv-datepicker-dialog&gt;&lt;/jv-datepicker-dialog&gt;

4. Done

### Supported Browsers

[Same as Polymer](http://www.polymer-project.org/resources/compatibility.html)
