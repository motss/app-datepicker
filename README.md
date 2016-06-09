[![GitHub version](https://badge.fury.io/gh/motss%2Fapp-datepicker.svg)](http://badge.fury.io/gh/motss%2Fapp-datepicker)
[![Bower version](https://badge.fury.io/bo/app-datepicker.svg)](http://badge.fury.io/bo/app-datepicker)
[![Build Status](https://travis-ci.org/motss/app-datepicker.svg?branch=master)](https://travis-ci.org/motss/app-datepicker)

# app-datepicker
<image src="https://cloud.githubusercontent.com/assets/10607759/14078902/232af734-f52c-11e5-9646-c0a5fb7899ef.png" alt="datepicker-light-theme" width="32%">
<image src="https://cloud.githubusercontent.com/assets/10607759/14078900/22302dae-f52c-11e5-9bb9-fb84f31075a8.png" alt="datepicker-dark-theme" width="32%">
<image src="https://cloud.githubusercontent.com/assets/10607759/14078901/22633d84-f52c-11e5-9041-02c805ac9843.png" alt="datepicker-goog-theme" width="32%">

<!-- ![light-themed-app-datepicker-landscape](https://cloud.githubusercontent.com/assets/10607759/10119266/ce6d5b0e-64c3-11e5-843d-1310de755315.png)
![dark-themed-app-datepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/10119265/c9ad900c-64c3-11e5-937e-338a770eebea.png) -->
<!-- ![app-datepicker-landscape](https://cloud.githubusercontent.com/assets/10607759/9871233/c9e33d04-5bc4-11e5-8af9-d93d080d8815.PNG) -->
<!-- ![app-datepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/9871234/cacf33c6-5bc4-11e5-833a-96cbd3dbf440.PNG) -->
<!-- ![dark-themed-app-datepicker](https://cloud.githubusercontent.com/assets/10607759/10106751/1bec71c0-63e9-11e5-93f2-ee197d2ba0f2.png) -->

## Update (v2.5.0)
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

- `locale` (To change the locale of the datepicker, available language codes can be found in the [demo](http://motss.github.io/app-datepicker/components/app-datepicker/demo/).

See the [component page](http://motss.github.io/app-datepicker/components/app-datepicker/) for more information.

An custom Polymer element built from scratch to provide a datepicker based on Google's Material Design that is more compelling and rich with features.

Example:

    <app-datepicker><app-datepicker>
    <app-datepicker view="horizontal"></app-datepicker>
    <app-datepicker theme="dark-theme"></app-datepicker>
    <app-datepicker-dialog modal></app-datepicker-dialog>
    <app-datepicker-dialog with-backdrop></app-datepicker-dialog>
    <app-datepicker-dialog></app-datepicker-dialog>

`app-datepicker` provides a regular datepicker element.
While `app-datepicker-dialog` has a `app-datepicker` being wrapped inside a dialog.


~~## ( Coming soon!) Generating your own boilerplate code of the compounds~~
~~At the end of the demo, there is a section where user can play around with to generate your own boilerplate code with the attributes provided.~~


## Styling
Now with mixins, head over to the [component page](http://motss.github.io/app-datepicker/components/app-datepicker/) for more details.


## Getting Started
1. Install with bower.
`bower install --save app-datepicker`

2. Load the web component and the dependencies.

For `app-datepicker`,

```html
<link rel="import" href="path-to-bower-components/app-datepicker/app-datepicker.html">
```
For `app-datepicker-dialog`,

```html
<link rel="import" href="path-to-bower-components/app-datepicker/app-datepicker-dialog.html">
```

3. Markup with `<app-datepicker></app-datepicker>` or `<app-datepicker-dialog></app-datepicker-dialog>`.

4. Done.

## Browser Support
##### `app-datepicker` and `app-datepicker-dialog`:

| <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/internet-explorer/internet-explorer_48x48.png" alt="IE" width="48px" height="48px"/><img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/edge/edge_48x48.png" alt="Edge" width="48px" height="48px" /></br>IE/ Edge | <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/firefox/firefox_48x48.png" alt="Firefox" width="48px" height="48px" /></br>Firefox | <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/chrome/chrome_48x48.png" alt="Chrome" width="48px" height="48px" /><img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/opera/opera_48x48.png" alt="Opera" width="48px" height="48px" /></br>Chrome/ Opera | <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/chrome/chrome_48x48.png" alt="Chrome for Android" width="48px" height="48px" /></br>Chrome for Android | <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/safari/safari_48x48.png" alt="Safari" width="48px" height="48px" /></br>Safari | <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/safari/safari_48x48.png" alt="iOS Safari" width="48px" height="48px" /></br>iOS Safari |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| IE11, Edge | latest | latest | latest | unknown ? | unknown ?

##### [Intl.DateTimeFormat] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) (ECMAScript Internationalization API for `locale`) or for more details please visit [Can I use... Intl?](http://caniuse.com/#search=intl):
| <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/internet-explorer/internet-explorer_48x48.png" alt="IE" width="48px" height="48px"/><img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/edge/edge_48x48.png" alt="Edge" width="48px" height="48px" /></br>IE/ Edge | <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/firefox/firefox_48x48.png" alt="Firefox" width="48px" height="48px" /></br>Firefox | <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/chrome/chrome_48x48.png" alt="Chrome" width="48px" height="48px" /><img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/opera/opera_48x48.png" alt="Opera" width="48px" height="48px" /></br>Chrome/ Opera | <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/chrome/chrome_48x48.png" alt="Chrome for Android" width="48px" height="48px" /></br>Chrome for Android | <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/safari/safari_48x48.png" alt="Safari" width="48px" height="48px" /></br>Safari | <img src="https://raw.githubusercontent.com/paulirish/browser-logos/master/safari/safari_48x48.png" alt="iOS Safari" width="48px" height="48px" /></br>iOS Safari |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| IE11, Edge | latest | latest | latest | polyfilled with [Intl.js](https://github.com/andyearnshaw/Intl.js) | polyfilled with [Intl.js](https://github.com/andyearnshaw/Intl.js)

## Throughput
[![Throughput Graph](https://graphs.waffle.io/motss/app-datepicker/throughput.svg)](https://waffle.io/motss/app-datepicker/metrics/throughput)

## License
[MIT License](http://motss.mit-license.org/) © Rong Sen Ng
