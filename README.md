[![GitHub version](https://badge.fury.io/gh/motss%2Fjv-datepicker.svg)](http://badge.fury.io/gh/motss%2Fjv-datepicker)
[![Bower version](https://badge.fury.io/bo/jv-datepicker.svg)](http://badge.fury.io/bo/jv-datepicker)

# jv-datepicker
![jv-datepicker-v2-dark-portrait](https://cloud.githubusercontent.com/assets/10607759/11032650/1e9b9d36-8718-11e5-95b3-4c5c7baaef3a.png)
![jv-datepicker-v2-light-portrait](https://cloud.githubusercontent.com/assets/10607759/11032651/1e9fb0ba-8718-11e5-823a-37f18efeead6.png)

<!-- ![light-themed-jv-datepicker-landscape](https://cloud.githubusercontent.com/assets/10607759/10119266/ce6d5b0e-64c3-11e5-843d-1310de755315.png)
![dark-themed-jv-datepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/10119265/c9ad900c-64c3-11e5-937e-338a770eebea.png) -->
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

## Event handling
`jv-datepicker` or `jv-datepicker-dialog` will fire an event `format-date` whenever a date is being selected via user interaction and it is one of the ways which user can make use of to retrieve the value of the selected date.

Example:

    <jv-datepicker on-format-date="{{selectedDate}}"></jv-datepicker>
    <jv-datepicker-dialog modal on-format-date="{{selectedDate}}"></jv-datepicker-dialog>

## Generating your own boilerplate code of the compounds
At the end of the demo, there is a section where user can play around with to generate your own boilerplate code with the attributes provided.


## Styling
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

## License

[MIT License](http://motss.mit-license.org/) © Rong Sen Ng
