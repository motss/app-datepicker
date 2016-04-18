[![GitHub version](https://badge.fury.io/gh/motss%2Fjv-datepicker.svg)](http://badge.fury.io/gh/motss%2Fjv-datepicker)
[![Bower version](https://badge.fury.io/bo/jv-datepicker.svg)](http://badge.fury.io/bo/jv-datepicker)
[![Build Status](https://travis-ci.org/motss/jv-datepicker.svg?branch=master)](https://travis-ci.org/motss/jv-datepicker)

# jv-datepicker
<image src="https://cloud.githubusercontent.com/assets/10607759/14078902/232af734-f52c-11e5-9646-c0a5fb7899ef.png" alt="datepicker-light-theme" width="32%">
<image src="https://cloud.githubusercontent.com/assets/10607759/14078900/22302dae-f52c-11e5-9bb9-fb84f31075a8.png" alt="datepicker-dark-theme" width="32%">
<image src="https://cloud.githubusercontent.com/assets/10607759/14078901/22633d84-f52c-11e5-9041-02c805ac9843.png" alt="datepicker-goog-theme" width="32%">

<!-- ![light-themed-jv-datepicker-landscape](https://cloud.githubusercontent.com/assets/10607759/10119266/ce6d5b0e-64c3-11e5-843d-1310de755315.png)
![dark-themed-jv-datepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/10119265/c9ad900c-64c3-11e5-937e-338a770eebea.png) -->
<!-- ![jv-datepicker-landscape](https://cloud.githubusercontent.com/assets/10607759/9871233/c9e33d04-5bc4-11e5-8af9-d93d080d8815.PNG) -->
<!-- ![jv-datepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/9871234/cacf33c6-5bc4-11e5-833a-96cbd3dbf440.PNG) -->
<!-- ![dark-themed-jv-datepicker](https://cloud.githubusercontent.com/assets/10607759/10106751/1bec71c0-63e9-11e5-93f2-ee197d2ba0f2.png) -->

## Update (v2.4.0)
A list of new features have been added to the element:
- `minDate` (dates that are smaller than the predefined `minDate` will be disabled)
- `maxDate` (dates that are larger than the predefined `maxDate` will be disabled)
- `showLongDate` (to show long date instead of short date. Eg. Fri, May 12 2017)
- `inputDate` (To allow date change from the external eg. `paper-input`)
- `invalidDate` (Comes with `inputDate` to indicate whether the input date is in valid date format)
- `noAnimation` (To enable/ disable all animations and transitions of the datepicker)
- `pageEntryAnimation` (To customize the entry animation for page switching between months)
- `pageExitAnimation` (To customize the exit animation for page switching between months)
- `enforceDateChange` (A public method to force update a datepicker w/o any buttons to confirm date change)

- `theme` (To change the theme of the datepicker. Available options: `dark-theme`, `light-theme`, `goog-theme`)
- `view` (To forcefully change the view of the datepicker without respecting the orientation of the device: `horizontal`, `vertical`)

See the [component page](http://motss.github.io/jv-datepicker/components/jv-datepicker/) for more information.

An custom Polymer element built from scratch to provide a datepicker based on Google's Material Design that is more compelling and rich with features.

Example:

    <jv-datepicker><jv-datepicker>
    <jv-datepicker view="horizontal"></jv-datepicker>
    <jv-datepicker theme="dark-theme"></jv-datepicker>
    <jv-datepicker-dialog modal></jv-datepicker-dialog>
    <jv-datepicker-dialog with-backdrop></jv-datepicker-dialog>
    <jv-datepicker-dialog></jv-datepicker-dialog>

`jv-datepicker` provides a regular datepicker element.
While `jv-datepicker-dialog` has a `jv-datepicker` being wrapped inside a dialog.


~~## ( Coming soon!) Generating your own boilerplate code of the compounds~~
~~At the end of the demo, there is a section where user can play around with to generate your own boilerplate code with the attributes provided.~~


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
